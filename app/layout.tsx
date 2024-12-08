import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from '@/lib/auth';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
              <Navbar />
              <main className="min-h-screen bg-background">
                {children}
              </main>
              <SonnerToaster richColors position="top-center" />
              <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}