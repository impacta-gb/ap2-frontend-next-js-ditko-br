'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Badge, Loading, Alert } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { formatDate, formatDateTime, translateStatus } from '@/src/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const [createdAtFallback, setCreatedAtFallback] = useState<string | null>(null);
  const [locaisMapa, setLocaisMapa] = useState<Record<string, any>>({});
  const [responsaveisMapa, setResponsaveisMapa] = useState<Record<string, any>>({});
  const { data: itemRaw, loading, error, refetch } = useFetch(() => apiClient.getItemById(id), [id]);

  // Recuperar fallback de criado_em do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const itemCreationTimes = JSON.parse(localStorage.getItem('itemCreationTimes') || '{}');
      setCreatedAtFallback(itemCreationTimes[id] || null);
    }
  }, [id]);

  // Extrair o item corretamente da resposta
  let item = itemRaw;
  if (itemRaw && typeof itemRaw === 'object' && !Array.isArray(itemRaw)) {
    const obj = itemRaw as Record<string, unknown>;
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      item = obj.data as any;
    } else if (obj.item && typeof obj.item === 'object' && !Array.isArray(obj.item)) {
      item = obj.item as any;
    }
  }

  // Debug: log das datas para verificar formato
  useEffect(() => {
    if (item) {
      console.log('Item data:', {
        criado_em: item.criado_em,
        atualizado_em: item.atualizado_em,
        data_encontro: item.data_encontro,
      });
    }
  }, [item]);

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
  }, []);

  const handleDelete = async () => {
    const confirmou = window.confirm('Deseja realmente excluir este item?');
    if (!confirmou) return;

    try {
      setActionLoading(true);
      await apiClient.deleteItem(id);
      setAlert({
        type: 'success',
        title: 'Item excluído',
        message: 'O registro foi removido com sucesso.',
      });
      setTimeout(() => {
        router.push('/items');
      }, 1200);
    } catch {
      setAlert({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o item.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert type="error" title="Erro" message={error} />
          <Link href="/items" className="mt-4 block">
            <Button variant="secondary">← Voltar para itens</Button>
          </Link>
        </div>
      </div>
    );

  if (!item)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert type="warning" title="Não encontrado" message="Item não encontrado" />
          <Link href="/items" className="mt-4 block">
            <Button variant="secondary">← Voltar para itens</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
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

        {/* Back Button */}
        <Link href="/items" className="mb-6 block">
          <Button variant="secondary">← Voltar</Button>
        </Link>

        {/* Item Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {item?.nome || 'Item sem nome'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{item?.categoria || 'Categoria não informada'}</p>
              </div>
              <Badge
                label={translateStatus(item?.status)}
                variant={
                  item?.status === 'disponível'
                    ? 'success'
                    : item?.status === 'devolvido'
                    ? 'info'
                    : 'warning'
                }
              />
            </div>
          </CardHeader>

          <CardBody className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Descrição
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{item?.descricao || 'Descrição não informada'}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  📅 Data de Encontro
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatDate(item?.data_encontro || '')}
                </p>
              </div>

              {/* Local */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  📍 Local Encontrado
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {item?.local?.tipo || locaisMapa[item?.local_id]?.tipo || 'Local não informado'}
                </p>
                {(item?.local?.bairro || locaisMapa[item?.local_id]?.bairro) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item?.local?.bairro || locaisMapa[item?.local_id]?.bairro}
                  </p>
                )}
              </div>

              {/* Responsável */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  👤 Responsável
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {item?.responsavel?.nome || responsaveisMapa[item?.responsavel_id]?.nome || 'Responsável não informado'}
                </p>
                {(item?.responsavel?.cargo || responsaveisMapa[item?.responsavel_id]?.cargo) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item?.responsavel?.cargo || responsaveisMapa[item?.responsavel_id]?.cargo}
                  </p>
                )}
              </div>

              {/* Created At */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  ⏰ Registrado em
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDateTime(item?.criado_em || createdAtFallback || '')}
                </p>
              </div>
            </div>

            {/* Devolução Info */}
            {item?.devolucao && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  ✅ Devolução Registrada
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      Reclamante:
                    </span>
                    <span className="text-blue-800 dark:text-blue-200 ml-2">
                      {item.devolucao.reclamante?.nome || 'Não informado'}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      Data de Devolução:
                    </span>
                    <span className="text-blue-800 dark:text-blue-200 ml-2">
                      {formatDate(item.devolucao.data_devolucao || '')}
                    </span>
                  </p>
                  {item.devolucao.observacao && (
                    <p>
                      <span className="font-medium text-blue-900 dark:text-blue-100">
                        Observação:
                      </span>
                      <span className="text-blue-800 dark:text-blue-200 ml-2">
                        {item.devolucao.observacao}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {item?.status === 'disponível' && (
                <Link href={`/devolucoes/new?item_id=${item?.id}`} className="block">
                  <Button variant="success" fullWidth>
                    ✅ Registrar Devolução
                  </Button>
                </Link>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/items/${id}/edit`} className="block">
                  <Button variant="secondary" fullWidth icon={<Pencil size={16} />}>
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  fullWidth
                  loading={actionLoading}
                  onClick={handleDelete}
                  icon={<Trash2 size={16} />}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
