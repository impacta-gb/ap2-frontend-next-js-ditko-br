'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Badge, Loading, Alert } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { translateStatus, formatDate, formatDateTime } from '@/src/lib/utils';
import { Plus, MapPin, Calendar, Tag, Search, Eye, Pencil, Trash2, Users, Clock } from 'lucide-react';

export default function ItemsPage() {
  const [page, setPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const [locaisMapa, setLocaisMapa] = useState<Record<string, any>>({});
  const [responsaveisMapa, setResponsaveisMapa] = useState<Record<string, any>>({});

  // Função auxiliar para retornar data de criação se campo estiver vazio
  const getDisplayValue = (value: string | null | undefined, fallbackDate: string | null | undefined): string => {
    if (value && value.trim() !== '') {
      return value;
    }
    return fallbackDate ? formatDate(fallbackDate) : 'Não informado';
  };
  const { data: items, loading, error, refetch } = useFetch(
    async () => {
      const response = await apiClient.getItems(page, 10);

      // Normalizar resposta para garantir compatibilidade com diferentes formatos
      const extractArray = (obj: Record<string, unknown> | unknown): any[] | undefined => {
        if (Array.isArray(obj)) return obj as any[];
        if (!obj || typeof obj !== 'object') return undefined;
        const o = obj as Record<string, unknown>;
        if (Array.isArray(o.data)) return o.data as any[];
        if (Array.isArray(o.items)) return o.items as any[];
        if (Array.isArray(o.results)) return o.results as any[];
        const resultsObj = (o.results as any) ?? undefined;
        if (Array.isArray(resultsObj?.data)) return resultsObj.data as any[];
        if (o.data && typeof o.data === 'object' && !Array.isArray(o.data)) {
          return extractArray(o.data as Record<string, unknown>);
        }
        return undefined;
      };

      const itemsArray = extractArray(response) || [];

      // Debug: log da estrutura dos itens
      if (itemsArray.length > 0) {
        console.log('Item structure:', {
          full: itemsArray[0],
          local: itemsArray[0]?.local,
          local_id: itemsArray[0]?.local_id,
          localData: itemsArray[0]?.local_data,
        });
      }

      const normalizeTotal = (payload: unknown, fallback: number): number => {
        if (payload && typeof payload === 'object') {
          const obj = payload as Record<string, unknown>;
          if (typeof obj.total === 'number') return obj.total;
          if (typeof obj.count === 'number') return obj.count;
          if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
            const dataObj = obj.data as Record<string, unknown>;
            if (typeof dataObj.total === 'number') return dataObj.total;
            if (typeof dataObj.count === 'number') return dataObj.count;
          }
        }
        return fallback;
      };

      const total = normalizeTotal(response, itemsArray.length);
      const pages = Math.max(1, Math.ceil(total / 10));

      return {
        data: itemsArray,
        total,
        page,
        limit: 10,
        pages,
      };
    },
    [page]
  );

  // Carregar dados dos locais para mapeamento
  useFetch(async () => {
    const response = await apiClient.getLocais(1, 1000);
    const extractArray = (obj: Record<string, unknown> | unknown): any[] | undefined => {
      if (Array.isArray(obj)) return obj as any[];
      if (!obj || typeof obj !== 'object') return undefined;
      const o = obj as Record<string, unknown>;
      if (Array.isArray(o.data)) return o.data as any[];
      if (Array.isArray(o.items)) return o.items as any[];
      return undefined;
    };
    const locais = extractArray(response) || [];
    const mapa: Record<string, any> = {};
    locais.forEach((local: any) => {
      mapa[local.id] = local;
    });
    setLocaisMapa(mapa);
    return locais;
  }, []);

  // Carregar dados dos responsáveis para mapeamento
  useFetch(async () => {
    const response = await apiClient.getResponsaveis(1, 1000);
    const extractArray = (obj: Record<string, unknown> | unknown): any[] | undefined => {
      if (Array.isArray(obj)) return obj as any[];
      if (!obj || typeof obj !== 'object') return undefined;
      const o = obj as Record<string, unknown>;
      if (Array.isArray(o.data)) return o.data as any[];
      if (Array.isArray(o.items)) return o.items as any[];
      return undefined;
    };
    const responsaveis = extractArray(response) || [];
    const mapa: Record<string, any> = {};
    responsaveis.forEach((resp: any) => {
      mapa[resp.id] = resp;
    });
    setResponsaveisMapa(mapa);
    return responsaveis;
  }, []);  const handleDelete = async (item: any) => {
    const confirmou = window.confirm(`Deseja realmente excluir o item "${item.nome}"?`);
    if (!confirmou) return;

    try {
      setActionLoadingId(item.id);
      await apiClient.deleteItem(item.id);
      setAlert({
        type: 'success',
        title: 'Item excluído',
        message: 'O registro foi removido com sucesso.',
      });
      refetch();
    } catch {
      setAlert({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o item.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Alert type="error" title="Erro ao carregar itens" message={error} />
          <div className="mt-4">
            <Button onClick={() => refetch()} variant="primary">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );

  const itemsPerPage = 10;
  const paginatedItems = items?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={() => setAlert(null)}
              closeable
              animated
            />
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-2">
              Itens Encontrados
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Tag size={18} />
              Total: <span className="font-bold text-blue-600 dark:text-blue-400">{items?.total || 0}</span> itens
            </p>
          </div>
          <Link href="/items/new">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Plus size={20} />
              Registrar Novo Item
            </Button>
          </Link>
        </div>

        {/* Items Grid */}
        {paginatedItems && paginatedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedItems.map((item: any, index: number) => (
              <Card
                key={item.id}
                className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden animate-scale-in border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.nome}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Tag size={14} />
                        {item.categoria}
                      </p>
                    </div>
                    <Badge
                      label={translateStatus(item.status)}
                      variant={
                        item.status === 'disponível'
                          ? 'success'
                          : item.status === 'devolvido'
                          ? 'info'
                          : 'warning'
                      }
                    />
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                    {item.descricao}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 border-t pt-4">
                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      <MapPin size={14} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="font-medium truncate text-xs">
                        {item.local?.tipo || locaisMapa[item.local_id]?.tipo || getDisplayValue('', item.criado_em)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      <Calendar size={14} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="font-medium text-xs">{formatDate(item.data_encontro || '') || getDisplayValue('', item.criado_em)}</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      <Users size={14} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="font-medium truncate text-xs">
                        {item.responsavel?.nome || responsaveisMapa[item.responsavel_id]?.nome || getDisplayValue('', item.criado_em)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      <Clock size={14} className="text-orange-600 dark:text-orange-400 flex-shrink-0" />
                      <span className="font-medium text-xs">{formatDate(item.criado_em || '')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href={`/items/${item.id}`}>
                      <Button variant="outline" size="sm" fullWidth icon={<Eye size={16} />}>
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/items/${item.id}/edit`}>
                      <Button variant="secondary" size="sm" fullWidth icon={<Pencil size={16} />}>
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      loading={actionLoadingId === item.id}
                      onClick={() => handleDelete(item)}
                      icon={<Trash2 size={16} />}
                      className="col-span-2"
                    >
                      Excluir
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/40 via-slate-50/30 to-purple-50/40 dark:from-blue-950/20 dark:via-slate-950/30 dark:to-purple-950/20 backdrop-blur-sm p-16 md:p-20 animate-scale-in hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300">
            {/* Decorative gradient blobs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 opacity-10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-400 to-cyan-400 opacity-10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              {/* Icon background with animation */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-20 animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300">
                  <Search size={56} className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text" />
                </div>
              </div>
              
              {/* Text content */}
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-3">
                Nenhum item encontrado
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
                Seja o primeiro a registrar um item encontrado no nosso sistema
              </p>
              
              {/* Action button */}
              <Link href="/items/new">
                <Button variant="primary" size="lg" className="group">
                  <Plus size={22} />
                  Registrar Primeiro Item
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {items?.total && items.total > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">
              Página {page} de {items.pages}
            </span>
            <Button
              variant="outline"
              disabled={page >= items.pages}
              onClick={() => setPage(page + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
