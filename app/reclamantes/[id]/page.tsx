'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Alert, Button, Card, CardBody, CardHeader, Loading, Input } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { formatDateTime, formatPhone, ApiErrorHandler } from '@/src/lib/utils';
import { Reclamante } from '@/src/types';
import { ArrowLeft, User, FileText, Phone, Save, Calendar, Info } from 'lucide-react';

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
  const { data, loading, error, refetch } = useFetch(() => apiClient.getReclamanteById(id), [id]);
  const reclamante = useMemo(() => extractReclamante(data), [data]);

  const alertTimerRef = useRef<number | null>(null);
  const [submitAlert, setSubmitAlert] = useState<null | { type: 'success' | 'error'; title: string; message: string }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nome: '', documento: '', telefone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!reclamante) return;
    setFormData({ nome: reclamante.nome || '', documento: reclamante.documento || '', telefone: reclamante.telefone || '' });
  }, [reclamante]);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) window.clearTimeout(alertTimerRef.current);
    };
  }, []);

  const showAlert = (alert: { type: 'success' | 'error'; title: string; message: string }) => {
    setSubmitAlert(alert);
    if (alertTimerRef.current) window.clearTimeout(alertTimerRef.current);
    alertTimerRef.current = window.setTimeout(() => setSubmitAlert(null), 3500) as unknown as number;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const c = { ...prev }; delete c[name]; return c; });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.documento.trim()) newErrors.documento = 'Documento é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) { showAlert({ type: 'error', title: 'Erro', message: 'Revise os campos' }); return; }
    setSubmitting(true);
    try {
      const payload = {
        nome: formData.nome.trim(),
        documento: formData.documento.replace(/\D/g, '').trim(),
        telefone: formData.telefone.replace(/\D/g, '').trim(),
      };
      await apiClient.patchReclamante(id, payload);
      showAlert({ type: 'success', title: 'Atualizado', message: 'Reclamante atualizado.' });
      refetch();
    } catch (err) {
      showAlert({ type: 'error', title: 'Erro', message: ApiErrorHandler.handle(err) });
    } finally {
      setSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        {submitAlert && (
          <Alert type={submitAlert.type} title={submitAlert.title} message={submitAlert.message} closeable={false} animated />
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/reclamantes">
            <Button variant="outline" icon={<ArrowLeft size={18} />}>Voltar</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                <User size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white truncate">{reclamante.nome}</h1>
                <p className="text-gray-600 dark:text-gray-300">Detalhes do reclamante</p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reclamante.documento && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2"><Info size={16} /> Documento</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{reclamante.documento}</p>
                </div>
              )}

              {reclamante.telefone && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2"><Phone size={16} /> Telefone</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatPhone(reclamante.telefone)}</p>
                </div>
              )}

              {reclamante.criado_em && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2"><Calendar size={16} /> Criado em</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDateTime(reclamante.criado_em)}</p>
                </div>
              )}

              {reclamante.atualizado_em && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2"><Calendar size={16} /> Atualizado em</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDateTime(reclamante.atualizado_em)}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card hover gradient className="shadow-2xl border-2 border-gradient-to-r from-purple-200 to-pink-200 dark:border-pink-700/50">
          <CardHeader variant="gradient" color="purple">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Save size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Atualização Parcial</h2>
                <p className="text-purple-100 text-sm">Altere campos e envie atualização parcial</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <form onSubmit={handlePatch} className="space-y-4">
              <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} error={errors.nome} icon={<User size={16} />} />
              <Input label="Documento" name="documento" value={formData.documento} onChange={handleChange} error={errors.documento} icon={<FileText size={16} />} />
              <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} error={errors.telefone} icon={<Phone size={16} />} />

              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={() => setFormData({ nome: reclamante.nome || '', documento: reclamante.documento || '', telefone: reclamante.telefone || '' })}>
                  Resetar
                </Button>
                <Button type="submit" variant="primary" loading={submitting} disabled={submitting} icon={<Save size={16} />}>
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
