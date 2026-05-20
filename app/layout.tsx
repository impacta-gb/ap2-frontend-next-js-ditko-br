import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/src/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lost & Found - Sistema de Achados e Perdidos",
  description: "Sistema para encontrar e devolver itens perdidos com facilidade e segurança",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lost & Found",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white relative">
        {/* Premium animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Animated gradient blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '3s' }} />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5" />
        </div>

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
