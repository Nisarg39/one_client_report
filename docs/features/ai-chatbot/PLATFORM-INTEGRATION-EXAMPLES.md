# Platform Integration Code Examples

**Document Version:** 1.0
**Last Updated:** 2025-11-22
**Status:** Implementation Guide
**Companion Doc:** [PHASE-5-PLATFORM-APIS.md](./PHASE-5-PLATFORM-APIS.md)

---

## Table of Contents

1. [Setup & Installation](#setup--installation)
2. [Google Analytics Examples](#google-analytics-examples)
3. [Meta Ads Examples](#meta-ads-examples)
4. [Server Actions](#server-actions)
5. [API Routes](#api-routes)
6. [Frontend Components](#frontend-components)
7. [AI Integration](#ai-integration)
8. [Error Handling Examples](#error-handling-examples)
9. [Testing Examples](#testing-examples)

---

## Setup & Installation

### Package Installation

```bash
# Install platform SDKs
npm install @google-analytics/data@^4.0.0
npm install google-ads-api@^17.0.0
npm install @upstash/redis@^1.25.0
npm install @upstash/ratelimit@^1.0.0

# Install encryption utilities
npm install bcryptjs@^2.4.3
npm install @types/bcryptjs@^2.4.6 --save-dev

# For testing
npm install --save-dev vitest@^1.0.0
npm install --save-dev @testing-library/react@^14.0.0
```

### Environment Variables

```bash
# .env.local

# Google Analytics
GOOGLE_ANALYTICS_CLIENT_ID=101955302048-xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_ANALYTICS_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxx

# Meta Ads
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret

# Google Ads
GOOGLE_ADS_CLIENT_ID=your_google_ads_client_id
GOOGLE_ADS_CLIENT_SECRET=your_google_ads_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token

# LinkedIn Ads
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Redis (Upstash)
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your_redis_token

# Encryption
PLATFORM_CREDENTIALS_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef  # 32 chars hex
```

---

## Google Analytics Examples

### Complete Service Implementation

```typescript
// src/lib/platforms/google-analytics/index.ts

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { IPlatform, MetricQuery, PlatformResponse, PlatformCredentials } from '../types';
import { transformGA4Response, GA_METRIC_MAP, GA_DIMENSION_MAP } from './transformers';
import { GoogleAnalyticsOAuth } from './oauth';
import { getCached, setCache, PLATFORM_CACHE_TTL } from '@/lib/cache/strategies';

export class GoogleAnalyticsService implements IPlatform {
  config = {
    id: 'google-analytics',
    name: 'Google Analytics',
    provider: 'google' as const,
    oauthScopes: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    apiVersion: 'v1',
  };

  private oauth: GoogleAnalyticsOAuth;

  constructor() {
    this.oauth = new GoogleAnalyticsOAuth();
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthUrl(redirectUri: string, state: string): string {
    return this.oauth.getAuthUrl(state);
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(
    code: string,
    state: string
  ): Promise<PlatformCredentials> {
    const tokens = await this.oauth.getTokens(code);

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expiresIn);

    return {
      clientId: '', // Will be set by caller
      userId: '', // Will be set by caller
      platformId: this.config.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt,
      scopes: this.config.oauthScopes,
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<PlatformCredentials> {
    const tokens = await this.oauth.refreshToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expiresIn);

    return {
      clientId: '',
      userId: '',
      platformId: this.config.id,
      accessToken: tokens.accessToken,
      refreshToken, // Keep existing refresh token
      expiresAt,
      scopes: this.config.oauthScopes,
    };
  }

  /**
   * Fetch metrics from Google Analytics
   */
  async fetchMetrics(
    credentials: PlatformCredentials,
    query: MetricQuery
  ): Promise<PlatformResponse> {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(credentials, query);
      const cached = await getCached<PlatformResponse>(cacheKey, {
        prefix: 'ga',
        ttl: PLATFORM_CACHE_TTL['google-analytics'],
      });

      if (cached) {
        return { ...cached, cached: true };
      }

      // Refresh token if expired
      let accessToken = credentials.accessToken;
      if (new Date() >= credentials.expiresAt) {
        const refreshed = await this.refreshAccessToken(credentials.refreshToken!);
        accessToken = refreshed.accessToken;
      }

      // Create client
      const client = new BetaAnalyticsDataClient({
        credentials: { access_token: accessToken },
      });

      // Map user-friendly metric names to GA4 API names
      const apiMetrics = query.metrics.map((m) => ({
        name: GA_METRIC_MAP[m] || m,
      }));

      const apiDimensions = query.dimensions?.map((d) => ({
        name: GA_DIMENSION_MAP[d] || d,
      }));

      // Get property ID from metadata
      const propertyId = credentials.metadata?.propertyId;
      if (!propertyId) {
        throw new Error('Google Analytics property ID not found');
      }

      // Run report
      const [response] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
          {
            startDate: query.startDate,
            endDate: query.endDate,
          },
        ],
        metrics: apiMetrics,
        dimensions: apiDimensions,
        limit: query.limit || 10000,
      });

      // Transform response
      const normalizedData = transformGA4Response(response);

      const result: PlatformResponse = {
        success: true,
        data: normalizedData,
        timestamp: new Date().toISOString(),
      };

      // Cache result
      await setCache(cacheKey, result, {
        prefix: 'ga',
        ttl: PLATFORM_CACHE_TTL['google-analytics'],
      });

      return result;
    } catch (error: any) {
      console.error('[GoogleAnalytics] Error fetching metrics:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch Google Analytics data',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Test connection to Google Analytics
   */
  async testConnection(credentials: PlatformCredentials): Promise<boolean> {
    try {
      const client = new BetaAnalyticsDataClient({
        credentials: { access_token: credentials.accessToken },
      });

      // Simple test: get metadata (lightweight request)
      const propertyId = credentials.metadata?.propertyId;
      if (!propertyId) return false;

      const [response] = await client.getMetadata({
        name: `properties/${propertyId}/metadata`,
      });

      return !!response;
    } catch (error) {
      console.error('[GoogleAnalytics] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available metrics
   */
  getAvailableMetrics(): string[] {
    return Object.keys(GA_METRIC_MAP);
  }

  /**
   * Get available dimensions
   */
  getAvailableDimensions(): string[] {
    return Object.keys(GA_DIMENSION_MAP);
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(
    credentials: PlatformCredentials,
    query: MetricQuery
  ): string {
    const parts = [
      credentials.userId,
      credentials.clientId,
      query.startDate,
      query.endDate,
      query.metrics.sort().join(','),
      query.dimensions?.sort().join(',') || 'none',
    ];
    return parts.join(':');
  }
}
```

### Usage Example

```typescript
// Example: Fetch GA data for a client

import { GoogleAnalyticsService } from '@/lib/platforms/google-analytics';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { decryptToken } from '@/lib/platforms/encryption';

async function getGoogleAnalyticsData(clientId: string, userId: string) {
  // 1. Get stored credentials
  const connection = await PlatformConnectionModel.findOne({
    clientId,
    userId,
    platformId: 'google-analytics',
    status: 'active',
  });

  if (!connection) {
    throw new Error('Google Analytics not connected');
  }

  // 2. Decrypt access token
  const accessToken = decryptToken({
    encrypted: connection.encryptedAccessToken,
    iv: connection.accessTokenIV,
    authTag: connection.accessTokenAuthTag,
  });

  const refreshToken = connection.encryptedRefreshToken
    ? decryptToken({
        encrypted: connection.encryptedRefreshToken,
        iv: connection.refreshTokenIV!,
        authTag: connection.refreshTokenAuthTag!,
      })
    : undefined;

  // 3. Create credentials object
  const credentials = {
    clientId,
    userId,
    platformId: 'google-analytics',
    accessToken,
    refreshToken,
    expiresAt: connection.expiresAt,
    scopes: connection.scopes,
    metadata: connection.metadata,
  };

  // 4. Fetch data
  const service = new GoogleAnalyticsService();
  const result = await service.fetchMetrics(credentials, {
    startDate: '2025-11-01',
    endDate: '2025-11-22',
    metrics: ['sessions', 'users', 'pageviews'],
    dimensions: ['date', 'source'],
  });

  return result;
}
```

---

## Meta Ads Examples

### Complete Service Implementation

```typescript
// src/lib/platforms/meta-ads/index.ts

import { IPlatform, MetricQuery, PlatformResponse, PlatformCredentials } from '../types';
import { MetaAdsClient } from './client';
import { MetaAdsOAuth } from './oauth';
import { transformMetaInsights, META_METRIC_MAP } from './transformers';
import { getCached, setCache, PLATFORM_CACHE_TTL } from '@/lib/cache/strategies';

export class MetaAdsService implements IPlatform {
  config = {
    id: 'meta-ads',
    name: 'Meta Ads',
    provider: 'facebook' as const,
    oauthScopes: ['ads_read', 'ads_management', 'read_insights'],
    apiVersion: 'v18.0',
  };

  private oauth: MetaAdsOAuth;

  constructor() {
    this.oauth = new MetaAdsOAuth();
  }

  getAuthUrl(redirectUri: string, state: string): string {
    return this.oauth.getAuthUrl(state);
  }

  async handleCallback(code: string, state: string): Promise<PlatformCredentials> {
    // Get short-lived token
    const shortLivedToken = await this.oauth.getTokens(code);

    // Exchange for long-lived token (60 days)
    const tokens = await this.oauth.getLongLivedToken(shortLivedToken.accessToken);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expiresIn);

    return {
      clientId: '',
      userId: '',
      platformId: this.config.id,
      accessToken: tokens.accessToken,
      expiresAt,
      scopes: this.config.oauthScopes,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<PlatformCredentials> {
    // Meta uses long-lived tokens (60 days) - no refresh needed
    // When token expires, user must re-authenticate
    throw new Error('Meta Ads tokens cannot be refreshed. User must re-authenticate.');
  }

  async fetchMetrics(
    credentials: PlatformCredentials,
    query: MetricQuery
  ): Promise<PlatformResponse> {
    try {
      const cacheKey = this.generateCacheKey(credentials, query);
      const cached = await getCached<PlatformResponse>(cacheKey, {
        prefix: 'meta',
        ttl: PLATFORM_CACHE_TTL['meta-ads'],
      });

      if (cached) {
        return { ...cached, cached: true };
      }

      const client = new MetaAdsClient(credentials.accessToken);

      // Get ad account ID from metadata
      const adAccountId = credentials.metadata?.accountId;
      if (!adAccountId) {
        throw new Error('Meta Ads account ID not found');
      }

      // Map metrics
      const fields = query.metrics.map((m) => META_METRIC_MAP[m] || m);

      // Fetch insights
      const response = await client.getInsights({
        adAccountId,
        timeRange: {
          since: query.startDate,
          until: query.endDate,
        },
        fields,
        level: 'account',
      });

      // Transform
      const normalizedData = transformMetaInsights(response);

      const result: PlatformResponse = {
        success: true,
        data: normalizedData,
        timestamp: new Date().toISOString(),
      };

      await setCache(cacheKey, result, {
        prefix: 'meta',
        ttl: PLATFORM_CACHE_TTL['meta-ads'],
      });

      return result;
    } catch (error: any) {
      console.error('[MetaAds] Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch Meta Ads data',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async testConnection(credentials: PlatformCredentials): Promise<boolean> {
    try {
      const client = new MetaAdsClient(credentials.accessToken);
      const accounts = await client.listAdAccounts();
      return !!accounts.data && accounts.data.length > 0;
    } catch (error) {
      return false;
    }
  }

  getAvailableMetrics(): string[] {
    return Object.keys(META_METRIC_MAP);
  }

  getAvailableDimensions(): string[] {
    return ['date', 'campaign_name', 'adset_name', 'ad_name'];
  }

  private generateCacheKey(
    credentials: PlatformCredentials,
    query: MetricQuery
  ): string {
    return [
      credentials.userId,
      credentials.clientId,
      query.startDate,
      query.endDate,
      query.metrics.sort().join(','),
    ].join(':');
  }
}
```

---

## Server Actions

### Connect Platform Action

```typescript
// src/app/actions/platforms/connectPlatform.ts

'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/adapter';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { PlatformServiceFactory } from '@/lib/platforms';
import { encryptToken } from '@/lib/platforms/encryption';
import { connectDB } from '@/lib/db';

const ConnectPlatformSchema = z.object({
  clientId: z.string().min(1),
  platformId: z.enum(['google-analytics', 'meta-ads', 'google-ads', 'linkedin-ads']),
  code: z.string().min(1), // OAuth authorization code
  state: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

export async function connectPlatform(input: z.infer<typeof ConnectPlatformSchema>) {
  try {
    // Validate input
    const validated = ConnectPlatformSchema.parse(input);

    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    await connectDB();

    // Get platform service
    const service = PlatformServiceFactory.create(validated.platformId, {} as any);

    // Exchange code for tokens
    const credentials = await service.handleCallback(validated.code, validated.state);

    // Encrypt tokens
    const encryptedAccess = encryptToken(credentials.accessToken);
    const encryptedRefresh = credentials.refreshToken
      ? encryptToken(credentials.refreshToken)
      : null;

    // Check if connection already exists
    const existing = await PlatformConnectionModel.findOne({
      userId: user.id,
      clientId: validated.clientId,
      platformId: validated.platformId,
    });

    if (existing) {
      // Update existing connection
      existing.encryptedAccessToken = encryptedAccess.encrypted;
      existing.accessTokenIV = encryptedAccess.iv;
      existing.accessTokenAuthTag = encryptedAccess.authTag;

      if (encryptedRefresh) {
        existing.encryptedRefreshToken = encryptedRefresh.encrypted;
        existing.refreshTokenIV = encryptedRefresh.iv;
        existing.refreshTokenAuthTag = encryptedRefresh.authTag;
      }

      existing.expiresAt = credentials.expiresAt;
      existing.scopes = credentials.scopes;
      existing.metadata = validated.metadata || {};
      existing.status = 'active';

      await existing.save();

      return {
        success: true,
        connectionId: existing._id.toString(),
      };
    }

    // Create new connection
    const connection = await PlatformConnectionModel.create({
      userId: user.id,
      clientId: validated.clientId,
      platformId: validated.platformId,
      platformName: service.config.name,

      encryptedAccessToken: encryptedAccess.encrypted,
      accessTokenIV: encryptedAccess.iv,
      accessTokenAuthTag: encryptedAccess.authTag,

      encryptedRefreshToken: encryptedRefresh?.encrypted,
      refreshTokenIV: encryptedRefresh?.iv,
      refreshTokenAuthTag: encryptedRefresh?.authTag,

      expiresAt: credentials.expiresAt,
      scopes: credentials.scopes,
      metadata: validated.metadata || {},
      status: 'active',
    });

    return {
      success: true,
      connectionId: connection._id.toString(),
    };
  } catch (error: any) {
    console.error('[connectPlatform] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect platform',
    };
  }
}
```

### Fetch Platform Data Action

```typescript
// src/app/actions/platforms/fetchPlatformData.ts

'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/adapter';
import PlatformConnectionModel from '@/models/PlatformConnection';
import { PlatformServiceFactory } from '@/lib/platforms';
import { decryptToken } from '@/lib/platforms/encryption';
import { checkRateLimit } from '@/lib/rateLimit';
import { connectDB } from '@/lib/db';

const FetchDataSchema = z.object({
  clientId: z.string().min(1),
  platformId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  metrics: z.array(z.string()),
  dimensions: z.array(z.string()).optional(),
});

export async function fetchPlatformData(input: z.infer<typeof FetchDataSchema>) {
  try {
    const validated = FetchDataSchema.parse(input);

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(user.id, validated.platformId);
    if (!rateLimitResult.success) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
      };
    }

    await connectDB();

    // Get platform connection
    const connection = await PlatformConnectionModel.findOne({
      userId: user.id,
      clientId: validated.clientId,
      platformId: validated.platformId,
      status: 'active',
    });

    if (!connection) {
      return {
        success: false,
        error: 'Platform not connected',
      };
    }

    // Decrypt credentials
    const accessToken = decryptToken({
      encrypted: connection.encryptedAccessToken,
      iv: connection.accessTokenIV,
      authTag: connection.accessTokenAuthTag,
    });

    const refreshToken = connection.encryptedRefreshToken
      ? decryptToken({
          encrypted: connection.encryptedRefreshToken,
          iv: connection.refreshTokenIV!,
          authTag: connection.refreshTokenAuthTag!,
        })
      : undefined;

    const credentials = {
      clientId: validated.clientId,
      userId: user.id,
      platformId: validated.platformId,
      accessToken,
      refreshToken,
      expiresAt: connection.expiresAt,
      scopes: connection.scopes,
      metadata: connection.metadata,
    };

    // Fetch data
    const service = PlatformServiceFactory.create(validated.platformId, credentials);
    const result = await service.fetchMetrics(credentials, {
      startDate: validated.startDate,
      endDate: validated.endDate,
      metrics: validated.metrics,
      dimensions: validated.dimensions,
    });

    // Update last synced time
    connection.lastSyncedAt = new Date();
    await connection.save();

    return result;
  } catch (error: any) {
    console.error('[fetchPlatformData] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch platform data',
    };
  }
}
```

---

## API Routes

### Google Analytics OAuth Callback

```typescript
// src/app/api/platforms/google-analytics/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectPlatform } from '@/app/actions/platforms/connectPlatform';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/onboarding?error=${error}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/onboarding?error=missing_params', request.url)
      );
    }

    // Parse state (should contain clientId and returnUrl)
    const stateData = JSON.parse(decodeURIComponent(state));

    // After successful OAuth, redirect to property selection
    // (User needs to select which GA4 property to connect)
    const redirectUrl = new URL('/onboarding/select-ga-property', request.url);
    redirectUrl.searchParams.set('code', code);
    redirectUrl.searchParams.set('clientId', stateData.clientId);

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('[GA OAuth Callback] Error:', error);
    return NextResponse.redirect(
      new URL('/onboarding?error=callback_failed', request.url)
    );
  }
}
```

### Platform Data Endpoint

```typescript
// src/app/api/platforms/[platformId]/data/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fetchPlatformData } from '@/app/actions/platforms/fetchPlatformData';

export async function POST(
  request: NextRequest,
  { params }: { params: { platformId: string } }
) {
  try {
    const body = await request.json();

    const result = await fetchPlatformData({
      platformId: params.platformId,
      ...body,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
```

---

## Frontend Components

### Platform Connection Button

```typescript
// src/components/onboarding/PlatformConnectButton.tsx

'use client';

import { useState } from 'react';
import { PlatformServiceFactory } from '@/lib/platforms';

interface PlatformConnectButtonProps {
  platformId: string;
  platformName: string;
  clientId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PlatformConnectButton({
  platformId,
  platformName,
  clientId,
  onSuccess,
  onError,
}: PlatformConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);

      // Generate state with clientId
      const state = encodeURIComponent(
        JSON.stringify({
          clientId,
          timestamp: Date.now(),
        })
      );

      // Get OAuth URL
      const service = PlatformServiceFactory.create(platformId, {} as any);
      const redirectUri = `${window.location.origin}/api/platforms/${platformId}/callback`;
      const authUrl = service.getAuthUrl(redirectUri, state);

      // Open OAuth popup
      const popup = window.open(
        authUrl,
        'oauth-popup',
        'width=600,height=700,scrollbars=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for OAuth completion
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'oauth-success') {
          popup?.close();
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
          onSuccess?.();
        } else if (event.data.type === 'oauth-error') {
          popup?.close();
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
          onError?.(event.data.error);
        }
      };

      window.addEventListener('message', handleMessage);

      // Clean up if popup is closed manually
      const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
        }
      }, 1000);
    } catch (error: any) {
      console.error('Platform connection error:', error);
      setIsConnecting(false);
      onError?.(error.message);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
    >
      {isConnecting ? 'Connecting...' : `Connect ${platformName}`}
    </button>
  );
}
```

### Data Display Component

```typescript
// src/components/analytics/MetricsChart.tsx

'use client';

import { useEffect, useState } from 'react';
import { fetchPlatformData } from '@/app/actions/platforms/fetchPlatformData';
import { Line } from 'react-chartjs-2';

interface MetricsChartProps {
  clientId: string;
  platformId: string;
  metric: string;
}

export function MetricsChart({ clientId, platformId, metric }: MetricsChartProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [clientId, platformId, metric]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const result = await fetchPlatformData({
        clientId,
        platformId,
        startDate,
        endDate,
        metrics: [metric],
        dimensions: ['date'],
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Transform for chart
      const chartData = {
        labels: result.data?.map((d: any) => d.date) || [],
        datasets: [
          {
            label: metric,
            data: result.data?.map((d: any) => d.value) || [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
        ],
      };

      setData(chartData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{metric}</h3>
      <Line data={data} />
    </div>
  );
}
```

---

## AI Integration

### AI Chat Handler with Platform Data

```typescript
// src/lib/ai/handlers/analyticsChatHandler.ts

import { fetchPlatformData } from '@/app/actions/platforms/fetchPlatformData';
import { generateCompletion } from '../openai';

export async function analyticsChatHandler(input: {
  clientId: string;
  userId: string;
  message: string;
  connectedPlatforms: string[];
}) {
  // 1. Determine which platforms to query based on user message
  const platformsToQuery = determinePlatforms(input.message, input.connectedPlatforms);

  // 2. Determine date range
  const dateRange = extractDateRange(input.message);

  // 3. Fetch data from platforms
  const platformData = await Promise.all(
    platformsToQuery.map(async (platformId) => {
      const result = await fetchPlatformData({
        clientId: input.clientId,
        platformId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        metrics: ['sessions', 'users', 'conversions', 'revenue'],
        dimensions: ['date'],
      });

      return {
        platform: platformId,
        data: result.data,
      };
    })
  );

  // 4. Create AI prompt with context
  const prompt = `
You are an AI analytics assistant. Analyze the following data and answer the user's question.

User Question: "${input.message}"

Platform Data:
${JSON.stringify(platformData, null, 2)}

Provide a clear, actionable answer with specific numbers and insights.
`;

  // 5. Generate AI response
  const aiResponse = await generateCompletion({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful analytics assistant.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return {
    response: aiResponse,
    platformData,
  };
}

function determinePlatforms(message: string, available: string[]): string[] {
  const lowerMessage = message.toLowerCase();

  const platformKeywords: Record<string, string[]> = {
    'google-analytics': ['analytics', 'ga', 'website', 'traffic', 'visitors'],
    'meta-ads': ['meta', 'facebook', 'instagram', 'fb ads'],
    'google-ads': ['google ads', 'adwords', 'search ads'],
    'linkedin-ads': ['linkedin', 'linkedin ads'],
  };

  const matches = available.filter((platform) => {
    const keywords = platformKeywords[platform] || [];
    return keywords.some((keyword) => lowerMessage.includes(keyword));
  });

  return matches.length > 0 ? matches : available;
}

function extractDateRange(message: string): {
  startDate: string;
  endDate: string;
} {
  const today = new Date();
  let startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 30); // Default: last 30 days

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('today')) {
    startDate = new Date(today);
  } else if (lowerMessage.includes('yesterday')) {
    startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 1);
  } else if (lowerMessage.includes('last 7 days')) {
    startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7);
  } else if (lowerMessage.includes('last month')) {
    startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 1);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
}
```

---

## Error Handling Examples

### Retry Logic

```typescript
// src/lib/platforms/utils/retry.ts

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on auth errors
      if (error.message.includes('auth') || error.message.includes('unauthorized')) {
        throw error;
      }

      // Exponential backoff
      const delay = initialDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Usage
const result = await retryWithBackoff(
  () => service.fetchMetrics(credentials, query),
  3,
  1000
);
```

### Global Error Handling

```typescript
// src/lib/platforms/errors.ts

export class PlatformError extends Error {
  constructor(
    message: string,
    public platformId: string,
    public code?: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'PlatformError';
  }
}

export class AuthenticationError extends PlatformError {
  constructor(platformId: string) {
    super(
      'Authentication failed. Please reconnect this platform.',
      platformId,
      'AUTH_ERROR',
      false
    );
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends PlatformError {
  constructor(platformId: string) {
    super(
      'Rate limit exceeded. Please try again later.',
      platformId,
      'RATE_LIMIT',
      true
    );
    this.name = 'RateLimitError';
  }
}
```

---

## Testing Examples

### Unit Test Example

```typescript
// __tests__/lib/platforms/google-analytics.test.ts

import { describe, it, expect, vi } from 'vitest';
import { GoogleAnalyticsService } from '@/lib/platforms/google-analytics';

describe('GoogleAnalyticsService', () => {
  it('should generate correct cache key', () => {
    const service = new GoogleAnalyticsService();

    const key = (service as any).generateCacheKey(
      {
        userId: 'user1',
        clientId: 'client1',
      },
      {
        startDate: '2025-11-01',
        endDate: '2025-11-22',
        metrics: ['sessions', 'users'],
        dimensions: ['date'],
      }
    );

    expect(key).toBe('user1:client1:2025-11-01:2025-11-22:sessions,users:date');
  });

  it('should handle fetch errors gracefully', async () => {
    const service = new GoogleAnalyticsService();

    // Mock client to throw error
    vi.mock('@google-analytics/data', () => ({
      BetaAnalyticsDataClient: vi.fn(() => ({
        runReport: vi.fn().mockRejectedValue(new Error('API Error')),
      })),
    }));

    const result = await service.fetchMetrics({} as any, {} as any);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### Integration Test Example

```typescript
// __tests__/api/platforms/google-analytics/data.test.ts

import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/platforms/google-analytics/data/route';

describe('POST /api/platforms/google-analytics/data', () => {
  it('should return 400 if clientId missing', async () => {
    const request = new Request('http://localhost:3000/api/platforms/google-analytics/data', {
      method: 'POST',
      body: JSON.stringify({
        startDate: '2025-11-01',
        endDate: '2025-11-22',
        metrics: ['sessions'],
      }),
    });

    const response = await POST(request, {
      params: { platformId: 'google-analytics' },
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });
});
```

---

**Next Steps:**

1. Install required packages
2. Set up environment variables
3. Implement one platform at a time (start with Google Analytics)
4. Test OAuth flow end-to-end
5. Integrate with AI chat handler

For architecture details, see [PHASE-5-PLATFORM-APIS.md](./PHASE-5-PLATFORM-APIS.md)
