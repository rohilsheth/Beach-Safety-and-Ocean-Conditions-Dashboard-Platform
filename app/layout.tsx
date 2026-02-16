import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'San Mateo County Beach Safety Dashboard',
  description:
    'Real-time beach conditions, safety alerts, and hazard information for San Mateo County beaches.',
  keywords: [
    'beach safety',
    'San Mateo County',
    'ocean conditions',
    'rip currents',
    'surf report',
    'water safety',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col h-full bg-gray-100">
        <LanguageProvider>
          <Header />
          <main className="flex-1 flex flex-col overflow-auto">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
