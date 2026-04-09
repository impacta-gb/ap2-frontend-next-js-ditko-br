'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Loading } from '@/src/components';
import { useMockData } from '@/src/hooks/useMockData';
import { mockDevolucoes } from '@/src/lib/mockData';
import { RotateCcw, Package, User, Calendar, ArrowRight, Plus } from 'lucide-react';

export default function DevolucoesPage() {
  const [page, setPage] = useState(1);
  const { data: devolucoes, loading } = useMockData(mockDevolucoes);

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
              Total: <span className="font-bold text-green-600 dark:text-green-400">{devolucoes?.total || 0}</span> devoluções
            </p>
          </div>
          <Link href="/devolucoes/new">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <RotateCcw size={20} />
              Registrar Devolução
            </Button>
          </Link>
        </div>

        {/* Devolucoes List */}
        {devolucoes?.data && devolucoes.data.length > 0 ? (
          <div className="space-y-4 mb-8">
            {devolucoes.data.map((dev: any) => (
              <Card key={dev.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Item */}
                    <div className="flex gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                        <Package size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                          Item
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {dev.item?.nome || 'Item não encontrado'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {dev.item?.categoria}
                        </p>
                      </div>
                    </div>

                    {/* Reclamante */}
                    <div className="flex gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                        <User size={20} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                          Reclamante
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {dev.reclamante?.nome}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {dev.reclamante?.documento}
                        </p>
                      </div>
                    </div>

                    {/* Data */}
                    <div className="flex gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                        <Calendar size={20} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                          Data de Devolução
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {dev.data_devolucao}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-end">
                      <Link href={`/items/${dev.item_id}`} className="w-full group">
                        <Button variant="outline" size="sm" fullWidth className="group-hover:border-blue-600 group-hover:text-blue-600">
                          Ver Item
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Observation */}
                  {dev.observacao && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        📝 Observações
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">{dev.observacao}</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Nenhuma devolução registrada
              </p>
            </CardBody>
          </Card>
        )}

        {/* Pagination */}
        {devolucoes && devolucoes.pages > 1 && (
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
                Página {page} de {devolucoes.pages}
              </span>
            </div>
            <Button
              variant="secondary"
              disabled={page === devolucoes.pages}
              onClick={() => setPage(Math.min(devolucoes.pages, page + 1))}
            >
              Próxima →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
