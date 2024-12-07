import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProvider } from '@/providers/i18n-provider';
import { Toaster as SonnerToaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Recetas Compartidas',
  description: 'Comparte y descubre recetas increíbles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <Navbar />
            <main className="min-h-screen bg-background">
              {children}
            </main>
            <SonnerToaster richColors position="top-center" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}