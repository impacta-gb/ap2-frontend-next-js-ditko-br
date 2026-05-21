'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Button, Card, CardBody, CardHeader, Input, Textarea, Select, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id || '');
  
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
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  const { data: item, loading: loadingItem, error: errorItem } = useFetch(() => apiClient.getItemById(id), [id]);
  const { data: locais, loading: loadingLocais } = useFetch(() => apiClient.getLocais(1, 100));
  const { data: responsaveis, loading: loadingResponsaveis } = useFetch(() => apiClient.getResponsaveis(1, 100));

  useEffect(() => {
    if (!item) return;
    
    // Extrair dados do item
    let itemData = item;
    if (item.data && typeof item.data === 'object' && !Array.isArray(item.data)) {
      itemData = item.data;
    }
    
    // Converter data para formato YYYY-MM-DD se necessário
    let dataEncontro = itemData.data_encontro || '';
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
      local_id: itemData.local_id || '',
      responsavel_id: itemData.responsavel_id || '',
    });
  }, [item]);

  const validate = () => {
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
