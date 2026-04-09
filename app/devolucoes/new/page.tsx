'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, Alert, Loading } from '@/src/components';
import { mockReclamantes, mockItems } from '@/src/lib/mockData';
import { RotateCcw, Save, X } from 'lucide-react';

function NewDevolutionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('item_id');

  const [formData, setFormData] = useState({
    item_id: itemId || '',
    reclamante_id: '',
    data_devolucao: new Date().toISOString().split('T')[0],
    observacao: '',
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

    if (!formData.item_id) newErrors.item_id = 'Item é obrigatório';
    if (!formData.reclamante_id) newErrors.reclamante_id = 'Reclamante é obrigatório';
    if (!formData.data_devolucao) newErrors.data_devolucao = 'Data de devolução é obrigatória';

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
        router.push('/devolucoes');
      }, 1500);
    }, 500);
  };

  const reclamanteOptions =
    mockReclamantes?.data?.map((rec: any) => ({
      value: rec.id,
      label: `${rec.nome} (${rec.documento})`,
    })) || [];

  const itemOptions =
    mockItems?.data
      ?.filter((item: any) => item.status === 'disponível')
      .map((item: any) => ({
        value: item.id,
        label: `${item.nome} - ${item.categoria}`,
      })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-blue-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
              <RotateCcw size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-1">
                Registrar Devolução
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Registre a devolução de um item encontrado
              </p>
            </div>
          </div>
        </div>

        {/* Error/Success Alert */}
        {submitSuccess && (
          <Alert
            type="success"
            title="Sucesso!"
            message="Devolução registrada com sucesso. Redirecionando..."
            closeable={false}
          />
        )}

        {/* Form */}
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <RotateCcw size={24} className="text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dados da Devolução</h2>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item */}
              <Select
                label="Item a ser devolvido"
                name="item_id"
                value={formData.item_id}
                onChange={handleChange}
                error={errors.item_id}
                options={itemOptions}
              />

              {/* Reclamante */}
              <Select
                label="Reclamante"
                name="reclamante_id"
                value={formData.reclamante_id}
                onChange={handleChange}
                error={errors.reclamante_id}
                options={reclamanteOptions}
              />

              {/* Data de Devolução */}
              <Input
                label="Data da Devolução"
                name="data_devolucao"
                type="date"
                value={formData.data_devolucao}
                onChange={handleChange}
                error={errors.data_devolucao}
              />

              {/* Observação */}
              <Textarea
                label="Observações"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                placeholder="Informações adicionais sobre a devolução (opcional)"
                rows={4}
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
                  {submitting ? 'Salvando...' : 'Registrar Devolução'}
                </Button>
                <Link href="/devolucoes" className="w-full sm:w-auto">
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

export default function NewDevolutionPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NewDevolutionPageContent />
    </Suspense>
  );
}
