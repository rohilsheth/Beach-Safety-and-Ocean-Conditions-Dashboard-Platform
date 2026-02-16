/**
 * NOAA NDBC (National Data Buoy Center) API Integration
 *
 * Buoys:
 * - 46012: Half Moon Bay (37.361°N 122.881°W)
 * - 46026: San Francisco (37.759°N 122.833°W)
 *
 * Data Format: Space-delimited text files
 * Update Frequency: Hourly
 * Docs: https://www.ndbc.noaa.gov/
 */

import { NOAABuoyData } from './types';

const BUOY_STATIONS = {
  HALF_MOON_BAY: '46012', // 37.356N, 122.881W
  SAN_FRANCISCO: '46026', // 37.750N, 122.838W
  MONTEREY: '46042', // 36.785N, 122.396W
};

// Helper to convert wind direction degrees to cardinal direction
function degreesToCardinal(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Fetch latest data from NOAA buoy
 * Example URL: https://www.ndbc.noaa.gov/data/realtime2/46012.txt
 */
export async function fetchNOAABuoyData(stationId: string): Promise<NOAABuoyData | null> {
  try {
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error(`NOAA buoy ${stationId} fetch failed:`, response.status);
      return null;
    }

    const text = await response.text();
    const lines = text.trim().split('\n');

    // Skip header lines (first 2 lines)
    if (lines.length < 3) return null;

    // Parse the most recent data line (line 2, after 2 header rows)
    const dataLine = lines[2].trim().split(/\s+/);

    // NOAA format: YY MM DD hh mm WDIR WSPD GST WVHT DPD APD MWD PRES ATMP WTMP DEWP VIS TIDE
    // Indices: 0-4 = timestamp, 5=wind dir, 6=wind speed, 10=wave height, 14=air temp, 15=water temp

    const waveHeight = parseFloat(dataLine[8]); // WVHT (significant wave height in meters)
    const windSpeed = parseFloat(dataLine[6]); // WSPD (wind speed in m/s)
    const windDirection = parseFloat(dataLine[5]); // WDIR (degrees)
    const waterTemp = parseFloat(dataLine[14]); // WTMP (celsius)
    const airTemp = parseFloat(dataLine[13]); // ATMP (celsius)

    return {
      station: stationId,
      timestamp: new Date().toISOString(),
      waveHeight: isNaN(waveHeight) || waveHeight === 99 ? null : waveHeight,
      windSpeed: isNaN(windSpeed) || windSpeed === 99 ? null : windSpeed,
      windDirection: isNaN(windDirection) || windDirection === 999 ? null : windDirection,
      waterTemp: isNaN(waterTemp) || waterTemp === 99 ? null : waterTemp,
      airTemp: isNaN(airTemp) || airTemp === 99 ? null : airTemp,
    };
  } catch (error) {
    console.error(`Error fetching NOAA buoy ${stationId}:`, error);
    return null;
  }
}

/**
 * Get buoy data for San Mateo County region
 * Uses Half Moon Bay buoy (46012) as primary, San Francisco (46026) as fallback
 */
export async function getRegionalBuoyData(): Promise<NOAABuoyData | null> {
  // Try Half Moon Bay buoy first (closest to San Mateo County)
  let data = await fetchNOAABuoyData(BUOY_STATIONS.HALF_MOON_BAY);

  // Fallback to San Francisco buoy if Half Moon Bay is unavailable
  if (!data) {
    data = await fetchNOAABuoyData(BUOY_STATIONS.SAN_FRANCISCO);
  }

  return data;
}

/**
 * Get buoy data for specific beach based on geographic proximity
 * Uses multiple REAL buoy stations for accurate localized data:
 * - North region (lat > 37.5): Station 46026 (San Francisco - 37.750N, 122.838W)
 * - Central region: Station 46012 (Half Moon Bay - 37.356N, 122.881W)
 * - South region (lat < 37.25): Station 46042 (Monterey - 36.785N, 122.396W)
 *
 * Sources:
 * - NOAA NDBC: https://www.ndbc.noaa.gov/
 */
export async function getBuoyDataForBeach(
  beachLat: number,
  beachRegion: string
): Promise<NOAABuoyData | null> {
  let primaryStation: string;
  let fallbackStation: string;

  // Determine which buoy station is closest based on latitude and region
  if (beachRegion === 'North' || beachLat > 37.5) {
    // North beaches: Pacifica, Gray Whale Cove, Rockaway, Sharp Park, Pebble Beach
    primaryStation = BUOY_STATIONS.SAN_FRANCISCO;
    fallbackStation = BUOY_STATIONS.HALF_MOON_BAY;
  } else if (beachRegion === 'South' || beachLat < 37.25) {
    // South beaches: Pescadero, Bean Hollow, Año Nuevo, San Gregorio
    primaryStation = BUOY_STATIONS.MONTEREY;
    fallbackStation = BUOY_STATIONS.HALF_MOON_BAY;
  } else {
    // Central beaches: Half Moon Bay, Mavericks, Montara, Moss Beach, Pillar Point, Martins
    primaryStation = BUOY_STATIONS.HALF_MOON_BAY;
    fallbackStation = BUOY_STATIONS.SAN_FRANCISCO;
  }

  // Try primary station
  let data = await fetchNOAABuoyData(primaryStation);

  // Fallback if primary unavailable
  if (!data) {
    console.warn(
      `⚠️ Buoy ${primaryStation} unavailable, using fallback ${fallbackStation}`
    );
    data = await fetchNOAABuoyData(fallbackStation);
  }

  return data;
}

/**
 * Helper functions to convert NOAA units to imperial
 */
export function metersToFeet(meters: number): number {
  return meters * 3.28084;
}

export function mpsToMph(mps: number): number {
  return mps * 2.23694;
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

export { degreesToCardinal };
