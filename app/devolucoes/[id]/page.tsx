'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Badge, Loading, Alert, Input, Textarea } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { formatDate } from '@/src/lib/utils';
import { ArrowLeft, Pencil, Trash2, Package, User, Calendar, Info, RotateCcw, Save } from 'lucide-react';

export default function DevolucaoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [busy, setBusy] = useState(false);
  const [savingPartial, setSavingPartial] = useState(false);
  const [partialData, setPartialData] = useState({ data_devolucao: '', observacao: '' });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const alertTimerRef = useRef<number | null>(null);
  const { data: devolucao, loading, error, refetch } = useFetch(() => apiClient.getDevolutionById(id), [id]);
  const { data: items } = useFetch(() => apiClient.getItems(1, 1000));
  const { data: reclamantes } = useFetch(() => apiClient.getReclamantes(0, 1000));

  const extractEntity = (payload: any, keys: string[] = ['data', 'item', 'reclamante']): any => {
    if (!payload || typeof payload !== 'object') return payload;

    const obj = payload as Record<string, unknown>;
    for (const key of keys) {
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value;
      }
    }

    return payload;
  };

  const extractItemsArray = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;

    const extract = (obj: Record<string, unknown>): any[] | undefined => {
      if (Array.isArray(obj.items)) return obj.items as any[];
      if (Array.isArray(obj.data)) return obj.data as any[];
      if (Array.isArray(obj.results)) return obj.results as any[];

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

  const itemsArray = useMemo(() => extractItemsArray(items), [items]);
  const reclamantesArray = useMemo(() => extractReclamantesArray(reclamantes), [reclamantes]);
  const itemId = devolucao?.item_id || devolucao?.itemId || devolucao?.id_item;
  const reclamanteId = devolucao?.reclamante_id || devolucao?.reclamanteId || devolucao?.id_reclamante;

  const { data: itemDetalhe } = useFetch(
    () => (itemId ? apiClient.getItemById(String(itemId)) : Promise.resolve(null as any)),
    [itemId]
  );

  const { data: reclamanteDetalhe } = useFetch(
    () => (reclamanteId ? apiClient.getReclamanteById(String(reclamanteId)) : Promise.resolve(null as any)),
    [reclamanteId]
  );

  const itemDetalheNormalizado = useMemo(() => extractEntity(itemDetalhe, ['data', 'item']), [itemDetalhe]);
  const reclamanteDetalheNormalizado = useMemo(
    () => extractEntity(reclamanteDetalhe, ['data', 'reclamante']),
    [reclamanteDetalhe]
  );
  const devolucaoNormalizada = useMemo(() => extractEntity(devolucao, ['data', 'devolucao']), [devolucao]);

  const resolveItem = useMemo(() => {
    if (devolucaoNormalizada?.item && typeof devolucaoNormalizada.item === 'object') return devolucaoNormalizada.item;
    const itemId =
      devolucaoNormalizada?.item_id ||
      devolucaoNormalizada?.itemId ||
      devolucaoNormalizada?.id_item ||
      devolucaoNormalizada?.item?.id;
    return (
      itemDetalheNormalizado ||
      itemsArray.find((item: any) => String(item.id) === String(itemId))
    );
  }, [devolucaoNormalizada, itemsArray, itemDetalheNormalizado]);

  const resolveReclamante = useMemo(() => {
    if (devolucaoNormalizada?.reclamante && typeof devolucaoNormalizada.reclamante === 'object') return devolucaoNormalizada.reclamante;
    const reclamanteId =
      devolucaoNormalizada?.reclamante_id ||
      devolucaoNormalizada?.reclamanteId ||
      devolucaoNormalizada?.id_reclamante ||
      devolucaoNormalizada?.reclamante?.id;
    return (
      reclamanteDetalheNormalizado ||
      reclamantesArray.find((reclamante: any) => String(reclamante.id) === String(reclamanteId))
    );
  }, [devolucaoNormalizada, reclamantesArray, reclamanteDetalheNormalizado]);

  const devolucaoId = devolucaoNormalizada?.id || devolucaoNormalizada?.devolucao_id || devolucaoNormalizada?._id || id;
  const itemNome = useMemo(
    () =>
      resolveItem?.nome ||
      devolucaoNormalizada?.item_nome ||
      devolucaoNormalizada?.nome_item ||
      `Item #${devolucaoNormalizada?.item_id || devolucaoNormalizada?.itemId || id}`,
    [resolveItem, devolucaoNormalizada, id]
  );
  const itemCategoria = resolveItem?.categoria || devolucaoNormalizada?.item_categoria || devolucaoNormalizada?.categoria_item || '';
  const reclamanteNome =
    resolveReclamante?.nome ||
    resolveReclamante?.nome_completo ||
    resolveReclamante?.nome_reclamante ||
    devolucaoNormalizada?.reclamante_nome ||
    devolucaoNormalizada?.nome_reclamante ||
    'Não informado';
  const reclamanteDocumento = resolveReclamante?.documento || resolveReclamante?.cpf || devolucaoNormalizada?.reclamante_documento || '';
  const dataDevolucao =
    devolucaoNormalizada?.data_devolucao ||
    devolucaoNormalizada?.dataDevolucao ||
    devolucaoNormalizada?.data ||
    devolucaoNormalizada?.created_at ||
    '';

  useEffect(() => {
    if (!devolucaoNormalizada) return;

    setPartialData({
      data_devolucao: dataDevolucao?.split?.('T')?.[0] || dataDevolucao || '',
      observacao: devolucaoNormalizada.observacao || devolucaoNormalizada.observacoes || '',
    });
  }, [devolucaoNormalizada, dataDevolucao]);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) {
        window.clearTimeout(alertTimerRef.current);
      }
    };
  }, []);

  const showAlert = (nextAlert: { type: 'success' | 'error'; title: string; message: string }) => {
    setAlert(nextAlert);

    if (alertTimerRef.current) {
      window.clearTimeout(alertTimerRef.current);
    }

    alertTimerRef.current = window.setTimeout(() => {
      setAlert(null);
    }, 3500);
  };

  const handleDelete = async () => {
    if (!devolucaoNormalizada) return;
    const confirmou = window.confirm(`Deseja excluir a devolução do item ${itemNome}?`);
    if (!confirmou) return;

    try {
      setBusy(true);
      await apiClient.deleteDevolucao(id);
      router.push('/devolucoes');
    } catch {
      setAlert({ type: 'error', title: 'Erro ao excluir', message: 'Não foi possível remover a devolução.' });
    } finally {
      setBusy(false);
    }
  };

  const handlePartialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, string> = {};

    if (partialData.data_devolucao.trim()) {
      payload.data_devolucao = partialData.data_devolucao.trim();
    }

    if (partialData.observacao.trim()) {
      payload.observacao = partialData.observacao.trim();
    }

    if (!Object.keys(payload).length) {
      showAlert({
        type: 'error',
        title: 'Sem alterações',
        message: 'Informe ao menos um campo para atualização parcial.',
      });
      return;
    }

    try {
      setSavingPartial(true);
      await apiClient.updateDevolucao(id, payload);
      showAlert({
        type: 'success',
        title: 'Atualização parcial',
        message: 'Dados atualizados com sucesso.',
      });
      refetch();
    } catch {
      showAlert({
        type: 'error',
        title: 'Erro ao atualizar',
        message: 'Não foi possível atualizar parcialmente a devolução.',
      });
    } finally {
      setSavingPartial(false);
    }
  };

  if (loading || !itemsArray || !reclamantesArray) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert type="error" title="Erro" message={error} />
          <Link href="/devolucoes" className="mt-4 inline-block">
            <Button variant="secondary">← Voltar para devoluções</Button>
          </Link>
        </div>
      </div>
    );

  if (!devolucaoNormalizada)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert type="warning" title="Não encontrado" message="Devolução não encontrada" />
          <Link href="/devolucoes" className="mt-4 inline-block">
            <Button variant="secondary">← Voltar para devoluções</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
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

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/devolucoes">
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              Voltar
            </Button>
          </Link>
          <Link href={`/devolucoes/${id}/edit`}>
            <Button variant="secondary" icon={<Pencil size={18} />}>
              Editar
            </Button>
          </Link>
          <Button variant="danger" icon={<Trash2 size={18} />} loading={busy} onClick={handleDelete}>
            Excluir
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl">
                <RotateCcw size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white truncate">
                  Devolução #{devolucaoId}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">Detalhes do registro</p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                  <Package size={16} /> Item
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{itemNome}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{itemCategoria || 'Categoria não informada'}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                  <User size={16} /> Reclamante
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{reclamanteNome}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{reclamanteDocumento || 'Documento não informado'}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                  <Calendar size={16} /> Data da devolução
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(dataDevolucao)}</p>
              </div>
            </div>

            {(devolucaoNormalizada.observacao || devolucaoNormalizada.observacoes) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-1 font-semibold">Observação</p>
                <p className="text-blue-800 dark:text-blue-200">{devolucaoNormalizada.observacao || devolucaoNormalizada.observacoes}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card hover gradient className="shadow-2xl border-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:border-teal-700/50">
          <CardHeader variant="gradient" color="emerald">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Save size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Atualização Parcial</h2>
                <p className="text-emerald-100 text-sm">Atualize apenas os campos desejados</p>
              </div>
            </div>
          </CardHeader>

          <CardBody padding="lg">
            <form onSubmit={handlePartialSubmit} className="space-y-7">
              <Input
                label="Nova data da devolução (opcional)"
                type="date"
                value={partialData.data_devolucao}
                onChange={(e) => setPartialData((prev) => ({ ...prev, data_devolucao: e.target.value }))}
                icon={<Calendar size={20} />}
                helperText="Deixe em branco para manter a data atual."
              />

              <Textarea
                label="Nova observação (opcional)"
                value={partialData.observacao}
                onChange={(e) => setPartialData((prev) => ({ ...prev, observacao: e.target.value }))}
                placeholder="Atualize apenas o texto desejado"
                rows={5}
                helperText="Deixe em branco para manter a observação atual."
              />

              <div className="pt-8 border-t-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:border-teal-700/50">
                <Button type="submit" variant="success" icon={<Save size={18} />} loading={savingPartial}>
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