/**
 * Google Analytics Platform Types
 *
 * GA4-specific types and interfaces
 */

import { PlatformConfig, MetricDefinition, DimensionDefinition } from '../types';

/**
 * Google Analytics platform configuration
 */
export const GA_CONFIG: PlatformConfig = {
  id: 'google-analytics',
  name: 'Google Analytics',
  provider: 'google',
  oauthScopes: [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
  apiVersion: 'v1',
};

/**
 * GA4 Run Report Request
 */
export interface GA4RunReportRequest {
  propertyId: string;
  dateRanges: Array<{ startDate: string; endDate: string }>;
  metrics: Array<{ name: string }>;
  dimensions?: Array<{ name: string }>;
  limit?: number;
  offset?: number;
}

/**
 * GA4 API Response (simplified)
 */
export interface GA4Response {
  dimensionHeaders?: Array<{ name: string }>;
  metricHeaders?: Array<{ name: string; type: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value: string }>;
    metricValues?: Array<{ value: string }>;
  }>;
  rowCount?: number;
}

/**
 * GA4 Property
 */
export interface GA4Property {
  name: string;
  propertyId: string;
  displayName: string;
  timeZone?: string;
  currencyCode?: string;
}

/**
 * Map user-friendly metric names to GA4 API names
 */
export const GA_METRIC_MAP: Record<string, string> = {
  // Traffic metrics
  sessions: 'sessions',
  users: 'activeUsers',
  pageviews: 'screenPageViews',
  bounce_rate: 'bounceRate',
  avg_session_duration: 'averageSessionDuration',

  // Engagement metrics
  engagement_rate: 'engagementRate',
  engaged_sessions: 'engagedSessions',
  events_per_session: 'eventsPerSession',
  engaged_sessions_per_user: 'engagedSessionsPerUser',

  // Conversion metrics
  conversions: 'conversions',
  conversion_rate: 'sessionConversionRate',
  total_revenue: 'totalRevenue',
  transactions: 'transactions',
  average_purchase_revenue: 'averagePurchaseRevenue',

  // User metrics
  new_users: 'newUsers',
  returning_users: 'returningUsers',
  total_users: 'totalUsers',
};

/**
 * Map user-friendly dimension names to GA4 API names
 */
export const GA_DIMENSION_MAP: Record<string, string> = {
  date: 'date',
  source: 'sessionSource',
  medium: 'sessionMedium',
  campaign: 'sessionCampaignName',
  country: 'country',
  city: 'city',
  device: 'deviceCategory',
  browser: 'browser',
  landing_page: 'landingPage',
  page_path: 'pagePath',
  page_title: 'pageTitle',
};

/**
 * Available GA4 metrics
 */
export const AVAILABLE_GA_METRICS: MetricDefinition[] = [
  // Traffic
  { id: 'sessions', name: 'Sessions', description: 'Total number of sessions', category: 'Traffic' },
  { id: 'users', name: 'Users', description: 'Total active users', category: 'Traffic' },
  { id: 'pageviews', name: 'Pageviews', description: 'Total page views', category: 'Traffic' },
  { id: 'bounce_rate', name: 'Bounce Rate', description: 'Percentage of single-page sessions', category: 'Traffic' },
  { id: 'avg_session_duration', name: 'Avg. Session Duration', description: 'Average time on site', category: 'Traffic' },

  // Engagement
  { id: 'engagement_rate', name: 'Engagement Rate', description: 'Percentage of engaged sessions', category: 'Engagement' },
  { id: 'engaged_sessions', name: 'Engaged Sessions', description: 'Sessions with engagement', category: 'Engagement' },
  { id: 'events_per_session', name: 'Events per Session', description: 'Average events per session', category: 'Engagement' },

  // Conversions
  { id: 'conversions', name: 'Conversions', description: 'Total conversion events', category: 'Conversions' },
  { id: 'conversion_rate', name: 'Conversion Rate', description: 'Percentage of converting sessions', category: 'Conversions' },
  { id: 'total_revenue', name: 'Revenue', description: 'Total revenue from conversions', category: 'Conversions' },
  { id: 'transactions', name: 'Transactions', description: 'Total e-commerce transactions', category: 'Conversions' },

  // Users
  { id: 'new_users', name: 'New Users', description: 'First-time visitors', category: 'Users' },
  { id: 'returning_users', name: 'Returning Users', description: 'Repeat visitors', category: 'Users' },
];

/**
 * Available GA4 dimensions
 */
export const AVAILABLE_GA_DIMENSIONS: DimensionDefinition[] = [
  { id: 'date', name: 'Date', description: 'Date of the session', category: 'Time' },
  { id: 'source', name: 'Source', description: 'Traffic source', category: 'Acquisition' },
  { id: 'medium', name: 'Medium', description: 'Traffic medium', category: 'Acquisition' },
  { id: 'campaign', name: 'Campaign', description: 'Campaign name', category: 'Acquisition' },
  { id: 'device', name: 'Device', description: 'Device category (mobile/desktop/tablet)', category: 'Technology' },
  { id: 'browser', name: 'Browser', description: 'Browser name', category: 'Technology' },
  { id: 'country', name: 'Country', description: 'User country', category: 'Geography' },
  { id: 'city', name: 'City', description: 'User city', category: 'Geography' },
  { id: 'landing_page', name: 'Landing Page', description: 'Entry page', category: 'Behavior' },
  { id: 'page_path', name: 'Page Path', description: 'Page URL path', category: 'Behavior' },
];
