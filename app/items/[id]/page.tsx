'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, Button, Badge, Loading, Alert, Input, Textarea, Select } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { formatDate, formatDateTime, translateStatus, normalizeItemStatus } from '@/src/lib/utils';
import { Pencil, Trash2, ArrowLeft, Package, Calendar, MapPin, Users, Clock, RotateCcw, Info, Save, Search } from 'lucide-react';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const [createdAtFallback, setCreatedAtFallback] = useState<string | null>(null);
  const [savingPartial, setSavingPartial] = useState(false);
  const [partialData, setPartialData] = useState({ nome: '', categoria: '', data_encontro: '', descricao: '', status: '', local_id: '', responsavel_id: '' });
  const [locaisMapa, setLocaisMapa] = useState<Record<string, any>>({});
  const [responsaveisMapa, setResponsaveisMapa] = useState<Record<string, any>>({});
  const [patchAlert, setPatchAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const alertTimerRef = useRef<number | null>(null);
  const patchAlertTimerRef = useRef<number | null>(null);
  const { data: itemRaw, loading, error, refetch } = useFetch(() => apiClient.getItemById(id), [id]);

  const extractArray = (obj: Record<string, unknown> | unknown): any[] | undefined => {
    if (Array.isArray(obj)) return obj as any[];
    if (!obj || typeof obj !== 'object') return undefined;

    const o = obj as Record<string, unknown>;
    const candidates = [o.data, o.items, o.results, o.locais, o.responsaveis, o.locals];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate as any[];
    }

    if (o.data && typeof o.data === 'object' && !Array.isArray(o.data)) {
      return extractArray(o.data as Record<string, unknown>);
    }

    const resultsObj = (o.results as any) ?? undefined;
    if (resultsObj && typeof resultsObj === 'object') {
      if (Array.isArray(resultsObj.data)) return resultsObj.data as any[];
      if (Array.isArray(resultsObj.items)) return resultsObj.items as any[];
    }

    return undefined;
  };

  const resolveLinkedEntity = (
    itemData: Record<string, any>,
    entityKey: 'local' | 'responsavel',
    fallbackMap: Record<string, any>
  ) => {
    const direct = itemData?.[entityKey];
    if (direct && typeof direct === 'object') return direct;

    const altKeys = [`${entityKey}_data`, `${entityKey}Data`, `${entityKey}Info`];
    for (const key of altKeys) {
      const candidate = itemData?.[key];
      if (candidate && typeof candidate === 'object') return candidate;
    }

    const idKey = `${entityKey}_id`;
    const linkedId = itemData?.[idKey];
    if (linkedId !== undefined && linkedId !== null && linkedId !== '') {
      const fromMap = fallbackMap[String(linkedId)];
      if (fromMap) return fromMap;
    }

    return null;
  };

  const resolveDateValue = (...values: Array<string | null | undefined>) => {
    for (const value of values) {
      if (typeof value === 'string' && value.trim() !== '') return value;
    }
    return '';
  };

  const extractItem = (payload: unknown) => {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
    const obj = payload as Record<string, unknown>;
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) return obj.data as Record<string, unknown>;
    if (obj.item && typeof obj.item === 'object' && !Array.isArray(obj.item)) return obj.item as Record<string, unknown>;
    return obj as Record<string, unknown>;
  };

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
          </div>

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

  // Recuperar fallback de criado_em do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const itemCreationTimes = JSON.parse(localStorage.getItem('itemCreationTimes') || '{}');
      setCreatedAtFallback(itemCreationTimes[id] || null);
    }
  }, [id]);

  // Extrair o item corretamente da resposta
  let item = itemRaw;
  if (itemRaw && typeof itemRaw === 'object' && !Array.isArray(itemRaw)) {
    const obj = itemRaw as Record<string, unknown>;
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      item = obj.data as any;
    } else if (obj.item && typeof obj.item === 'object' && !Array.isArray(obj.item)) {
      item = obj.item as any;
    }
  }

  // Debug: log das datas para verificar formato
  useEffect(() => {
    if (item) {
      console.log('Item data:', {
        criado_em: item.criado_em,
        atualizado_em: item.atualizado_em,
        data_encontro: item.data_encontro,
      });
    }
  }, [item]);

  const itemData = useMemo(() => extractItem(item), [item]);

  useEffect(() => {
    if (!itemData) return;

    const rawDate = String(itemData.data_encontro || itemData.dataEncontro || itemData.encontro_em || '');
    const normalizedDate = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;

    setPartialData({
      nome: String(itemData.nome || ''),
      categoria: String(itemData.categoria || ''),
      data_encontro: normalizedDate,
      descricao: String(itemData.descricao || ''),
      status: normalizeItemStatus(String(itemData.status || '')),
      local_id: String(itemData.local_id || itemData.localId || ''),
      responsavel_id: String(itemData.responsavel_id || itemData.responsavelId || ''),
    });
  }, [itemData]);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) {
        window.clearTimeout(alertTimerRef.current);
      }
      if (patchAlertTimerRef.current) {
        window.clearTimeout(patchAlertTimerRef.current);
      }
    };
  }, []);

  const showAlert = (nextAlert: { type: 'success' | 'error'; title: string; message: string }) => {
    setPatchAlert(nextAlert);
    if (patchAlertTimerRef.current) {
      window.clearTimeout(patchAlertTimerRef.current);
    }
    patchAlertTimerRef.current = window.setTimeout(() => {
      setPatchAlert(null);
    }, 3500);
  };

  // Carregar dados dos locais para mapeamento
  useFetch(async () => {
    const response = await apiClient.getLocais(1, 1000);
    const locais = extractArray(response) || [];
    const mapa: Record<string, any> = {};
    locais.forEach((local: any) => {
      mapa[local.id] = local;
    });
    setLocaisMapa(mapa);
    return locais;
  }, []);

  // Carregar dados dos responsáveis para mapeamento
  useFetch(async () => {
    const response = await apiClient.getResponsaveis(1, 1000);
    const responsaveis = extractArray(response) || [];
    const mapa: Record<string, any> = {};
    responsaveis.forEach((resp: any) => {
      mapa[resp.id] = resp;
    });
    setResponsaveisMapa(mapa);
    return responsaveis;
  }, []);

  const localOptions = useMemo(() => {
    return Object.values(locaisMapa || {}).map((local: any) => ({
      value: String(local.id),
      label: `${local.tipo || ''}${local.tipo && local.descricao ? ' - ' : ''}${local.descricao || ''}`,
    }));
  }, [locaisMapa]);

  const responsavelOptions = useMemo(() => {
    return Object.values(responsaveisMapa || {})
      .filter((r: any) => r && (r.ativo === undefined || Boolean(r.ativo)))
      .map((resp: any) => ({
        value: String(resp.id),
        label: `${resp.nome || ''}${resp.cargo ? ' - ' + resp.cargo : ''}`,
      }));
  }, [responsaveisMapa]);

  const statusOptions = [
    { value: '', label: 'Selecione um status' },
    ...(partialData.status === 'devolvido' ? [{ value: 'devolvido', label: 'Devolvido' }] : []),
    { value: 'disponível', label: 'Disponível' },
    { value: 'pendente', label: 'Pendente' },
  ];

  const handleDelete = async () => {
    const confirmou = window.confirm('Deseja realmente excluir este item?');
    if (!confirmou) return;

    try {
      setActionLoading(true);
      await apiClient.deleteItem(id);
      setAlert({
        type: 'success',
        title: 'Item excluído',
        message: 'O registro foi removido com sucesso.',
      });
      setTimeout(() => {
        router.push('/items');
      }, 1200);
    } catch {
      setAlert({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o item.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePartialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, string> = {};

    if (partialData.nome.trim()) payload.nome = partialData.nome.trim();
    if (partialData.categoria.trim()) payload.categoria = partialData.categoria.trim();
    if (partialData.data_encontro.trim()) payload.data_encontro = partialData.data_encontro.trim();
    if (partialData.descricao.trim()) payload.descricao = partialData.descricao.trim();
    if (partialData.status.trim()) payload.status = partialData.status.trim();
    if (partialData.local_id.trim()) payload.local_id = partialData.local_id.trim();
    if (partialData.responsavel_id.trim()) payload.responsavel_id = partialData.responsavel_id.trim();

    if (!Object.keys(payload).length) {
      showAlert({ type: 'error', title: 'Sem alterações', message: 'Informe ao menos um campo para atualização parcial.' });
      return;
    }

    try {
      setSavingPartial(true);
      await apiClient.patchItem(id, payload);
      showAlert({ type: 'success', title: 'Atualização parcial', message: 'Dados atualizados com sucesso.' });
      refetch();
    } catch {
      showAlert({ type: 'error', title: 'Erro ao atualizar', message: 'Não foi possível atualizar parcialmente o item.' });
    } finally {
      setSavingPartial(false);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert type="error" title="Erro" message={error} />
          <Link href="/items" className="mt-4 block">
            <Button variant="secondary">← Voltar para itens</Button>
          </Link>
        </div>
      </div>
    );

  if (!item)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert type="warning" title="Não encontrado" message="Item não encontrado" />
          <Link href="/items" className="mt-4 block">
            <Button variant="secondary">← Voltar para itens</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
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

        {patchAlert && (
          <Alert
            type={patchAlert.type}
            title={patchAlert.title}
            message={patchAlert.message}
            onClose={() => setPatchAlert(null)}
            closeable
            animated
          />
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/items">
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              Voltar
            </Button>
          </Link>
          {normalizeItemStatus(item?.status) === 'disponível' && (
            <Link href={`/devolucoes/new?item_id=${item?.id}`}>
              <Button variant="success" icon={<RotateCcw size={18} />}>
                Registrar Devolução
              </Button>
            </Link>
          )}
          <Link href={`/items/${id}/edit`}>
            <Button variant="secondary" icon={<Pencil size={18} />}>
              Editar
            </Button>
          </Link>
          <Button variant="danger" icon={<Trash2 size={18} />} loading={actionLoading} onClick={handleDelete}>
            Excluir
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Package size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white truncate">
                  {item?.nome || 'Item sem nome'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {item?.categoria || 'Categoria não informada'}
                </p>
              </div>
              <Badge
                label={translateStatus(item?.status)}
                variant={
                  normalizeItemStatus(item?.status) === 'disponível'
                    ? 'success'
                    : normalizeItemStatus(item?.status) === 'devolvido'
                    ? 'info'
                    : 'warning'
                }
              />
            </div>
          </CardHeader>

          <CardBody className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                <Info size={16} /> Descrição
              </p>
              <p className="text-gray-700 dark:text-gray-200">{item?.descricao || 'Descrição não informada'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2"><Calendar size={16} /> Data de Encontro</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(item?.data_encontro || '')}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2"><MapPin size={16} /> Local Encontrado</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{resolveLinkedEntity(item as Record<string, any>, 'local', locaisMapa)?.tipo || resolveLinkedEntity(item as Record<string, any>, 'local', locaisMapa)?.descricao || 'Local não informado'}</p>
                {(resolveLinkedEntity(item as Record<string, any>, 'local', locaisMapa)?.bairro || resolveLinkedEntity(item as Record<string, any>, 'local', locaisMapa)?.descricao) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{resolveLinkedEntity(item as Record<string, any>, 'local', locaisMapa)?.bairro || resolveLinkedEntity(item as Record<string, any>, 'local', locaisMapa)?.descricao}</p>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2"><Users size={16} /> Responsável</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{resolveLinkedEntity(item as Record<string, any>, 'responsavel', responsaveisMapa)?.nome || resolveLinkedEntity(item as Record<string, any>, 'responsavel', responsaveisMapa)?.cargo || 'Responsável não informado'}</p>
                {(resolveLinkedEntity(item as Record<string, any>, 'responsavel', responsaveisMapa)?.cargo || resolveLinkedEntity(item as Record<string, any>, 'responsavel', responsaveisMapa)?.telefone) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{resolveLinkedEntity(item as Record<string, any>, 'responsavel', responsaveisMapa)?.cargo || resolveLinkedEntity(item as Record<string, any>, 'responsavel', responsaveisMapa)?.telefone}</p>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2"><Clock size={16} /> Registrado em</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDateTime(resolveDateValue(item?.criado_em, item?.created_at, item?.createdAt, createdAtFallback))}</p>
              </div>
            </div>

            {item?.devolucao && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">✅ Devolução Registrada</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-blue-900 dark:text-blue-100">Reclamante:</span><span className="text-blue-800 dark:text-blue-200 ml-2">{item.devolucao.reclamante?.nome || 'Não informado'}</span></p>
                  <p><span className="font-medium text-blue-900 dark:text-blue-100">Data de Devolução:</span><span className="text-blue-800 dark:text-blue-200 ml-2">{formatDate(item.devolucao.data_devolucao || '')}</span></p>
                  {item.devolucao.observacao && <p><span className="font-medium text-blue-900 dark:text-blue-100">Observação:</span><span className="text-blue-800 dark:text-blue-200 ml-2">{item.devolucao.observacao}</span></p>}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card hover gradient className="shadow-2xl border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
          <CardHeader variant="gradient" color="blue">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Save size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Atualização Parcial</h2>
                <p className="text-blue-100 text-sm">Atualize apenas os campos desejados</p>
              </div>
            </div>
          </CardHeader>

          <CardBody padding="lg">
            <form onSubmit={handlePartialSubmit} className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Novo nome (opcional)"
                  value={partialData.nome}
                  onChange={(e) => setPartialData((prev) => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Carteira marrom"
                  helperText="Deixe em branco para manter o nome atual."
                />

                <Input
                  label="Nova categoria (opcional)"
                  value={partialData.categoria}
                  onChange={(e) => setPartialData((prev) => ({ ...prev, categoria: e.target.value }))}
                  placeholder="Ex: Eletrônicos"
                  helperText="Deixe em branco para manter a categoria atual."
                />

                <Input
                  label="Nova data de encontro (opcional)"
                  type="date"
                  value={partialData.data_encontro}
                  onChange={(e) => setPartialData((prev) => ({ ...prev, data_encontro: e.target.value }))}
                  helperText="Deixe em branco para manter a data atual."
                />
                <Select
                  label="Novo status (opcional)"
                  value={partialData.status}
                  onChange={(e) => setPartialData((prev) => ({ ...prev, status: e.target.value }))}
                  options={statusOptions}
                />
              </div>

              <Textarea
                label="Nova descrição (opcional)"
                value={partialData.descricao}
                onChange={(e) => setPartialData((prev) => ({ ...prev, descricao: e.target.value }))}
                placeholder="Atualize apenas o texto desejado"
                rows={5}
                helperText="Deixe em branco para manter a descrição atual."
              />

              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SearchableSelect
                  label="Novo local (opcional)"
                  placeholder="Digite para buscar um local"
                  value={partialData.local_id}
                  options={localOptions}
                  onChange={(nextValue) => setPartialData((prev) => ({ ...prev, local_id: nextValue }))}
                />

                <SearchableSelect
                  label="Novo responsável (opcional)"
                  placeholder="Digite para buscar um responsável"
                  value={partialData.responsavel_id}
                  options={responsavelOptions}
                  onChange={(nextValue) => setPartialData((prev) => ({ ...prev, responsavel_id: nextValue }))}
                />
              </div>

              <div className="pt-8 border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:border-purple-700/50">
                <Button type="submit" variant="primary" icon={<Save size={18} />} loading={savingPartial}>
                  Atualizar parcialmente
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
