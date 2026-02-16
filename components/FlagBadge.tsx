'use client';

import React from 'react';
import { FlagStatus } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';
import { FLAG_BG_COLORS, FLAG_TEXT_COLORS, FLAG_BORDER_COLORS } from '@/lib/constants';

interface FlagBadgeProps {
  status: FlagStatus;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export default function FlagBadge({ status, size = 'md', showDescription = false }: FlagBadgeProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const label = t(`flag.${status}`);
  const description = t(`flag.${status}.desc`);

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`inline-flex items-center justify-center font-semibold rounded-full border-2 ${FLAG_BG_COLORS[status]} ${FLAG_TEXT_COLORS[status]} ${FLAG_BORDER_COLORS[status]} ${sizeClasses[size]}`}
        role="status"
        aria-label={`${label}: ${description}`}
      >
        {label}
      </div>
      {showDescription && (
        <p className={`text-xs ${FLAG_TEXT_COLORS[status]} mt-1`}>
          {description}
        </p>
      )}
    </div>
  );
}
