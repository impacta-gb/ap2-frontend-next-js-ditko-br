'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Home, Package, Plus, RotateCcw, Users, MapPin, MessageSquare, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const navItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/items', label: 'Itens', icon: Package },
    { href: '/items/new', label: 'Registrar', icon: Plus },
    { href: '/devolucoes', label: 'Devoluções', icon: RotateCcw },
    { href: '/responsaveis', label: 'Responsáveis', icon: Users },
    { href: '/locais', label: 'Locais', icon: MapPin },
    { href: '/reclamantes', label: 'Reclamantes', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-blue-500/20 bg-slate-950/80">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 via-slate-950/50 to-purple-950/50 pointer-events-none"></div>
      
      {/* Animated glow effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full filter blur-3xl opacity-50 pointer-events-none animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Premium - Left Aligned */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-105 flex-shrink-0"
          >
            <div className="relative">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              
              {/* Icon container */}
              <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-300">
                <Search size={28} className="text-white" />
              </div>
            </div>
            
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                Lost & Found
              </span>
              <span className="text-xs text-blue-300/60 group-hover:text-blue-300/80 transition-colors">Achados e Perdidos</span>
            </div>
          </Link>

          {/* Navigation Menu - Premium */}
          <ul className="hidden lg:flex gap-2 items-center ml-auto">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative group px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                    isActive(href)
                      ? 'text-white'
                      : 'text-blue-200/80 hover:text-white'
                  }`}
                >
                  {/* Background gradient - appears on active/hover */}
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    isActive(href)
                      ? 'bg-gradient-to-r from-blue-600/60 to-purple-600/60 backdrop-blur-sm border border-blue-400/50'
                      : 'bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/40 group-hover:to-purple-600/40 group-hover:backdrop-blur-sm group-hover:border group-hover:border-blue-400/30'
                  }`} />
                  
                  {/* Content */}
                  <Icon size={18} className={`relative z-10 transition-all duration-300 ${isActive(href) ? 'text-blue-200' : 'text-blue-300/80 group-hover:text-blue-200'} group-hover:scale-110`} />
                  <span className="relative z-10 hidden sm:inline">{label}</span>
                  
                  {/* Bottom indicator */}
                  {isActive(href) && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-pulse"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600/40 to-purple-600/40 hover:from-blue-600/60 hover:to-purple-600/60 backdrop-blur-sm border border-blue-400/30 text-blue-200 hover:text-white transition-all duration-300 hover:scale-110">
              <Search size={20} />
            </button>
            <button className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600/40 to-purple-600/40 hover:from-blue-600/60 hover:to-purple-600/60 backdrop-blur-sm border border-blue-400/30 text-blue-200 hover:text-white transition-all duration-300 hover:scale-110">
              <ChevronDown size={20} />
            </button>
          </div>

          {/* CTA Button */}
          <Link
            href="/items/new"
            className="hidden sm:flex items-center gap-2 ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border border-blue-400/50 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Registrar</span>
          </Link>
        </div>
      </div>

      {/* Animated gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </nav>
  );
};
