'use client';

import React from 'react';
import { HazardType } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';
import { HAZARD_CONFIG } from '@/lib/constants';

interface HazardChipProps {
  hazard: HazardType;
  size?: 'sm' | 'md';
}

export default function HazardChip({ hazard, size = 'md' }: HazardChipProps) {
  const { t } = useLanguage();
  const config = HAZARD_CONFIG[hazard];
  const label = t(`hazard.${hazard}`);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-white border-2 border-gray-300 rounded-lg ${sizeClasses[size]} font-medium ${config.color}`}
      role="img"
      aria-label={`Hazard: ${label}`}
    >
      <span className="text-base" aria-hidden="true">
        {config.icon}
      </span>
      <span aria-hidden="true">{label}</span>
    </div>
  );
}
