'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Alert, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { RotateCcw, Save, X, Calendar, Search } from 'lucide-react';

type OptionItem = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  label: string;
  placeholder: string;
  value: string;
  options: OptionItem[];
  error?: string;
  onChange: (value: string) => void;
};

function SearchableSelect({ label, placeholder, value, options, error, onChange }: SearchableSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label || '',
    [options, value]
  );

  useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  const handleSelect = (option: OptionItem) => {
    onChange(option.value);
    setQuery(option.label);
    setOpen(false);
  };

  const handleInputChange = (nextValue: string) => {
    setQuery(nextValue);
    setOpen(Boolean(nextValue.trim()));
    onChange('');
  };

  const handleBlur = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setQuery(selectedLabel);
    }, 150);
  };

  return (
    <div className="w-full relative">
      <label className="block text-sm font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-2">
        {label}
      </label>
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(Boolean(query.trim()))}
          onBlur={handleBlur}
          placeholder={placeholder}
          error={error}
          icon={<Search size={20} />}
        />

        {open && filteredOptions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-2xl border-2 border-emerald-200 dark:border-teal-800 bg-white dark:bg-gray-800 shadow-2xl">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-3 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-emerald-50 dark:hover:bg-teal-900/30 ${
                  option.value === value ? 'bg-emerald-50 dark:bg-teal-900/20' : ''
                }`}
              >
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{option.label}</div>
              </button>
            ))}
          </div>
        )}

        {open && query.trim() && filteredOptions.length === 0 && (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border-2 border-emerald-200 dark:border-teal-800 bg-white dark:bg-gray-800 shadow-2xl px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

function NewDevolutionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('item_id');
  const alertTimerRef = useRef<number | null>(null);
  const redirectTimerRef = useRef<number | null>(null);

  const { data: items, loading: loadingItems } = useFetch(() => apiClient.getItems(1, 100));
  const { data: reclamantes, loading: loadingReclamantes } = useFetch(() => apiClient.getReclamantes(0, 100));

  const [formData, setFormData] = useState({
    item_id: itemId || '',
    reclamante_id: '',
    data_devolucao: new Date().toISOString().split('T')[0],
    observacao: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const showSuccess = () => {
    setSubmitSuccess(true);
    if (alertTimerRef.current) {
      window.clearTimeout(alertTimerRef.current);
    }
    alertTimerRef.current = window.setTimeout(() => setSubmitSuccess(false), 3500);
  };

  const showError = (message: string) => {
    setSubmitError(message);
    if (alertTimerRef.current) {
      window.clearTimeout(alertTimerRef.current);
    }
    alertTimerRef.current = window.setTimeout(() => setSubmitError(null), 3500);
  };

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
    setSubmitError(null);
    try {
      await apiClient.createDevolucao(formData);
      
      showSuccess();
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = window.setTimeout(() => router.push('/devolucoes'), 2200);
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao criar devolução. Tente novamente.';
      showError(errorMsg);
      console.error('Erro ao criar devolução', err);
      setSubmitting(false);
    }
  };

  // Função auxiliar para extrair array de items
  const extractItemsArray = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;

    const extract = (obj: Record<string, unknown>): any[] | undefined => {
      if (Array.isArray(obj.items)) return obj.items as any[];
      if (Array.isArray(obj.data)) return obj.data as any[];
      if (Array.isArray(obj.results)) return obj.results as any[];

      if (obj.results && typeof obj.results === 'object' && !Array.isArray(obj.results)) {
        const resultsObj = obj.results as Record<string, unknown>;
        if (Array.isArray(resultsObj.data)) return resultsObj.data as any[];
      }

      if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
        return extract(obj.data as Record<string, unknown>);
      }

      return undefined;
    };

    if (payload && typeof payload === 'object') {
      const extracted = extract(payload as Record<string, unknown>);
      if (Array.isArray(extracted)) return extracted;
    }

    return [];
  };

  // Função auxiliar para extrair array de reclamantes
  const extractReclamantesArray = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;

    const extract = (obj: Record<string, unknown>): any[] | undefined => {
      if (Array.isArray(obj.reclamantes)) return obj.reclamantes as any[];
      if (Array.isArray(obj.items)) return obj.items as any[];
      if (Array.isArray(obj.results)) return obj.results as any[];
      if (Array.isArray(obj.data)) return obj.data as any[];

      if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
        return extract(obj.data as Record<string, unknown>);
      }

      return undefined;
    };

    if (payload && typeof payload === 'object') {
      const extracted = extract(payload as Record<string, unknown>);
      if (Array.isArray(extracted)) return extracted;
    }

    return [];
  };

  const itemsArray = extractItemsArray(items);
  const reclamantesArray = extractReclamantesArray(reclamantes);

  const availableItems = itemsArray.filter((item: any) => item.status !== 'devolvido');

  const itemOptions = availableItems
    .map((item: any) => ({
      value: String(item.id),
      label: `${item.nome} - ${item.categoria}`,
    }));

  const reclamanteOptions = reclamantesArray.map((rec: any) => ({
    value: String(rec.id),
    label: `${rec.nome} (${rec.documento})`,
  }));

  if (loadingItems || loadingReclamantes) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-2xl mx-auto relative z-10">
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

        {submitSuccess && (
          <div className="fixed top-6 left-4 right-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-full sm:max-w-md animate-slide-down pointer-events-none">
            <Alert
              type="success"
              title="Devolução registrada"
              message="O cadastro foi concluído com sucesso. Redirecionando..."
              closeable={false}
              animated
            />
          </div>
        )}

        {submitError && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Erro ao salvar"
              message={submitError}
              closeable
              onClose={() => setSubmitError(null)}
              animated
            />
          </div>
        )}

        <Card hover gradient className="shadow-2xl border-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:border-teal-700/50">
          <CardHeader variant="gradient" color="emerald">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <RotateCcw size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Informações da Devolução</h2>
                <p className="text-emerald-100 text-sm">Preencha os dados do registro</p>
              </div>
            </div>
          </CardHeader>

          <CardBody padding="lg">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Info Alert if no items available */}
              {itemOptions.length === 0 && (
                <Alert
                  type="warning"
                  title="Nenhum item disponível"
                  message="Não há itens para devolver no momento. Todos os itens já foram devolvidos."
                  closeable={false}
                />
              )}

              {/* Row 1: Item and Reclamante */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SearchableSelect
                  label="Item a ser devolvido"
                  value={formData.item_id}
                  onChange={(nextValue) => setFormData((prev) => ({ ...prev, item_id: nextValue }))}
                  error={errors.item_id}
                  options={itemOptions}
                  placeholder="Digite para buscar um item"
                />

                <SearchableSelect
                  label="Reclamante"
                  value={formData.reclamante_id}
                  onChange={(nextValue) => setFormData((prev) => ({ ...prev, reclamante_id: nextValue }))}
                  error={errors.reclamante_id}
                  options={reclamanteOptions}
                  placeholder="Digite para buscar um reclamante"
                />
              </div>

              <Input
                label="Data da Devolução"
                name="data_devolucao"
                type="date"
                value={formData.data_devolucao}
                onChange={handleChange}
                error={errors.data_devolucao}
                icon={<Calendar size={20} />}
              />

              <Textarea
                label="Observações"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                placeholder="Informações adicionais sobre a devolução (estado do item, confirmações, etc.)"
                rows={5}
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:border-teal-700/50">
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  disabled={submitting || itemOptions.length === 0}
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
