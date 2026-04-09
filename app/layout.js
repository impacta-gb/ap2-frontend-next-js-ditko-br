import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/src/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sistema de Achados e Perdidos",
  description: "Sistema para encontrar e devolver itens perdidos",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
            <p>© 2026 Sistema de Achados e Perdidos - Projeto Acadêmico</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
