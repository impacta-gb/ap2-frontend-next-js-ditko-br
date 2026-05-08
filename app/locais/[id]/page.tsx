'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Badge, Loading, Alert } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { formatDate, formatDateTime, translateStatus } from '@/src/lib/utils';

export default function LocalDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: local, loading, error } = useFetch(() => apiClient.getLocalById(id), [id]);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert type="error" title="Erro" message={error} />
          <Link href="/local" className="mt-4 block">
            <Button variant="secondary">← Voltar para locais</Button>
          </Link>
        </div>
      </div>
    );

  if (!local)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert type="warning" title="Não encontrado" message="Item não encontrado" />
          <Link href="/locais" className="mt-4 block">
            <Button variant="secondary">← Voltar para locais</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link href="/locais" className="mb-6 block">
          <Button variant="secondary">← Voltar</Button>
        </Link>

        {/* Item Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {local.tipo}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{local.bairro}</p>
              </div>
              <Badge
                label={translateStatus(local.tipo)}
                variant={
                  local.status === 'disponível'
                    ? 'success'
                    : local.status === 'devolvido'
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
              <p className="text-gray-600 dark:text-gray-300">{local.descricao}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              

              {/* Local */}
              {(
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    📍 Local Encontrado
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {local.tipo}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {local.bairro}
                  </p>
                </div>
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
