'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Language } from '@/lib/types';
import { trackLanguageChange } from '@/lib/analytics';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const handleToggle = (lang: Language) => {
    if (lang !== language) {
      trackLanguageChange(language, lang);
    }
    setLanguage(lang);
  };

  return (
    <div
      className="inline-flex rounded-lg border-2 border-gray-300 bg-white overflow-hidden"
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => handleToggle('en')}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        aria-pressed={language === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => handleToggle('es')}
        className={`px-3 py-1.5 text-sm font-medium transition-colors border-l-2 border-gray-300 ${
          language === 'es'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        aria-pressed={language === 'es'}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  );
}
