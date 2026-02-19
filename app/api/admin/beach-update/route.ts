import { NextResponse } from 'next/server';
import { AdminUpdate, FlagStatus, HazardType } from '@/lib/types';
import {
  isAdminAuthenticated,
  unauthorizedAdminResponse,
} from '@/lib/server/adminAuth';
import { invalidateBeachDataCache } from '@/lib/api/aggregator';
import {
  readAdminUpdates,
  writeAdminUpdates,
} from '@/lib/server/persistence';

// GET - Retrieve all admin updates
export async function GET() {
  if (!isAdminAuthenticated()) {
    return unauthorizedAdminResponse();
  }

  try {
    const updates = await readAdminUpdates<AdminUpdate>();
    return NextResponse.json({
      success: true,
      data: updates,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching admin updates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin updates' },
      { status: 500 }
    );
  }
}

// POST - Save admin beach update
export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return unauthorizedAdminResponse();
  }

  try {
    const body = await request.json();
    const updates = await readAdminUpdates<AdminUpdate>();

    const newUpdate: AdminUpdate = {
      beachId: body.beachId,
      timestamp: new Date().toISOString(),
      updatedBy: body.updatedBy || 'County Staff',
      changes: {
        flagStatus: body.flagStatus as FlagStatus | undefined,
        advisory: body.advisory || undefined,
        hazards: body.hazards as HazardType[] | undefined,
      },
    };

    // Add new update to the beginning of the array (most recent first)
    updates.unshift(newUpdate);

    // Keep only the last 100 updates
    if (updates.length > 100) {
      updates.splice(100);
    }

    await writeAdminUpdates<AdminUpdate>(updates);
    invalidateBeachDataCache();

    return NextResponse.json({
      success: true,
      data: newUpdate,
      message: 'Beach update saved successfully',
    });
  } catch (error) {
    console.error('Error saving admin update:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save update' },
      { status: 500 }
    );
  }
}

// DELETE - Remove admin override for a specific beach (reset to automatic)
export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) {
    return unauthorizedAdminResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const beachId = searchParams.get('beachId');

    if (!beachId) {
      return NextResponse.json(
        { success: false, error: 'beachId is required' },
        { status: 400 }
      );
    }

    const updates = await readAdminUpdates<AdminUpdate>();

    // Remove all updates for this specific beach
    const filteredUpdates = updates.filter((update) => update.beachId !== beachId);

    await writeAdminUpdates<AdminUpdate>(filteredUpdates);
    invalidateBeachDataCache();

    return NextResponse.json({
      success: true,
      message: `Reset ${beachId} to automatic data`,
      removedCount: updates.length - filteredUpdates.length,
    });
  } catch (error) {
    console.error('Error removing admin override:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove override' },
      { status: 500 }
    );
  }
}
