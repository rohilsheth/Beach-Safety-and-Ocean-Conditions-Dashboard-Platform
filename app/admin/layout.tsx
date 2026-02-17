'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { href: '/admin', label: 'Beach Conditions', exact: true },
    { href: '/admin/alerts', label: 'Alerts' },
    { href: '/admin/analytics', label: 'Analytics' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl">
                🏛️
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Portal</h1>
                <p className="text-blue-100 text-sm">San Mateo County Beach Safety</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open User View
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav className="flex gap-2 border-t border-white/20 pt-3 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1 flex flex-col overflow-auto">{children}</main>
    </div>
  );
}
