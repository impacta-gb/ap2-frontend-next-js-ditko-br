'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Loading, Alert } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { RotateCcw, Package, User, Calendar, ArrowRight, Plus } from 'lucide-react';
import { Local, Responsavel} from '@/src/types';
import { Users, Briefcase, Phone, Search, UserCheck, UserX, Eye, Pencil, Trash2 } from 'lucide-react';

type FiltroAtivo = 'todos' | 'ativos' | 'inativos';

interface LocalListState {
  items: Local[];
  total: number;
  pages: number;
}

const LOCAIS_PER_PAGE = 10;

const extractLocalArray = (obj: Record<string, unknown>): Local[] | undefined => {
  if (Array.isArray(obj.locais)) return obj.locais as Local[];
  if (Array.isArray(obj.locals)) return obj.locals as Local[];
  if (Array.isArray(obj.items)) return obj.items as Local[];
  if (Array.isArray(obj.results)) return obj.results as Local[];
  if (Array.isArray(obj.data)) return obj.data as Local[];

  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    return extractLocalArray(obj.data as Record<string, unknown>);
  }

  return undefined;
};

const normalizeLocalArray = (payload: unknown): Local[] => {
  if (Array.isArray(payload)) return payload as Local[];

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    const extracted = extractLocalArray(obj);
    if (Array.isArray(extracted)) return extracted;
  }

  return [];
};

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

const normalizePages = (payload: unknown, total: number): number => {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (typeof obj.pages === 'number') return obj.pages;

    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      const dataObj = obj.data as Record<string, unknown>;
      if (typeof dataObj.pages === 'number') return dataObj.pages;
    }
  }

  return Math.max(1, Math.ceil(total / LOCAIS_PER_PAGE));
};



export default function LocaisPage() {
  const [page, setPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const { data: locais, loading, error, refetch } = useFetch<LocalListState>(
    async () => {
      const response = await apiClient.getLocais(page, LOCAIS_PER_PAGE);
      const items = normalizeLocalArray(response);
      const total = normalizeTotal(response, items.length);
      const pages = normalizePages(response, total);

      return {
        items,
        total,
        pages,
      };
    },
    [page]
  );

  const locaisItems = Array.isArray(locais?.items) ? locais.items : [];
  const totalLocais = locais?.total || 0;
  const totalPages = locais?.pages || 1;

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert type="error" title="Erro" message={error} />
        </div>
      </div>
    );

  const handleDelete = async (resp: Responsavel) => {
    const confirmou = window.confirm(`Deseja realmente excluir o responsável ${resp.nome}?`);
    if (!confirmou) return;

    try {
      setActionLoadingId(resp.id);
      await apiClient.deleteResponsavel(resp.id);
      setAlert({
        type: 'success',
        title: 'Responsável excluído',
        message: 'O registro foi removido com sucesso.',
      });
      refetch();
    } catch {
      setAlert({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o responsável.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-blue-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                <RotateCcw size={28} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                Locais
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 ml-16">
              Total: <span className="font-bold text-green-600 dark:text-green-400">{totalLocais}</span> locais
            </p>
          </div>
          <Link href="/locais/new">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <RotateCcw size={20} />
              Registrar Local
            </Button>
          </Link>
        </div>

        {/* locais List */}
        {locaisItems.length > 0 ? (
          <div className="space-y-4 mb-8">
            {locaisItems.map((loc: any) => (
              <Card key={loc.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Bairro */}
                    <div className="flex gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                        <Calendar size={20} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                          Bairro do Local
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {loc.bairro}
                        </p>
                      </div>
                    </div>

                    {/* Descrição */}
                    <div className="flex gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                        <Calendar size={20} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                          Descrição do Local
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {loc.descricao}
                        </p>
                      </div>
                    </div>

                    {/* Tipo */}
                    <div className="flex gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                        <Calendar size={20} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                          Tipo do Local
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {loc.tipo}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    
                    <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href={`/responsaveis/${loc.id}`}>
                      <Button variant="outline" size="sm" fullWidth icon={<Eye size={16} />}>
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/responsaveis/${loc.id}/edit`}>
                      <Button variant="secondary" size="sm" fullWidth icon={<Pencil size={16} />}>
                        Editar
                      </Button>
                    </Link>
                   
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      loading={actionLoadingId === loc.id}
                      onClick={() => handleDelete(loc)}
                      icon={<Trash2 size={16} />}
                    >
                      Excluir
                    </Button>
                  </div>

                  </div>

                  
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/40 via-slate-50/30 to-green-50/40 dark:from-emerald-950/20 dark:via-slate-950/30 dark:to-green-950/20 backdrop-blur-sm p-16 md:p-20 animate-scale-in hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300">
            {/* Decorative gradient blobs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400 to-green-400 opacity-10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-emerald-400 to-teal-400 opacity-10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              {/* Icon background with animation */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-400 rounded-2xl blur-xl opacity-20 animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300">
                  <RotateCcw size={56} className="text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text" />
                </div>
              </div>
              
              {/* Text content */}
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-green-400 mb-3">
                Nenhum local registrado
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
                Nenhum local registrado até agora. Quando alguem perder um item, o local sera criado
              </p>
              
              {/* Action button */}
              <Link href="/locais/new">
                <Button variant="primary" size="lg" className="group">
                  <RotateCcw size={22} />
                  Registrar Local
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              ← Anterior
            </Button>
            <div className="flex items-center px-4 py-2">
              <span className="text-gray-600 dark:text-gray-400">
                Página {page} de {totalPages}
              </span>
            </div>
            <Button
              variant="secondary"
              disabled={page === totalPages}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
            >
              Próxima →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
