'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Badge, Loading, Alert } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { formatDate, formatDateTime, translateStatus } from '@/src/lib/utils';

export default function ItemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: item, loading, error } = useFetch(() => apiClient.getItemById(id), [id]);

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
                  {item.nome}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{item.categoria}</p>
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

          <CardBody className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Descrição
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{item.descricao}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  📅 Data de Encontro
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatDate(item.data_encontro)}
                </p>
              </div>

              {/* Local */}
              {item.local && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    📍 Local Encontrado
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {item.local.tipo}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.local.bairro}
                  </p>
                </div>
              )}

              {/* Responsável */}
              {item.responsavel && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    👤 Responsável
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {item.responsavel.nome}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.responsavel.cargo}
                  </p>
                </div>
              )}

              {/* Created At */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  ⏰ Registrado em
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDateTime(item.criado_em)}
                </p>
              </div>
            </div>

            {/* Devolução Info */}
            {item.devolucao && (
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
                      {item.devolucao.reclamante?.nome}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      Data de Devolução:
                    </span>
                    <span className="text-blue-800 dark:text-blue-200 ml-2">
                      {formatDate(item.devolucao.data_devolucao)}
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
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {item.status === 'disponível' && (
                <Link href={`/devolucoes/new?item_id=${item.id}`} className="flex-1">
                  <Button variant="success" fullWidth>
                    ✅ Registrar Devolução
                  </Button>
                </Link>
              )}
              <Link href="/items" className="flex-1">
                <Button variant="secondary" fullWidth>
                  ← Voltar
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
