'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Alert, Button, Card, CardBody, CardHeader, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { formatDateTime, formatPhone } from '@/src/lib/utils';
import { Reclamante } from '@/src/types';
import { ArrowLeft, User } from 'lucide-react';

const extractReclamante = (payload: unknown): Reclamante | null => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  const obj = payload as Record<string, unknown>;
  const candidate = obj.data ?? obj.reclamante ?? obj;

  if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
    return candidate as Reclamante;
  }

  return null;
};

export default function ReclamanteDetailPage() {
  const params = useParams();
  const id = String(params?.id || '');
  const { data, loading, error } = useFetch(() => apiClient.getReclamanteById(id), [id]);
  const reclamante = useMemo(() => extractReclamante(data), [data]);

  if (loading) return <Loading />;

  if (error || !reclamante) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert
            type="error"
            title="Falha ao carregar"
            message={error || 'Reclamante não encontrado.'}
            closeable={false}
            animated
          />
          <div className="mt-4">
            <Link href="/reclamantes">
              <Button variant="secondary">← Voltar para reclamantes</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Reclamante</h1>
            <p className="text-gray-600 dark:text-gray-400">Detalhes do reclamante</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/reclamantes">
              <Button variant="secondary" icon={<ArrowLeft size={18} />}>
                Voltar
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User size={24} className="text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{reclamante.nome}</h2>
                <p className="text-gray-600 dark:text-gray-400">Documento: {reclamante.documento}</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Telefone</p>
              <p className="font-semibold text-gray-900 dark:text-white">{formatPhone(reclamante.telefone)}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">ID</p>
              <p className="font-semibold text-gray-900 dark:text-white">{reclamante.id}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Criado em</p>
              <p className="font-semibold text-gray-900 dark:text-white">{formatDateTime(reclamante.criado_em)}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Atualizado em</p>
              <p className="font-semibold text-gray-900 dark:text-white">{formatDateTime(reclamante.atualizado_em)}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
