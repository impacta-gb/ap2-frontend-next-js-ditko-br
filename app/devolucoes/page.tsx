'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Loading, Alert } from '@/src/components';
import { apiClient } from '@/src/lib/api-client';
import { RotateCcw, Package, User, Calendar, Plus, Eye, Pencil, Trash2, Search } from 'lucide-react';

const DEVOLUCOES_POR_PAGINA = 10;

export default function DevolucoesPage() {
  const [page, setPage] = useState(1);
  const [filtroData, setFiltroData] = useState('');
  const [devolucoes, setDevolucoes] = useState<any | null>(null);
  const [itemsCatalog, setItemsCatalog] = useState<any[]>([]);
  const [reclamantesCatalog, setReclamantesCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  useEffect(() => {
    setPage(1);
  }, [filtroData]);

  const extractDevolucoesArray = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;

    const extract = (obj: Record<string, unknown>): any[] | undefined => {
      if (Array.isArray(obj.devolucoes)) return obj.devolucoes as any[];
      if (Array.isArray(obj.data)) return obj.data as any[];
      if (Array.isArray(obj.items)) return obj.items as any[];
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

  const resolveItem = (dev: any) => {
    if (dev?.item) return dev.item;
    return itemsCatalog.find((item: any) => String(item.id) === String(dev?.item_id));
  };

  const resolveItemName = (dev: any) => resolveItem(dev)?.nome || `Item #${dev?.item_id}`;
  const resolveItemCategory = (dev: any) => resolveItem(dev)?.categoria || '';
  const resolveReclamante = (dev: any) => {
    if (dev?.reclamante) return dev.reclamante;
    const reclamanteId = dev?.reclamante_id || dev?.reclamanteId || dev?.id_reclamante || dev?.reclamante?.id;
    return reclamantesCatalog.find((reclamante: any) => String(reclamante.id) === String(reclamanteId));
  };
  const resolveReclamanteName = (dev: any) => {
    const reclamante = resolveReclamante(dev);
    return (
      reclamante?.nome ||
      reclamante?.nome_completo ||
      reclamante?.nome_reclamante ||
      dev?.reclamante?.nome ||
      dev?.reclamante?.nome_completo ||
      dev?.reclamante?.nome_reclamante ||
      dev?.reclamante_nome ||
      dev?.nome_reclamante ||
      ''
    );
  };
  const resolveReclamanteDoc = (dev: any) => resolveReclamante(dev)?.documento || dev?.reclamante_documento || '';
  const formatDate = (value: string) => {
    if (!value) return 'Data não informada';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR').format(parsed);
  };
  const normalizeDateKey = (value: string) => {
    if (!value) return '';
    return String(value).split('T')[0];
  };

  const filtroDataFormatada = filtroData ? formatDate(filtroData) : '';

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const devolucoesPage = filtroData ? 1 : page;
        const devolucoesLimit = filtroData ? 1000 : DEVOLUCOES_POR_PAGINA;
        const [devolucoesRes, itemsRes, reclamantesRes] = await Promise.allSettled([
          apiClient.getDevolucoes(devolucoesPage, devolucoesLimit),
          apiClient.getItems(1, 1000),
          apiClient.getReclamantes(0, 1000),
        ]);

        if (mounted) {
          if (devolucoesRes.status === 'fulfilled') {
            setDevolucoes(devolucoesRes.value);
          }

          if (itemsRes.status === 'fulfilled') {
            const normalizeItems = (payload: any): any[] => {
              if (Array.isArray(payload)) return payload;

              const extract = (obj: Record<string, unknown>): any[] | undefined => {
                if (Array.isArray(obj.data)) return obj.data as any[];
                if (Array.isArray(obj.items)) return obj.items as any[];
                if (Array.isArray(obj.results)) return obj.results as any[];

                if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
                  return extract(obj.data as Record<string, unknown>);
                }

                return undefined;
              };

              if (payload && typeof payload === 'object') {
                return extract(payload as Record<string, unknown>) || [];
              }

              return [];
            };

            setItemsCatalog(normalizeItems(itemsRes.value));
          }

          if (reclamantesRes.status === 'fulfilled') {
            const normalizeReclamantes = (payload: any): any[] => {
              if (Array.isArray(payload)) return payload;

              const extract = (obj: Record<string, unknown>): any[] | undefined => {
                if (Array.isArray(obj.reclamantes)) return obj.reclamantes as any[];
                if (Array.isArray(obj.data)) return obj.data as any[];
                if (Array.isArray(obj.items)) return obj.items as any[];
                if (Array.isArray(obj.results)) return obj.results as any[];

                if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
                  return extract(obj.data as Record<string, unknown>);
                }

                return undefined;
              };

              if (payload && typeof payload === 'object') {
                return extract(payload as Record<string, unknown>) || [];
              }

              return [];
            };

            setReclamantesCatalog(normalizeReclamantes(reclamantesRes.value));
          }
        }
      } catch (err) {
        console.error('Erro ao carregar devoluções', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [page, filtroData]);

  const handleDelete = async (dev: any) => {
    const confirmed = window.confirm(`Deseja realmente excluir a devolução do item ${resolveItemName(dev)}?`);
    if (!confirmed) return;

    try {
      setActionLoadingId(String(dev.id));
      await apiClient.deleteDevolucao(String(dev.id));
      setAlert({
        type: 'success',
        title: 'Devolução excluída',
        message: 'O registro foi removido com sucesso.',
      });
      const res = await apiClient.getDevolucoes(page, 10);
      setDevolucoes(res);
    } catch {
      setAlert({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir a devolução.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const devolucoesArray = extractDevolucoesArray(devolucoes);
  const devolucoesFiltradas = useMemo(() => {
    if (!filtroData) return devolucoesArray;
    return devolucoesArray.filter((dev) => normalizeDateKey(dev.data_devolucao) === filtroData);
  }, [devolucoesArray, filtroData]);

  const devolucoesVisiveis = filtroData
    ? devolucoesFiltradas.slice((page - 1) * DEVOLUCOES_POR_PAGINA, page * DEVOLUCOES_POR_PAGINA)
    : devolucoesArray;

  const totalDevolucoes = filtroData ? devolucoesFiltradas.length : devolucoes?.total ?? devolucoesArray.length;
  const totalPages = filtroData
    ? Math.max(1, Math.ceil(devolucoesFiltradas.length / DEVOLUCOES_POR_PAGINA))
    : devolucoes?.pages ?? 0;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-blue-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                <RotateCcw size={28} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                Devoluções
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 ml-16">
              Total: <span className="font-bold text-green-600 dark:text-green-400">{totalDevolucoes}</span> devoluções
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              aria-label="Filtrar devoluções por data"
              className="px-4 py-3 border-2 border-gray-300 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 font-medium w-full sm:w-auto"
            />

            {filtroData && (
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => setFiltroData('')}>
                Limpar
              </Button>
            )}

            <Link href="/devolucoes/new" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <RotateCcw size={20} />
                Registrar Devolução
              </Button>
            </Link>
          </div>
        </div>

        {/* Devolucoes List */}
        {devolucoesVisiveis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {devolucoesVisiveis.map((dev: any, index: number) => (
              <Card
                key={dev.id}
                className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden animate-scale-in border-2 border-transparent hover:border-emerald-300 dark:hover:border-emerald-700"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {resolveItemName(dev)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Package size={14} />
                        {resolveItemCategory(dev) || 'Categoria não informada'}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardBody>
                  <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 dark:text-gray-400 border-t pt-4">
                    <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex-shrink-0">
                        <User size={18} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{resolveReclamanteName(dev)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{resolveReclamanteDoc(dev) || 'Documento não informado'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                        <Calendar size={18} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{formatDate(dev.data_devolucao)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Data de devolução</p>
                      </div>
                    </div>
                  </div>

                  {dev.observacao && (
                    <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">Observações</p>
                      <p className="text-gray-700 dark:text-gray-300">{dev.observacao}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href={`/devolucoes/${dev.id}`}>
                      <Button variant="outline" size="sm" fullWidth icon={<Eye size={16} />}>
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/devolucoes/${dev.id}/edit`}>
                      <Button variant="secondary" size="sm" fullWidth icon={<Pencil size={16} />}>
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      loading={actionLoadingId === String(dev.id)}
                      onClick={() => handleDelete(dev)}
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
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/40 via-slate-50/30 to-green-50/40 dark:from-emerald-950/20 dark:via-slate-950/30 dark:to-green-950/20 backdrop-blur-sm p-16 md:p-20 animate-scale-in hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400 to-green-400 opacity-10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-emerald-400 to-teal-400 opacity-10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-400 rounded-2xl blur-xl opacity-20 animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300">
                  <Search size={56} className="text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-green-400 mb-3">
                {filtroData ? `Nenhuma devolução em ${filtroDataFormatada}` : 'Nenhuma devolução registrada'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
                {filtroData
                  ? 'Nenhum registro encontrado para a data selecionada. Ajuste o filtro ou limpe para ver todas as devoluções.'
                  : 'Nenhuma devolução foi registrada até agora. Quando houver um registro, ele aparecerá aqui.'}
              </p>

              <Link href="/devolucoes/new">
                <Button variant="primary" size="lg" className="group">
                  <RotateCcw size={22} />
                  Registrar Devolução
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              ← Anterior
            </Button>
            <div className="flex items-center px-4 py-2">
              <span className="text-gray-600 dark:text-gray-400">
                Página {page} de {totalPages}
              </span>
            </div>
            <Button
              variant="secondary"
              disabled={page === totalPages}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
            >
              Próxima →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
