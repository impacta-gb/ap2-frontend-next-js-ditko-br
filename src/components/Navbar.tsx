'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Home, Package, Plus, RotateCcw, Users } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const navItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/items', label: 'Itens', icon: Package },
    { href: '/items/new', label: 'Registrar', icon: Plus },
    { href: '/devolucoes', label: 'Devoluções', icon: RotateCcw },
    { href: '/responsaveis', label: 'Responsáveis', icon: Users },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl border-b-4 border-blue-400 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 dark:border-blue-700 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-2xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent hover:from-blue-100 hover:to-white transition-all duration-300 group"
          >
            <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
              <Search size={24} className="text-white" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Lost & Found</span>
          </Link>

          {/* Menu */}
          <ul className="flex gap-1 items-center">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${
                    isActive(href)
                      ? 'bg-white/20 text-white shadow-lg scale-105 backdrop-blur-sm border border-white/30'
                      : 'text-white/90 hover:bg-white/15 hover:text-white hover:backdrop-blur-sm hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  <Icon size={20} className="transition-all duration-300 group-hover:animate-bounce relative z-10" />
                  <span className="hidden sm:inline relative z-10">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50"></div>
    </nav>
  );
};
