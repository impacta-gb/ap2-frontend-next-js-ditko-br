'use client';

import Link from 'next/link';
import { Heart, Mail, MapPin, Phone, Code, Briefcase, Share2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-transparent via-slate-50 to-slate-100 dark:via-slate-900 dark:to-slate-950 border-t border-gray-200 dark:border-gray-800 mt-20 pt-16 pb-8">
      {/* Decorative gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Heart size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                Lost & Found
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Recupere o que foi perdido. Conectando pessoas com seus itens especiais através da tecnologia.
            </p>
            <div className="flex gap-3 pt-4">
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-blue-500 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 hover:text-white transition-all hover:scale-110"
                title="GitHub"
              >
                <Code size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-blue-500 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 hover:text-white transition-all hover:scale-110"
                title="LinkedIn"
              >
                <Briefcase size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-blue-500 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 hover:text-white transition-all hover:scale-110"
                title="Twitter"
              >
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Início', href: '/' },
                { label: 'Itens Encontrados', href: '/items' },
                { label: 'Devoluções', href: '/devolucoes' },
                { label: 'Registrar Item', href: '/items/new' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Suporte
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Sobre Nós', href: '#' },
                { label: 'Contato', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Termos de Uso', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Contato
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0 group-hover:bg-blue-500 group-hover:scale-110 transition-all">
                  <Mail size={16} className="text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    contato@lostandfound.com
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0 group-hover:bg-purple-500 group-hover:scale-110 transition-all">
                  <Phone size={16} className="text-purple-600 dark:text-purple-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Telefone</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    (11) 9999-9999
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex-shrink-0 group-hover:bg-emerald-500 group-hover:scale-110 transition-all">
                  <MapPin size={16} className="text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Localização</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    São Paulo, SP
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
            © {currentYear} Lost & Found. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Feito por</span>
            <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Ditko.br
            </span>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacidade
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
