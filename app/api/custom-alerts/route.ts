import { NextResponse } from 'next/server';
import { CustomAlert } from '@/lib/types';
import fs from 'fs';
import path from 'path';

const ALERTS_FILE = path.join(process.cwd(), 'data', 'custom-alerts.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read alerts from file
function readAlerts(): CustomAlert[] {
  try {
    ensureDataDir();
    if (fs.existsSync(ALERTS_FILE)) {
      const data = fs.readFileSync(ALERTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading alerts:', error);
    return [];
  }
}

// Write alerts to file
function writeAlerts(alerts: CustomAlert[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(alerts, null, 2));
  } catch (error) {
    console.error('Error writing alerts:', error);
  }
}

// GET - Retrieve all active custom alerts
export async function GET() {
  try {
    const alerts = readAlerts();
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
  try {
    const body = await request.json();
    const alerts = readAlerts();

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
    writeAlerts(alerts);

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
  try {
    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      return NextResponse.json(
        { success: false, error: 'Alert ID required' },
        { status: 400 }
      );
    }

    const alerts = readAlerts();
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, isActive: false } : alert
    );

    writeAlerts(updatedAlerts);

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
