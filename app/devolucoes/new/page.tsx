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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg">
              <RotateCcw size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400 mb-2">
                Registrar Devolução
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Complete o registro de devolução de um item encontrado
              </p>
            </div>
          </div>
        </div>

        {/* Error/Success Alert */}
        {submitSuccess && (
          <Alert
            type="success"
            title="✓ Sucesso!"
            message="Devolução registrada com sucesso. Redirecionando..."
            closeable={false}
            animated
          />
        )}

        {/* Form Card */}
        <Card hover gradient className="shadow-2xl border-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:border-teal-700/50">
          <CardHeader variant="gradient" color="emerald">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <RotateCcw size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Informações da Devolução</h2>
                <p className="text-emerald-100 text-sm">Registre a devolução do achado</p>
              </div>
            </div>
          </CardHeader>

          <CardBody padding="lg">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Row 1: Item and Reclamante */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Item a ser devolvido"
                  name="item_id"
                  value={formData.item_id}
                  onChange={handleChange}
                  error={errors.item_id}
                  options={itemOptions}
                />

                <Select
                  label="Reclamante"
                  name="reclamante_id"
                  value={formData.reclamante_id}
                  onChange={handleChange}
                  error={errors.reclamante_id}
                  options={reclamanteOptions}
                />
              </div>

              {/* Row 2: Data de Devolução */}
              <Input
                label="Data da Devolução"
                name="data_devolucao"
                type="date"
                value={formData.data_devolucao}
                onChange={handleChange}
                error={errors.data_devolucao}
              />

              {/* Row 3: Observação */}
              <Textarea
                label="Observações"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                placeholder="Informações adicionais sobre a devolução (estado do item, confirmações, etc.)"
                rows={5}
              />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:border-teal-700/50">
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  disabled={submitting}
                  icon={<Save size={20} />}
                >
                  {submitting ? 'Salvando...' : 'Registrar Devolução'}
                </Button>
                <Link href="/devolucoes" className="w-full sm:w-auto">
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

export default function NewDevolutionPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NewDevolutionPageContent />
    </Suspense>
  );
}
