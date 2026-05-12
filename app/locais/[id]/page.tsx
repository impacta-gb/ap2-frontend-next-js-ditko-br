'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Badge, Loading, Alert } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { formatDate, formatDateTime } from '@/src/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

export default function LocalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data: local, loading, error } = useFetch(() => apiClient.getLocalById(id), [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Deseja realmente excluir este local?');
    if (!confirmed) return;

    try {
      setActionLoading(true);
      await apiClient.deleteLocal(id);
      router.push('/locais');
    } catch (err) {
      setDeleteError('Não foi possível excluir o local.');
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
          <Link href="/locais" className="mt-4 block">
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
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {local.tipo}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{local.bairro}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link href={`/locais/${id}/edit`}>
                  <Button variant="secondary" icon={<Pencil size={16} />}>
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  icon={<Trash2 size={16} />}
                  onClick={handleDelete}
                  loading={actionLoading}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </CardHeader>

          {deleteError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-700 mb-4">
              <p className="text-sm text-red-700 dark:text-red-200">{deleteError}</p>
            </div>
          )}

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
