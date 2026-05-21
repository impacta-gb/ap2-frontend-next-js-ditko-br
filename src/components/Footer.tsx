'use client';

import Link from 'next/link';
import { Heart, Mail, MapPin, Phone, Code, Briefcase, Share2, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-blue-500/20 backdrop-blur-xl bg-slate-950/50">
      {/* Premium decorative elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 group transition-all duration-300 hover:scale-105">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-xl">
                  <Heart size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Lost & Found
                </h3>
                <p className="text-xs text-blue-300/60">Achados e Perdidos</p>
              </div>
            </div>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Recupere seus itens valiosos com segurança. Uma comunidade global dedicada a conectar pessoas com seus objetos perdidos.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="p-3 rounded-lg bg-gradient-to-br from-blue-600/40 to-purple-600/40 hover:from-blue-600/60 hover:to-purple-600/60 backdrop-blur-sm border border-blue-400/30 text-blue-300 hover:text-blue-100 transition-all hover:scale-110 hover:shadow-lg"
                title="GitHub"
              >
                <Code size={18} />
              </a>
              <a
                href="#"
                className="p-3 rounded-lg bg-gradient-to-br from-blue-600/40 to-purple-600/40 hover:from-blue-600/60 hover:to-purple-600/60 backdrop-blur-sm border border-blue-400/30 text-blue-300 hover:text-blue-100 transition-all hover:scale-110 hover:shadow-lg"
                title="LinkedIn"
              >
                <Briefcase size={18} />
              </a>
              <a
                href="#"
                className="p-3 rounded-lg bg-gradient-to-br from-blue-600/40 to-purple-600/40 hover:from-blue-600/60 hover:to-purple-600/60 backdrop-blur-sm border border-blue-400/30 text-blue-300 hover:text-blue-100 transition-all hover:scale-110 hover:shadow-lg"
                title="Twitter"
              >
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-blue-200 uppercase tracking-widest">
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
                    className="text-blue-200/70 hover:text-blue-100 transition-colors flex items-center gap-2 group"
                  >
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity scale-75" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-blue-200 uppercase tracking-widest">
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
                    className="text-blue-200/70 hover:text-blue-100 transition-colors flex items-center gap-2 group"
                  >
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity scale-75" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-blue-200 uppercase tracking-widest">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <Mail size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-300/60">Email</p>
                  <a href="mailto:contato@lostandfound.com" className="text-blue-200 hover:text-blue-100 transition-colors text-sm">
                    contato@lf.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <Phone size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-300/60">Telefone</p>
                  <a href="tel:+5511999999999" className="text-blue-200 hover:text-blue-100 transition-colors text-sm">
                    +55 (11) 9999-9999
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-300/60">Localização</p>
                  <p className="text-blue-200 text-sm">São Paulo, Brasil</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-500/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-200/60 text-sm">
              © {currentYear} Lost & Found. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-blue-200/60 hover:text-blue-200 transition-colors text-sm">
                Privacidade
              </a>
              <a href="#" className="text-blue-200/60 hover:text-blue-200 transition-colors text-sm">
                Termos
              </a>
              <a href="#" className="text-blue-200/60 hover:text-blue-200 transition-colors text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gradient accent */}
        <div className="text-center pt-6 pb-4">
          <p className="text-blue-300/40 text-xs">
            Feito com <Heart size={12} className="inline text-red-400 animate-pulse" /> para reunir pessoas
          </p>
        </div>
      </div>
    </footer>
  );
}
