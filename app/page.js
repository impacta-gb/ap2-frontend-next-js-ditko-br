'use client';

import Link from 'next/link';
import { Card, CardBody, Stats } from '@/src/components';
import {
  Search,
  ClipboardList,
  CheckCircle2,
  MapPin,
  Users,
  Lock,
  ArrowRight,
  Plus,
  TrendingUp,
  Shield,
  Zap,
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

  const stats = [
    {
      value: '0',
      label: 'Itens Registrados',
      icon: <ClipboardList size={24} />,
      color: 'blue',
    },
    {
      value: '0',
      label: 'Devoluções Realizadas',
      icon: <CheckCircle2 size={24} />,
      color: 'emerald',
    },
    {
      value: '0%',
      label: 'Taxa de Satisfação',
      icon: <TrendingUp size={24} />,
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"
          style={{ animationDelay: '4s' }}
        />
        
        {/* Additional accent blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-slide-up">
          {/* Floating icon */}
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-8 shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-300 group cursor-pointer hover:shadow-3xl floating">
            <Search size={64} className="text-white group-hover:animate-bounce" />
          </div>

          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-6 animate-slide-down drop-shadow-2xl">
            Lost & Found
          </h1>

          <p className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 animate-slide-left">
            Sistema de Achados e Perdidos
          </p>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-3 animate-slide-right">
            Conectando pessoas que encontraram objetos com seus proprietários legítimos.
          </p>

          <p className="text-lg text-gray-500 dark:text-gray-500 mb-10">
            Registre, busque e devolva itens com segurança, facilidade e transparência.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link
              href="/items"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <Search size={22} className="mr-2 group-hover:animate-bounce" />
              Buscar Itens
              <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/items/new"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 border-3 border-blue-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-blue-400"
            >
              <Plus size={22} className="mr-2 group-hover:animate-bounce" />
              Registrar Achado
              <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4 animate-slide-up">
            Recursos Principais
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up">
            Uma plataforma completa para gerenciar itens perdidos e encontrados de forma eficiente
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  hover
                  gradient
                  className="group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardBody className="p-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors leading-relaxed">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-2xl" />
          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Estatísticas do Sistema</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Acompanhe o desempenho e o impacto do nosso sistema de achados e perdidos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const colorValue = stat.color;
                return (
                  <Stats
                    key={index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    color={colorValue}
                    animated
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Por que escolher nosso sistema?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Descobra os diferenciais que fazem do Lost & Found a melhor solução para achados e perdidos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={32} className="text-white" />,
                title: 'Segurança Garantida',
                description:
                  'Seus dados são protegidos com as melhores práticas de segurança digital.',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
              },
              {
                icon: <Zap size={32} className="text-white" />,
                title: 'Rápido e Eficiente',
                description:
                  'Interface intuitiva que permite registrar e buscar itens em segundos.',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-50 dark:bg-purple-900/20',
              },
              {
                icon: <TrendingUp size={32} className="text-white" />,
                title: 'Alta Taxa de Sucesso',
                description:
                  'Muitas pessoas já recuperaram seus itens através do nosso sistema.',
                color: 'from-emerald-500 to-emerald-600',
                bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 group animate-scale-in ${benefit.bgColor}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Decorative gradient overlay */}
                <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${benefit.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className={`absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br ${benefit.color} opacity-5 rounded-full blur-3xl group-hover:opacity-15 transition-opacity`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${benefit.color} rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${benefit.color} w-0 group-hover:w-full transition-all duration-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-16 animate-slide-up">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão recuperando seus itens perdidos.
          </p>
          <Link
            href="/items/new"
            className="group inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105"
          >
            <Plus size={24} className="mr-2 group-hover:animate-bounce" />
            Registrar Primeiro Item
            <ArrowRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
