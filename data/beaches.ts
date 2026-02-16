/**
 * Beach Safety Data for San Mateo County Beaches
 *
 * PRODUCTION DATA SOURCES:
 * ------------------------
 * In a production environment, this data would be aggregated from:
 *
 * 1. NOAA NDBC Buoy Network:
 *    - Buoy 46012 (Half Moon Bay) - https://www.ndbc.noaa.gov/station_page.php?station=46012
 *    - Buoy 46026 (San Francisco) - https://www.ndbc.noaa.gov/station_page.php?station=46026
 *    - Provides: Wave height, wave period, wind speed/direction, water temperature
 *
 * 2. National Weather Service API:
 *    - api.weather.gov - Surf Zone Forecasts and Marine Warnings
 *    - Provides: Hazard alerts, surf forecasts, rip current risk
 *
 * 3. Open-Meteo API:
 *    - https://api.open-meteo.com/v1/forecast
 *    - Provides: Air temperature, UV index, local weather conditions
 *
 * 4. EPA BEACON (Beach Advisory and Closing Online Notification):
 *    - https://watersgeo.epa.gov/beacon2
 *    - Provides: Water quality advisories, beach closures
 *
 * 5. San Mateo County Lifeguard Services:
 *    - Local reports from on-duty lifeguards
 *    - Provides: Real-time conditions, local hazards, wildlife sightings
 *
 * DATA REFRESH:
 * - Target refresh rate: <5 minutes
 * - NOAA buoys: Updated hourly
 * - NWS alerts: Near real-time
 * - County lifeguards: Manual updates as conditions change
 */

import { Beach } from '@/lib/types';

export const beaches: Beach[] = [
  {
    id: 'pacifica-linda-mar',
    name: 'Pacifica State Beach',
    nickname: 'Linda Mar',
    region: 'North',
    coordinates: { lat: 37.5935, lng: -122.5068 },
    flagStatus: 'yellow',
    conditions: {
      waveHeight: 4.5,
      windSpeed: 12,
      windDirection: 'NW',
      waterTemp: 54,
      airTemp: 62,
      uvIndex: 5,
      tideStatus: 'Rising',
    },
    hazards: ['rip-currents'],
    advisory: 'Moderate rip currents present near the surf zone. Swim near lifeguard towers.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'rockaway-beach',
    name: 'Rockaway Beach',
    region: 'North',
    coordinates: { lat: 37.6028, lng: -122.4965 },
    flagStatus: 'green',
    conditions: {
      waveHeight: 2.5,
      windSpeed: 8,
      windDirection: 'W',
      waterTemp: 55,
      airTemp: 63,
      uvIndex: 4,
      tideStatus: 'High Tide',
    },
    hazards: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sharp-park',
    name: 'Sharp Park Beach',
    region: 'North',
    coordinates: { lat: 37.6175, lng: -122.4903 },
    flagStatus: 'green',
    conditions: {
      waveHeight: 3.0,
      windSpeed: 10,
      windDirection: 'NW',
      waterTemp: 55,
      airTemp: 64,
      uvIndex: 5,
      tideStatus: 'Falling',
    },
    hazards: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'montara',
    name: 'Montara State Beach',
    region: 'Central',
    coordinates: { lat: 37.5428, lng: -122.5134 },
    flagStatus: 'red',
    conditions: {
      waveHeight: 8.0,
      windSpeed: 18,
      windDirection: 'W',
      waterTemp: 53,
      airTemp: 59,
      uvIndex: 6,
      tideStatus: 'Low Tide',
    },
    hazards: ['sneaker-waves', 'high-surf', 'rip-currents'],
    advisory:
      '⚠️ DANGER: Sneaker waves reported. People have been swept off rocks. Stay back from the water\'s edge. High surf and strong rip currents present.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'moss-beach',
    name: 'Moss Beach',
    nickname: 'Fitzgerald Marine Reserve',
    region: 'Central',
    coordinates: { lat: 37.5261, lng: -122.5129 },
    flagStatus: 'green',
    conditions: {
      waveHeight: 2.0,
      windSpeed: 6,
      windDirection: 'NW',
      waterTemp: 54,
      airTemp: 61,
      uvIndex: 4,
      tideStatus: 'Low Tide',
    },
    hazards: [],
    advisory: 'Protected tide pool area - excellent for exploring during low tide.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'half-moon-bay',
    name: 'Half Moon Bay State Beach',
    region: 'Central',
    coordinates: { lat: 37.4636, lng: -122.4425 },
    flagStatus: 'yellow',
    conditions: {
      waveHeight: 5.0,
      windSpeed: 14,
      windDirection: 'W',
      waterTemp: 54,
      airTemp: 60,
      uvIndex: 6,
      tideStatus: 'Rising',
    },
    hazards: ['rip-currents', 'strong-winds'],
    advisory: 'Rip currents common along this stretch. Swim only in designated areas.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'mavericks',
    name: 'Mavericks Beach',
    region: 'Central',
    coordinates: { lat: 37.4935, lng: -122.4965 },
    flagStatus: 'red',
    conditions: {
      waveHeight: 15.0,
      windSpeed: 22,
      windDirection: 'NW',
      waterTemp: 52,
      airTemp: 58,
      uvIndex: 5,
      tideStatus: 'High Tide',
    },
    hazards: ['high-surf', 'rip-currents', 'strong-winds'],
    advisory:
      '🛑 EXTREME DANGER: World-famous big wave surf break. Waves 12-20+ feet. FOR EXPERIENCED SURFERS ONLY. Swimming is extremely dangerous and not recommended.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'pomponio',
    name: 'Pomponio State Beach',
    region: 'South',
    coordinates: { lat: 37.2924, lng: -122.4057 },
    flagStatus: 'green',
    conditions: {
      waveHeight: 3.5,
      windSpeed: 9,
      windDirection: 'NW',
      waterTemp: 55,
      airTemp: 62,
      uvIndex: 6,
      tideStatus: 'Falling',
    },
    hazards: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'pescadero',
    name: 'Pescadero State Beach',
    region: 'South',
    coordinates: { lat: 37.2609, lng: -122.4099 },
    flagStatus: 'green',
    conditions: {
      waveHeight: 3.0,
      windSpeed: 10,
      windDirection: 'W',
      waterTemp: 56,
      airTemp: 63,
      uvIndex: 7,
      tideStatus: 'Low Tide',
    },
    hazards: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'ano-nuevo',
    name: 'Año Nuevo State Beach',
    region: 'South',
    coordinates: { lat: 37.1085, lng: -122.3379 },
    flagStatus: 'yellow',
    conditions: {
      waveHeight: 4.0,
      windSpeed: 11,
      windDirection: 'NW',
      waterTemp: 55,
      airTemp: 61,
      uvIndex: 6,
      tideStatus: 'Rising',
    },
    hazards: ['wildlife'],
    advisory:
      '🦭 Elephant seal breeding season (Dec-Mar). Stay at least 50 feet away from all marine mammals. Beach access may be restricted in certain areas.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'gray-whale-cove',
    name: 'Gray Whale Cove State Beach',
    region: 'North',
    coordinates: { lat: 37.5673, lng: -122.5153 },
    flagStatus: 'yellow',
    conditions: {
      waveHeight: 5.5,
      windSpeed: 14,
      windDirection: 'NW',
      waterTemp: 54,
      airTemp: 60,
      uvIndex: 7,
      tideStatus: 'High Tide',
    },
    hazards: ['high-surf', 'strong-winds'],
    advisory: 'Steep cliffs and strong currents. Beach access via stairway only.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'san-gregorio',
    name: 'San Gregorio State Beach',
    region: 'Central',
    coordinates: { lat: 37.3258, lng: -122.4026 },
    flagStatus: 'green',
    conditions: {
      waveHeight: 3.5,
      windSpeed: 8,
      windDirection: 'W',
      waterTemp: 56,
      airTemp: 64,
      uvIndex: 6,
      tideStatus: 'Low Tide',
    },
    hazards: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'bean-hollow',
    name: 'Bean Hollow State Beach',
    region: 'South',
    coordinates: { lat: 37.2274, lng: -122.4113 },
    flagStatus: 'green',
    conditions: {
      waveHeight: 3.0,
      windSpeed: 9,
      windDirection: 'NW',
      waterTemp: 55,
      airTemp: 62,
      uvIndex: 6,
      tideStatus: 'Rising',
    },
    hazards: [],
    advisory: 'Popular tidepooling location. Watch for sneaker waves near rocks.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'pebble-beach',
    name: 'Pebble Beach',
    nickname: 'Crescent Beach',
    region: 'North',
    coordinates: { lat: 37.6089, lng: -122.4996 },
    flagStatus: 'green',
    conditions: {
      waveHeight: 3.5,
      windSpeed: 10,
      windDirection: 'W',
      waterTemp: 54,
      airTemp: 61,
      uvIndex: 7,
      tideStatus: 'Falling',
    },
    hazards: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'pillar-point',
    name: 'Pillar Point Harbor Beach',
    region: 'Central',
    coordinates: { lat: 37.4964, lng: -122.4821 },
    flagStatus: 'green',
    conditions: {
      waveHeight: 2.0,
      windSpeed: 7,
      windDirection: 'W',
      waterTemp: 56,
      airTemp: 63,
      uvIndex: 6,
      tideStatus: 'Low Tide',
    },
    hazards: [],
    advisory: 'Protected harbor area. Calmer conditions, popular with families.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'martins-beach',
    name: 'Martins Beach',
    region: 'Central',
    coordinates: { lat: 37.3687, lng: -122.4195 },
    flagStatus: 'yellow',
    conditions: {
      waveHeight: 4.0,
      windSpeed: 11,
      windDirection: 'NW',
      waterTemp: 56,
      airTemp: 63,
      uvIndex: 7,
      tideStatus: 'Rising',
    },
    hazards: ['rip-currents'],
    advisory: 'Private beach with access fee. Check tide schedules before visiting.',
    lastUpdated: new Date().toISOString(),
  },
];
