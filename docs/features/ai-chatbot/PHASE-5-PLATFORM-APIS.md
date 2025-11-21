# Phase 5: Platform API Integrations

**Document Version:** 1.0
**Last Updated:** 2025-11-22
**Status:** Implementation Roadmap
**Timeline:** 3-4 weeks
**Priority:** High

---

## Table of Contents

1. [Overview](#overview)
2. [Platform Integration Architecture](#platform-integration-architecture)
3. [Google Analytics Integration](#google-analytics-integration)
4. [Meta Ads Integration](#meta-ads-integration)
5. [Google Ads Integration](#google-ads-integration)
6. [LinkedIn Ads Integration](#linkedin-ads-integration)
7. [Unified Data Layer](#unified-data-layer)
8. [Security & Compliance](#security--compliance)
9. [Rate Limiting & Caching](#rate-limiting--caching)
10. [Testing Strategy](#testing-strategy)
11. [Implementation Timeline](#implementation-timeline)

---

## Overview

### Purpose
Integrate with major marketing platforms to enable AI-powered insights and analytics through natural language queries in the chat interface.

### Goals
1. **Seamless OAuth**: Secure, user-friendly platform connections
2. **Real-time Data**: Fresh insights from live platform data
3. **Unified Interface**: Consistent API layer across all platforms
4. **AI-Ready**: Structured data optimized for AI analysis
5. **Scalable**: Support for future platform additions

### Supported Platforms

| Platform | Priority | OAuth Provider | API Version | Data Types |
|----------|----------|----------------|-------------|------------|
| Google Analytics | P0 | Google OAuth 2.0 | GA4 Data API v1 | Web analytics, user behavior, conversions |
| Meta Ads | P0 | Facebook Login | Marketing API v18.0 | Campaign performance, ad metrics, insights |
| Google Ads | P1 | Google OAuth 2.0 | Google Ads API v14 | Campaign data, keywords, performance |
| LinkedIn Ads | P1 | LinkedIn OAuth 2.0 | Marketing API v2023-11 | Campaign analytics, audience data |

---

## Platform Integration Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (Chat)                    │
│                                                             │
│  "How's my Meta campaign performing?"                      │
│  "Show me Google Analytics traffic trends"                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               AI Chat Handler (Server Action)               │
│  - Parse user query                                         │
│  - Determine required platforms/metrics                     │
│  - Call appropriate data fetchers                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Unified Data Layer                         │
│  - Platform abstraction                                     │
│  - Normalize data structures                                │
│  - Cache management                                         │
│  - Error handling                                           │
└───────┬──────────┬──────────┬──────────┬───────────────────┘
        │          │          │          │
        ▼          ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
   │   GA   │ │  Meta  │ │ Google │ │LinkedIn │
   │Service │ │Service │ │  Ads   │ │  Ads    │
   │        │ │        │ │Service │ │ Service │
   └────┬───┘ └────┬───┘ └────┬───┘ └────┬────┘
        │          │          │          │
        ▼          ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
   │   GA   │ │  Meta  │ │ Google │ │LinkedIn │
   │  API   │ │  API   │ │  Ads   │ │  API    │
   │        │ │        │ │  API   │ │         │
   └────────┘ └────────┘ └────────┘ └─────────┘
```

### Directory Structure

```
src/
├── lib/
│   ├── platforms/
│   │   ├── index.ts                    # Unified interface
│   │   ├── types.ts                    # Shared types
│   │   ├── base-platform.ts            # Abstract base class
│   │   ├── google-analytics/
│   │   │   ├── index.ts               # Main service
│   │   │   ├── oauth.ts               # OAuth flow
│   │   │   ├── client.ts              # API client
│   │   │   ├── types.ts               # GA-specific types
│   │   │   └── transformers.ts        # Data normalization
│   │   ├── meta-ads/
│   │   │   ├── index.ts
│   │   │   ├── oauth.ts
│   │   │   ├── client.ts
│   │   │   ├── types.ts
│   │   │   └── transformers.ts
│   │   ├── google-ads/
│   │   │   └── [same structure]
│   │   └── linkedin-ads/
│   │       └── [same structure]
│   └── cache/
│       ├── redis.ts                    # Redis client
│       └── strategies.ts               # Caching strategies
├── models/
│   └── PlatformConnection.ts           # Platform credentials model
└── app/
    ├── api/
    │   └── platforms/
    │       ├── google-analytics/
    │       │   ├── authorize/route.ts  # OAuth start
    │       │   ├── callback/route.ts   # OAuth callback
    │       │   └── data/route.ts       # Data endpoints
    │       ├── meta-ads/
    │       │   └── [same structure]
    │       ├── google-ads/
    │       │   └── [same structure]
    │       └── linkedin-ads/
    │           └── [same structure]
    └── actions/
        └── platforms/
            ├── connect.ts              # Connect platform
            ├── disconnect.ts           # Disconnect platform
            └── fetch-data.ts           # Fetch platform data
```

### Unified Interface

```typescript
// src/lib/platforms/types.ts

export interface PlatformConfig {
  id: string;
  name: string;
  provider: 'google' | 'facebook' | 'linkedin';
  oauthScopes: string[];
  apiVersion: string;
}

export interface PlatformCredentials {
  clientId: string;
  userId: string;
  platformId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scopes: string[];
  metadata?: Record<string, any>;
}

export interface MetricQuery {
  startDate: string;      // ISO date
  endDate: string;        // ISO date
  metrics: string[];      // e.g., ['sessions', 'pageviews']
  dimensions?: string[];  // e.g., ['date', 'source']
  filters?: QueryFilter[];
  limit?: number;
}

export interface QueryFilter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte';
  value: string | number;
}

export interface NormalizedMetric {
  date: string;
  metric: string;
  value: number;
  dimensions?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface PlatformResponse {
  success: boolean;
  data?: NormalizedMetric[];
  error?: string;
  cached?: boolean;
  timestamp: string;
}

// Base platform interface
export interface IPlatform {
  config: PlatformConfig;

  // OAuth methods
  getAuthUrl(redirectUri: string, state: string): string;
  handleCallback(code: string, state: string): Promise<PlatformCredentials>;
  refreshAccessToken(refreshToken: string): Promise<PlatformCredentials>;

  // Data methods
  fetchMetrics(credentials: PlatformCredentials, query: MetricQuery): Promise<PlatformResponse>;
  testConnection(credentials: PlatformCredentials): Promise<boolean>;

  // Metadata methods
  getAvailableMetrics(): string[];
  getAvailableDimensions(): string[];
}
```

---

## Google Analytics Integration

### Overview
- **Platform**: Google Analytics 4 (GA4)
- **API**: Google Analytics Data API v1
- **OAuth**: Google OAuth 2.0
- **Documentation**: https://developers.google.com/analytics/devguides/reporting/data/v1

### OAuth Configuration

```typescript
// src/lib/platforms/google-analytics/oauth.ts

export const GA_CONFIG = {
  id: 'google-analytics',
  name: 'Google Analytics',
  provider: 'google' as const,
  oauthScopes: [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
  apiVersion: 'v1',
};

export class GoogleAnalyticsOAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GOOGLE_ANALYTICS_CLIENT_ID!;
    this.clientSecret = process.env.GOOGLE_ANALYTICS_CLIENT_SECRET!;
    this.redirectUri = `${process.env.NEXTAUTH_URL}/api/platforms/google-analytics/callback`;
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: GA_CONFIG.oauthScopes.join(' '),
      access_type: 'offline',  // Get refresh token
      prompt: 'consent',       // Force consent to get refresh token
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error(`OAuth token exchange failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }
}
```

### API Client

```typescript
// src/lib/platforms/google-analytics/client.ts

import { BetaAnalyticsDataClient } from '@google-analytics/data';

export interface GA4RunReportRequest {
  propertyId: string;
  dateRanges: Array<{ startDate: string; endDate: string }>;
  metrics: Array<{ name: string }>;
  dimensions?: Array<{ name: string }>;
  limit?: number;
}

export class GoogleAnalyticsClient {
  private client: BetaAnalyticsDataClient;

  constructor(accessToken: string) {
    this.client = new BetaAnalyticsDataClient({
      credentials: {
        access_token: accessToken,
      },
    });
  }

  /**
   * Run a GA4 report
   */
  async runReport(request: GA4RunReportRequest) {
    const [response] = await this.client.runReport({
      property: `properties/${request.propertyId}`,
      dateRanges: request.dateRanges,
      metrics: request.metrics,
      dimensions: request.dimensions,
      limit: request.limit || 10000,
    });

    return response;
  }

  /**
   * Get account summaries (list properties)
   */
  async listProperties() {
    // Using Google Analytics Admin API
    const response = await fetch(
      'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
      {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch GA properties');
    }

    return response.json();
  }

  private getAccessToken(): string {
    // Extract token from client credentials
    return (this.client as any).auth.credentials.access_token;
  }
}
```

### Data Transformers

```typescript
// src/lib/platforms/google-analytics/transformers.ts

import { NormalizedMetric } from '../types';

/**
 * Transform GA4 API response to normalized format
 */
export function transformGA4Response(
  response: any
): NormalizedMetric[] {
  const results: NormalizedMetric[] = [];

  response.rows?.forEach((row: any) => {
    const dimensions: Record<string, string> = {};

    row.dimensionValues?.forEach((dim: any, index: number) => {
      const dimensionName = response.dimensionHeaders[index].name;
      dimensions[dimensionName] = dim.value;
    });

    row.metricValues?.forEach((metric: any, index: number) => {
      const metricName = response.metricHeaders[index].name;

      results.push({
        date: dimensions.date || new Date().toISOString().split('T')[0],
        metric: metricName,
        value: parseFloat(metric.value) || 0,
        dimensions,
        metadata: {
          platform: 'google-analytics',
        },
      });
    });
  });

  return results;
}

/**
 * Map user-friendly metric names to GA4 API names
 */
export const GA_METRIC_MAP: Record<string, string> = {
  // Traffic metrics
  sessions: 'sessions',
  users: 'activeUsers',
  pageviews: 'screenPageViews',
  'bounce_rate': 'bounceRate',
  'avg_session_duration': 'averageSessionDuration',

  // Engagement metrics
  'engagement_rate': 'engagementRate',
  'engaged_sessions': 'engagedSessions',
  'events_per_session': 'eventsPerSession',

  // Conversion metrics
  conversions: 'conversions',
  'conversion_rate': 'sessionConversionRate',
  'total_revenue': 'totalRevenue',
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
  'landing_page': 'landingPage',
};
```

### Available Metrics & Dimensions

```typescript
// src/lib/platforms/google-analytics/index.ts

export const AVAILABLE_GA_METRICS = [
  // Traffic
  { id: 'sessions', name: 'Sessions', description: 'Total number of sessions' },
  { id: 'users', name: 'Users', description: 'Total active users' },
  { id: 'pageviews', name: 'Pageviews', description: 'Total page views' },
  { id: 'bounce_rate', name: 'Bounce Rate', description: 'Percentage of single-page sessions' },

  // Engagement
  { id: 'engagement_rate', name: 'Engagement Rate', description: 'Percentage of engaged sessions' },
  { id: 'avg_session_duration', name: 'Avg. Session Duration', description: 'Average time on site' },

  // Conversions
  { id: 'conversions', name: 'Conversions', description: 'Total conversion events' },
  { id: 'total_revenue', name: 'Revenue', description: 'Total revenue from conversions' },
];

export const AVAILABLE_GA_DIMENSIONS = [
  { id: 'date', name: 'Date', description: 'Date of the session' },
  { id: 'source', name: 'Source', description: 'Traffic source' },
  { id: 'medium', name: 'Medium', description: 'Traffic medium' },
  { id: 'campaign', name: 'Campaign', description: 'Campaign name' },
  { id: 'device', name: 'Device', description: 'Device category (mobile/desktop/tablet)' },
  { id: 'country', name: 'Country', description: 'User country' },
];
```

### Rate Limits
- **Quota**: 50,000 requests per day per project (standard)
- **Concurrent requests**: 10 per user
- **Strategy**: Cache aggressively, batch requests when possible

---

## Meta Ads Integration

### Overview
- **Platform**: Meta Ads (Facebook Ads)
- **API**: Marketing API v18.0
- **OAuth**: Facebook Login
- **Documentation**: https://developers.facebook.com/docs/marketing-apis

### OAuth Configuration

```typescript
// src/lib/platforms/meta-ads/oauth.ts

export const META_CONFIG = {
  id: 'meta-ads',
  name: 'Meta Ads',
  provider: 'facebook' as const,
  oauthScopes: [
    'ads_read',
    'ads_management',
    'read_insights',
    'business_management',
  ],
  apiVersion: 'v18.0',
};

export class MetaAdsOAuth {
  private appId: string;
  private appSecret: string;
  private redirectUri: string;

  constructor() {
    this.appId = process.env.META_APP_ID!;
    this.appSecret = process.env.META_APP_SECRET!;
    this.redirectUri = `${process.env.NEXTAUTH_URL}/api/platforms/meta-ads/callback`;
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      state,
      scope: META_CONFIG.oauthScopes.join(','),
      response_type: 'code',
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
  }

  async getTokens(code: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const params = new URLSearchParams({
      client_id: this.appId,
      client_secret: this.appSecret,
      redirect_uri: this.redirectUri,
      code,
    });

    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?${params}`
    );

    if (!response.ok) {
      throw new Error('Meta token exchange failed');
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Exchange short-lived token for long-lived token (60 days)
   */
  async getLongLivedToken(shortLivedToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: this.appId,
      client_secret: this.appSecret,
      fb_exchange_token: shortLivedToken,
    });

    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?${params}`
    );

    if (!response.ok) {
      throw new Error('Long-lived token exchange failed');
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }
}
```

### API Client

```typescript
// src/lib/platforms/meta-ads/client.ts

export interface MetaInsightsRequest {
  adAccountId: string;
  datePreset?: 'today' | 'yesterday' | 'last_7d' | 'last_30d';
  timeRange?: { since: string; until: string };
  fields: string[];
  level?: 'account' | 'campaign' | 'adset' | 'ad';
  limit?: number;
}

export class MetaAdsClient {
  private accessToken: string;
  private apiVersion: string = 'v18.0';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Get ad account insights
   */
  async getInsights(request: MetaInsightsRequest) {
    const accountId = request.adAccountId.startsWith('act_')
      ? request.adAccountId
      : `act_${request.adAccountId}`;

    const params = new URLSearchParams({
      access_token: this.accessToken,
      fields: request.fields.join(','),
      level: request.level || 'account',
      limit: String(request.limit || 1000),
    });

    if (request.datePreset) {
      params.append('date_preset', request.datePreset);
    } else if (request.timeRange) {
      params.append('time_range', JSON.stringify(request.timeRange));
    }

    const url = `https://graph.facebook.com/${this.apiVersion}/${accountId}/insights?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Meta API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * List ad accounts
   */
  async listAdAccounts() {
    const url = `https://graph.facebook.com/${this.apiVersion}/me/adaccounts?access_token=${this.accessToken}&fields=id,name,account_status,currency`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch ad accounts');
    }

    return response.json();
  }

  /**
   * Get campaigns
   */
  async getCampaigns(adAccountId: string) {
    const accountId = adAccountId.startsWith('act_')
      ? adAccountId
      : `act_${adAccountId}`;

    const url = `https://graph.facebook.com/${this.apiVersion}/${accountId}/campaigns?access_token=${this.accessToken}&fields=id,name,status,objective`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    return response.json();
  }
}
```

### Data Transformers

```typescript
// src/lib/platforms/meta-ads/transformers.ts

export function transformMetaInsights(response: any): NormalizedMetric[] {
  const results: NormalizedMetric[] = [];

  response.data?.forEach((row: any) => {
    const date = row.date_start || new Date().toISOString().split('T')[0];

    // Transform each metric
    Object.entries(row).forEach(([key, value]) => {
      if (key === 'date_start' || key === 'date_stop') return;

      results.push({
        date,
        metric: key,
        value: typeof value === 'number' ? value : parseFloat(value) || 0,
        dimensions: {
          campaign_id: row.campaign_id,
          campaign_name: row.campaign_name,
          adset_id: row.adset_id,
          ad_id: row.ad_id,
        },
        metadata: {
          platform: 'meta-ads',
        },
      });
    });
  });

  return results;
}

export const META_METRIC_MAP: Record<string, string> = {
  impressions: 'impressions',
  clicks: 'clicks',
  spend: 'spend',
  reach: 'reach',
  frequency: 'frequency',
  ctr: 'ctr',
  cpc: 'cpc',
  cpm: 'cpm',
  conversions: 'conversions',
  cost_per_conversion: 'cost_per_conversion',
  roas: 'roas',
};
```

### Available Metrics

```typescript
export const AVAILABLE_META_METRICS = [
  { id: 'impressions', name: 'Impressions', description: 'Total ad impressions' },
  { id: 'clicks', name: 'Clicks', description: 'Total link clicks' },
  { id: 'spend', name: 'Spend', description: 'Total amount spent' },
  { id: 'reach', name: 'Reach', description: 'Unique users reached' },
  { id: 'ctr', name: 'CTR', description: 'Click-through rate' },
  { id: 'cpc', name: 'CPC', description: 'Cost per click' },
  { id: 'cpm', name: 'CPM', description: 'Cost per 1000 impressions' },
  { id: 'conversions', name: 'Conversions', description: 'Total conversions' },
  { id: 'roas', name: 'ROAS', description: 'Return on ad spend' },
];
```

### Rate Limits
- **Quota**: 200 calls per hour per user (default)
- **Insights API**: Special rate limits apply
- **Strategy**: Use batching, cache results for 5-15 minutes

---

## Google Ads Integration

### Overview
- **Platform**: Google Ads
- **API**: Google Ads API v14
- **OAuth**: Google OAuth 2.0
- **Documentation**: https://developers.google.com/google-ads/api/docs

### OAuth Configuration

```typescript
// src/lib/platforms/google-ads/oauth.ts

export const GOOGLE_ADS_CONFIG = {
  id: 'google-ads',
  name: 'Google Ads',
  provider: 'google' as const,
  oauthScopes: [
    'https://www.googleapis.com/auth/adwords',
  ],
  apiVersion: 'v14',
};

// Similar to Google Analytics OAuth
// Reuse GoogleAnalyticsOAuth with different scopes
```

### API Client

```typescript
// src/lib/platforms/google-ads/client.ts

// Using @google-ads/google-ads package
import { GoogleAdsApi } from 'google-ads-api';

export class GoogleAdsClient {
  private client: GoogleAdsApi;

  constructor(credentials: {
    client_id: string;
    client_secret: string;
    developer_token: string;
    refresh_token: string;
  }) {
    this.client = new GoogleAdsApi({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      developer_token: credentials.developer_token,
    });
  }

  /**
   * Query campaign performance
   */
  async getCampaignPerformance(customerId: string, dateRange: {
    startDate: string;
    endDate: string;
  }) {
    const customer = this.client.Customer({
      customer_id: customerId,
      refresh_token: this.getRefreshToken(),
    });

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
      ORDER BY metrics.impressions DESC
    `;

    return customer.query(query);
  }

  private getRefreshToken(): string {
    // Return stored refresh token
    return '';
  }
}
```

### Available Metrics

```typescript
export const AVAILABLE_GOOGLE_ADS_METRICS = [
  { id: 'impressions', name: 'Impressions', description: 'Total impressions' },
  { id: 'clicks', name: 'Clicks', description: 'Total clicks' },
  { id: 'cost', name: 'Cost', description: 'Total cost' },
  { id: 'conversions', name: 'Conversions', description: 'Total conversions' },
  { id: 'ctr', name: 'CTR', description: 'Click-through rate' },
  { id: 'avg_cpc', name: 'Avg. CPC', description: 'Average cost per click' },
  { id: 'conversion_rate', name: 'Conv. Rate', description: 'Conversion rate' },
];
```

---

## LinkedIn Ads Integration

### Overview
- **Platform**: LinkedIn Ads
- **API**: Marketing API v2023-11
- **OAuth**: LinkedIn OAuth 2.0
- **Documentation**: https://learn.microsoft.com/en-us/linkedin/marketing/

### OAuth Configuration

```typescript
// src/lib/platforms/linkedin-ads/oauth.ts

export const LINKEDIN_CONFIG = {
  id: 'linkedin-ads',
  name: 'LinkedIn Ads',
  provider: 'linkedin' as const,
  oauthScopes: [
    'r_ads',
    'r_ads_reporting',
    'rw_ads',
  ],
  apiVersion: '202311',
};

export class LinkedInAdsOAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.LINKEDIN_CLIENT_ID!;
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
    this.redirectUri = `${process.env.NEXTAUTH_URL}/api/platforms/linkedin-ads/callback`;
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
      scope: LINKEDIN_CONFIG.oauthScopes.join(' '),
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  }

  async getTokens(code: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('LinkedIn token exchange failed');
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }
}
```

### API Client

```typescript
// src/lib/platforms/linkedin-ads/client.ts

export class LinkedInAdsClient {
  private accessToken: string;
  private apiVersion: string = '202311';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Get analytics for campaigns
   */
  async getAnalytics(request: {
    accounts: string[];
    dateRange: { start: number; end: number };
    fields: string[];
  }) {
    const url = 'https://api.linkedin.com/rest/adAnalytics';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'LinkedIn-Version': this.apiVersion,
        'X-RestLi-Protocol-Version': '2.0.0',
      },
    });

    if (!response.ok) {
      throw new Error('LinkedIn API request failed');
    }

    return response.json();
  }
}
```

---

## Unified Data Layer

### Platform Service Factory

```typescript
// src/lib/platforms/index.ts

import { GoogleAnalyticsService } from './google-analytics';
import { MetaAdsService } from './meta-ads';
import { GoogleAdsService } from './google-ads';
import { LinkedInAdsService } from './linkedin-ads';

export class PlatformServiceFactory {
  static create(platformId: string, credentials: PlatformCredentials): IPlatform {
    switch (platformId) {
      case 'google-analytics':
        return new GoogleAnalyticsService(credentials);
      case 'meta-ads':
        return new MetaAdsService(credentials);
      case 'google-ads':
        return new GoogleAdsService(credentials);
      case 'linkedin-ads':
        return new LinkedInAdsService(credentials);
      default:
        throw new Error(`Unsupported platform: ${platformId}`);
    }
  }
}

/**
 * Fetch data from multiple platforms
 */
export async function fetchFromMultiplePlatforms(
  platforms: Array<{ id: string; credentials: PlatformCredentials }>,
  query: MetricQuery
): Promise<PlatformResponse[]> {
  const promises = platforms.map(async ({ id, credentials }) => {
    const service = PlatformServiceFactory.create(id, credentials);
    return service.fetchMetrics(credentials, query);
  });

  return Promise.allSettled(promises).then((results) =>
    results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          error: result.reason.message,
          timestamp: new Date().toISOString(),
        };
      }
    })
  );
}
```

---

## Security & Compliance

### Environment Variables

```bash
# .env.local

# Google Analytics
GOOGLE_ANALYTICS_CLIENT_ID=your_client_id
GOOGLE_ANALYTICS_CLIENT_SECRET=your_client_secret

# Meta Ads
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret

# Google Ads
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token

# LinkedIn Ads
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

# Encryption
PLATFORM_CREDENTIALS_ENCRYPTION_KEY=your_32_char_key
```

### Credential Encryption

```typescript
// src/lib/platforms/encryption.ts

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.PLATFORM_CREDENTIALS_ENCRYPTION_KEY!, 'hex');

export function encryptToken(token: string): {
  encrypted: string;
  iv: string;
  authTag: string;
} {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

export function decryptToken(data: {
  encrypted: string;
  iv: string;
  authTag: string;
}): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(data.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));

  let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### PlatformConnection Model

```typescript
// src/models/PlatformConnection.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IPlatformConnection extends Document {
  userId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  platformId: string;
  platformName: string;

  // Encrypted credentials
  encryptedAccessToken: string;
  accessTokenIV: string;
  accessTokenAuthTag: string;

  encryptedRefreshToken?: string;
  refreshTokenIV?: string;
  refreshTokenAuthTag?: string;

  expiresAt: Date;
  scopes: string[];

  // Platform-specific metadata
  metadata: {
    accountId?: string;
    propertyId?: string;
    [key: string]: any;
  };

  status: 'active' | 'expired' | 'revoked';
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PlatformConnectionSchema = new Schema<IPlatformConnection>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    platformId: { type: String, required: true },
    platformName: { type: String, required: true },

    encryptedAccessToken: { type: String, required: true },
    accessTokenIV: { type: String, required: true },
    accessTokenAuthTag: { type: String, required: true },

    encryptedRefreshToken: String,
    refreshTokenIV: String,
    refreshTokenAuthTag: String,

    expiresAt: { type: Date, required: true },
    scopes: [String],

    metadata: { type: Schema.Types.Mixed, default: {} },

    status: {
      type: String,
      enum: ['active', 'expired', 'revoked'],
      default: 'active',
    },

    lastSyncedAt: Date,
  },
  { timestamps: true }
);

PlatformConnectionSchema.index({ userId: 1, clientId: 1, platformId: 1 });
PlatformConnectionSchema.index({ status: 1, expiresAt: 1 });

export default mongoose.models.PlatformConnection ||
  mongoose.model<IPlatformConnection>('PlatformConnection', PlatformConnectionSchema);
```

---

## Rate Limiting & Caching

### Redis Caching Strategy

```typescript
// src/lib/cache/strategies.ts

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export interface CacheOptions {
  ttl: number; // seconds
  prefix: string;
}

export async function getCached<T>(
  key: string,
  options: CacheOptions
): Promise<T | null> {
  const fullKey = `${options.prefix}:${key}`;
  const cached = await redis.get(fullKey);
  return cached as T | null;
}

export async function setCache<T>(
  key: string,
  value: T,
  options: CacheOptions
): Promise<void> {
  const fullKey = `${options.prefix}:${key}`;
  await redis.set(fullKey, value, { ex: options.ttl });
}

/**
 * Cache TTL by platform
 */
export const PLATFORM_CACHE_TTL = {
  'google-analytics': 300,  // 5 minutes
  'meta-ads': 600,          // 10 minutes
  'google-ads': 600,        // 10 minutes
  'linkedin-ads': 900,      // 15 minutes
};
```

### Rate Limiting

```typescript
// src/lib/rateLimit.ts

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const platformRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 h'), // 60 requests per hour
  analytics: true,
});

export async function checkRateLimit(
  userId: string,
  platformId: string
): Promise<{ success: boolean; limit: number; remaining: number }> {
  const key = `platform:${platformId}:${userId}`;
  const result = await platformRateLimiter.limit(key);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
  };
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// __tests__/lib/platforms/google-analytics.test.ts

import { GoogleAnalyticsService } from '@/lib/platforms/google-analytics';
import { transformGA4Response } from '@/lib/platforms/google-analytics/transformers';

describe('GoogleAnalyticsService', () => {
  it('should transform GA4 response correctly', () => {
    const mockResponse = {
      dimensionHeaders: [{ name: 'date' }],
      metricHeaders: [{ name: 'sessions' }],
      rows: [
        {
          dimensionValues: [{ value: '2025-11-22' }],
          metricValues: [{ value: '1234' }],
        },
      ],
    };

    const result = transformGA4Response(mockResponse);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      date: '2025-11-22',
      metric: 'sessions',
      value: 1234,
    });
  });
});
```

### Integration Tests

```typescript
// __tests__/api/platforms/google-analytics.test.ts

import { GET } from '@/app/api/platforms/google-analytics/data/route';

describe('GET /api/platforms/google-analytics/data', () => {
  it('should return analytics data', async () => {
    const request = new Request('http://localhost:3000/api/platforms/google-analytics/data', {
      headers: {
        'Authorization': 'Bearer test-token',
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });
});
```

---

## Implementation Timeline

### Week 1: Foundation
- **Day 1-2**: Set up unified platform interface, base classes
- **Day 3-4**: Implement PlatformConnection model with encryption
- **Day 5**: Set up Redis caching and rate limiting

### Week 2: Google Analytics & Meta Ads
- **Day 1-2**: Google Analytics OAuth + API client
- **Day 3-4**: Meta Ads OAuth + API client
- **Day 5**: Testing and debugging

### Week 3: Google Ads & LinkedIn Ads
- **Day 1-2**: Google Ads integration
- **Day 3-4**: LinkedIn Ads integration
- **Day 5**: Cross-platform testing

### Week 4: Polish & Production
- **Day 1-2**: Error handling, retry logic
- **Day 3**: Performance optimization
- **Day 4**: Security audit
- **Day 5**: Documentation and deployment

---

## Success Criteria

- [ ] All 4 platforms successfully integrated
- [ ] OAuth flows working end-to-end
- [ ] Token encryption/decryption secure
- [ ] Rate limiting prevents API quota exhaustion
- [ ] Caching reduces API calls by 70%+
- [ ] Error handling graceful and informative
- [ ] Unit test coverage > 80%
- [ ] Integration tests passing
- [ ] Security audit passed
- [ ] Documentation complete

---

**Next Phase**: [PHASE-6-CONVERSATIONS.md](./PHASE-6-CONVERSATIONS.md) - Conversation Persistence & History
