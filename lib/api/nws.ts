/**
 * National Weather Service (NWS) API Integration
 *
 * API Base: https://api.weather.gov
 * Coverage: San Mateo County (CAZ509 - San Francisco Peninsula Coast)
 * Update Frequency: Real-time for alerts, hourly for forecasts
 * Docs: https://www.weather.gov/documentation/services-web-api
 */

import { NWSAlert } from './types';

const NWS_BASE_URL = 'https://api.weather.gov';
const SAN_MATEO_COUNTY_ZONE = 'CAZ509'; // San Francisco Peninsula Coast

/**
 * Fetch active weather alerts for San Mateo County coast
 */
export async function fetchNWSAlerts(): Promise<NWSAlert[]> {
  try {
    const url = `${NWS_BASE_URL}/alerts/active/zone/${SAN_MATEO_COUNTY_ZONE}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': '(Beach Safety Dashboard, contact@beachsafety.local)',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error('NWS alerts fetch failed:', response.status);
      return [];
    }

    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    return data.features.map((feature: any) => ({
      id: feature.id,
      event: feature.properties.event,
      severity: feature.properties.severity,
      certainty: feature.properties.certainty,
      urgency: feature.properties.urgency,
      headline: feature.properties.headline,
      description: feature.properties.description,
      instruction: feature.properties.instruction,
      areaDesc: feature.properties.areaDesc,
      onset: feature.properties.onset,
      expires: feature.properties.expires,
    }));
  } catch (error) {
    console.error('Error fetching NWS alerts:', error);
    return [];
  }
}

/**
 * Get marine forecast for specific coordinates
 */
export async function fetchMarineForecast(lat: number, lng: number): Promise<any> {
  try {
    // First, get the grid point
    const pointUrl = `${NWS_BASE_URL}/points/${lat},${lng}`;
    const pointResponse = await fetch(pointUrl, {
      headers: {
        'User-Agent': '(Beach Safety Dashboard, contact@beachsafety.local)',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!pointResponse.ok) {
      console.error('NWS point fetch failed:', pointResponse.status);
      return null;
    }

    const pointData = await pointResponse.json();
    const forecastUrl = pointData.properties.forecast;

    // Get the forecast
    const forecastResponse = await fetch(forecastUrl, {
      headers: {
        'User-Agent': '(Beach Safety Dashboard, contact@beachsafety.local)',
      },
      next: { revalidate: 3600 },
    });

    if (!forecastResponse.ok) {
      console.error('NWS forecast fetch failed:', forecastResponse.status);
      return null;
    }

    return await forecastResponse.json();
  } catch (error) {
    console.error('Error fetching NWS marine forecast:', error);
    return null;
  }
}

/**
 * Determine if an alert is relevant to beach safety
 */
export function isBeachSafetyAlert(alert: NWSAlert): boolean {
  const beachRelatedEvents = [
    'Rip Current Statement',
    'High Surf Advisory',
    'High Surf Warning',
    'Beach Hazards Statement',
    'Coastal Flood Advisory',
    'Coastal Flood Warning',
    'Small Craft Advisory',
    'Gale Warning',
    'Storm Warning',
  ];

  return beachRelatedEvents.some((event) =>
    alert.event.toLowerCase().includes(event.toLowerCase())
  );
}

/**
 * Map NWS alert severity to our flag status
 */
export function alertToFlagStatus(alerts: NWSAlert[]): 'green' | 'yellow' | 'red' {
  if (alerts.length === 0) return 'green';

  const hasSevere = alerts.some(
    (alert) => alert.severity === 'Severe' || alert.severity === 'Extreme'
  );
  const hasModerate = alerts.some((alert) => alert.severity === 'Moderate');

  if (hasSevere) return 'red';
  if (hasModerate) return 'yellow';
  return 'green';
}
