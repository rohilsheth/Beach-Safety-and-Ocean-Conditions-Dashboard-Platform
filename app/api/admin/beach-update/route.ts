import { NextResponse } from 'next/server';
import { AdminUpdate, FlagStatus, HazardType } from '@/lib/types';
import fs from 'fs';
import path from 'path';

const ADMIN_UPDATES_FILE = path.join(process.cwd(), 'data', 'admin-updates.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read admin updates from file
function readAdminUpdates(): AdminUpdate[] {
  try {
    ensureDataDir();
    if (fs.existsSync(ADMIN_UPDATES_FILE)) {
      const data = fs.readFileSync(ADMIN_UPDATES_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading admin updates:', error);
    return [];
  }
}

// Write admin updates to file
function writeAdminUpdates(updates: AdminUpdate[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(ADMIN_UPDATES_FILE, JSON.stringify(updates, null, 2));
  } catch (error) {
    console.error('Error writing admin updates:', error);
  }
}

// GET - Retrieve all admin updates
export async function GET() {
  try {
    const updates = readAdminUpdates();
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
  try {
    const body = await request.json();
    const updates = readAdminUpdates();

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

    writeAdminUpdates(updates);

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
  try {
    const { searchParams } = new URL(request.url);
    const beachId = searchParams.get('beachId');

    if (!beachId) {
      return NextResponse.json(
        { success: false, error: 'beachId is required' },
        { status: 400 }
      );
    }

    const updates = readAdminUpdates();

    // Remove all updates for this specific beach
    const filteredUpdates = updates.filter((update) => update.beachId !== beachId);

    writeAdminUpdates(filteredUpdates);

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
