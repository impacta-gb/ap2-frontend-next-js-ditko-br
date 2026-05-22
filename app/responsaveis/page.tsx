'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Badge, Loading, Alert } from '@/src/components';
import { apiClient } from '@/src/lib/api-client';
import { useFetch } from '@/src/hooks/useApi';
import { formatPhone } from '@/src/lib/utils';
import { Responsavel } from '@/src/types';
import { Plus, Users, Briefcase, Phone, Search, UserCheck, UserX, Eye, Pencil, Trash2 } from 'lucide-react';

type FiltroAtivo = 'todos' | 'ativos' | 'inativos';

interface ResponsavelListState {
  items: Responsavel[];
  total: number;
  pages: number;
}

const RESPONSAVEIS_PER_PAGE = 10;

const normalizeResponsavelArray = (payload: unknown): Responsavel[] => {
  if (Array.isArray(payload)) return payload as Responsavel[];

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;

    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      const dataObj = obj.data as Record<string, unknown>;
      if (Array.isArray(dataObj.responsaveis)) return dataObj.responsaveis as Responsavel[];
    }

    if (Array.isArray(obj.data)) return obj.data as Responsavel[];
    if (Array.isArray(obj.items)) return obj.items as Responsavel[];
    if (Array.isArray(obj.results)) return obj.results as Responsavel[];
  }

  return [];
};

const normalizeTotal = (payload: unknown, fallback: number): number => {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (typeof obj.total === 'number') return obj.total;
    if (typeof obj.count === 'number') return obj.count;

    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      const dataObj = obj.data as Record<string, unknown>;
      if (typeof dataObj.total === 'number') return dataObj.total;
      if (typeof dataObj.count === 'number') return dataObj.count;
    }
  }

  return fallback;
};

const normalizePages = (payload: unknown, total: number): number => {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (typeof obj.pages === 'number') return obj.pages;

    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      const dataObj = obj.data as Record<string, unknown>;
      if (typeof dataObj.pages === 'number') return dataObj.pages;
    }
  }

  return Math.max(1, Math.ceil(total / RESPONSAVEIS_PER_PAGE));
};

export default function ResponsaveisPage() {
  const [page, setPage] = useState(1);
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroAtivo>('todos');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  useEffect(() => {
    setPage(1);
  }, [filtroAtivo]);

  const { data, loading, error, refetch } = useFetch<ResponsavelListState>(
    async () => {
      if (filtroAtivo === 'todos') {
        const response = await apiClient.getResponsaveis(page, RESPONSAVEIS_PER_PAGE);
        const items = normalizeResponsavelArray(response);
        const total = normalizeTotal(response, items.length);
        const pages = normalizePages(response, total);

        return {
          items,
          total,
          pages,
        };
      }

      const ativo = filtroAtivo === 'ativos';
      const filteredRaw = await apiClient.getResponsaveisByAtivo(ativo);
      const filtered = normalizeResponsavelArray(filteredRaw);
      const total = filtered.length;
      const pages = Math.max(1, Math.ceil(total / RESPONSAVEIS_PER_PAGE));
      const start = (page - 1) * RESPONSAVEIS_PER_PAGE;
      const end = start + RESPONSAVEIS_PER_PAGE;

      return {
        items: filtered.slice(start, end),
        total,
        pages,
      };
    },
    [page, filtroAtivo]
  );

  const totalResponsaveis = data?.total || 0;
  const totalPages = data?.pages || 1;
  const responsaveis = Array.isArray(data?.items) ? data.items : [];

  const statusResumo = useMemo(() => {
    const ativos = responsaveis.filter((r) => r.ativo).length;
    const inativos = responsaveis.length - ativos;
    return { ativos, inativos };
  }, [responsaveis]);

  const handleToggleStatus = async (resp: Responsavel) => {
    try {
      setActionLoadingId(resp.id);
      await apiClient.updateResponsavelStatus(resp.id, !resp.ativo);
      setAlert({
        type: 'success',
        title: 'Status atualizado',
        message: `Responsável ${resp.ativo ? 'inativado' : 'ativado'} com sucesso.`,
      });
      refetch();
    } catch {
      setAlert({
        type: 'error',
        title: 'Erro ao atualizar status',
        message: 'Não foi possível alterar o status do responsável.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (resp: Responsavel) => {
    const confirmou = window.confirm(`Deseja realmente excluir o responsável ${resp.nome}?`);
    if (!confirmou) return;

    try {
      setActionLoadingId(resp.id);
      await apiClient.deleteResponsavel(resp.id);
      setAlert({
        type: 'success',
        title: 'Responsável excluído',
        message: 'O registro foi removido com sucesso.',
      });
      refetch();
    } catch {
      setAlert({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o responsável.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={() => setAlert(null)}
              closeable
              animated
            />
          </div>
        )}

        {error && (
          <div className="mb-6">
            <Alert type="error" title="Falha na API" message={error} closeable={false} animated />
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Users size={28} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                Responsáveis
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 ml-16">
              Total: <span className="font-bold text-blue-600 dark:text-blue-400">{totalResponsaveis}</span> responsáveis
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-16 mt-1">
              Ativos: {statusResumo.ativos} | Inativos: {statusResumo.inativos}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <select
              value={filtroAtivo}
              onChange={(e) => setFiltroAtivo(e.target.value as FiltroAtivo)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 font-medium"
            >
              <option value="todos">Todos</option>
              <option value="ativos">Somente ativos</option>
              <option value="inativos">Somente inativos</option>
            </select>

            <Link href="/responsaveis/new" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <Plus size={20} />
                Registrar Responsável
              </Button>
            </Link>
          </div>
        </div>

        {responsaveis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {responsaveis.map((resp: Responsavel, index: number) => (
              <Card
                key={resp.id}
                className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden animate-scale-in border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/30">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {resp.nome}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Briefcase size={14} />
                        {resp.cargo}
                      </p>
                    </div>
                    <Badge
                      label={resp.ativo ? 'Ativo' : 'Inativo'}
                      variant={resp.ativo ? 'success' : 'warning'}
                      icon={resp.ativo ? <UserCheck size={14} /> : <UserX size={14} />}
                    />
                  </div>
                </CardHeader>

                <CardBody>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 border-t pt-4">
                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      <Phone size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="font-medium">{formatPhone(resp.telefone || 'Telefone não informado')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href={`/responsaveis/${resp.id}`}>
                      <Button variant="outline" size="sm" fullWidth icon={<Eye size={16} />}>
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/responsaveis/${resp.id}/edit`}>
                      <Button variant="secondary" size="sm" fullWidth icon={<Pencil size={16} />}>
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant={resp.ativo ? 'secondary' : 'success'}
                      size="sm"
                      fullWidth
                      loading={actionLoadingId === resp.id}
                      onClick={() => handleToggleStatus(resp)}
                      icon={resp.ativo ? <UserX size={16} /> : <UserCheck size={16} />}
                    >
                      {resp.ativo ? 'Inativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      loading={actionLoadingId === resp.id}
                      onClick={() => handleDelete(resp)}
                      icon={<Trash2 size={16} />}
                    >
                      Excluir
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/40 via-slate-50/30 to-purple-50/40 dark:from-blue-950/20 dark:via-slate-950/30 dark:to-purple-950/20 backdrop-blur-sm p-16 md:p-20 animate-scale-in hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-300 to-purple-300 opacity-10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-300 to-pink-300 opacity-10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-300 rounded-2xl blur-xl opacity-20" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300">
                  <Search size={56} className="text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-3">
                Nenhum responsável cadastrado
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
                Cadastre os responsáveis para iniciar os registros e o gerenciamento dos itens.
              </p>

              <Link href="/responsaveis/new">
                <Button variant="primary" size="lg" className="group">
                  <Plus size={22} />
                  Registrar Primeiro Responsável
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Anterior
            </Button>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">
              Página {page} de {totalPages}
            </span>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Próxima
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
