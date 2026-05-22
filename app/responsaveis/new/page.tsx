'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Input, Alert } from '@/src/components';
import { apiClient } from '@/src/lib/api-client';
import { CreateResponsavelRequest } from '@/src/types';
import { Plus, Save, X, Users, Briefcase, Phone } from 'lucide-react';

export default function NewResponsavelPage() {
  const router = useRouter();
  const alertTimerRef = useRef<number | null>(null);
  const redirectTimerRef = useRef<number | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    telefone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitAlert, setSubmitAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) {
        window.clearTimeout(alertTimerRef.current);
      }
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const showAlert = (alert: { type: 'success' | 'error'; title: string; message: string }) => {
    setSubmitAlert(alert);

    if (alertTimerRef.current) {
      window.clearTimeout(alertTimerRef.current);
    }

    alertTimerRef.current = window.setTimeout(() => {
      setSubmitAlert(null);
    }, 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.cargo.trim()) newErrors.cargo = 'Cargo é obrigatório';
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
      showAlert({
        type: 'error',
        title: 'Erro ao registrar',
        message: 'Revise os campos destacados e tente novamente.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateResponsavelRequest = {
        nome: formData.nome.trim(),
        cargo: formData.cargo.trim(),
        telefone: formData.telefone.trim(),
      };

      console.log('Enviando payload:', payload);
      await apiClient.createResponsavel(payload);

      showAlert({
        type: 'success',
        title: 'Responsável registrado',
        message: 'O cadastro foi concluído com sucesso.',
      });

      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = window.setTimeout(() => {
        router.push('/responsaveis');
      }, 2200);
    } catch (error: any) {
      console.error('Erro ao criar responsável:', error);
      console.error('Erro completo:', JSON.stringify(error, null, 2));
      const errorMsg = error?.message || error?.details || JSON.stringify(error);
      showAlert({
        type: 'error',
        title: 'Erro ao salvar',
        message: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-2">
              <Plus size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-2 pb-2">
                Registrar Responsável
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Cadastre um novo responsável para gerenciar os registros
              </p>
            </div>
          </div>
        </div>

        {submitAlert && (
          <div className="fixed top-6 left-4 right-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-full sm:max-w-md animate-slide-down pointer-events-none">
            <Alert
              type={submitAlert.type}
              title={submitAlert.title}
              message={submitAlert.message}
              closeable={false}
              animated
            />
          </div>
        )}

        <Card hover gradient className="shadow-2xl border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
          <CardHeader variant="gradient" color="purple">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Informações do Responsável</h2>
                <p className="text-purple-100 text-sm">Preencha os dados de identificação</p>
              </div>
            </div>
          </CardHeader>

          <CardBody padding="lg">
            <form onSubmit={handleSubmit} className="space-y-7">
              <Input
                label="Nome completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                error={errors.nome}
                placeholder="Ex: Maria dos Santos"
                icon={<Users size={20} />}
              />

              <Input
                label="Cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                error={errors.cargo}
                placeholder="Ex: Assistente Administrativo"
                icon={<Briefcase size={20} />}
              />

              <Input
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                error={errors.telefone}
                placeholder="Ex: (11) 99999-9999"
                icon={<Phone size={20} />}
              />

              <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">
                O responsável é criado como <span className="font-semibold">ativo</span> por padrão.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  disabled={submitting}
                  icon={<Save size={20} />}
                >
                  {submitting ? 'Salvando...' : 'Registrar Responsável'}
                </Button>
                <Link href="/responsaveis" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" fullWidth icon={<X size={20} />}>
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}