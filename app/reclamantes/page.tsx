'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Loading, Alert } from '@/src/components';
import { useFetch } from '@/src/hooks/useApi';
import { apiClient } from '@/src/lib/api-client';
import { Reclamante } from '@/src/types';
import { Plus, User, Phone, ArrowRight, RotateCcw, Edit, X } from 'lucide-react';

interface ReclamanteListState {
  items: Reclamante[];
  total: number;
  pages: number;
}

const RECLAMANTES_PER_PAGE = 10;

const extractReclamanteArray = (obj: Record<string, unknown>): Reclamante[] | undefined => {
  if (Array.isArray(obj.reclamantes)) return obj.reclamantes as Reclamante[];
  if (Array.isArray(obj.items)) return obj.items as Reclamante[];
  if (Array.isArray(obj.results)) return obj.results as Reclamante[];
  if (Array.isArray(obj.data)) return obj.data as Reclamante[];

  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    return extractReclamanteArray(obj.data as Record<string, unknown>);
  }

  return undefined;
};

const normalizeReclamanteArray = (payload: unknown): Reclamante[] => {
  if (Array.isArray(payload)) return payload as Reclamante[];

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    const extracted = extractReclamanteArray(obj);
    if (Array.isArray(extracted)) return extracted;
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

  return Math.max(1, Math.ceil(total / RECLAMANTES_PER_PAGE));
};

export default function ReclamantesPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch<ReclamanteListState>(
    async () => {
      const response = await apiClient.getReclamantes(page, RECLAMANTES_PER_PAGE);
      const items = normalizeReclamanteArray(response);
      const total = normalizeTotal(response, items.length);
      const pages = normalizePages(response, total);

      return {
        items,
        total,
        pages,
      };
    },
    [page]
  );

  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [actionAlert, setActionAlert] = useState<null | { type: 'success' | 'error'; title: string; message: string }>(null);
  const alertTimer = useRef<number | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Confirma a exclusão deste reclamante?')) return;
    setDeletingIds((prev) => [...prev, id]);
    try {
      await apiClient.deleteReclamante(id);
      setActionAlert({ type: 'success', title: 'Excluído', message: 'Reclamante excluído.' });
      refetch();
    } catch (err) {
      setActionAlert({ type: 'error', title: 'Erro', message: String((err as any)?.message || 'Falha ao excluir') });
    } finally {
      setDeletingIds((prev) => prev.filter((x) => x !== id));
      if (alertTimer.current) window.clearTimeout(alertTimer.current as any);
      alertTimer.current = window.setTimeout(() => setActionAlert(null), 3500) as unknown as number;
    }
  };

  const reclamantes = Array.isArray(data?.items) ? data.items : [];
  const totalReclamantes = data?.total || 0;
  const totalPages = data?.pages || 1;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {error && (
          <div className="mb-6">
            <Alert type="error" title="Erro" message={error} closeable={false} animated />
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                <User size={28} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Reclamantes
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 ml-16">
              Total: <span className="font-bold text-pink-600 dark:text-pink-400">{totalReclamantes}</span> reclamantes
            </p>
          </div>
          <Link href="/reclamantes/new" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Plus size={20} />
              Registrar Reclamante
            </Button>
          </Link>
        </div>

        {reclamantes.length > 0 ? (
          <div className="space-y-4 mb-8">
            {reclamantes.map((reclamante) => (
              <Card key={reclamante.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{reclamante.nome}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Documento: {reclamante.documento}</p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Phone size={16} /> {reclamante.telefone}
                    </div>
                  </div>
                </CardHeader>
                <div className="flex justify-end px-6 pb-5 gap-2">
                  <Link href={`/reclamantes/${reclamante.id}`}>
                    <Button variant="secondary" size="sm">Ver detalhes</Button>
                  </Link>
                  <Link href={`/reclamantes/${reclamante.id}/edit`}>
                    <Button variant="outline" size="sm" icon={<Edit size={14} />}>Editar</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(reclamante.id)}
                    disabled={deletingIds.includes(reclamante.id)}
                  >
                    {deletingIds.includes(reclamante.id) ? 'Excluindo...' : (
                      <>
                        <X size={12} /> Excluir
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50/40 via-white/70 to-purple-50/40 dark:from-pink-950/20 dark:via-purple-950/30 dark:to-pink-950/20 backdrop-blur-sm p-16 md:p-20 animate-scale-in hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-300">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-400 opacity-10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-pink-400 to-purple-400 opacity-10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl blur-xl opacity-20 animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300">
                  <RotateCcw size={56} className="text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-purple-400 mb-3">
                Nenhum reclamante registrado
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
                Quando alguém fizer uma devolução, o reclamante será registrado aqui.
              </p>
              <Link href="/reclamantes/new">
                <Button variant="primary" size="lg" className="group">
                  <Plus size={22} />
                  Registrar Reclamante
                </Button>
              </Link>
            </div>
          </div>
        )}

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
