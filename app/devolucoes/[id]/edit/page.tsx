'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [submitAlert, setSubmitAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const alertTimerRef = useRef<number | null>(null);
  const redirectTimerRef = useRef<number | null>(null);

  const showAlert = (nextAlert: { type: 'success' | 'error'; title: string; message: string }) => {
    setSubmitAlert(nextAlert);
    if (alertTimerRef.current) window.clearTimeout(alertTimerRef.current);
    alertTimerRef.current = window.setTimeout(() => setSubmitAlert(null), 3500);
  };

  useEffect(() => {
    if (devolucao) {
      // Normalizar envelope: suportar { data: {...} } ou { devolucao: {...} }
      let candidate: any = devolucao;
      if (devolucao && typeof devolucao === 'object' && !Array.isArray(devolucao)) {
        const obj = devolucao as Record<string, unknown>;
        candidate = obj.data ?? obj.devolucao ?? obj;
      }

      setFormData({
        data_devolucao: candidate?.data_devolucao?.split?.('T')?.[0] || candidate?.data_devolucao || '',
        observacao: candidate?.observacao || '',
      });
    }
  }, [devolucao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.updateDevolucao(id, formData);
      showAlert({ type: 'success', title: 'Devolução atualizada', message: 'As alterações foram salvas com sucesso.' });
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = window.setTimeout(() => router.push('/devolucoes'), 1200);
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

        <div className="max-w-2xl mx-auto relative z-10 space-y-6">
        {submitAlert && (
          <div className="fixed top-6 left-4 right-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-full sm:max-w-md animate-slide-down pointer-events-none">
            <Alert type={submitAlert.type} title={submitAlert.title} message={submitAlert.message} closeable={false} animated />
          </div>
        )}
        {error && (
          <Alert
            type="error"
            title="Falha ao carregar"
            message={error || 'Devolução não encontrada.'}
            closeable={false}
            animated
          />
        )}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Editar Devolução</h1>
            <p className="text-gray-600">Atualize os dados da devolução</p>
          </div>
          <Link href={`/devolucoes/${id}`}>
            <Button variant="outline" icon={<ArrowLeft size={18} />}>Voltar para detalhes</Button>
          </Link>
        </div>

        <Card hover gradient>
          <CardHeader variant="gradient" color="purple">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Informações</h2>
                <p className="text-purple-100 text-sm">Edite os dados da devolução</p>
              </div>
            </div>
          </CardHeader>
          <CardBody padding="lg">
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

              <div className="pt-8 border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
                <Button type="submit" variant="primary" size="lg" fullWidth icon={<Save size={18} />} loading={saving}>
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}