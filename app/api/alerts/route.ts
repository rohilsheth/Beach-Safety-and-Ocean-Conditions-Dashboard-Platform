/**
 * Weather Alerts API Route
 *
 * GET /api/alerts - Returns active NWS alerts for San Mateo County coast
 */

import { NextResponse } from 'next/server';
import { fetchNWSAlerts, isBeachSafetyAlert } from '@/lib/api/nws';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET() {
  try {
    const allAlerts = await fetchNWSAlerts();
    const beachAlerts = allAlerts.filter(isBeachSafetyAlert);

    return NextResponse.json({
      success: true,
      data: beachAlerts,
      count: beachAlerts.length,
      timestamp: new Date().toISOString(),
      source: 'National Weather Service (CAZ509)',
    });
  } catch (error) {
    console.error('Error in /api/alerts:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch alerts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
