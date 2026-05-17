'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Button, Card, CardBody, CardHeader, Input, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { Local, UpdateLocalRequest } from '@/src/types';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditLocalPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id || '');
  const [formData, setFormData] = useState({ tipo: '', descricao: '', bairro: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  const { data: local, loading, error } = useFetch<Local>(() => apiClient.getLocalById(id), [id]);

  useEffect(() => {
    if (!local) return;
    setFormData({
      tipo: local.tipo || '',
      descricao: local.descricao || '',
      bairro: local.bairro || '',
    });
  }, [local]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.tipo.trim()) newErrors.tipo = 'Tipo é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';

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
      const payload: UpdateLocalRequest = {
        tipo: formData.tipo.trim(),
        descricao: formData.descricao.trim(),
        bairro: formData.bairro.trim(),
      };

      await apiClient.patchLocal(id, payload);
      setAlert({ type: 'success', title: 'Local atualizado', message: 'As alterações foram salvas com sucesso.' });
      setTimeout(() => {
        router.push(`/locais/${id}`);
      }, 1200);
    } catch {
      setAlert({ type: 'error', title: 'Erro ao atualizar', message: 'Não foi possível salvar as alterações.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  if (error || !local) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert
          type="error"
          title="Falha ao carregar"
          message={error || 'Local não encontrado.'}
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

        <Link href={`/locais/${id}`}>
          <Button variant="outline" icon={<ArrowLeft size={18} />}>
            Voltar para detalhes
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar local</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Tipo"
                name="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData((prev) => ({ ...prev, tipo: e.target.value }))}
                error={errors.tipo}
              />

              <Input
                label="Bairro"
                name="bairro"
                value={formData.bairro}
                onChange={(e) => setFormData((prev) => ({ ...prev, bairro: e.target.value }))}
                error={errors.bairro}
              />

              <Input
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                error={errors.descricao}
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
