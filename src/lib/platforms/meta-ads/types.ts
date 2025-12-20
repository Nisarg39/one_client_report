/**
 * Meta Ads Platform Types
 *
 * Facebook/Instagram Ads specific types and interfaces
 */

import { PlatformConfig, MetricDefinition, DimensionDefinition } from '../types';

/**
 * Meta Ads platform configuration
 */
export const META_CONFIG: PlatformConfig = {
  id: 'meta-ads',
  name: 'Meta Ads',
  provider: 'facebook',
  oauthScopes: [
    'ads_read',
    'ads_management',
    'business_management',
  ],
  apiVersion: 'v18.0',
};

/**
 * Meta Insights Request
 */
export interface MetaInsightsRequest {
  adAccountId: string;
  datePreset?: 'today' | 'yesterday' | 'last_7d' | 'last_30d' | 'this_month' | 'last_month';
  timeRange?: { since: string; until: string };
  fields: string[];
  level?: 'account' | 'campaign' | 'adset' | 'ad';
  limit?: number;
  filtering?: Array<{ field: string; operator: string; value: any }>;
  breakdowns?: string[];
}

/**
 * Meta API Response
 */
export interface MetaInsightsResponse {
  data?: Array<{
    date_start?: string;
    date_stop?: string;
    [key: string]: any;
  }>;
  paging?: {
    cursors?: {
      before?: string;
      after?: string;
    };
    next?: string;
  };
}

/**
 * Meta Ad Account
 */
export interface MetaAdAccount {
  id: string;
  account_id: string;
  name: string;
  account_status: number;
  currency: string;
}

/**
 * Map user-friendly metric names to Meta API names
 */
export const META_METRIC_MAP: Record<string, string> = {
  // Core metrics
  impressions: 'impressions',
  clicks: 'clicks',
  spend: 'spend',
  reach: 'reach',
  frequency: 'frequency',

  // Performance metrics
  ctr: 'ctr',
  cpc: 'cpc',
  cpm: 'cpm',
  cpp: 'cpp',

  // Conversion metrics
  conversions: 'conversions',
  cost_per_conversion: 'cost_per_conversion',
  conversion_rate: 'conversion_rate',
  roas: 'roas',

  // Engagement metrics
  engagement: 'engagement',
  post_engagement: 'post_engagement',
  video_views: 'video_views',
  video_view_rate: 'video_view_rate',

  // Link clicks
  link_clicks: 'link_clicks',
  outbound_clicks: 'outbound_clicks',
  inline_link_clicks: 'inline_link_clicks',

  // Video
  video_p25_watched_actions: 'video_p25_watched_actions',
  video_p50_watched_actions: 'video_p50_watched_actions',
  video_p100_watched_actions: 'video_p100_watched_actions',

  // Actions & Cost
  actions: 'actions',
  cost_per_action_type: 'cost_per_action_type',
};

/**
 * Map user-friendly dimension names to Meta API names
 */
export const META_DIMENSION_MAP: Record<string, string> = {
  date: 'date_start',
  campaign_id: 'campaign_id',
  campaign_name: 'campaign_name',
  adset_id: 'adset_id',
  adset_name: 'adset_name',
  ad_id: 'ad_id',
  ad_name: 'ad_name',
};

/**
 * Available Meta Ads metrics
 */
export const AVAILABLE_META_METRICS: MetricDefinition[] = [
  // Core metrics
  { id: 'impressions', name: 'Impressions', description: 'Total ad impressions', category: 'Delivery' },
  { id: 'clicks', name: 'Clicks', description: 'Total link clicks', category: 'Engagement' },
  { id: 'spend', name: 'Spend', description: 'Total amount spent', category: 'Cost' },
  { id: 'reach', name: 'Reach', description: 'Unique users reached', category: 'Delivery' },
  { id: 'frequency', name: 'Frequency', description: 'Average impressions per user', category: 'Delivery' },

  // Performance metrics
  { id: 'ctr', name: 'CTR', description: 'Click-through rate', category: 'Performance' },
  { id: 'cpc', name: 'CPC', description: 'Cost per click', category: 'Cost' },
  { id: 'cpm', name: 'CPM', description: 'Cost per 1000 impressions', category: 'Cost' },

  // Conversions
  { id: 'conversions', name: 'Conversions', description: 'Total conversions', category: 'Conversions' },
  { id: 'cost_per_conversion', name: 'Cost per Conversion', description: 'Average cost per conversion', category: 'Cost' },
  { id: 'roas', name: 'ROAS', description: 'Return on ad spend', category: 'Conversions' },
  { id: 'purchases', name: 'Purchases', description: 'Total purchases', category: 'Conversions' },
  { id: 'leads', name: 'Leads', description: 'Total leads', category: 'Conversions' },
  { id: 'cost_per_purchase', name: 'Cost per Purchase', description: 'Average cost per purchase', category: 'Cost' },
  { id: 'cost_per_lead', name: 'Cost per Lead', description: 'Average cost per lead', category: 'Cost' },

  // Engagement
  { id: 'link_clicks', name: 'Link Clicks', description: 'Clicks on links', category: 'Engagement' },
  { id: 'inline_link_clicks', name: 'Link Clicks (Inline)', description: 'Clicks on links to destination', category: 'Engagement' },
  { id: 'video_views', name: 'Video Views', description: 'Video views', category: 'Engagement' },
  { id: 'video_p100_watched_actions', name: 'Video 100% Watched', description: 'Video played to 100%', category: 'Engagement' },
];

/**
 * Available Meta Ads dimensions
 */
export const AVAILABLE_META_DIMENSIONS: DimensionDefinition[] = [
  { id: 'date', name: 'Date', description: 'Date of the ad delivery', category: 'Time' },
  { id: 'campaign_name', name: 'Campaign', description: 'Campaign name', category: 'Structure' },
  { id: 'adset_name', name: 'Ad Set', description: 'Ad set name', category: 'Structure' },
  { id: 'ad_name', name: 'Ad', description: 'Ad name', category: 'Structure' },
];
