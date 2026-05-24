"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Input, Alert, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { ApiErrorHandler } from '@/src/lib/utils';
import { Save, ArrowLeft, User, FileText, Phone } from 'lucide-react';

export default function EditReclamantePage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || '');

  const alertTimerRef = useRef<number | null>(null);
  const redirectTimerRef = useRef<number | null>(null);

  const [formData, setFormData] = useState({ nome: '', documento: '', telefone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitAlert, setSubmitAlert] = useState<null | { type: 'success' | 'error'; title: string; message: string }>(null);

  const { data, loading, error } = useFetch(() => apiClient.getReclamanteById(id), [id]);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) window.clearTimeout(alertTimerRef.current);
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    let candidate: any = data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const obj = data as Record<string, unknown>;
      candidate = obj.data ?? obj.reclamante ?? obj;
    }

    if (candidate && typeof candidate === 'object') {
      setFormData({
        nome: String(candidate.nome ?? ''),
        documento: String(candidate.documento ?? ''),
        telefone: String(candidate.telefone ?? ''),
      });
    }
  }, [data]);

  const showAlert = (alert: { type: 'success' | 'error'; title: string; message: string }) => {
    setSubmitAlert(alert);
    if (alertTimerRef.current) window.clearTimeout(alertTimerRef.current);
    alertTimerRef.current = window.setTimeout(() => setSubmitAlert(null), 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.documento.trim()) {
      newErrors.documento = 'Documento é obrigatório';
    } else if (formData.documento.replace(/\D/g, '').length < 11) {
      newErrors.documento = 'Informe um documento válido (CPF/CNPJ)';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Informe um telefone válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showAlert({ type: 'error', title: 'Erro', message: 'Revise os campos e tente novamente.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        nome: formData.nome.trim(),
        documento: formData.documento.replace(/\D/g, '').trim(),
        telefone: formData.telefone.replace(/\D/g, '').trim(),
      };

      await apiClient.patchReclamante(id, payload);

      showAlert({ type: 'success', title: 'Atualizado', message: 'Reclamante atualizado com sucesso.' });

      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = window.setTimeout(() => router.push(`/reclamantes/${id}`), 1400);
    } catch (err) {
      showAlert({ type: 'error', title: 'Erro ao salvar', message: ApiErrorHandler.handle(err) });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert type="error" title="Falha ao carregar" message={error} closeable={false} animated />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        {submitAlert && (
          <div className="fixed top-6 left-4 right-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-full sm:max-w-md animate-slide-down pointer-events-none">
            <Alert type={submitAlert.type} title={submitAlert.title} message={submitAlert.message} closeable={false} animated />
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Editar Reclamante</h1>
            <p className="text-gray-600">Atualize os dados do reclamante</p>
          </div>
          <Link href={`/reclamantes/${id}`}>
            <Button variant="outline" icon={<ArrowLeft size={18} />}>Voltar para detalhes</Button>
          </Link>
        </div>

        <Card hover gradient>
          <CardHeader variant="gradient" color="purple">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Informações</h2>
                <p className="text-purple-100 text-sm">Edite os dados do reclamante</p>
              </div>
            </div>
          </CardHeader>

          <CardBody padding="lg">
            <form onSubmit={handleSubmit} className="space-y-7">
              <Input label="Nome completo" name="nome" value={formData.nome} onChange={handleChange} error={errors.nome} placeholder="Ex: João Silva" icon={<User size={20} />} />

              <Input label="Documento (CPF ou CNPJ)" name="documento" value={formData.documento} onChange={handleChange} error={errors.documento} placeholder="Ex: 123.456.789-00" icon={<FileText size={20} />} />

              <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} error={errors.telefone} placeholder="Ex: (11) 99999-9999" icon={<Phone size={20} />} />

              <div className="pt-8 border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
                <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting} disabled={submitting} icon={<Save size={20} />}>
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
