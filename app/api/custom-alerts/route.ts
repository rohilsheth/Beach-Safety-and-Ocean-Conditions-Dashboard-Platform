import { NextResponse } from 'next/server';
import { CustomAlert } from '@/lib/types';
import {
  isAdminAuthenticated,
  unauthorizedAdminResponse,
} from '@/lib/server/adminAuth';
import {
  readCustomAlerts,
  writeCustomAlerts,
} from '@/lib/server/persistence';

// GET - Retrieve all active custom alerts
export async function GET() {
  try {
    const alerts = await readCustomAlerts<CustomAlert>();
    const now = new Date().toISOString();

    // Filter active and non-expired alerts
    const activeAlerts = alerts.filter(
      (alert) => alert.isActive && alert.expiresAt > now
    );

    return NextResponse.json({
      success: true,
      data: activeAlerts,
      timestamp: now,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// POST - Create a new custom alert
export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return unauthorizedAdminResponse();
  }

  try {
    const body = await request.json();
    const alerts = await readCustomAlerts<CustomAlert>();

    const newAlert: CustomAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      beachId: body.beachId || 'all',
      title: body.title,
      message: body.message,
      priority: body.priority || 'medium',
      createdBy: body.createdBy || 'County Staff',
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default 24 hours
      isActive: true,
      language: body.language || 'both',
    };

    alerts.push(newAlert);
    await writeCustomAlerts<CustomAlert>(alerts);

    return NextResponse.json({
      success: true,
      data: newAlert,
      message: 'Alert created successfully',
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate or delete an alert
export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) {
    return unauthorizedAdminResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      return NextResponse.json(
        { success: false, error: 'Alert ID required' },
        { status: 400 }
      );
    }

    const alerts = await readCustomAlerts<CustomAlert>();
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, isActive: false } : alert
    );

    await writeCustomAlerts<CustomAlert>(updatedAlerts);

    return NextResponse.json({
      success: true,
      message: 'Alert deactivated successfully',
    });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}
