'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Button, Card, CardBody, CardHeader, Input, Loading } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { formatDateTime, formatPhone } from '@/src/lib/utils';
import { ArrowLeft, Pencil, Power, Save, Trash2, User } from 'lucide-react';

export default function ResponsavelDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id || '');
  const [patchData, setPatchData] = useState({ cargo: '', telefone: '' });
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  const { data: responsavel, loading, error, refetch } = useFetch(() => apiClient.getResponsavelById(id), [id]);

  const hasCreatedAt = Boolean(responsavel?.criado_em);
  const hasUpdatedAt = Boolean(responsavel?.atualizado_em);

  const dadosPatch = useMemo(() => {
    const payload: { cargo?: string; telefone?: string } = {};

    if (patchData.cargo.trim()) payload.cargo = patchData.cargo.trim();
    if (patchData.telefone.trim()) payload.telefone = patchData.telefone.trim();

    return payload;
  }, [patchData]);

  const handlePatch = async () => {
    if (!Object.keys(dadosPatch).length) {
      setAlert({
        type: 'error',
        title: 'Sem alterações',
        message: 'Informe ao menos um campo para atualização parcial.',
      });
      return;
    }

    try {
      setBusy(true);
      await apiClient.patchResponsavel(id, dadosPatch);
      setPatchData({ cargo: '', telefone: '' });
      setAlert({ type: 'success', title: 'Atualização parcial', message: 'Dados atualizados com PATCH.' });
      refetch();
    } catch {
      setAlert({ type: 'error', title: 'Erro no PATCH', message: 'Não foi possível atualizar parcialmente.' });
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!responsavel) return;

    try {
      setBusy(true);
      await apiClient.updateResponsavelStatus(id, !responsavel.ativo);
      setAlert({
        type: 'success',
        title: 'Status atualizado',
        message: `Responsável ${responsavel.ativo ? 'inativado' : 'ativado'} com sucesso.`,
      });
      refetch();
    } catch {
      setAlert({ type: 'error', title: 'Erro no status', message: 'Não foi possível alterar o status.' });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!responsavel) return;
    const confirmou = window.confirm(`Deseja excluir ${responsavel.nome}?`);
    if (!confirmou) return;

    try {
      setBusy(true);
      await apiClient.deleteResponsavel(id);
      router.push('/responsaveis');
    } catch {
      setAlert({ type: 'error', title: 'Erro ao excluir', message: 'Não foi possível remover o responsável.' });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;

  if (error || !responsavel) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert
          type="error"
          title="Falha ao carregar"
          message={error || 'Responsável não encontrado.'}
          closeable={false}
          animated
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
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
          <Link href="/responsaveis">
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              Voltar
            </Button>
          </Link>
          <Link href={`/responsaveis/${id}/edit`}>
            <Button variant="secondary" icon={<Pencil size={18} />}>
              Editar
            </Button>
          </Link>
          <Button
            variant={responsavel.ativo ? 'secondary' : 'success'}
            icon={<Power size={18} />}
            loading={busy}
            onClick={handleToggleStatus}
          >
            {responsavel.ativo ? 'Inativar' : 'Ativar'}
          </Button>
          <Button variant="danger" icon={<Trash2 size={18} />} loading={busy} onClick={handleDelete}>
            Excluir
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User size={24} className="text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{responsavel.nome}</h1>
                <p className="text-gray-600 dark:text-gray-300">Detalhes do responsável</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-2">
            <p className="text-gray-700 dark:text-gray-200"><strong>Cargo:</strong> {responsavel.cargo || 'Não informado'}</p>
            <p className="text-gray-700 dark:text-gray-200"><strong>Telefone:</strong> {formatPhone(responsavel.telefone)}</p>
            <p className="text-gray-700 dark:text-gray-200"><strong>Status:</strong> {responsavel.ativo ? 'Ativo' : 'Inativo'}</p>
            {hasCreatedAt && (
              <p className="text-gray-500 dark:text-gray-400 text-sm"><strong>Criado em:</strong> {formatDateTime(responsavel.criado_em)}</p>
            )}
            {hasUpdatedAt && (
              <p className="text-gray-500 dark:text-gray-400 text-sm"><strong>Atualizado em:</strong> {formatDateTime(responsavel.atualizado_em)}</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Atualização Parcial</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Novo cargo (opcional)"
              value={patchData.cargo}
              onChange={(e) => setPatchData((prev) => ({ ...prev, cargo: e.target.value }))}
              placeholder="Ex: Supervisor"
            />
            <Input
              label="Novo telefone (opcional)"
              value={patchData.telefone}
              onChange={(e) => setPatchData((prev) => ({ ...prev, telefone: e.target.value }))}
              placeholder="Ex: (11) 98888-7777"
            />
            <Button variant="primary" icon={<Save size={18} />} onClick={handlePatch} loading={busy}>
              Atualizar parcialmente
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
