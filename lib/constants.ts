import { HazardType } from './types';

export const FLAG_COLORS = {
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
};

export const FLAG_TEXT_COLORS = {
  green: 'text-emerald-700',
  yellow: 'text-amber-700',
  red: 'text-red-700',
};

export const FLAG_BG_COLORS = {
  green: 'bg-emerald-100',
  yellow: 'bg-amber-100',
  red: 'bg-red-100',
};

export const FLAG_BORDER_COLORS = {
  green: 'border-emerald-500',
  yellow: 'border-amber-500',
  red: 'border-red-500',
};

export const HAZARD_CONFIG: Record<
  HazardType,
  { label: string; icon: string; color: string }
> = {
  'rip-currents': {
    label: 'Rip Currents',
    icon: '🌊',
    color: 'text-blue-600',
  },
  'high-surf': {
    label: 'High Surf',
    icon: '🌊',
    color: 'text-indigo-600',
  },
  jellyfish: {
    label: 'Jellyfish',
    icon: '🪼',
    color: 'text-purple-600',
  },
  sharks: {
    label: 'Shark Activity',
    icon: '🦈',
    color: 'text-gray-700',
  },
  'water-quality': {
    label: 'Water Quality Advisory',
    icon: '⚠️',
    color: 'text-orange-600',
  },
  'sneaker-waves': {
    label: 'Sneaker Waves',
    icon: '🌊',
    color: 'text-red-600',
  },
  wildlife: {
    label: 'Wildlife Present',
    icon: '🦭',
    color: 'text-green-700',
  },
  'strong-winds': {
    label: 'Strong Winds',
    icon: '💨',
    color: 'text-cyan-600',
  },
};

export const DATA_SOURCES = {
  noaa: 'NOAA NDBC Buoy Network',
  nws: 'National Weather Service',
  openMeteo: 'Open-Meteo API',
  epa: 'EPA BEACON',
  countyLifeguards: 'San Mateo County Lifeguard Services',
};

// Production API endpoints (for reference - not used in demo)
export const PRODUCTION_APIS = {
  noaaBuoy46012: 'https://www.ndbc.noaa.gov/data/realtime2/46012.txt', // Half Moon Bay
  noaaBuoy46026: 'https://www.ndbc.noaa.gov/data/realtime2/46026.txt', // San Francisco
  nwsApi: 'https://api.weather.gov',
  openMeteo: 'https://api.open-meteo.com/v1/forecast',
  epaBeacon: 'https://watersgeo.epa.gov/beacon2',
};
