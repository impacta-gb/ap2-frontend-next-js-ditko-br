'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, Alert, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { Plus, Save, X, Package } from 'lucide-react';

export default function NewItemPage() {
  const router = useRouter();
  const { data: locais, loading: loadingLocais } = useFetch(() => apiClient.getLocais(1, 100));
  const { data: responsaveis, loading: loadingResponsaveis } = useFetch(() => apiClient.getResponsaveis(1, 100));
  const alertTimerRef = useRef<number | null>(null);
  const redirectTimerRef = useRef<number | null>(null);
  const [submitAlert, setSubmitAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) window.clearTimeout(alertTimerRef.current);
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const showAlert = (alert: { type: 'success' | 'error'; title: string; message: string }) => {
    setSubmitAlert(alert);
    if (alertTimerRef.current) window.clearTimeout(alertTimerRef.current);
    alertTimerRef.current = window.setTimeout(() => {
      setSubmitAlert(null);
    }, 3500);
  };
  
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
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
    
    try {
      const resp = await apiClient.createItem(formData);
      console.log('createItem response:', resp);
      
      // Armazenar data de criação no localStorage para fallback
      if (resp?.id) {
        const creationData = {
          id: resp.id,
          criado_em: new Date().toISOString(),
        };
        const itemCreationTimes = JSON.parse(localStorage.getItem('itemCreationTimes') || '{}');
        itemCreationTimes[resp.id] = creationData.criado_em;
        localStorage.setItem('itemCreationTimes', JSON.stringify(itemCreationTimes));
      }
      
      showAlert({ type: 'success', title: 'Item registrado', message: 'O cadastro foi concluído com sucesso.' });
      setSubmitting(false);
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = window.setTimeout(() => {
        router.push('/items');
      }, 2200);
    } catch (error: any) {
      console.error('Erro ao criar item:', error);
      let msg = 'Erro ao registrar item';
      if (error?.message) msg = error.message;
      else if (typeof error?.details === 'string') msg = error.details;
      else if (error?.details) msg = JSON.stringify(error.details);
      showAlert({ type: 'error', title: 'Erro ao salvar', message: msg });
      setSubmitting(false);
    }
  };

  // Função auxiliar para extrair array de locais
  const extractLocaisArray = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;

    const extract = (obj: Record<string, unknown>): any[] | undefined => {
      if (Array.isArray(obj.locais)) return obj.locais as any[];
      if (Array.isArray(obj.locals)) return obj.locals as any[];
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

  // Função auxiliar para extrair array de responsáveis
  const extractResponsaveisArray = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;
      
      // Verificar estrutura aninhada
      if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
        const dataObj = obj.data as Record<string, unknown>;
        if (Array.isArray(dataObj.responsaveis)) return dataObj.responsaveis as any[];
      }
      
      if (Array.isArray(obj.data)) return obj.data;
      if (Array.isArray(obj.items)) return obj.items;
      if (Array.isArray(obj.responsaveis)) return obj.responsaveis;
    }
    return [];
  };

  const locaisArray = extractLocaisArray(locais);
  const responsaveisArray = extractResponsaveisArray(responsaveis);

  // Mostrar apenas responsáveis ativos no select
  const responsaveisAtivos = responsaveisArray.filter((r: any) => r && typeof r === 'object' ? Boolean((r as any).ativo) : false);

  const localOptions = [
    { value: '', label: 'Selecione um local' },
    ...locaisArray.map((local: any) => ({
      value: local.id,
      label: local.descricao,
    })),
  ];

  const responsavelOptions = [
    { value: '', label: 'Selecione um responsável' },
    ...responsaveisAtivos.map((resp: any) => ({
      value: resp.id,
      label: `${resp.nome} - ${resp.cargo}`,
    })),
  ];

  if (loadingLocais || loadingResponsaveis) {
    return <Loading />;
  }

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
                Registrar Novo Item
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Preencha os dados do item encontrado com precisão
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

        {/* Form Card */}
        <Card hover gradient className="shadow-2xl border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
          <CardHeader variant="gradient" color="blue">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Informações do Item</h2>
                <p className="text-blue-100 text-sm">Detalhes do achado</p>
              </div>
            </div>
          </CardHeader>

          <CardBody padding="lg">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Row 1: Nome and Categoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome/Descrição Breve"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  error={errors.nome}
                  placeholder="Ex: Chaves prateadas"
                  icon={<Package size={20} />}
                />

                <Input
                  label="Categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  error={errors.categoria}
                  placeholder="Ex: Eletrônicos"
                />
              </div>

              {/* Row 2: Data de Encontro */}
              <Input
                label="Data de Encontro"
                name="data_encontro"
                type="date"
                value={formData.data_encontro}
                onChange={handleChange}
                error={errors.data_encontro}
              />

              {/* Row 3: Descrição */}
              <Textarea
                label="Descrição Detalhada"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                error={errors.descricao}
                placeholder="Descreva o item em detalhes: cores, marca, estado, condições especiais, etc."
                rows={5}
              />

              {/* Row 4: Seleções */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Local onde foi encontrado"
                  name="local_id"
                  value={formData.local_id}
                  onChange={handleChange}
                  error={errors.local_id}
                  options={localOptions}
                />

                <Select
                  label="Responsável pelo registro"
                  name="responsavel_id"
                  value={formData.responsavel_id}
                  onChange={handleChange}
                  error={errors.responsavel_id}
                  options={responsavelOptions}
                />
              </div>

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
}
