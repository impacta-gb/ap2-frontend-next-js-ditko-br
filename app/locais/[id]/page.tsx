'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Loading, Alert, Input, Textarea } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { Pencil, Trash2, RotateCcw, MapPin, Calendar, Info, Save, ArrowLeft } from 'lucide-react';

export default function LocalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [actionLoading, setActionLoading] = useState(false);
  const [savingPartial, setSavingPartial] = useState(false);
  const [partialData, setPartialData] = useState({ tipo: '', bairro: '', descricao: '' });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  const alertTimerRef = useRef<number | null>(null);
  const { data: local, loading, error } = useFetch(() => apiClient.getLocalById(id), [id]);
  const resolveLocalData = (payload: unknown) => {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;

    const obj = payload as Record<string, unknown>;
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) return obj.data as Record<string, unknown>;
    if (obj.local && typeof obj.local === 'object' && !Array.isArray(obj.local)) return obj.local as Record<string, unknown>;
    return obj as Record<string, unknown>;
  };

  const resolveDateValue = (...values: Array<string | null | undefined>) => {
    for (const value of values) {
      if (typeof value === 'string' && value.trim() !== '') return value;
    }
    return '';
  };

  const localData = resolveLocalData(local);

  useEffect(() => {
    if (!localData) return;

    setPartialData({
      tipo: String(localData.tipo || localData.nome || ''),
      bairro: String(localData.bairro || ''),
      descricao: String(localData.descricao || localData.observacao || ''),
    });
  }, [localData]);

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
    const confirmed = window.confirm('Deseja realmente excluir este local?');
    if (!confirmed) return;

    try {
      setActionLoading(true);
      await apiClient.deleteLocal(id);
      router.push('/locais');
    } catch (err) {
      setDeleteError('Não foi possível excluir o local.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePartialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, string> = {};

    if (partialData.tipo.trim()) payload.tipo = partialData.tipo.trim();
    if (partialData.bairro.trim()) payload.bairro = partialData.bairro.trim();
    if (partialData.descricao.trim()) payload.descricao = partialData.descricao.trim();

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
      await apiClient.patchLocal(id, payload);
      showAlert({
        type: 'success',
        title: 'Atualização parcial',
        message: 'Dados atualizados com sucesso.',
      });
    } catch {
      showAlert({
        type: 'error',
        title: 'Erro ao atualizar',
        message: 'Não foi possível atualizar parcialmente o local.',
      });
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
          <Link href="/locais" className="mt-4 block">
            <Button variant="secondary">← Voltar para locais</Button>
          </Link>
        </div>
      </div>
    );

  if (!local)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert type="warning" title="Não encontrado" message="Item não encontrado" />
          <Link href="/locais" className="mt-4 block">
            <Button variant="secondary">← Voltar para locais</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
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
          <Link href="/locais">
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              Voltar
            </Button>
          </Link>
          <Link href={`/locais/${id}/edit`}>
            <Button variant="secondary" icon={<Pencil size={18} />}>
              Editar
            </Button>
          </Link>
          <Button variant="danger" icon={<Trash2 size={18} />} loading={actionLoading} onClick={handleDelete}>
            Excluir
          </Button>
        </div>

        {deleteError && (
          <Alert type="error" title="Erro ao excluir" message={deleteError} />
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl">
                <RotateCcw size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white truncate">
                  {String(localData?.tipo || localData?.nome || 'Local sem nome')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {String(localData?.bairro || localData?.descricao || 'Bairro não informado')}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                  <MapPin size={16} /> Tipo
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {String(localData?.tipo || localData?.nome || 'Tipo não informado')}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                  <Info size={16} /> Bairro / referência
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {String(localData?.bairro || localData?.descricao || 'Bairro não informado')}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl md:col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                  <Calendar size={16} /> Descrição
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  {String(localData?.descricao || localData?.observacao || 'Descrição não informada')}
                </p>
              </div>
            </div>

            {/* Registro removido por solicitação do usuário */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Novo tipo do local (opcional)"
                  value={partialData.tipo}
                  onChange={(e) => setPartialData((prev) => ({ ...prev, tipo: e.target.value }))}
                  placeholder="Ex: Centro da cidade"
                  helperText="Deixe em branco para manter o tipo atual."
                />

                <Input
                  label="Novo bairro / referência (opcional)"
                  value={partialData.bairro}
                  onChange={(e) => setPartialData((prev) => ({ ...prev, bairro: e.target.value }))}
                  placeholder="Ex: Jardim Paulista"
                  helperText="Deixe em branco para manter o bairro atual."
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
