import { NextResponse } from 'next/server';
import { AnalyticsEvent, AnalyticsEventType } from '@/lib/analytics';
import fs from 'fs';
import path from 'path';

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics-events.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read analytics events from file
function readAnalyticsEvents(): AnalyticsEvent[] {
  try {
    ensureDataDir();
    if (fs.existsSync(ANALYTICS_FILE)) {
      const data = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading analytics:', error);
    return [];
  }
}

// Write analytics events to file
function writeAnalyticsEvents(events: AnalyticsEvent[]) {
  try {
    ensureDataDir();
    // Keep only last 10000 events to prevent file from growing too large
    const trimmedEvents = events.slice(-10000);
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(trimmedEvents, null, 2));
  } catch (error) {
    console.error('Error writing analytics:', error);
  }
}

// POST - Track an analytics event
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const events = readAnalyticsEvents();

    const newEvent: AnalyticsEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: body.type as AnalyticsEventType,
      timestamp: body.timestamp || new Date().toISOString(),
      data: body.data || {},
    };

    events.push(newEvent);
    writeAnalyticsEvents(events);

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
