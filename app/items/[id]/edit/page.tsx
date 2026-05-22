'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Button, Card, CardBody, CardHeader, Input, Textarea, Loading, Select } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { normalizeItemStatus } from '@/src/lib/utils';
import { ArrowLeft, Save, Search } from 'lucide-react';
import type { ItemStatus } from '@/src/types';

type SearchableOption = {
  value: string;
  label: string;
  searchText?: string;
};

type SearchableSelectProps = {
  label: string;
  placeholder: string;
  value: string;
  options: SearchableOption[];
  error?: string;
  onChange: (value: string) => void;
};

function SearchableSelect({
  label,
  placeholder,
  value,
  options,
  error,
  onChange,
}: SearchableSelectProps) {
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

    return options.filter((option) => {
      const searchable = `${option.label} ${option.searchText || ''}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [options, query]);

  const handleSelect = (option: SearchableOption) => {
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
          helperText={selectedLabel ? `Selecionado: ${selectedLabel}` : undefined}
          error={error}
          icon={<Search size={20} />}
        />

        {open && filteredOptions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 shadow-2xl">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-3 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                  option.value === value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{option.label}</div>
              </button>
            ))}
          </div>
        )}

        {open && query.trim() && filteredOptions.length === 0 && (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 shadow-2xl px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id || '');

  const extractArray = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];

    const obj = payload as Record<string, unknown>;
    const candidates = [obj.data, obj.items, obj.results, obj.locais, obj.responsaveis, obj.locals];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate as any[];
    }

    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      return extractArray(obj.data);
    }

    const resultsObj = obj.results as any;
    if (resultsObj && typeof resultsObj === 'object') {
      if (Array.isArray(resultsObj.data)) return resultsObj.data as any[];
      if (Array.isArray(resultsObj.items)) return resultsObj.items as any[];
    }

    return [];
  };

  const resolveItemData = (payload: any) => {
    if (!payload || typeof payload !== 'object') return payload;
    if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) return payload.data;
    if (payload.item && typeof payload.item === 'object' && !Array.isArray(payload.item)) return payload.item;
    return payload;
  };

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

  const extractResponsaveisArray = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;

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
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    data_encontro: '',
    descricao: '',
    status: '' as ItemStatus | '',
    local_id: '',
    responsavel_id: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  const { data: item, loading: loadingItem, error: errorItem } = useFetch(() => apiClient.getItemById(id), [id]);
  const { data: locais, loading: loadingLocais } = useFetch(() => apiClient.getLocais(1, 100));
  const { data: responsaveis, loading: loadingResponsaveis } = useFetch(() => apiClient.getResponsaveis(1, 100));

  useEffect(() => {
    if (!item) return;
    
    // Extrair dados do item
    const itemData = resolveItemData(item) as Record<string, any>;
    
    // Converter data para formato YYYY-MM-DD se necessário
    let dataEncontro = itemData.data_encontro || itemData.dataEncontro || itemData.encontro_em || '';
    if (dataEncontro) {
      // Se a data está em formato DD/MM/YYYY ou outro, converter para YYYY-MM-DD
      if (dataEncontro.includes('/')) {
        const parts = dataEncontro.split('/');
        if (parts.length === 3) {
          dataEncontro = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      } else if (dataEncontro.includes('-') && dataEncontro.length > 10) {
        // Se é ISO com hora, pegar apenas a data
        dataEncontro = dataEncontro.split('T')[0];
      }
    }
    
    setFormData({
      nome: itemData.nome || '',
      categoria: itemData.categoria || '',
      data_encontro: dataEncontro,
      descricao: itemData.descricao || '',
      status: (normalizeItemStatus(itemData.status) as ItemStatus) || '',
      local_id: itemData.local_id || itemData.localId || '',
      responsavel_id: itemData.responsavel_id || itemData.responsavelId || '',
    });
  }, [item]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.categoria.trim()) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.data_encontro) newErrors.data_encontro = 'Data de encontro é obrigatória';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.status) newErrors.status = 'Status é obrigatório';
    if (!formData.local_id) newErrors.local_id = 'Local é obrigatório';
    if (!formData.responsavel_id) newErrors.responsavel_id = 'Responsável é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setAlert({ type: 'error', title: 'Campos inválidos', message: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        nome: formData.nome.trim(),
        categoria: formData.categoria.trim(),
        data_encontro: formData.data_encontro,
        descricao: formData.descricao.trim(),
        status: formData.status ? (formData.status as ItemStatus) : undefined,
        local_id: formData.local_id,
        responsavel_id: formData.responsavel_id,
      };

      console.log('Enviando payload:', payload);
      // Usar PATCH para atualização parcial
      const response = await apiClient.patchItem(id, payload);
      console.log('Resposta do patchItem:', response);
      setAlert({ type: 'success', title: 'Item atualizado', message: 'As alterações foram salvas com sucesso.' });
      setTimeout(() => {
        router.push(`/items/${id}`);
      }, 1200);
    } catch (error: any) {
      console.error('Erro ao atualizar item - Objeto completo:', error);
      console.error('Erro ao atualizar item - Type:', typeof error);
      console.error('Erro ao atualizar item - Keys:', Object.keys(error || {}));
      
      let errorMessage = 'Não foi possível atualizar o item.';
      
      // Tentar extrair mensagem de vários locais
      if (error?.message && error.message !== '') {
        errorMessage = error.message;
      } else if (error?.status) {
        errorMessage = `Erro ${error.status}: ${error.message || 'Falha na requisição'}`;
      } else if (typeof error?.details === 'string' && error.details !== '') {
        errorMessage = error.details;
      } else if (error?.details && typeof error.details === 'object') {
        // Se details é um objeto com erros
        const firstError = Object.values(error.details)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0] || 'Erro ao atualizar';
        } else if (typeof firstError === 'string') {
          errorMessage = firstError;
        } else {
          errorMessage = JSON.stringify(error.details);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message || 'Erro desconhecido';
      }
      
      setAlert({ type: 'error', title: 'Erro ao atualizar', message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  // Função auxiliar para extrair array de locais
  const locaisArray = extractLocaisArray(locais);
  const responsaveisArray = extractResponsaveisArray(responsaveis);

  // Mostrar apenas responsáveis ativos no select
  const responsaveisAtivos = responsaveisArray.filter((r: any) => r && typeof r === 'object' ? Boolean((r as any).ativo) : false);

  const localOptions = [
    { value: '', label: 'Selecione um local' },
    ...locaisArray.map((local: any) => ({
      value: local.id,
      label: `${local.tipo} - ${local.descricao}`,
      searchText: `${local.tipo} ${local.descricao}`,
    })),
  ];

  const responsavelOptions = [
    { value: '', label: 'Selecione um responsável' },
    ...responsaveisAtivos.map((resp: any) => ({
      value: resp.id,
      label: `${resp.nome} - ${resp.cargo}`,
      searchText: `${resp.nome} ${resp.cargo}`,
    })),
  ];

  const statusOptions = [
    { value: '', label: 'Selecione um status' },
    ...(formData.status === 'devolvido'
      ? [{ value: 'devolvido', label: 'Devolvido' }]
      : []),
    { value: 'disponível', label: 'Disponível' },
    { value: 'pendente', label: 'Pendente' },
  ];

  if (loadingItem || loadingLocais || loadingResponsaveis) return <Loading />;

  if (errorItem || !item) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert
          type="error"
          title="Falha ao carregar"
          message={errorItem || 'Item não encontrado.'}
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

        <Link href={`/items/${id}`}>
          <Button variant="outline" icon={<ArrowLeft size={18} />}>
            Voltar para detalhes
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar item</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Nome/Descrição Breve"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  error={errors.nome}
                  placeholder="Ex: Chaves prateadas"
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

              <Input
                label="Data de Encontro"
                name="data_encontro"
                type="date"
                value={formData.data_encontro}
                onChange={handleChange}
                error={errors.data_encontro}
              />

              <Textarea
                label="Descrição Detalhada"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                error={errors.descricao}
                placeholder="Descreva o item em detalhes: cores, marca, estado, condições especiais, etc."
                rows={5}
              />

              <Select
                label="Status do item"
                name="status"
                value={formData.status}
                onChange={handleChange}
                error={errors.status}
                options={statusOptions}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SearchableSelect
                  label="Local onde foi encontrado"
                  placeholder="Digite para buscar pelo tipo ou descrição"
                  value={formData.local_id}
                  onChange={(nextValue) => setFormData((prev) => ({ ...prev, local_id: nextValue }))}
                  error={errors.local_id}
                  options={localOptions}
                />

                <SearchableSelect
                  label="Responsável pelo registro"
                  placeholder="Digite para buscar pelo nome"
                  value={formData.responsavel_id}
                  onChange={(nextValue) => setFormData((prev) => ({ ...prev, responsavel_id: nextValue }))}
                  error={errors.responsavel_id}
                  options={responsavelOptions}
                />
              </div>

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
