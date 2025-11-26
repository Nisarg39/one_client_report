/**
 * Unified Platform Types
 *
 * Shared types and interfaces for all platform integrations
 */

/**
 * Platform configuration
 */
export interface PlatformConfig {
  id: string;
  name: string;
  provider: 'google' | 'facebook' | 'linkedin';
  oauthScopes: string[];
  apiVersion: string;
}

/**
 * Platform credentials (encrypted in database)
 */
export interface PlatformCredentials {
  id: string;
  userId: string;
  clientId: string;
  platformId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scopes: string[];
  metadata?: Record<string, any>;
}

/**
 * Query filter for metrics
 */
export interface QueryFilter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte';
  value: string | number;
}

/**
 * Metric query request
 */
export interface MetricQuery {
  startDate: string;      // ISO date (YYYY-MM-DD)
  endDate: string;        // ISO date (YYYY-MM-DD)
  metrics: string[];      // e.g., ['sessions', 'pageviews']
  dimensions?: string[];  // e.g., ['date', 'source']
  filters?: QueryFilter[];
  limit?: number;
}

/**
 * Normalized metric response
 */
export interface NormalizedMetric {
  date: string;
  metric: string;
  value: number;
  dimensions?: Record<string, string>;
  metadata?: Record<string, any>;
}

/**
 * Platform response wrapper
 */
export interface PlatformResponse {
  success: boolean;
  data?: NormalizedMetric[];
  error?: string;
  cached?: boolean;
  timestamp: string;
}

/**
 * OAuth token response
 */
export interface OAuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // seconds
}

/**
 * Available metric definition
 */
export interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  category?: string;
}

/**
 * Available dimension definition
 */
export interface DimensionDefinition {
  id: string;
  name: string;
  description: string;
  category?: string;
}

/**
 * Base platform interface
 * All platform services must implement this interface
 */
export interface IPlatform {
  config: PlatformConfig;

  // OAuth methods
  getAuthUrl(redirectUri: string, state: string): string;
  handleCallback(code: string, state: string): Promise<PlatformCredentials>;
  refreshAccessToken(refreshToken: string): Promise<PlatformCredentials>;

  // Data methods
  fetchMetrics(
    credentials: PlatformCredentials,
    query: MetricQuery
  ): Promise<PlatformResponse>;

  testConnection(credentials: PlatformCredentials): Promise<boolean>;

  // Metadata methods
  getAvailableMetrics(): MetricDefinition[];
  getAvailableDimensions(): DimensionDefinition[];
}

/**
 * Platform connection status
 */
export type PlatformConnectionStatus = 'active' | 'expired' | 'revoked' | 'error';

/**
 * Supported platform IDs
 */
export type SupportedPlatform =
  | 'google-analytics'
  | 'meta-ads'
  | 'google-ads'
  | 'linkedin-ads';
