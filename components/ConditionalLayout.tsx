'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show public header/footer on admin pages
  const isAdminPage = pathname.startsWith('/admin');

  const isDashboard = pathname === '/';

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col overflow-auto">{children}</main>
      <div className={isDashboard ? 'hidden md:block' : ''}>
        <Footer />
      </div>
    </>
  );
}
