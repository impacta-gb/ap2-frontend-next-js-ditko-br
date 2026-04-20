'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Button, Card, CardBody, CardHeader, Input, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { UpdateResponsavelRequest } from '@/src/types';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditResponsavelPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id || '');
  const [formData, setFormData] = useState({ nome: '', cargo: '', telefone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

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
      setAlert({ type: 'error', title: 'Campos inválidos', message: 'Preencha os campos obrigatórios.' });
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
      setAlert({ type: 'success', title: 'Responsável atualizado', message: 'Atualização completa via PUT realizada.' });
      setTimeout(() => {
        router.push(`/responsaveis/${id}`);
      }, 1200);
    } catch {
      setAlert({ type: 'error', title: 'Erro no PUT', message: 'Não foi possível atualizar o responsável.' });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
            closeable
            animated
          />
        )}

        <Link href={`/responsaveis/${id}`}>
          <Button variant="outline" icon={<ArrowLeft size={18} />}>
            Voltar para detalhes
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar responsável</h1>
          </CardHeader>
          <CardBody>
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

              <Button type="submit" variant="primary" icon={<Save size={18} />} loading={submitting}>
                Salvar alterações
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
