import { NextResponse } from 'next/server';
import { AnalyticsEvent } from '@/lib/analytics';
import {
  isAdminAuthenticated,
  unauthorizedAdminResponse,
} from '@/lib/server/adminAuth';
import fs from 'fs';
import path from 'path';

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics-events.json');

// Read analytics events from file
function readAnalyticsEvents(): AnalyticsEvent[] {
  try {
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

// Calculate analytics statistics
function calculateStats(events: AnalyticsEvent[], days: number = 7) {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Filter events within the time range
  const recentEvents = events.filter(
    (event) => new Date(event.timestamp) >= startDate
  );

  // Total page views
  const pageViews = recentEvents.filter((e) => e.type === 'page_view').length;

  // Most visited beaches
  const beachViews = recentEvents.filter((e) => e.type === 'beach_view');
  const beachCounts: Record<string, { name: string; count: number }> = {};

  beachViews.forEach((event) => {
    const beachId = event.data.beachId;
    const beachName = event.data.beachName || beachId;

    if (!beachCounts[beachId]) {
      beachCounts[beachId] = { name: beachName, count: 0 };
    }
    beachCounts[beachId].count++;
  });

  const topBeaches = Object.entries(beachCounts)
    .map(([id, data]) => ({
      beachId: id,
      beachName: data.name,
      views: data.count,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Alert interactions
  const alertClicks = recentEvents.filter((e) => e.type === 'alert_click').length;
  const alertClickRate = beachViews.length > 0
    ? ((alertClicks / beachViews.length) * 100).toFixed(1)
    : '0.0';

  // Daily breakdown
  const dailyBreakdown: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    dailyBreakdown[dateStr] = 0;
  }

  recentEvents.forEach((event) => {
    const dateStr = event.timestamp.split('T')[0];
    if (dailyBreakdown[dateStr] !== undefined) {
      dailyBreakdown[dateStr]++;
    }
  });

  const dailyStats = Object.entries(dailyBreakdown)
    .map(([date, count]) => ({ date, count }))
    .reverse();

  // Event type breakdown
  const eventTypes: Record<string, number> = {};
  recentEvents.forEach((event) => {
    eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
  });

  return {
    totalEvents: recentEvents.length,
    pageViews,
    beachViews: beachViews.length,
    alertClicks,
    alertClickRate: `${alertClickRate}%`,
    topBeaches,
    dailyStats,
    eventTypes,
    timeRange: {
      start: startDate.toISOString(),
      end: now.toISOString(),
      days,
    },
  };
}

// GET - Retrieve analytics statistics
export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return unauthorizedAdminResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const rawDays = parseInt(searchParams.get('days') || '7', 10);
    const days = [7, 30, 90].includes(rawDays) ? rawDays : 7;

    const events = readAnalyticsEvents();
    const stats = calculateStats(events, days);

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate analytics' },
      { status: 500 }
    );
  }
}
