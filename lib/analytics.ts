/**
 * Analytics Tracking System
 *
 * Tracks user engagement metrics as required by RFP:
 * - User engagement (page views, session duration)
 * - Most-visited beach pages
 * - Alert click-through rates
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'beach_view'
  | 'alert_click'
  | 'flag_view'
  | 'map_interaction'
  | 'language_change';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  data: Record<string, any>;
}

/**
 * Track an analytics event
 */
export async function trackEvent(
  type: AnalyticsEventType,
  data: Record<string, any> = {}
): Promise<void> {
  try {
    // Send to analytics API
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string): void {
  trackEvent('page_view', { path });
}

/**
 * Track beach detail view
 */
export function trackBeachView(beachId: string, beachName: string): void {
  trackEvent('beach_view', { beachId, beachName });
}

/**
 * Track alert click
 */
export function trackAlertClick(alertId: string, alertTitle: string): void {
  trackEvent('alert_click', { alertId, alertTitle });
}

/**
 * Track flag status view
 */
export function trackFlagView(beachId: string, flagStatus: string): void {
  trackEvent('flag_view', { beachId, flagStatus });
}

/**
 * Track map interaction
 */
export function trackMapInteraction(action: string, beachId?: string): void {
  trackEvent('map_interaction', { action, beachId });
}

/**
 * Track language change
 */
export function trackLanguageChange(from: string, to: string): void {
  trackEvent('language_change', { from, to });
}
