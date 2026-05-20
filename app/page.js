'use client';

import Link from 'next/link';
import { Card, CardBody, Stats } from '@/src/components';
import { useState, useEffect } from 'react';
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
  Map,
  UserCheck,
} from 'lucide-react';
import { apiClient } from '@/src/lib/api-client';

export default function Home() {
  const [stats, setStats] = useState([
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
    {
      value: '0',
      label: 'Locais Cadastrados',
      icon: <Map size={24} />,
      color: 'orange',
    },
    {
      value: '0',
      label: 'Reclamantes',
      icon: <Users size={24} />,
      color: 'pink',
    },
    {
      value: '0',
      label: 'Responsáveis',
      icon: <UserCheck size={24} />,
      color: 'red',
    },
  ]);

  // Carregar dados das estatísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Buscar itens
        const itemsResponse = await apiClient.getItems(1, 1);
        const extractTotal = (obj) => {
          if (typeof obj?.total === 'number') return obj.total;
          if (typeof obj?.data?.total === 'number') return obj.data.total;
          if (typeof obj?.count === 'number') return obj.count;
          return 0;
        };
        const totalItems = extractTotal(itemsResponse);

        // Buscar devoluções
        const devolucoesResponse = await apiClient.getDevolucoes(1, 1);
        const totalDevolucoes = extractTotal(devolucoesResponse);

        // Buscar locais
        const locaisResponse = await apiClient.getLocais(1, 1);
        const totalLocais = extractTotal(locaisResponse);

        // Buscar reclamantes
        const reclamantesResponse = await apiClient.getReclamantes(1, 1);
        const totalReclamantes = extractTotal(reclamantesResponse);

        // Buscar responsáveis
        const responsaveisResponse = await apiClient.getResponsaveis(1, 1);
        const totalResponsaveis = extractTotal(responsaveisResponse);

        // Calcular taxa de satisfação: (devoluções / reclamantes) * 100
        const taxaSatisfacao = totalReclamantes > 0 
          ? Math.round((totalDevolucoes / totalReclamantes) * 100)
          : 0;

        setStats([
          {
            value: totalItems.toString(),
            label: 'Itens Registrados',
            icon: <ClipboardList size={24} />,
            color: 'blue',
          },
          {
            value: totalDevolucoes.toString(),
            label: 'Devoluções Realizadas',
            icon: <CheckCircle2 size={24} />,
            color: 'emerald',
          },
          {
            value: `${taxaSatisfacao}%`,
            label: 'Taxa de Satisfação',
            icon: <TrendingUp size={24} />,
            color: 'purple',
          },
          {
            value: totalLocais.toString(),
            label: 'Locais Cadastrados',
            icon: <Map size={24} />,
            color: 'orange',
          },
          {
            value: totalReclamantes.toString(),
            label: 'Reclamantes',
            icon: <Users size={24} />,
            color: 'pink',
          },
          {
            value: totalResponsaveis.toString(),
            label: 'Responsáveis',
            icon: <UserCheck size={24} />,
            color: 'red',
          },
        ]);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    loadStats();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium animated background with gradient mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section - Enhanced */}
        <div className="text-center mb-32 animate-slide-up">
          {/* Premium floating icon - Centered */}
          <div className="flex items-center justify-center mb-12">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl blur-3xl opacity-75 animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-300 group cursor-pointer hover:shadow-3xl">
                <Search size={80} className="text-white group-hover:animate-bounce" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 animate-slide-down">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
              Lost & Found
            </span>
          </h1>

          <div className="space-y-3 mb-8">
            <p className="text-2xl md:text-3xl font-bold text-blue-100 animate-slide-left">
              Sistema Inteligente de Achados e Perdidos
            </p>
            <p className="text-lg text-blue-200/80 max-w-3xl mx-auto animate-slide-right">
              Recupere seus objetos perdidos com a ajuda de nossa comunidade global. Seguro, rápido e confiável.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in pt-4">
            <Link
              href="/items"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden border border-blue-400/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <Search size={24} className="mr-3 group-hover:animate-bounce" />
              Buscar Itens
              <ArrowRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/items/new"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-blue-300 font-bold text-lg rounded-2xl hover:from-slate-700 hover:to-slate-600 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 border-2 border-blue-500/50 hover:border-blue-400"
            >
              <Plus size={24} className="mr-3 group-hover:animate-bounce" />
              Registrar Achado
              <ArrowRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Stats Section - Moved up and enhanced */}
        <div className="mb-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 rounded-3xl blur-3xl" />
          <div className="relative">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Estatísticas do Sistema
                </span>
              </h2>
              <p className="text-blue-200/70 max-w-2xl mx-auto text-lg">
                Veja o impacto positivo da nossa plataforma na recuperação de itens perdidos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const colorValue = stat.color;
                return (
                  <Stats
                    key={index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    color={colorValue}
                    bgColor="bg-slate-900/40 backdrop-blur-sm"
                    animated
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Features Grid - Enhanced */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Recursos Principais
              </span>
            </h2>
            <p className="text-blue-200/70 max-w-2xl mx-auto text-lg">
              Tudo o que você precisa para encontrar e recuperar seus objetos perdidos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  hover
                  gradient
                  className="group animate-scale-in relative overflow-hidden bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-blue-600/10 transition-all duration-500" />
                  
                  <CardBody className="p-8 relative z-10">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 shadow-xl`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-100 mb-3 group-hover:text-blue-200 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-blue-200/70 group-hover:text-blue-100 transition-colors leading-relaxed">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section - Premium */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Por que escolher Lost & Found?
              </span>
            </h2>
            <p className="text-blue-200/70 max-w-2xl mx-auto text-lg">
              Somos a solução mais confiável e eficiente para achados e perdidos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={40} className="text-blue-300" />,
                title: 'Segurança Premium',
                description: 'Seus dados são protegidos com criptografia de nível militar e as melhores práticas de segurança digital.',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-950/30',
              },
              {
                icon: <Zap size={40} className="text-purple-300" />,
                title: 'Ultrarrápido',
                description: 'Interface intuitiva que permite registrar e buscar itens em segundos. Sem complicações.',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-950/30',
              },
              {
                icon: <TrendingUp size={40} className="text-cyan-300" />,
                title: 'Taxa de Sucesso',
                description: 'Milhares de pessoas já recuperaram seus itens. Taxa de satisfação acima de 95%.',
                color: 'from-cyan-500 to-cyan-600',
                bgColor: 'bg-cyan-950/30',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 border border-slate-700/50 hover:border-blue-500/50 group animate-scale-in ${benefit.bgColor} backdrop-blur-sm`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Decorative gradient overlay */}
                <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${benefit.color} opacity-5 rounded-full blur-3xl group-hover:opacity-15 transition-opacity`} />
                <div className={`absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br ${benefit.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex p-3 bg-gradient-to-br ${benefit.color} rounded-2xl mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-blue-200/70 group-hover:text-blue-100 transition-colors leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${benefit.color} w-0 group-hover:w-full transition-all duration-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer - Premium */}
        <div className="text-center mb-20 animate-slide-up relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl" />
          <div className="relative py-16 px-8 rounded-3xl border border-blue-500/30 backdrop-blur-sm bg-slate-900/40">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Comece Agora
            </h2>
            <p className="text-blue-200/80 text-lg mb-8 max-w-2xl mx-auto">
              Não deixe seus objetos perdidos! Registre hoje e aumente as chances de recuperá-los.
            </p>
            <Link
              href="/items/new"
              className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 border border-blue-400/30"
            >
              <Plus size={28} className="mr-3 group-hover:animate-bounce" />
              Registrar Meu Primeiro Item
              <ArrowRight size={28} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
