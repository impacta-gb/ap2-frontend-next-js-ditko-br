'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Alert, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { ArrowLeft, Save, Package, Calendar } from 'lucide-react';

export default function EditDevolucaoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: devolucao, loading, error } = useFetch(() => apiClient.getDevolutionById(id), [id]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ data_devolucao: '', observacao: '' });

  useEffect(() => {
    if (devolucao) {
      setFormData({
        data_devolucao: devolucao.data_devolucao?.split?.('T')?.[0] || devolucao.data_devolucao || '',
        observacao: devolucao.observacao || '',
      });
    }
  }, [devolucao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.updateDevolucao(id, formData);
      router.push('/devolucoes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Alert type="error" title="Erro" message={error} />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-6">
        {error && (
          <Alert
            type="error"
            title="Falha ao carregar"
            message={error || 'Devolução não encontrada.'}
            closeable={false}
            animated
          />
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/devolucoes/${id}`}>
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              Voltar para detalhes
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl">
                <Package size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar devolução</h1>
                <p className="text-gray-600 dark:text-gray-300">Atualize os dados do registro</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-7">
              <Input
                label="Data da devolução"
                type="date"
                value={formData.data_devolucao}
                onChange={(e) => setFormData((prev) => ({ ...prev, data_devolucao: e.target.value }))}
                icon={<Calendar size={20} />}
              />

              <Textarea
                label="Observação"
                value={formData.observacao}
                onChange={(e) => setFormData((prev) => ({ ...prev, observacao: e.target.value }))}
                rows={5}
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
                <Button type="submit" variant="primary" icon={<Save size={18} />} loading={saving}>
                  Salvar alterações
                </Button>
                <Link href={`/devolucoes/${id}`}>
                  <Button type="button" variant="secondary">Cancelar</Button>
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}