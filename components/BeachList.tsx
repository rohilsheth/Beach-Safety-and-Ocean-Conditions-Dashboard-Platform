'use client';

import React, { useState, useMemo } from 'react';
import { Beach, FlagStatus, Region } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';
import FlagBadge from './FlagBadge';
import HazardChip from './HazardChip';
import { Search, MapPin } from 'lucide-react';

interface BeachListProps {
  beaches: Beach[];
  selectedBeach: Beach | null;
  onSelectBeach: (beach: Beach) => void;
}

export default function BeachList({
  beaches,
  selectedBeach,
  onSelectBeach,
}: BeachListProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all');
  const [flagFilter, setFlagFilter] = useState<FlagStatus | 'all'>('all');

  const filteredBeaches = useMemo(() => {
    return beaches.filter((beach) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        beach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beach.nickname?.toLowerCase().includes(searchQuery.toLowerCase());

      // Region filter
      const matchesRegion = regionFilter === 'all' || beach.region === regionFilter;

      // Flag filter
      const matchesFlag = flagFilter === 'all' || beach.flagStatus === flagFilter;

      return matchesSearch && matchesRegion && matchesFlag;
    });
  }, [beaches, searchQuery, regionFilter, flagFilter]);

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('ui.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-sm"
            aria-label="Search beaches"
          />
        </div>

        {/* Region Filter */}
        <div>
          <label htmlFor="region-filter" className="block text-xs font-medium text-gray-700 mb-1">
            {t('ui.filterByRegion')}
          </label>
          <select
            id="region-filter"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value as Region | 'all')}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-sm"
          >
            <option value="all">{t('ui.allRegions')}</option>
            <option value="North">{t('region.North')}</option>
            <option value="Central">{t('region.Central')}</option>
            <option value="South">{t('region.South')}</option>
          </select>
        </div>

        {/* Flag Filter */}
        <div>
          <label htmlFor="flag-filter" className="block text-xs font-medium text-gray-700 mb-1">
            {t('ui.filterByFlag')}
          </label>
          <select
            id="flag-filter"
            value={flagFilter}
            onChange={(e) => setFlagFilter(e.target.value as FlagStatus | 'all')}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-sm"
          >
            <option value="all">{t('ui.allFlags')}</option>
            <option value="green">{t('flag.green')}</option>
            <option value="yellow">{t('flag.yellow')}</option>
            <option value="red">{t('flag.red')}</option>
          </select>
        </div>
      </div>

      {/* Beach List */}
      <div className="flex-1 overflow-y-auto">
        {filteredBeaches.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">No beaches found matching your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBeaches.map((beach) => (
              <BeachListItem
                key={beach.id}
                beach={beach}
                isSelected={selectedBeach?.id === beach.id}
                onClick={() => onSelectBeach(beach)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BeachListItem({
  beach,
  isSelected,
  onClick,
}: {
  beach: Beach;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-l-4 border-primary' : ''
      }`}
      aria-pressed={isSelected}
    >
      <div className="space-y-2">
        {/* Beach Name and Region */}
        <div>
          <h3 className="font-semibold text-sm text-gray-900">
            {beach.name}
            {beach.nickname && (
              <span className="text-xs font-normal text-gray-600 ml-1">
                ({beach.nickname})
              </span>
            )}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{t(`region.${beach.region}`)}</span>
          </div>
        </div>

        {/* Flag Status */}
        <div>
          <FlagBadge status={beach.flagStatus} size="sm" />
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          <span>🌊 {beach.conditions.waveHeight} ft</span>
          <span>💨 {beach.conditions.windSpeed} mph</span>
          <span>🌡️ {beach.conditions.waterTemp}°F</span>
        </div>

        {/* Hazards */}
        {beach.hazards.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {beach.hazards.slice(0, 3).map((hazard) => (
              <HazardChip key={hazard} hazard={hazard} size="sm" />
            ))}
            {beach.hazards.length > 3 && (
              <span className="text-xs text-gray-500 self-center">
                +{beach.hazards.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
