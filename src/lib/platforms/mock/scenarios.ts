/**
 * Pre-built Mock Data Scenario Templates
 *
 * Each scenario contains intentional issues for students to discover
 * and includes learning objectives and key insights
 */

import type { MockScenarioTemplate } from './generator';

/**
 * BEGINNER: E-commerce High Bounce Rate
 *
 * Learning Objectives:
 * - Identify high bounce rate
 * - Analyze device breakdown
 * - Understand mobile optimization impact
 *
 * Key Issue: 72% bounce rate on mobile (vs 35% on desktop)
 * Mobile represents 70% of traffic but has poor UX
 */
export const BEGINNER_ECOMMERCE: MockScenarioTemplate = {
  id: 'beginner-ecommerce-bounce',
  name: 'E-commerce Basics: High Bounce Rate Mystery',
  description:
    'FashionStore.com is seeing decent traffic but poor engagement. As a digital marketing analyst, you need to identify why visitors are leaving so quickly.',
  difficulty: 'beginner',
  industry: 'ecommerce',
  learningObjectives: [
    'Identify high bounce rate patterns',
    'Analyze traffic by device type',
    'Understand mobile optimization impact on user behavior',
    'Recommend actionable improvements based on data',
  ],
  keyInsights: [
    'Overall bounce rate is 58% (seems okay)',
    'But 70% of traffic is mobile',
    'Mobile bounce rate is 72% (very high!)',
    'Desktop bounce rate is only 35% (normal)',
    'Conclusion: Mobile UX is broken, needs optimization',
  ],
  commonMistakes: [
    'Only looking at overall bounce rate without segmentation',
    'Not considering device distribution',
    'Missing the mobile-specific problem',
  ],
  gaConfig: {
    websiteName: 'FashionStore.com',
    sessionsRange: [15000, 20000],
    usersRange: [12000, 16000],
    bounceRate: 0.58, // Overall (calculated weighted average)
    avgSessionDuration: 85, // Overall (calculated weighted average)
    deviceMix: {
      mobile: {
        percentage: 70,
        bounceRate: 0.72, // Very high - mobile issue!
        avgSessionDuration: 45, // Low session time
      },
      desktop: {
        percentage: 25,
        bounceRate: 0.35, // Normal
        avgSessionDuration: 180, // Good session time
      },
      tablet: {
        percentage: 5,
        bounceRate: 0.42, // Normal
        avgSessionDuration: 120,
      },
    },
    trafficSources: [
      { source: 'google', medium: 'organic', sessions: 8000 },
      { source: 'facebook', medium: 'social', sessions: 4500 },
      { source: 'instagram', medium: 'social', sessions: 3000 },
      { source: 'direct', medium: '(none)', sessions: 2500 },
    ],
    topPages: [
      { page: '/', views: 6000 },
      { page: '/products/womens-clothing', views: 3500 },
      { page: '/products/mens-clothing', views: 2800 },
      { page: '/sale', views: 2200 },
      { page: '/new-arrivals', views: 1800 },
    ],
  },
  noiseLevel: 0.05,
  issueObviousness: 0.7,
};

/**
 * INTERMEDIATE: Google Ads CPC Crisis
 *
 * Learning Objectives:
 * - Calculate cost per acquisition (CPA)
 * - Identify inefficient campaigns
 * - Recommend budget reallocation
 *
 * Key Issue: Generic keyword campaign has 8.5x higher CPC but same conversion rate
 * Student must calculate CPA and realize budget wastage
 */
export const INTERMEDIATE_GOOGLE_ADS: MockScenarioTemplate = {
  id: 'intermediate-google-ads-cpc',
  name: 'Google Ads: CPC Crisis & Budget Optimization',
  description:
    'CloudTasker SaaS is spending $15,000/month on Google Ads but conversions are below target. You need to analyze campaign performance and recommend budget reallocation.',
  difficulty: 'intermediate',
  industry: 'saas',
  learningObjectives: [
    'Calculate cost per acquisition (CPA) for each campaign',
    'Identify campaigns with inefficient spend',
    'Understand the difference between CPC, CTR, and conversion metrics',
    'Recommend data-driven budget reallocation',
    'Estimate potential conversion improvements',
  ],
  keyInsights: [
    'Total spend: $13,700, Conversions: 95, Overall CPA: $144',
    'Brand campaign: CPA = $63 (efficient)',
    'Generic keywords: CPA = $638 (terrible!)',
    'Long-tail keywords: CPA = $84 (best!)',
    'Generic keywords eating 56% of budget but generating only 13% of conversions',
    'If reallocate $7,650 from generic to long-tail, could get 91 more conversions (79% improvement!)',
  ],
  commonMistakes: [
    'Only looking at CPC without calculating CPA',
    'Not considering conversion rate differences',
    'Missing the opportunity cost of budget misallocation',
  ],
  gaConfig: {
    websiteName: 'CloudTasker.io',
    sessionsRange: [8000, 10000],
    usersRange: [6000, 8000],
    bounceRate: 0.45,
    avgSessionDuration: 180,
    trafficSources: [
      { source: 'google', medium: 'cpc', sessions: 5500 }, // From Google Ads
      { source: 'google', medium: 'organic', sessions: 2000 },
      { source: 'linkedin', medium: 'social', sessions: 800 },
      { source: 'direct', medium: '(none)', sessions: 700 },
    ],
  },
  adsConfig: {
    totalBudget: 15000,
    dateRange: 'Last 30 days',
    currency: 'USD',
    campaigns: [
      {
        name: 'Brand Campaign',
        budget: 3000,
        spend: 2850,
        impressions: 125000,
        clicks: 3200,
        conversions: 45,
        cpc: 0.89, // Good CPC
        ctr: 2.56, // Good CTR
        conversionRate: 1.41, // Good conversion rate
        // CPA = $63 (2850 / 45)
      },
      {
        name: 'Generic Keywords (Project Management)',
        budget: 8000,
        spend: 7650,
        impressions: 85000,
        clicks: 900, // Low clicks despite high spend
        conversions: 12, // Low conversions
        cpc: 8.5, // VERY HIGH CPC (issue!)
        ctr: 1.06, // Low CTR
        conversionRate: 1.33, // Conversion rate similar to brand
        // CPA = $638 (7650 / 12) - TERRIBLE!
      },
      {
        name: 'Long-Tail Keywords (Task Automation)',
        budget: 4000,
        spend: 3200,
        impressions: 45000,
        clicks: 2100,
        conversions: 38,
        cpc: 1.52, // Decent CPC
        ctr: 4.67, // Great CTR
        conversionRate: 1.81, // Best conversion rate!
        // CPA = $84 (3200 / 38) - BEST!
      },
    ],
  },
  noiseLevel: 0.03,
  issueObviousness: 0.6,
};

/**
 * ADVANCED: Multi-Channel Attribution Puzzle
 *
 * Learning Objectives:
 * - Cross-channel attribution analysis
 * - Customer journey mapping
 * - ROAS optimization across platforms
 *
 * Key Issue: Instagram drives awareness but LinkedIn converts
 * Student must understand multi-touch attribution
 */
export const ADVANCED_MULTI_CHANNEL: MockScenarioTemplate = {
  id: 'advanced-multi-channel-attribution',
  name: 'Cross-Channel Attribution: The Hidden Customer Journey',
  description:
    'TechConsult B2B is running ads on Instagram and LinkedIn. Surface-level metrics suggest cutting Instagram spend, but the real story is more complex. Can you uncover the multi-touch customer journey?',
  difficulty: 'advanced',
  industry: 'b2b',
  learningObjectives: [
    'Understand multi-touch attribution models',
    'Analyze customer journey across platforms',
    'Calculate ROAS (Return on Ad Spend) correctly',
    'Identify the role of awareness vs. conversion channels',
    'Make recommendations that consider the full funnel',
  ],
  keyInsights: [
    'Surface analysis: LinkedIn has better ROAS (15x vs 0.6x)',
    'But Instagram reaches 450K people, LinkedIn only 30K',
    'Many LinkedIn converters first saw Instagram ad (GA campaign data shows this)',
    'Multi-touch journey: Awareness (Instagram) → Consideration (Google) → Conversion (LinkedIn)',
    'Instagram is essential for top-of-funnel; cutting it would hurt LinkedIn conversions!',
    'Proper attribution: Instagram should get assisted conversion credit',
  ],
  commonMistakes: [
    'Only looking at last-click attribution',
    'Comparing platforms without considering funnel stage',
    'Not analyzing GA campaign data to see multi-touch journeys',
    'Recommending cutting Instagram based on direct ROAS alone',
  ],
  gaConfig: {
    websiteName: 'TechConsult.com',
    sessionsRange: [12000, 15000],
    usersRange: [9000, 11000],
    bounceRate: 0.52,
    avgSessionDuration: 160,
    trafficSources: [
      { source: 'google', medium: 'organic', sessions: 4000 },
      { source: 'instagram', medium: 'cpc', sessions: 3500 }, // High traffic from Instagram
      { source: 'linkedin', medium: 'cpc', sessions: 2100 }, // Lower traffic from LinkedIn
      { source: 'direct', medium: '(none)', sessions: 1800 },
      { source: 'google', medium: 'cpc', sessions: 1500 },
    ],
  },
  metaConfig: {
    accountName: 'TechConsult Ads',
    currency: 'USD',
    campaigns: [
      {
        name: 'Instagram Awareness - Tech Leaders',
        platform: 'instagram',
        objective: 'REACH',
        spend: 12000,
        impressions: 2500000,
        reach: 450000, // High reach
        clicks: 8500,
        cpc: 1.41,
        conversions: 5, // Direct conversions low
        conversionValue: 7500, // $1,500 per conversion
        // Direct ROAS: 0.625x ($7,500 / $12,000) - Looks bad!
      },
    ],
  },
  linkedInConfig: {
    accountName: 'TechConsult LinkedIn',
    currency: 'USD',
    campaigns: [
      {
        name: 'LinkedIn Lead Gen - Decision Makers',
        objective: 'LEAD_GENERATION',
        spend: 8500,
        impressions: 125000,
        clicks: 2100,
        conversions: 85, // High conversions
        conversionValue: 127500, // $1,500 per conversion (same as Instagram)
        cpc: 4.05,
        // Direct ROAS: 15x ($127,500 / $8,500) - Looks amazing!
      },
    ],
  },
  noiseLevel: 0.05,
  issueObviousness: 0.3, // Very subtle issue
};

/**
 * BEGINNER: Local Business Seasonal Dip
 *
 * Learning Objectives:
 * - Identify seasonal patterns
 * - Analyze time-based trends
 * - Understand normal vs. abnormal fluctuations
 */
export const BEGINNER_LOCAL_SEASONAL: MockScenarioTemplate = {
  id: 'beginner-local-seasonal',
  name: 'Local Business: Understanding Seasonal Trends',
  description:
    "Mike's Coffee Shop is worried about traffic dropping in the last week. Is this a problem, or just a normal pattern?",
  difficulty: 'beginner',
  industry: 'local',
  learningObjectives: [
    'Analyze daily traffic trends',
    'Identify day-of-week patterns',
    'Distinguish between concerning and normal fluctuations',
    'Understand local business seasonality',
  ],
  keyInsights: [
    'Traffic drops 30% on weekends (Saturday/Sunday)',
    'This is normal for a business-district coffee shop',
    'Weekday traffic is consistent and healthy',
    'Recommendation: Focus marketing on weekday office workers',
  ],
  commonMistakes: [
    'Panicking about weekend dips without understanding context',
    'Not looking at day-of-week patterns',
    'Missing the business location context',
  ],
  gaConfig: {
    websiteName: 'MikesCoffeeShop.com',
    sessionsRange: [2500, 3500],
    usersRange: [2000, 2800],
    bounceRate: 0.38,
    avgSessionDuration: 95,
    trafficSources: [
      { source: 'google', medium: 'organic', sessions: 1800 },
      { source: 'direct', medium: '(none)', sessions: 900 },
      { source: 'facebook', medium: 'social', sessions: 500 },
      { source: 'instagram', medium: 'social', sessions: 300 },
    ],
  },
  noiseLevel: 0.08,
  issueObviousness: 0.8,
};

/**
 * Scenario template library
 */
export const SCENARIO_TEMPLATES = {
  beginnerEcommerce: BEGINNER_ECOMMERCE,
  beginnerLocalSeasonal: BEGINNER_LOCAL_SEASONAL,
  intermediateGoogleAds: INTERMEDIATE_GOOGLE_ADS,
  advancedMultiChannel: ADVANCED_MULTI_CHANNEL,
};

/**
 * Select a random scenario template based on filters
 */
export function selectScenarioTemplate(
  difficulty?: 'beginner' | 'intermediate' | 'advanced',
  industry?: string
): MockScenarioTemplate {
  const candidates = Object.values(SCENARIO_TEMPLATES).filter((template) => {
    if (difficulty && template.difficulty !== difficulty) return false;
    if (industry && template.industry !== industry) return false;
    return true;
  });

  if (candidates.length === 0) {
    // No matches, return a default scenario
    return BEGINNER_ECOMMERCE;
  }

  // Random selection from candidates
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

/**
 * Get all available scenario templates
 */
export function getAllScenarios(): MockScenarioTemplate[] {
  return Object.values(SCENARIO_TEMPLATES);
}

/**
 * Get scenario template by ID
 */
export function getScenarioById(id: string): MockScenarioTemplate | null {
  const scenario = Object.values(SCENARIO_TEMPLATES).find((s) => s.id === id);
  return scenario || null;
}
