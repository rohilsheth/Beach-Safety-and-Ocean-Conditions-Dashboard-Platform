'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { Clock } from 'lucide-react';

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [liveStatus, setLiveStatus] = React.useState<{
    isLiveData: boolean;
    lastUpdated: string;
  } | null>(null);

  React.useEffect(() => {
    const handleLiveStatus = (event: Event) => {
      const customEvent = event as CustomEvent<{
        isLiveData: boolean;
        lastUpdated: string;
      }>;
      if (customEvent.detail) {
        setLiveStatus(customEvent.detail);
      }
    };

    window.addEventListener('beach-live-status', handleLiveStatus as EventListener);
    return () => {
      window.removeEventListener('beach-live-status', handleLiveStatus as EventListener);
    };
  }, []);

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
        <div className="flex items-center justify-between border-t border-white/20 pt-3 gap-2">
          <nav
            className="flex gap-1"
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

          {pathname === '/' && liveStatus && (
            <div className={`shadow rounded-md px-2.5 py-1.5 flex items-center gap-2 border text-xs ${
              liveStatus.isLiveData
                ? 'bg-white/95 border-gray-200 text-gray-700'
                : 'bg-white/90 border-gray-300 text-gray-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${liveStatus.isLiveData ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
              <span className="font-medium">{liveStatus.isLiveData ? 'Live' : 'Loading...'}</span>
              {liveStatus.isLiveData && (
                <>
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span>{new Date(liveStatus.lastUpdated).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
