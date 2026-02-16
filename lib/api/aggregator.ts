/**
 * Data Aggregation Service
 *
 * Combines data from multiple sources (hyperlocal per beach):
 * - Open-Meteo Marine (PRIMARY: wave height - 5km resolution)
 * - Open-Meteo Weather (PRIMARY: wind, air temp, UV - coordinate-based)
 * - NOAA CO-OPS (PRIMARY: tide predictions - beach-level station mapping)
 * - NOAA NDBC (FALLBACK: buoy data for water temp and backup wind)
 * - NWS (beach hazard alerts)
 * - Admin overrides (manual county updates - highest priority)
 *
 * Returns unified beach condition data with hyperlocal accuracy
 */

import { Beach, HazardType, AdminUpdate } from '@/lib/types';
import { beaches as beachData } from '@/data/beaches';
import {
  getRegionalBuoyData,
  getBuoyDataForBeach,
  metersToFeet,
  mpsToMph,
  celsiusToFahrenheit,
  degreesToCardinal,
} from './noaa';
import {
  fetchNWSAlerts,
  isBeachSafetyAlert,
  alertToFlagStatus,
} from './nws';
import { fetchOpenMeteoData, fetchMarineData } from './openmeteo';
import { getTideData } from './tides';
import fs from 'fs';
import path from 'path';

/**
 * Fetch admin overrides from file
 */
function getAdminOverrides(): AdminUpdate[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'admin-updates.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading admin overrides:', error);
  }
  return [];
}

/**
 * Get the most recent admin override for a specific beach
 */
function getLatestAdminOverride(beachId: string): AdminUpdate | null {
  const updates = getAdminOverrides();
  return updates.find((u) => u.beachId === beachId) || null;
}

/**
 * Apply admin override to beach data
 */
function applyAdminOverride(beach: Beach, override: AdminUpdate | null): Beach {
  if (!override) return beach;

  return {
    ...beach,
    flagStatus: override.changes.flagStatus || beach.flagStatus,
    advisory: override.changes.advisory || beach.advisory,
    hazards: override.changes.hazards || beach.hazards,
  };
}


/**
 * Fetch and aggregate all beach data from live sources
 */
export async function aggregateBeachData(): Promise<Beach[]> {
  try {
    // Fetch NWS alerts (applies to all beaches)
    const nwsAlerts = await fetchNWSAlerts();

    // Filter to beach-relevant alerts only
    const beachAlerts = nwsAlerts.filter(isBeachSafetyAlert);

    // Determine base flag status from alerts
    const alertFlagStatus = alertToFlagStatus(beachAlerts);

    // Update each beach with live data
    const updatedBeaches = await Promise.all(
      beachData.map(async (beach) => {
        // Fetch multiple data sources in parallel for maximum speed
        const [buoyData, localWeather, marineData, tideData] = await Promise.all([
          getBuoyDataForBeach(beach.coordinates.lat, beach.region),
          fetchOpenMeteoData(beach.coordinates.lat, beach.coordinates.lng),
          fetchMarineData(beach.coordinates.lat, beach.coordinates.lng),
          getTideData(beach.coordinates.lat),
        ]);

        // Build conditions object from REAL data sources
        // Priority: Open-Meteo (hyperlocal per beach) > NOAA Buoys (regional fallback)
        const conditions = {
          // Wave height: Open-Meteo Marine API (5km resolution) is PRIMARY
          waveHeight: marineData?.waveHeight
            ? Math.round(metersToFeet(marineData.waveHeight) * 10) / 10
            : buoyData?.waveHeight
            ? Math.round(metersToFeet(buoyData.waveHeight) * 10) / 10
            : beach.conditions.waveHeight,

          // Wind: Open-Meteo Weather API is PRIMARY (hyperlocal per beach coordinates)
          windSpeed: localWeather?.current.windspeed_10m
            ? Math.round(localWeather.current.windspeed_10m)
            : buoyData?.windSpeed
            ? Math.round(mpsToMph(buoyData.windSpeed))
            : beach.conditions.windSpeed,

          windDirection: localWeather?.current.winddirection_10m
            ? degreesToCardinal(localWeather.current.winddirection_10m)
            : buoyData?.windDirection
            ? degreesToCardinal(buoyData.windDirection)
            : beach.conditions.windDirection,

          // Water temp: NOAA Buoy ONLY (Open-Meteo Marine doesn't provide ocean surface temp)
          waterTemp: buoyData?.waterTemp
            ? Math.round(celsiusToFahrenheit(buoyData.waterTemp))
            : beach.conditions.waterTemp,

          // Air temp & UV: Open-Meteo provides hyperlocal data per beach
          airTemp: localWeather?.current.temperature_2m
            ? Math.round(localWeather.current.temperature_2m)
            : beach.conditions.airTemp,

          uvIndex: localWeather?.current.uv_index
            ? Math.round(localWeather.current.uv_index)
            : beach.conditions.uvIndex,

          // Tide: NOAA CO-OPS with beach-level station mapping
          tideStatus: tideData?.currentStatus || beach.conditions.tideStatus,
        };

        // Determine hazards
        const hazards = new Set<HazardType>(beach.hazards);

        // Add hazards based on conditions
        if (conditions.waveHeight > 8) {
          hazards.add('high-surf');
        }
        if (conditions.windSpeed > 20) {
          hazards.add('strong-winds');
        }

        // Add hazards from NWS alerts
        beachAlerts.forEach((alert) => {
          if (alert.event.toLowerCase().includes('rip current')) {
            hazards.add('rip-currents');
          }
          if (alert.event.toLowerCase().includes('high surf')) {
            hazards.add('high-surf');
          }
        });

        // Determine final flag status
        let flagStatus = beach.flagStatus;

        // Override with alert status if more severe
        if (alertFlagStatus === 'red') {
          flagStatus = 'red';
        } else if (alertFlagStatus === 'yellow' && flagStatus === 'green') {
          flagStatus = 'yellow';
        }

        // Generate advisory from alerts
        let advisory = beach.advisory;
        if (beachAlerts.length > 0) {
          advisory = beachAlerts[0].headline;
        }

        const updatedBeach = {
          ...beach,
          flagStatus,
          conditions,
          hazards: Array.from(hazards),
          advisory: advisory || undefined,
          lastUpdated: new Date().toISOString(),
        };

        // Apply admin overrides (takes priority over all other data)
        const adminOverride = getLatestAdminOverride(beach.id);
        return applyAdminOverride(updatedBeach, adminOverride);
      })
    );

    return updatedBeaches;
  } catch (error) {
    console.error('Error aggregating beach data:', error);
    // Return original beach data as fallback
    return beachData;
  }
}

/**
 * Get data for a specific beach by ID
 */
export async function getBeachById(beachId: string): Promise<Beach | null> {
  const beaches = await aggregateBeachData();
  return beaches.find((b) => b.id === beachId) || null;
}

/**
 * Check if data should be refreshed (cache management)
 */
let lastFetchTime: number = 0;
let cachedData: Beach[] | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedBeachData(): Promise<Beach[]> {
  const now = Date.now();

  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return cachedData;
  }

  cachedData = await aggregateBeachData();
  lastFetchTime = now;

  return cachedData;
}
