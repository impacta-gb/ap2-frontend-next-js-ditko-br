'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Home, Package, Plus, RotateCcw } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const navItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/items', label: 'Itens', icon: Package },
    { href: '/items/new', label: 'Registrar', icon: Plus },
    { href: '/devolucoes', label: 'Devoluções', icon: RotateCcw },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl border-b border-purple-400 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 dark:border-purple-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-2xl text-white hover:text-blue-100 transition-all duration-300 group"
          >
            <div className="p-2 bg-blue-500 bg-opacity-40 rounded-lg hover:bg-opacity-60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Search size={24} className="text-white group-hover:text-blue-100" />
            </div>
            <span className="hidden sm:inline">Lost & Found</span>
          </Link>

          {/* Menu */}
          <ul className="flex gap-1 items-center">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActive(href)
                      ? 'bg-blue-500 bg-opacity-30 text-white shadow-lg scale-105 backdrop-blur-sm'
                      : 'text-white hover:bg-blue-500 hover:bg-opacity-20 hover:backdrop-blur-sm hover:scale-105'
                  }`}
                >
                  <Icon size={18} className="transition-all duration-300 group-hover:animate-bounce" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
