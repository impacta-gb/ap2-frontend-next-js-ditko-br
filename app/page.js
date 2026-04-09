'use client';

import Link from 'next/link';
import { Card, CardBody } from '@/src/components';
import {
  Search,
  ClipboardList,
  CheckCircle2,
  MapPin,
  Users,
  Lock,
  ArrowRight,
  Plus,
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: ClipboardList,
      title: 'Registrar Itens',
      description: 'Registre os itens encontrados com descrição detalhada, local e categoria.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Search,
      title: 'Buscar Perdidos',
      description: 'Busque pelos seus itens perdidos por categoria, local ou descrição.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: CheckCircle2,
      title: 'Devolver Itens',
      description: 'Registre a devolução de itens encontrados com informações do reclamante.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: MapPin,
      title: 'Localização',
      description: 'Rastreie onde os itens foram encontrados para facilitar a busca.',
      color: 'from-orange-500 to-amber-600',
    },
    {
      icon: Users,
      title: 'Responsáveis',
      description: 'Sistema de responsáveis que registram e gerenciam os itens.',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: Lock,
      title: 'Segurança',
      description: 'Informações seguras e confiáveis para recuperar seus itens.',
      color: 'from-cyan-500 to-sky-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-8 shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-300 group cursor-pointer hover-lift">
            <Search size={56} className="text-white group-hover:animate-bounce" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-4 animate-slide-down">
            Lost & Found
          </h1>
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 animate-slide-left">
            Sistema de Achados e Perdidos
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-2 animate-slide-right">
            Conectando pessoas que encontraram objetos com seus proprietários legítimos.
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Registre, busque e devolva itens com segurança e facilidade.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in">
          <Link
            href="/items"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 group hover-lift"
          >
            <Search size={20} className="mr-2 group-hover:animate-bounce" />
            Buscar Itens
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/items/new"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 border-2 border-blue-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-blue-400 group hover-lift"
          >
            <Plus size={20} className="mr-2 group-hover:animate-bounce" />
            Registrar Achado
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardBody className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-12 mb-12 hover-glow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-110 transition-all duration-300 group cursor-pointer">
              <div className="text-5xl font-bold text-white mb-2 group-hover:animate-bounce">0</div>
              <p className="text-blue-100 group-hover:text-white transition-colors">Itens Registrados</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300 group cursor-pointer">
              <div className="text-5xl font-bold text-white mb-2 group-hover:animate-bounce">0</div>
              <p className="text-blue-100 group-hover:text-white transition-colors">Devoluções Realizadas</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300 group cursor-pointer">
              <div className="text-5xl font-bold text-white mb-2 group-hover:animate-bounce">0%</div>
              <p className="text-blue-100 group-hover:text-white transition-colors">Taxa de Satisfação</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
