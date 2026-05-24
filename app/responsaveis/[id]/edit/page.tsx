'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Button, Card, CardBody, CardHeader, Input, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { UpdateResponsavelRequest } from '@/src/types';
import { ArrowLeft, Save, User } from 'lucide-react';

export default function EditResponsavelPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id || '');
  const [formData, setFormData] = useState({ nome: '', cargo: '', telefone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitAlert, setSubmitAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const alertTimerRef = useRef<number | null>(null);
  const redirectTimerRef = useRef<number | null>(null);

  const showAlert = (nextAlert: { type: 'success' | 'error'; title: string; message: string }) => {
    setSubmitAlert(nextAlert);
    if (alertTimerRef.current) window.clearTimeout(alertTimerRef.current);
    alertTimerRef.current = window.setTimeout(() => setSubmitAlert(null), 3500);
  };

  const { data: responsavel, loading, error } = useFetch(() => apiClient.getResponsavelById(id), [id]);

  useEffect(() => {
    if (!responsavel) return;
    setFormData({
      nome: responsavel.nome || '',
      cargo: responsavel.cargo || '',
      telefone: responsavel.telefone || '',
    });
  }, [responsavel]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.cargo.trim()) newErrors.cargo = 'Cargo é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showAlert({ type: 'error', title: 'Campos inválidos', message: 'Preencha os campos obrigatórios.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload: UpdateResponsavelRequest = {
        nome: formData.nome.trim(),
        cargo: formData.cargo.trim(),
        telefone: formData.telefone.trim(),
      };

      await apiClient.updateResponsavel(id, payload);
      showAlert({ type: 'success', title: 'Responsável atualizado', message: 'Atualização completa via PUT realizada.' });
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = window.setTimeout(() => router.push(`/responsaveis/${id}`), 1200);
    } catch {
      showAlert({ type: 'error', title: 'Erro no PUT', message: 'Não foi possível atualizar o responsável.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  if (error || !responsavel) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert
          type="error"
          title="Falha ao carregar"
          message={error || 'Responsável não encontrado.'}
          closeable={false}
          animated
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10 space-y-6">
        {submitAlert && (
          <div className="fixed top-6 left-4 right-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-full sm:max-w-md animate-slide-down pointer-events-none">
            <Alert type={submitAlert.type} title={submitAlert.title} message={submitAlert.message} closeable={false} animated />
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Editar Responsável</h1>
            <p className="text-gray-600">Atualize os dados do responsável</p>
          </div>
          <Link href={`/responsaveis/${id}`}>
            <Button variant="outline" icon={<ArrowLeft size={18} />}>Voltar para detalhes</Button>
          </Link>
        </div>

        <Card hover gradient>
          <CardHeader variant="gradient" color="purple">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Informações</h2>
                <p className="text-purple-100 text-sm">Edite os dados do responsável</p>
              </div>
            </div>
          </CardHeader>
          <CardBody padding="lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                error={errors.nome}
              />

              <Input
                label="Cargo"
                name="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData((prev) => ({ ...prev, cargo: e.target.value }))}
                error={errors.cargo}
              />

              <Input
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                error={errors.telefone}
              />

              <div className="pt-8 border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
                <Button type="submit" variant="primary" size="lg" fullWidth icon={<Save size={18} />} loading={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
