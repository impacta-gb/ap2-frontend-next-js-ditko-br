'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, Alert } from '@/src/components';
import { mockLocais, mockResponsaveis } from '@/src/lib/mockData';
import { Plus, Save, X, Package } from 'lucide-react';

export default function NewItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    data_encontro: '',
    descricao: '',
    local_id: '',
    responsavel_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.categoria.trim()) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.data_encontro) newErrors.data_encontro = 'Data de encontro é obrigatória';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.local_id) newErrors.local_id = 'Local é obrigatório';
    if (!formData.responsavel_id) newErrors.responsavel_id = 'Responsável é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    // Simular delay de API
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        router.push('/items');
      }, 1500);
    }, 500);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Plus size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-1">
                Registrar Novo Item
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Preencha os dados do item encontrado com cuidado
              </p>
            </div>
          </div>
        </div>

        {/* Error/Success Alert */}
        {submitSuccess && (
          <Alert
            type="success"
            title="Sucesso!"
            message="Item registrado com sucesso. Redirecionando..."
            closeable={false}
          />
        )}

        {/* Form */}
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package size={24} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informações do Item</h2>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <Input
                label="Nome/Descrição Breve"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                error={errors.nome}
                placeholder="Ex: Chaves prateadas"
              />

              {/* Categoria */}
              <Input
                label="Categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                error={errors.categoria}
                placeholder="Ex: Eletrônicos, Documentos, Acessórios"
              />

              {/* Data de Encontro */}
              <Input
                label="Data de Encontro"
                name="data_encontro"
                type="date"
                value={formData.data_encontro}
                onChange={handleChange}
                error={errors.data_encontro}
              />

              {/* Descrição */}
              <Textarea
                label="Descrição Detalhada"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                error={errors.descricao}
                placeholder="Descreva o item em detalhes: cores, marca, estado, etc."
                rows={5}
              />

              {/* Local */}
              <Select
                label="Local onde foi encontrado"
                name="local_id"
                value={formData.local_id}
                onChange={handleChange}
                error={errors.local_id}
                options={localOptions}
              />

              {/* Responsável */}
              <Select
                label="Responsável pelo registro"
                name="responsavel_id"
                value={formData.responsavel_id}
                onChange={handleChange}
                error={errors.responsavel_id}
                options={responsavelOptions}
              />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  disabled={submitting}
                >
                  <Save size={20} />
                  {submitting ? 'Salvando...' : 'Registrar Item'}
                </Button>
                <Link href="/items" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" fullWidth>
                    <X size={20} />
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
