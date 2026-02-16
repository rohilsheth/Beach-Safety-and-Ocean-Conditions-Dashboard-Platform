/**
 * Open-Meteo API Integration
 *
 * API Base: https://api.open-meteo.com
 * Coverage: Global (uses coordinates)
 * Update Frequency: Hourly
 * Docs: https://open-meteo.com/en/docs
 * Note: Free, no API key required
 */

import { OpenMeteoData } from './types';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_MARINE_URL = 'https://marine-api.open-meteo.com/v1/marine';

/**
 * Fetch current weather data for specific coordinates
 */
export async function fetchOpenMeteoData(
  lat: number,
  lng: number
): Promise<OpenMeteoData | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      current: 'temperature_2m,uv_index,windspeed_10m,winddirection_10m',
      temperature_unit: 'fahrenheit',
      windspeed_unit: 'mph',
      timezone: 'America/Los_Angeles',
    });

    const url = `${OPEN_METEO_BASE_URL}?${params}`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error('Open-Meteo fetch failed:', response.status);
      return null;
    }

    const data = await response.json();

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      current: {
        temperature_2m: data.current.temperature_2m,
        uv_index: data.current.uv_index,
        windspeed_10m: data.current.windspeed_10m,
        winddirection_10m: data.current.winddirection_10m,
      },
    };
  } catch (error) {
    console.error('Error fetching Open-Meteo data:', error);
    return null;
  }
}

/**
 * Fetch marine conditions for specific coordinates
 * Uses Open-Meteo Marine API with 5km resolution
 * Provides: wave height, wave direction, wave period, ocean currents, sea surface temp
 * Source: https://open-meteo.com/en/docs/marine-weather-api
 */
export async function fetchMarineData(
  lat: number,
  lng: number
): Promise<any> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      current: 'wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction,swell_wave_height',
      timezone: 'America/Los_Angeles',
    });

    const url = `${OPEN_METEO_MARINE_URL}?${params}`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error('Open-Meteo Marine API failed:', response.status);
      return null;
    }

    const data = await response.json();

    return {
      waveHeight: data.current?.wave_height, // meters
      waveDirection: data.current?.wave_direction, // degrees
      wavePeriod: data.current?.wave_period, // seconds
      swellHeight: data.current?.swell_wave_height, // meters
      currentVelocity: data.current?.ocean_current_velocity, // m/s
      currentDirection: data.current?.ocean_current_direction, // degrees
    };
  } catch (error) {
    console.error('Error fetching Open-Meteo Marine data:', error);
    return null;
  }
}

