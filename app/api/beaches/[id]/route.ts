/**
 * Individual Beach Data API Route
 *
 * GET /api/beaches/[id] - Returns specific beach data
 */

import { NextResponse } from 'next/server';
import { getBeachById } from '@/lib/api/aggregator';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const beach = await getBeachById(params.id);

    if (!beach) {
      return NextResponse.json(
        {
          success: false,
          error: 'Beach not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: beach,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error fetching beach ${params.id}:`, error);

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
