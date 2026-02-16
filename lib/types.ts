export type FlagStatus = 'green' | 'yellow' | 'red';

export type Region = 'North' | 'Central' | 'South';

export type HazardType =
  | 'rip-currents'
  | 'high-surf'
  | 'jellyfish'
  | 'sharks'
  | 'water-quality'
  | 'sneaker-waves'
  | 'wildlife'
  | 'strong-winds';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BeachConditions {
  waveHeight: number; // feet
  windSpeed: number; // mph
  windDirection: string; // N, NE, E, SE, S, SW, W, NW
  waterTemp: number; // Fahrenheit
  airTemp: number; // Fahrenheit
  uvIndex: number; // 0-11+
  tideStatus: string; // "High Tide" | "Low Tide" | "Rising" | "Falling"
}

export interface Beach {
  id: string;
  name: string;
  nickname?: string;
  region: Region;
  coordinates: Coordinates;
  flagStatus: FlagStatus;
  conditions: BeachConditions;
  hazards: HazardType[];
  advisory?: string;
  lastUpdated: string; // ISO timestamp
}

export interface AdminUpdate {
  beachId: string;
  timestamp: string;
  updatedBy: string;
  changes: {
    flagStatus?: FlagStatus;
    advisory?: string;
    hazards?: HazardType[];
  };
}

export interface CustomAlert {
  id: string;
  beachId: string; // 'all' for county-wide alerts
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  language: 'en' | 'es' | 'both';
}

export type Language = 'en' | 'es';

export interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}
