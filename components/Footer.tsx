'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { DATA_SOURCES } from '@/lib/constants';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white py-3 flex-shrink-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <div className="text-center md:text-left">
            <p>
              <span className="text-gray-400">{t('footer.copyright')}</span>
            </p>
          </div>

          <div className="text-center md:text-right text-gray-400">
            <p>
              {t('footer.dataSources')}: {DATA_SOURCES.noaa} • {DATA_SOURCES.nws} • {DATA_SOURCES.epa}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
