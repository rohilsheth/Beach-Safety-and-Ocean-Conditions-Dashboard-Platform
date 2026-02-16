/**
 * NOAA CO-OPS Tides & Currents API Integration
 *
 * API Base: https://api.tidesandcurrents.noaa.gov/api/prod/datagetter
 * Coverage: Specific tide stations (beach-level data)
 * Update Frequency: 6-minute intervals
 * Docs: https://api.tidesandcurrents.noaa.gov/api/prod/
 * Note: Free, no API key required
 */

export interface TideStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface TidePrediction {
  time: string; // ISO format
  height: number; // feet
  type: 'H' | 'L'; // High or Low
}

export interface TideData {
  stationId: string;
  stationName: string;
  currentStatus: string; // "High Tide", "Low Tide", "Rising", "Falling"
  currentHeight: number | null; // feet
  nextTide: {
    type: 'H' | 'L';
    time: string;
    height: number;
  } | null;
  predictions: TidePrediction[];
}

/**
 * NOAA CO-OPS Tide Stations for San Mateo County
 * Mapped by geographic location for accurate beach-level data
 */
const TIDE_STATIONS: Record<string, TideStation> = {
  PILLAR_POINT: {
    id: '9414131',
    name: 'Pillar Point Harbor, Half Moon Bay',
    lat: 37.5025,
    lng: -122.4822,
  },
  SAN_FRANCISCO: {
    id: '9414290',
    name: 'San Francisco',
    lat: 37.8063,
    lng: -122.4659,
  },
  MONTEREY: {
    id: '9413450',
    name: 'Monterey',
    lat: 36.6089,
    lng: -121.8914,
  },
};

/**
 * Select the nearest tide station for a given beach
 */
export function getNearestTideStation(beachLat: number): TideStation {
  // Northern beaches (above 37.6°N) -> San Francisco
  if (beachLat > 37.6) {
    return TIDE_STATIONS.SAN_FRANCISCO;
  }

  // Southern beaches (below 37.4°N) -> Monterey
  if (beachLat < 37.4) {
    return TIDE_STATIONS.MONTEREY;
  }

  // Central beaches (Half Moon Bay area) -> Pillar Point
  return TIDE_STATIONS.PILLAR_POINT;
}

/**
 * Fetch tide predictions from NOAA CO-OPS API
 */
export async function fetchTidePredictions(
  stationId: string
): Promise<TidePrediction[]> {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const beginDate = today.toISOString().split('T')[0].replace(/-/g, '');
    const endDate = tomorrow.toISOString().split('T')[0].replace(/-/g, '');

    const params = new URLSearchParams({
      product: 'predictions',
      application: 'NOS.COOPS.TAC.WL',
      begin_date: beginDate,
      end_date: endDate,
      datum: 'MLLW', // Mean Lower Low Water
      station: stationId,
      time_zone: 'lst_ldt', // Local Standard/Local Daylight Time
      units: 'english', // feet
      interval: 'hilo', // High/Low only
      format: 'json',
    });

    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${params}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('NOAA CO-OPS tide fetch failed:', response.status);
      return [];
    }

    const data = await response.json();

    if (!data.predictions || data.predictions.length === 0) {
      return [];
    }

    return data.predictions.map((p: any) => ({
      time: p.t,
      height: parseFloat(p.v),
      type: p.type as 'H' | 'L',
    }));
  } catch (error) {
    console.error('Error fetching NOAA CO-OPS tide predictions:', error);
    return [];
  }
}

/**
 * Determine current tide status based on predictions
 */
function getCurrentTideStatus(predictions: TidePrediction[]): {
  status: string;
  currentHeight: number | null;
  nextTide: { type: 'H' | 'L'; time: string; height: number } | null;
} {
  if (predictions.length === 0) {
    return { status: 'Unknown', currentHeight: null, nextTide: null };
  }

  const now = new Date();
  const currentTime = now.getTime();

  // Find the previous and next tide events
  let prevTide: TidePrediction | null = null;
  let nextTide: TidePrediction | null = null;

  for (let i = 0; i < predictions.length; i++) {
    const tideTime = new Date(predictions[i].time).getTime();

    if (tideTime <= currentTime) {
      prevTide = predictions[i];
    } else {
      nextTide = predictions[i];
      break;
    }
  }

  if (!prevTide || !nextTide) {
    return {
      status: 'Unknown',
      currentHeight: prevTide?.height || null,
      nextTide: nextTide
        ? { type: nextTide.type, time: nextTide.time, height: nextTide.height }
        : null,
    };
  }

  // Determine status based on previous and next tide
  let status: string;
  if (prevTide.type === 'L' && nextTide.type === 'H') {
    status = 'Rising';
  } else if (prevTide.type === 'H' && nextTide.type === 'L') {
    status = 'Falling';
  } else if (prevTide.type === 'H') {
    // Just passed high tide
    const timeSinceHigh = (currentTime - new Date(prevTide.time).getTime()) / 1000 / 60; // minutes
    status = timeSinceHigh < 30 ? 'High Tide' : 'Falling';
  } else {
    // Just passed low tide
    const timeSinceLow = (currentTime - new Date(prevTide.time).getTime()) / 1000 / 60; // minutes
    status = timeSinceLow < 30 ? 'Low Tide' : 'Rising';
  }

  // Estimate current height (linear interpolation)
  const prevTime = new Date(prevTide.time).getTime();
  const nextTime = new Date(nextTide.time).getTime();
  const progress = (currentTime - prevTime) / (nextTime - prevTime);
  const currentHeight =
    prevTide.height + (nextTide.height - prevTide.height) * progress;

  return {
    status,
    currentHeight: Math.round(currentHeight * 10) / 10,
    nextTide: {
      type: nextTide.type,
      time: nextTide.time,
      height: nextTide.height,
    },
  };
}

/**
 * Get complete tide data for a beach location
 */
export async function getTideData(beachLat: number): Promise<TideData | null> {
  try {
    const station = getNearestTideStation(beachLat);
    const predictions = await fetchTidePredictions(station.id);

    if (predictions.length === 0) {
      return null;
    }

    const { status, currentHeight, nextTide } = getCurrentTideStatus(predictions);

    return {
      stationId: station.id,
      stationName: station.name,
      currentStatus: status,
      currentHeight,
      nextTide,
      predictions: predictions.slice(0, 8), // Next 4 tides (2 days)
    };
  } catch (error) {
    console.error('Error getting tide data:', error);
    return null;
  }
}
