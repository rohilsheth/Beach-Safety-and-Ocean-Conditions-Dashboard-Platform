'use client';

import React from 'react';
import { Beach } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';
import FlagBadge from './FlagBadge';
import HazardChip from './HazardChip';
import CustomAlerts from './CustomAlerts';
import { Wind, Thermometer, Droplets, Waves, Sun, ArrowUp, AlertTriangle } from 'lucide-react';

interface BeachDetailProps {
  beach: Beach | null;
  onClose: () => void;
}

export default function BeachDetail({ beach, onClose }: BeachDetailProps) {
  const { t } = useLanguage();

  if (!beach) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center text-gray-500">
        <p>{t('ui.selectBeach')}</p>
      </div>
    );
  }

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-primary text-white p-4 shadow-md z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {beach.name}
              {beach.nickname && (
                <span className="text-sm font-normal ml-2 opacity-90">
                  ({beach.nickname})
                </span>
              )}
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {t(`region.${beach.region}`)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close beach details"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Safety Flag */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Safety Status
          </h3>
          <FlagBadge status={beach.flagStatus} size="lg" showDescription />
        </section>

        {/* Advisory Alert */}
        {beach.advisory && (
          <section>
            <div
              className={`p-4 rounded-lg border-l-4 ${
                beach.flagStatus === 'red'
                  ? 'bg-red-50 border-red-500'
                  : beach.flagStatus === 'yellow'
                  ? 'bg-amber-50 border-amber-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
              role="alert"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    beach.flagStatus === 'red'
                      ? 'text-red-600'
                      : beach.flagStatus === 'yellow'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`}
                />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t('ui.advisory')}</h4>
                  <p className="text-sm leading-relaxed">{beach.advisory}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Custom County Alerts */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            County Alerts
          </h3>
          <CustomAlerts beachId={beach.id} />
        </section>

        {/* Current Conditions */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            {t('ui.currentConditions')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <ConditionCard
              icon={<Waves className="w-5 h-5" />}
              label={t('conditions.waveHeight')}
              value={`${beach.conditions.waveHeight} ft`}
            />
            <ConditionCard
              icon={<Wind className="w-5 h-5" />}
              label={t('conditions.windSpeed')}
              value={`${beach.conditions.windSpeed} mph ${beach.conditions.windDirection}`}
            />
            <ConditionCard
              icon={<Droplets className="w-5 h-5" />}
              label={t('conditions.waterTemp')}
              value={`${beach.conditions.waterTemp}°F`}
            />
            <ConditionCard
              icon={<Thermometer className="w-5 h-5" />}
              label={t('conditions.airTemp')}
              value={`${beach.conditions.airTemp}°F`}
            />
            <ConditionCard
              icon={<Sun className="w-5 h-5" />}
              label={t('conditions.uvIndex')}
              value={beach.conditions.uvIndex.toString()}
            />
            <ConditionCard
              icon={<ArrowUp className="w-5 h-5" />}
              label={t('conditions.tideStatus')}
              value={beach.conditions.tideStatus}
            />
          </div>
        </section>

        {/* Active Hazards */}
        {beach.hazards.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              {t('ui.activeHazards')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {beach.hazards.map((hazard) => (
                <HazardChip key={hazard} hazard={hazard} size="md" />
              ))}
            </div>
          </section>
        )}

        {/* Data Source */}
        <section className="text-xs text-gray-500 border-t pt-4">
          <p>
            <span className="font-medium">{t('ui.lastUpdated')}:</span>{' '}
            {formatTimestamp(beach.lastUpdated)}
          </p>
          <p className="mt-1">
            <span className="font-medium">{t('ui.dataSource')}:</span> NOAA, NWS,
            EPA
          </p>
        </section>
      </div>
    </div>
  );
}

function ConditionCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center gap-2 mb-1 text-gray-600">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}
