/**
 * API Response Types for External Data Sources
 */

// NOAA NDBC Buoy Data
export interface NOAABuoyData {
  station: string;
  timestamp: string;
  waveHeight: number | null; // meters
  windSpeed: number | null; // m/s
  windDirection: number | null; // degrees
  waterTemp: number | null; // celsius
  airTemp: number | null; // celsius
}

// National Weather Service Alert
export interface NWSAlert {
  id: string;
  event: string; // "Rip Current Statement", "High Surf Advisory", etc.
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
  certainty: 'Observed' | 'Likely' | 'Possible' | 'Unlikely' | 'Unknown';
  urgency: 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown';
  headline: string;
  description: string;
  instruction: string | null;
  areaDesc: string;
  onset: string;
  expires: string;
}

// Open-Meteo Weather Data
export interface OpenMeteoData {
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number; // celsius
    uv_index: number;
    windspeed_10m: number; // km/h
    winddirection_10m: number; // degrees
  };
}

// EPA Water Quality Data
export interface EPAWaterQuality {
  beachId: string;
  status: 'Open' | 'Closed' | 'Advisory';
  advisoryType?: string;
  description?: string;
  postedDate?: string;
}

// Aggregated Beach Data (what we return to frontend)
export interface AggregatedBeachData {
  beachId: string;
  conditions: {
    waveHeight: number; // feet
    windSpeed: number; // mph
    windDirection: string;
    waterTemp: number; // fahrenheit
    airTemp: number; // fahrenheit
    uvIndex: number;
  };
  alerts: NWSAlert[];
  waterQuality: EPAWaterQuality | null;
  lastUpdated: string;
}
