/**
 * Mock Data Generator Service
 *
 * Generates realistic marketing analytics data for education mode students
 * Mock data structure EXACTLY matches real API responses from platform integrations
 */

import type { GAMultiPropertyData, GAPropertyData } from '../googleAnalytics/fetchData';
import type { GoogleAdsData } from '../google-ads/fetchData';
import type { MetaAdsData } from '../meta-ads/fetchData';
import type { LinkedInAdsData } from '../linkedin-ads/fetchData';

/**
 * Platform data configuration interfaces
 */
export interface GAMockConfig {
  websiteName: string;
  sessionsRange: [number, number];
  usersRange: [number, number];
  bounceRate: number;
  avgSessionDuration: number;
  noiseLevel?: number;
  deviceMix?: {
    mobile: { percentage: number; bounceRate: number; avgSessionDuration: number };
    desktop: { percentage: number; bounceRate: number; avgSessionDuration: number };
    tablet: { percentage: number; bounceRate: number; avgSessionDuration: number };
  };
  trafficSources?: Array<{ source: string; medium: string; sessions: number }>;
  topPages?: Array<{ page: string; views: number }>;
}

export interface AdsCampaignConfig {
  name: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions?: number;
  cpc?: number;
  ctr?: number;
  conversionRate?: number;
}

export interface AdsMockConfig {
  totalBudget: number;
  dateRange: string;
  campaigns: AdsCampaignConfig[];
  currency?: string;
}

export interface MetaCampaignConfig {
  name: string;
  platform: 'facebook' | 'instagram' | 'audience_network' | 'messenger';
  objective: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpc: number;
  conversions?: number;
  conversionValue?: number;
}

export interface MetaMockConfig {
  accountName: string;
  currency: string;
  campaigns: MetaCampaignConfig[];
}

export interface LinkedInCampaignConfig {
  name: string;
  objective: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions?: number;
  conversionValue?: number;
  cpc: number;
}

export interface LinkedInMockConfig {
  accountName: string;
  currency: string;
  campaigns: LinkedInCampaignConfig[];
}

/**
 * Mock scenario template
 */
export interface MockScenarioTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  industry: 'ecommerce' | 'saas' | 'b2b' | 'local' | 'nonprofit';
  learningObjectives: string[];
  keyInsights: string[];
  commonMistakes?: string[];
  gaConfig?: GAMockConfig;
  adsConfig?: AdsMockConfig;
  metaConfig?: MetaMockConfig;
  linkedInConfig?: LinkedInMockConfig;
  noiseLevel?: number;
  issueObviousness?: number;
}

/**
 * Platform data response
 */
export interface PlatformData {
  googleAnalyticsMulti?: GAMultiPropertyData;
  googleAds?: GoogleAdsData;
  metaAds?: MetaAdsData;
  linkedInAds?: LinkedInAdsData;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate random integer in range [min, max]
 */
function randomInRange(range: [number, number]): number {
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random float in range [min, max]
 */
function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Add noise to a value based on noise level
 */
function addNoise(value: number, noiseLevel: number = 0.1): number {
  const variance = value * noiseLevel;
  return value + randomFloat(-variance, variance);
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

/**
 * Generate random ID
 */
function randomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Generate daily trend with realistic fluctuations
 */
function generateDailyTrend(
  sessionRange: [number, number],
  days: number
): Array<{ date: string; sessions: number; users: number; pageviews: number }> {
  const trend: Array<{ date: string; sessions: number; users: number; pageviews: number }> = [];
  const baselineSessions = (sessionRange[0] + sessionRange[1]) / 2;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();

    // Weekends have lower traffic (-30%)
    const weekendModifier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0;

    // Add random daily variance
    const randomModifier = randomFloat(0.85, 1.15);

    const sessions = Math.round((baselineSessions / days) * weekendModifier * randomModifier);
    const users = Math.round(sessions * randomFloat(0.75, 0.85));
    const pageviews = Math.round(sessions * randomFloat(2.8, 3.5));

    trend.push({
      date: formatDate(i),
      sessions,
      users,
      pageviews,
    });
  }

  return trend;
}

// ==================== GOOGLE ANALYTICS MOCK DATA ====================

/**
 * Generate mock Google Analytics data
 */
export function generateMockGA4Data(config: GAMockConfig): GAMultiPropertyData {
  const propertyId = `properties/${randomInRange([100000000, 999999999])}`;
  const sessions = randomInRange(config.sessionsRange);
  const users = randomInRange(config.usersRange);
  const newUsers = Math.round(users * randomFloat(0.6, 0.8));
  const returningUsers = users - newUsers;
  const pageviews = Math.round(sessions * randomFloat(2.8, 3.5));

  // Device breakdown
  const deviceMix = config.deviceMix || {
    mobile: { percentage: 60, bounceRate: 0.55, avgSessionDuration: 120 },
    desktop: { percentage: 35, bounceRate: 0.45, avgSessionDuration: 180 },
    tablet: { percentage: 5, bounceRate: 0.48, avgSessionDuration: 150 },
  };

  const totalSessions = sessions;
  const mobileSessions = Math.round((totalSessions * deviceMix.mobile.percentage) / 100);
  const desktopSessions = Math.round((totalSessions * deviceMix.desktop.percentage) / 100);
  const tabletSessions = totalSessions - mobileSessions - desktopSessions;

  // Calculate weighted bounce rate
  const weightedBounceRate =
    (mobileSessions * deviceMix.mobile.bounceRate +
      desktopSessions * deviceMix.desktop.bounceRate +
      tabletSessions * deviceMix.tablet.bounceRate) /
    totalSessions;

  // Calculate weighted session duration
  const weightedSessionDuration =
    (mobileSessions * deviceMix.mobile.avgSessionDuration +
      desktopSessions * deviceMix.desktop.avgSessionDuration +
      tabletSessions * deviceMix.tablet.avgSessionDuration) /
    totalSessions;

  // Traffic sources
  const trafficSources = config.trafficSources || [
    { source: 'google', medium: 'organic', sessions: Math.round(sessions * 0.45) },
    { source: 'direct', medium: '(none)', sessions: Math.round(sessions * 0.25) },
    { source: 'facebook', medium: 'social', sessions: Math.round(sessions * 0.15) },
    { source: 'newsletter', medium: 'email', sessions: Math.round(sessions * 0.10) },
    { source: 'bing', medium: 'organic', sessions: Math.round(sessions * 0.05) },
  ];

  // Top pages
  const topPages = config.topPages || [
    { page: '/', views: Math.round(pageviews * 0.35) },
    { page: '/products', views: Math.round(pageviews * 0.20) },
    { page: '/about', views: Math.round(pageviews * 0.12) },
    { page: '/contact', views: Math.round(pageviews * 0.08) },
    { page: '/blog', views: Math.round(pageviews * 0.10) },
  ];

  const propertyData: GAPropertyData = {
    propertyId,
    propertyName: config.websiteName,
    realtime: {
      activeUsers: randomInRange([5, 50]),
      byDevice: [
        { device: 'mobile', users: randomInRange([2, 30]) },
        { device: 'desktop', users: randomInRange([1, 15]) },
        { device: 'tablet', users: randomInRange([0, 5]) },
      ],
    },
    metrics: {
      sessions,
      users,
      newUsers,
      returningUsers,
      pageviews,
      bounceRate: addNoise(weightedBounceRate, config.noiseLevel || 0.05),
      avgSessionDuration: addNoise(weightedSessionDuration, config.noiseLevel || 0.1),
      engagementRate: addNoise(1 - weightedBounceRate, config.noiseLevel || 0.05),
      sessionsPerUser: sessions / users,
      eventCount: Math.round(sessions * randomFloat(8, 15)),
    },
    dimensions: {
      topSources: trafficSources.map((ts) => ({
        source: ts.source,
        sessions: ts.sessions,
        users: Math.round(ts.sessions * randomFloat(0.75, 0.85)),
      })),
      devices: [
        {
          device: 'mobile',
          sessions: mobileSessions,
          percentage: deviceMix.mobile.percentage,
        },
        {
          device: 'desktop',
          sessions: desktopSessions,
          percentage: deviceMix.desktop.percentage,
        },
        {
          device: 'tablet',
          sessions: tabletSessions,
          percentage: deviceMix.tablet.percentage,
        },
      ],
      topPages: topPages.map((tp) => ({
        page: tp.page,
        views: tp.views,
        avgTime: randomFloat(30, 180),
      })),
      countries: [
        { country: 'United States', users: Math.round(users * 0.65) },
        { country: 'Canada', users: Math.round(users * 0.15) },
        { country: 'United Kingdom', users: Math.round(users * 0.10) },
        { country: 'Australia', users: Math.round(users * 0.07) },
        { country: 'Germany', users: Math.round(users * 0.03) },
      ],
      daily: generateDailyTrend(config.sessionsRange, 30),
    },
    topCampaigns: trafficSources
      .filter((ts) => ts.medium !== '(none)')
      .map((ts) => ({
        source: ts.source,
        medium: ts.medium,
        campaign: `${ts.source}-campaign-2024`,
        sessions: ts.sessions,
        users: Math.round(ts.sessions * randomFloat(0.75, 0.85)),
      })),
    topEvents: [
      { eventName: 'page_view', eventCount: pageviews },
      { eventName: 'click', eventCount: Math.round(sessions * randomFloat(3, 6)) },
      { eventName: 'scroll', eventCount: Math.round(sessions * randomFloat(2, 4)) },
      { eventName: 'form_submit', eventCount: Math.round(sessions * randomFloat(0.02, 0.05)) },
      { eventName: 'purchase', eventCount: Math.round(sessions * randomFloat(0.01, 0.03)) },
    ],
    topLandingPages: topPages.slice(0, 5).map((tp) => ({
      page: tp.page,
      sessions: Math.round(tp.views * 0.8),
      bounceRate: randomFloat(0.35, 0.65),
    })),
    topCities: [
      { city: 'New York', country: 'United States', sessions: Math.round(sessions * 0.15) },
      { city: 'Los Angeles', country: 'United States', sessions: Math.round(sessions * 0.12) },
      { city: 'Toronto', country: 'Canada', sessions: Math.round(sessions * 0.08) },
      { city: 'London', country: 'United Kingdom', sessions: Math.round(sessions * 0.07) },
      { city: 'Chicago', country: 'United States', sessions: Math.round(sessions * 0.06) },
    ],
    topRegions: [
      { region: 'California', country: 'United States', sessions: Math.round(sessions * 0.20) },
      { region: 'New York', country: 'United States', sessions: Math.round(sessions * 0.15) },
      { region: 'Ontario', country: 'Canada', sessions: Math.round(sessions * 0.10) },
      { region: 'Texas', country: 'United States', sessions: Math.round(sessions * 0.08) },
      { region: 'England', country: 'United Kingdom', sessions: Math.round(sessions * 0.07) },
    ],
    browserBreakdown: [
      { browser: 'Chrome', sessions: Math.round(sessions * 0.55) },
      { browser: 'Safari', sessions: Math.round(sessions * 0.25) },
      { browser: 'Firefox', sessions: Math.round(sessions * 0.10) },
      { browser: 'Edge', sessions: Math.round(sessions * 0.08) },
      { browser: 'Other', sessions: Math.round(sessions * 0.02) },
    ],
  };

  const startDate = formatDate(30);
  const endDate = formatDate(0);

  return {
    properties: [propertyData],
    dateRange: `${startDate} to ${endDate}`,
    selectedPropertyId: propertyId,
  };
}

// ==================== GOOGLE ADS MOCK DATA ====================

/**
 * Generate mock Google Ads data
 */
export function generateMockGoogleAdsData(config: AdsMockConfig): GoogleAdsData {
  const customerId = `${randomInRange([1000000000, 9999999999])}`;
  const currency = config.currency || 'USD';

  // Calculate aggregate metrics from campaigns
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalCost = 0;
  let totalConversions = 0;

  const campaigns = config.campaigns.map((camp) => {
    const impressions = camp.impressions;
    const clicks = camp.clicks;
    const cost = camp.spend;
    const conversions = camp.conversions || Math.round(clicks * randomFloat(0.01, 0.03));

    totalImpressions += impressions;
    totalClicks += clicks;
    totalCost += cost;
    totalConversions += conversions;

    return {
      id: randomId(),
      name: camp.name,
      status: 'ENABLED',
      type: 'SEARCH',
      impressions,
      clicks,
      spend: cost,
      conversions,
      conversionRate: impressions > 0 ? (conversions / impressions) * 100 : 0,
    };
  });

  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCpc = totalClicks > 0 ? totalCost / totalClicks : 0;

  return {
    customers: [
      {
        id: customerId,
        name: 'Mock Ads Account',
        currency,
        timeZone: 'America/New_York',
      },
    ],
    metrics: {
      impressions: totalImpressions,
      clicks: totalClicks,
      spend: totalCost,
      currency,
      conversions: totalConversions,
      conversionsValue: totalConversions * 50, // Mock value
      costPerConversion: totalConversions > 0 ? totalCost / totalConversions : 0,
      conversionRate: totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0,
      viewThroughConversions: Math.round(totalConversions * 0.1),
      interactions: totalClicks,
      interactionRate: avgCtr,
      ctr: avgCtr,
      cpc: avgCpc,
      searchImpressionShare: 85.5,
      searchAbsTopImpressionShare: 45.2,
      searchBudgetLostImpressionShare: 5.4,
      searchRankLostImpressionShare: 9.1,
    },
    campaigns,
    dateRange: config.dateRange,
    developerTokenStatus: 'active',
  };
}

// ==================== META ADS MOCK DATA ====================

/**
 * Generate mock Meta Ads data
 */
export function generateMockMetaAdsData(config: MetaMockConfig): MetaAdsData {
  const accountId = `act_${randomInRange([100000000, 999999999])}`;

  // Calculate aggregate metrics from campaigns
  let totalImpressions = 0;
  let totalReach = 0;
  let totalClicks = 0;
  let totalSpend = 0;

  const campaigns = config.campaigns.map((camp) => {
    const impressions = camp.impressions;
    const clicks = camp.clicks;
    const spend = camp.spend;

    totalImpressions += impressions;
    totalReach += camp.reach;
    totalClicks += clicks;
    totalSpend += spend;

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
    const frequency = camp.reach > 0 ? impressions / camp.reach : 1;

    return {
      id: randomId(),
      name: camp.name,
      status: 'ACTIVE',
      objective: camp.objective,
      metrics: {
        impressions,
        reach: camp.reach,
        clicks,
        spend,
        ctr,
        cpc,
        cpm,
        frequency,
        inline_link_clicks: Math.round(clicks * 0.8),
        purchases: camp.conversions || 0,
        leads: 0,
        cost_per_purchase: (camp.conversions || 0) > 0 ? spend / (camp.conversions || 1) : 0,
        cost_per_lead: 0,
        roas: (camp.conversionValue || 0) > 0 && spend > 0 ? (camp.conversionValue || 0) / spend : 0,
        registrations: 0,
        add_to_carts: 0,
        checkouts: 0,
        content_views: 0,
      },
    };
  });

  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const avgCpm = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;
  const frequency = totalReach > 0 ? totalImpressions / totalReach : 1;

  return {
    accounts: [
      {
        id: accountId,
        name: config.accountName,
        status: 'ACTIVE',
        currency: config.currency,
      },
    ],
    metrics: {
      impressions: totalImpressions,
      reach: totalReach,
      clicks: totalClicks,
      spend: totalSpend,
      currency: config.currency,
      ctr: avgCtr,
      cpc: avgCpc,
      cpm: avgCpm,
      frequency,
      inline_link_clicks: 0,
      video_p25_watched_actions: 0,
      video_p50_watched_actions: 0,
      video_p100_watched_actions: 0,
      purchases: 0,
      leads: 0,
      cost_per_purchase: 0,
      cost_per_lead: 0,
      roas: 0,
      registrations: 0,
      add_to_carts: 0,
      checkouts: 0,
      content_views: 0,
      cost_per_registration: 0,
      cost_per_add_to_cart: 0,
    },
    campaigns,
    demographics: [],
    geography: [],
    devices: [],
    publisher_platforms: [],
    dateRange: 'Last 30 days',
  };
}

// ==================== LINKEDIN ADS MOCK DATA ====================

/**
 * Generate mock LinkedIn Ads data
 */
export function generateMockLinkedInAdsData(config: LinkedInMockConfig): LinkedInAdsData {
  const accountId = `${randomInRange([500000000, 599999999])}`;

  // Calculate aggregate metrics from campaigns
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalSpend = 0;
  let totalConversions = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;

  const campaigns = config.campaigns.map((camp) => {
    const impressions = camp.impressions;
    const clicks = camp.clicks;
    const spend = camp.spend;
    const conversions = camp.conversions || Math.round(clicks * randomFloat(0.02, 0.05));

    totalImpressions += impressions;
    totalClicks += clicks;
    totalSpend += spend;
    totalConversions += conversions;

    // LinkedIn-specific engagement metrics
    const likes = Math.round(impressions * randomFloat(0.005, 0.015));
    const comments = Math.round(impressions * randomFloat(0.001, 0.005));
    const shares = Math.round(impressions * randomFloat(0.001, 0.003));

    totalLikes += likes;
    totalComments += comments;
    totalShares += shares;

    return {
      id: randomId(),
      name: camp.name,
      status: 'ACTIVE',
      type: 'CAMPAIGN',
      metrics: {
        impressions,
        clicks,
        spend,
      },
    };
  });

  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const totalEngagements = totalLikes + totalComments + totalShares;
  const engagementRate = totalImpressions > 0 ? (totalEngagements / totalImpressions) * 100 : 0;
  const costPerEngagement = totalEngagements > 0 ? totalSpend / totalEngagements : 0;
  const costPerConversion = totalConversions > 0 ? totalSpend / totalConversions : 0;

  // Break down conversions into post-click and post-view
  const postClickConversions = Math.round(totalConversions * 0.7); // 70% post-click
  const postViewConversions = totalConversions - postClickConversions; // 30% post-view

  return {
    accounts: [
      {
        id: accountId,
        name: config.accountName,
        status: 'ACTIVE',
        currency: config.currency,
      },
    ],
    metrics: {
      impressions: totalImpressions,
      clicks: totalClicks,
      spend: totalSpend,
      ctr: avgCtr,
      cpc: avgCpc,
      currency: config.currency,
      engagement: {
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
        totalEngagements,
        reactions: totalLikes,
        follows: Math.round(totalEngagements * 0.1),
        companyPageClicks: Math.round(totalClicks * 0.05),
        otherEngagements: Math.round(totalEngagements * 0.05),
        engagementRate,
        costPerEngagement,
      },
      conversions: {
        total: totalConversions,
        postClick: postClickConversions,
        postView: postViewConversions,
        landingPageClicks: Math.round(totalClicks * 0.8),
        costPerConversion,
      },
      leads: {
        total: Math.round(totalConversions * 0.3),
        qualified: Math.round(totalConversions * 0.2),
        formOpens: Math.round(totalConversions * 0.5),
        qualityRate: 66.67,
        costPerLead: costPerConversion * 0.3,
      },
    },
    campaigns,
    dateRange: 'Last 30 days',
  };
}

// ==================== MAIN ENTRY POINT ====================

/**
 * Generate mock platform data from a scenario template
 */
export function generateMockPlatformData(scenario: MockScenarioTemplate): PlatformData {
  const platformData: PlatformData = {};

  if (scenario.gaConfig) {
    platformData.googleAnalyticsMulti = generateMockGA4Data(scenario.gaConfig);
  }

  if (scenario.adsConfig) {
    platformData.googleAds = generateMockGoogleAdsData(scenario.adsConfig);
  }

  if (scenario.metaConfig) {
    platformData.metaAds = generateMockMetaAdsData(scenario.metaConfig);
  }

  if (scenario.linkedInConfig) {
    platformData.linkedInAds = generateMockLinkedInAdsData(scenario.linkedInConfig);
  }

  return platformData;
}
