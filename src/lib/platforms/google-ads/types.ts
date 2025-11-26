/**
 * Google Ads API Type Definitions
 *
 * Type definitions for Google Ads API v14
 */

import { PlatformConfig, MetricDefinition } from '../types';

/**
 * Google Ads Platform Configuration
 */
export const GOOGLE_ADS_CONFIG: PlatformConfig = {
  id: 'google-ads',
  name: 'Google Ads',
  provider: 'google',
  oauthScopes: [
    'https://www.googleapis.com/auth/adwords',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
  apiVersion: 'v18', // Updated to latest stable version
};

/**
 * Map user-friendly metric names to Google Ads API names
 */
export const GOOGLE_ADS_METRIC_MAP: Record<string, string> = {
  // Basic Metrics
  impressions: 'metrics.impressions',
  clicks: 'metrics.clicks',
  cost: 'metrics.cost_micros',
  conversions: 'metrics.conversions',
  conversion_value: 'metrics.conversions_value',

  // Performance Metrics
  ctr: 'metrics.ctr',
  average_cpc: 'metrics.average_cpc',
  average_cpm: 'metrics.average_cpm',
  cost_per_conversion: 'metrics.cost_per_conversion',

  // Engagement Metrics
  interactions: 'metrics.interactions',
  interaction_rate: 'metrics.interaction_rate',
  engagement_rate: 'metrics.engagement_rate',

  // Video Metrics
  video_views: 'metrics.video_views',
  video_view_rate: 'metrics.video_view_rate',
  average_cpv: 'metrics.average_cpv',

  // Search Metrics
  search_impression_share: 'metrics.search_impression_share',
  search_rank_lost_impression_share: 'metrics.search_rank_lost_impression_share',
  quality_score: 'metrics.quality_score',

  // Shopping Metrics
  all_conversions: 'metrics.all_conversions',
  all_conversions_value: 'metrics.all_conversions_value',
};

/**
 * Map user-friendly dimension names to Google Ads API names
 */
export const GOOGLE_ADS_DIMENSION_MAP: Record<string, string> = {
  campaign_id: 'campaign.id',
  campaign_name: 'campaign.name',
  campaign_status: 'campaign.status',
  ad_group_id: 'ad_group.id',
  ad_group_name: 'ad_group.name',
  ad_id: 'ad_group_ad.ad.id',
  ad_name: 'ad_group_ad.ad.name',
  keyword: 'ad_group_criterion.keyword.text',
  device: 'segments.device',
  date: 'segments.date',
};

/**
 * Available Google Ads Metrics
 */
export const AVAILABLE_GOOGLE_ADS_METRICS: MetricDefinition[] = [
  // Traffic Metrics
  {
    id: 'impressions',
    name: 'Impressions',
    description: 'Number of times your ads were shown',
    category: 'Traffic',
  },
  {
    id: 'clicks',
    name: 'Clicks',
    description: 'Number of clicks on your ads',
    category: 'Traffic',
  },
  {
    id: 'ctr',
    name: 'Click-Through Rate',
    description: 'Percentage of impressions that resulted in clicks',
    category: 'Traffic',
  },

  // Cost Metrics
  {
    id: 'cost',
    name: 'Cost',
    description: 'Total cost of ads',
    category: 'Cost',
  },
  {
    id: 'average_cpc',
    name: 'Average CPC',
    description: 'Average cost per click',
    category: 'Cost',
  },
  {
    id: 'average_cpm',
    name: 'Average CPM',
    description: 'Average cost per thousand impressions',
    category: 'Cost',
  },

  // Conversion Metrics
  {
    id: 'conversions',
    name: 'Conversions',
    description: 'Number of conversions',
    category: 'Conversions',
  },
  {
    id: 'conversion_value',
    name: 'Conversion Value',
    description: 'Total value of conversions',
    category: 'Conversions',
  },
  {
    id: 'cost_per_conversion',
    name: 'Cost Per Conversion',
    description: 'Average cost per conversion',
    category: 'Conversions',
  },

  // Engagement Metrics
  {
    id: 'interactions',
    name: 'Interactions',
    description: 'Number of interactions with your ads',
    category: 'Engagement',
  },
  {
    id: 'interaction_rate',
    name: 'Interaction Rate',
    description: 'Percentage of impressions that resulted in interactions',
    category: 'Engagement',
  },
];

/**
 * Google Ads Query Request
 */
export interface GoogleAdsQueryRequest {
  customerId: string;
  query: string;
}

/**
 * Google Ads Query Response
 */
export interface GoogleAdsQueryResponse {
  results: Array<{
    campaign?: {
      resourceName?: string;
      id: string;
      name: string;
      status: string;
      advertisingChannelType?: string;
      biddingStrategyType?: string;
      [key: string]: any;
    };
    adGroup?: {
      id: string;
      name: string;
    };
    metrics?: {
      impressions?: string;
      clicks?: string;
      cost_micros?: string;
      conversions?: number;
      conversions_value?: number;
      ctr?: number;
      average_cpc?: string;
      [key: string]: any;
    };
    segments?: {
      date?: string;
      device?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }>;
  fieldMask: string;
  nextPageToken?: string;
}

/**
 * Google Ads Customer
 */
export interface GoogleAdsCustomer {
  resourceName: string;
  id: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  manager: boolean;
}

/**
 * Google Ads Campaign
 */
export interface GoogleAdsCampaign {
  resourceName: string;
  id: string;
  name: string;
  status: string;
  advertisingChannelType: string;
  biddingStrategyType?: string;
}

/**
 * Date Range for Google Ads queries
 */
export interface GoogleAdsDateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
