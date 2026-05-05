'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, Alert } from '@/src/components';
import { mockLocais, mockResponsaveis } from '@/src/lib/mockData';
import { CreateLocalRequest } from '@/src/types';
import { Plus, Save, X, Package } from 'lucide-react';
import { apiClient } from '@/src/lib/api-client';

export default function NewLocalPage() {
  const router = useRouter();
  const alertTimerRef = useRef<number | null>(null);
  const [formData, setFormData] = useState({
    tipo: '',
    descricao: '',
    bairro: '',
    item_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const redirectTimerRef = useRef<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitAlert, setSubmitAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const showAlert = (alert: { type: 'success' | 'error'; title: string; message: string }) => {
    setSubmitAlert(alert);

    if (alertTimerRef.current) {
      window.clearTimeout(alertTimerRef.current);
    }

    alertTimerRef.current = window.setTimeout(() => {
      setSubmitAlert(null);
    }, 3500);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tipo.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.descricao.trim()) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.bairro) newErrors.data_encontro = 'Data de encontro é obrigatória';
    if (!formData.item_id) newErrors.local_id = 'Local é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try{
      const payload: CreateLocalRequest = {
        tipo: formData.tipo.trim(),
        descricao: formData.descricao.trim(),
        bairro: formData.bairro.trim()
      }
      await apiClient.createLocal(payload)

      showAlert({
        type: 'success',
        title: 'Local registrado',
        message: 'O cadastro foi concluído com sucesso.',
      })

      if(redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current)
      }
      redirectTimerRef.current = window.setTimeout(() => {
        router.push('/locais')
      }, 2200)
    } catch{
      showAlert({
        type: 'error',
        title: 'Erro ao salvar',
        message: 'Não foi possível registrar o responsável neste momento.',
      });
    }
  const localOptions =
    mockLocais?.data?.map((local: any) => ({
      value: local.id,
      label: `${local.tipo} - ${local.bairro}`,
    })) || [];

  const responsavelOptions =
    mockResponsaveis?.data?.map((resp: any) => ({
      value: resp.id,
      label: `${resp.nome} (${resp.cargo})`,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Plus size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-2">
                Registrar Novo Local
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Preencha os dados do local com precisão
              </p>
            </div>
          </div>
        </div>

        {/* Error/Success Alert */}
        {submitSuccess && (
          <Alert
            type="success"
            title="🎉 Sucesso!"
            message="Local registrado com sucesso. Redirecionando..."
            closeable={false}
            animated
          />
        )}

        {/* Form Card */}
        <Card hover gradient className="shadow-2xl border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
          <CardHeader variant="gradient" color="blue">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Informações do Local</h2>
                <p className="text-blue-100 text-sm">Detalhes</p>
              </div>
            </div>
          </CardHeader>

          <CardBody padding="lg">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Row 1: Nome and Categoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="tipo do local"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  error={errors.nome}
                  placeholder="Ex: Avenida"
                  icon={<Package size={20} />}
                />

                <Input
                  label="Bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  error={errors.bairro}
                  placeholder="Ex: Vila mariana"
                />
              </div>


              {/* Row 2: Descrição */}
              <Textarea
                label="Descrição Detalhada"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                error={errors.descricao}
                placeholder="Descreva o local em detalhes"
                rows={5}
              />



              {/* Actions */}
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
                  {submitting ? 'Salvando...' : 'Registrar Item'}
                </Button>
                <Link href="/items" className="w-full sm:w-auto">
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
}}
