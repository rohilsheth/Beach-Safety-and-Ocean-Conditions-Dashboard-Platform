/**
 * Beach Data API Route
 *
 * GET /api/beaches - Returns all beach data with live conditions
 * Aggregates data from NOAA, NWS, Open-Meteo, and EPA
 */

import { NextResponse } from 'next/server';
import { getCachedBeachData } from '@/lib/api/aggregator';

export const dynamic = 'force-dynamic'; // Disable static generation
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    const beaches = await getCachedBeachData();

    return NextResponse.json({
      success: true,
      data: beaches,
      timestamp: new Date().toISOString(),
      sources: {
        buoy: 'NOAA NDBC (46012 Half Moon Bay, 46026 San Francisco)',
        alerts: 'National Weather Service (CAZ509)',
        weather: 'Open-Meteo API',
        waterQuality: 'EPA BEACON',
      },
    });
  } catch (error) {
    console.error('Error in /api/beaches:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch beach data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
