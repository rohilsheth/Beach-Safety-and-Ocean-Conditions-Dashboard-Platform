'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t('nav.dashboard') },
  ];

  return (
    <header className="bg-primary text-white shadow-lg flex-shrink-0">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start justify-between mb-2 gap-3">
          <div className="flex items-center gap-3">
            {/* County Seal Placeholder */}
            <div
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl"
              aria-hidden="true"
            >
              🏛️
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight">
                {t('header.title')}
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
            <LanguageToggle />
            <Link
              href="/admin"
              className="text-white/70 hover:text-white text-[11px] sm:text-xs font-medium transition-colors flex items-center gap-1 leading-none"
              title="Admin Login"
            >
              🔐 Admin
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="flex gap-1 border-t border-white/20 pt-3"
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-primary'
                    : 'text-white/90 hover:bg-white/10'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
