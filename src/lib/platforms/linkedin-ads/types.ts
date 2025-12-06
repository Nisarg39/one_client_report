/**
 * LinkedIn Ads API Type Definitions
 *
 * Type definitions for LinkedIn Marketing API
 */

import { PlatformConfig, MetricDefinition } from '../types';

/**
 * LinkedIn Ads Platform Configuration
 */
export const LINKEDIN_ADS_CONFIG: PlatformConfig = {
  id: 'linkedin-ads',
  name: 'LinkedIn Ads',
  provider: 'linkedin',
  oauthScopes: [
    'r_ads',
    'r_ads_reporting',
    'r_organization_social',
    'rw_ads',
  ],
  apiVersion: '202411', // Use valid YYYYMM format (November 2024)
};

/**
 * Map user-friendly metric names to LinkedIn Ads API names
 */
export const LINKEDIN_ADS_METRIC_MAP: Record<string, string> = {
  // Basic Metrics
  impressions: 'impressions',
  clicks: 'clicks',
  cost: 'costInLocalCurrency',
  conversions: 'externalWebsiteConversions',

  // Performance Metrics
  ctr: 'clickThroughRate',
  average_cpc: 'averageCostPerClick',
  average_cpm: 'averageCostPerImpression',

  // Engagement Metrics
  likes: 'likes',
  comments: 'comments',
  shares: 'shares',
  follows: 'follows',
  engagement_rate: 'engagementRate',

  // Video Metrics
  video_views: 'videoViews',
  video_starts: 'videoStarts',
  video_completions: 'videoCompletions',
  video_view_rate: 'videoViewRate',

  // Lead Gen Metrics
  leads: 'leadGenerationMailContactInfoShares',
  lead_form_opens: 'leadFormOpens',
  cost_per_lead: 'costPerLead',

  // Conversion Metrics
  conversion_rate: 'conversionRate',
  cost_per_conversion: 'costPerConversion',
};

/**
 * Map user-friendly dimension names to LinkedIn Ads API names
 */
export const LINKEDIN_ADS_DIMENSION_MAP: Record<string, string> = {
  campaign_id: 'campaignId',
  campaign_name: 'campaignName',
  creative_id: 'creativeId',
  account_id: 'accountId',
  date: 'dateRange',
};

/**
 * Available LinkedIn Ads Metrics
 */
export const AVAILABLE_LINKEDIN_ADS_METRICS: MetricDefinition[] = [
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

  // Engagement Metrics
  {
    id: 'likes',
    name: 'Likes',
    description: 'Number of likes on your ads',
    category: 'Engagement',
  },
  {
    id: 'comments',
    name: 'Comments',
    description: 'Number of comments on your ads',
    category: 'Engagement',
  },
  {
    id: 'shares',
    name: 'Shares',
    description: 'Number of shares of your ads',
    category: 'Engagement',
  },
  {
    id: 'engagement_rate',
    name: 'Engagement Rate',
    description: 'Percentage of impressions that resulted in engagement',
    category: 'Engagement',
  },

  // Lead Gen Metrics
  {
    id: 'leads',
    name: 'Leads',
    description: 'Number of leads generated',
    category: 'Leads',
  },
  {
    id: 'cost_per_lead',
    name: 'Cost Per Lead',
    description: 'Average cost per lead',
    category: 'Leads',
  },

  // Conversion Metrics
  {
    id: 'conversions',
    name: 'Conversions',
    description: 'Number of conversions',
    category: 'Conversions',
  },
  {
    id: 'conversion_rate',
    name: 'Conversion Rate',
    description: 'Percentage of clicks that resulted in conversions',
    category: 'Conversions',
  },
];

/**
 * LinkedIn Ads Analytics Request
 */
export interface LinkedInAdsAnalyticsRequest {
  accounts: string[]; // Ad account URNs
  dateRange: {
    start: {
      year: number;
      month: number;
      day: number;
    };
    end: {
      year: number;
      month: number;
      day: number;
    };
  };
  timeGranularity: 'DAILY' | 'MONTHLY' | 'ALL';
  pivot: 'CAMPAIGN' | 'CREATIVE' | 'ACCOUNT';
  fields: string[];
}

/**
 * LinkedIn Ads Analytics Response
 */
export interface LinkedInAdsAnalyticsResponse {
  elements: Array<{
    dateRange?: {
      start: {
        year: number;
        month: number;
        day: number;
      };
      end: {
        year: number;
        month: number;
        day: number;
      };
    };
    pivotValue?: string; // Campaign/Creative/Account URN
    // Core metrics
    impressions?: number;
    clicks?: number;
    costInLocalCurrency?: number;
    // Engagement metrics
    totalEngagements?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    reactions?: number;
    follows?: number;
    companyPageClicks?: number;
    otherEngagements?: number;
    // Conversion metrics
    externalWebsiteConversions?: number;
    externalWebsitePostClickConversions?: number;
    externalWebsitePostViewConversions?: number;
    landingPageClicks?: number;
    // Lead metrics
    oneClickLeads?: number;
    qualifiedLeads?: number;
    oneClickLeadFormOpens?: number;
    // Video metrics
    videoStarts?: number;
    videoViews?: number;
    videoCompletions?: number;
    videoFirstQuartileCompletions?: number;
    videoMidpointCompletions?: number;
    videoThirdQuartileCompletions?: number;
    fullScreenPlays?: number;
    // Reach metrics
    approximateMemberReach?: number;
    averageDwellTime?: number;
    [key: string]: any;
  }>;
  paging?: {
    start: number;
    count: number;
    total: number;
  };
}

/**
 * LinkedIn Ad Account
 */
export interface LinkedInAdAccount {
  id: string;
  name: string;
  type: string;
  status: string;
  currency: string;
}

/**
 * LinkedIn Campaign
 */
export interface LinkedInCampaign {
  id: string;
  name: string;
  status: string;
  type: string;
  costType: string;
  account: string;
}

/**
 * Date Range for LinkedIn Ads queries
 */
export interface LinkedInAdsDateRange {
  start: {
    year: number;
    month: number;
    day: number;
  };
  end: {
    year: number;
    month: number;
    day: number;
  };
}
