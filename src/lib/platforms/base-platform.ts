/**
 * Base Platform Abstract Class
 *
 * Abstract class that all platform services extend
 * Provides common functionality and enforces interface implementation
 */

import {
  IPlatform,
  PlatformConfig,
  PlatformCredentials,
  MetricQuery,
  PlatformResponse,
  MetricDefinition,
  DimensionDefinition,
  OAuthTokenResponse,
} from './types';

export abstract class BasePlatform implements IPlatform {
  abstract config: PlatformConfig;

  /**
   * Generate OAuth authorization URL
   */
  abstract getAuthUrl(redirectUri: string, state: string): string;

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  abstract handleCallback(
    code: string,
    state: string
  ): Promise<PlatformCredentials>;

  /**
   * Refresh expired access token
   */
  abstract refreshAccessToken(
    refreshToken: string
  ): Promise<PlatformCredentials>;

  /**
   * Fetch metrics from platform API
   */
  abstract fetchMetrics(
    credentials: PlatformCredentials,
    query: MetricQuery
  ): Promise<PlatformResponse>;

  /**
   * Test if credentials are valid
   */
  abstract testConnection(credentials: PlatformCredentials): Promise<boolean>;

  /**
   * Get available metrics for this platform
   */
  abstract getAvailableMetrics(): MetricDefinition[];

  /**
   * Get available dimensions for this platform
   */
  abstract getAvailableDimensions(): DimensionDefinition[];

  /**
   * Check if access token is expired
   */
  protected isTokenExpired(expiresAt: Date): boolean {
    const now = new Date();
    const buffer = 5 * 60 * 1000; // 5 minute buffer
    return now.getTime() >= expiresAt.getTime() - buffer;
  }

  /**
   * Calculate expiration date from expiresIn seconds
   */
  protected calculateExpirationDate(expiresIn: number): Date {
    return new Date(Date.now() + expiresIn * 1000);
  }

  /**
   * Validate metric query
   */
  protected validateQuery(query: MetricQuery): void {
    if (!query.startDate || !query.endDate) {
      throw new Error('Start date and end date are required');
    }

    if (!query.metrics || query.metrics.length === 0) {
      throw new Error('At least one metric is required');
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(query.startDate) || !dateRegex.test(query.endDate)) {
      throw new Error('Dates must be in YYYY-MM-DD format');
    }

    // Validate date range
    const start = new Date(query.startDate);
    const end = new Date(query.endDate);
    if (start > end) {
      throw new Error('Start date must be before end date');
    }
  }

  /**
   * Create error response
   */
  protected createErrorResponse(error: string): PlatformResponse {
    return {
      success: false,
      error,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create success response
   */
  protected createSuccessResponse(
    data: any[],
    cached: boolean = false
  ): PlatformResponse {
    return {
      success: true,
      data,
      cached,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle API errors with standardized error messages
   */
  protected handleApiError(error: any, context: string): never {
    console.error(`[${this.config.id}] ${context}:`, error);

    if (error.response) {
      // HTTP error response
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.message;

      if (status === 401 || status === 403) {
        throw new Error(
          `Authentication failed: ${message}. Please reconnect your ${this.config.name} account.`
        );
      }

      if (status === 429) {
        throw new Error(
          `Rate limit exceeded for ${this.config.name}. Please try again later.`
        );
      }

      if (status >= 500) {
        throw new Error(
          `${this.config.name} API is temporarily unavailable. Please try again later.`
        );
      }

      throw new Error(`${this.config.name} API error: ${message}`);
    }

    // Network or unknown error
    throw new Error(
      `Failed to connect to ${this.config.name}: ${error.message}`
    );
  }

  /**
   * Safely parse JSON response
   */
  protected async parseJsonResponse(response: Response): Promise<any> {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`Invalid JSON response: ${text.substring(0, 200)}`);
    }
  }
}
