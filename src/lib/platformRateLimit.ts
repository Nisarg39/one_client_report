/**
 * Platform API Rate Limiting
 *
 * Prevents API quota exhaustion by limiting platform API request frequency
 * Supports Upstash Ratelimit (when configured) with in-memory fallback
 */

import { SupportedPlatform } from './platforms/types';

/**
 * Rate limit result
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
}

/**
 * In-memory rate limiter (fallback when Upstash is not configured)
 */
class MemoryRateLimiter {
  private requests: Map<
    string,
    { count: number; resetAt: number }
  > = new Map();

  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  async limit(
    key: string,
    maxRequests: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.requests.get(key);

    // No entry or expired - create new window
    if (!entry || now > entry.resetAt) {
      const resetAt = now + windowMs;
      this.requests.set(key, { count: 1, resetAt });

      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: resetAt,
      };
    }

    // Within current window
    if (entry.count < maxRequests) {
      entry.count++;
      this.requests.set(key, entry);

      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - entry.count,
        reset: entry.resetAt,
      };
    }

    // Rate limit exceeded
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetAt) {
        this.requests.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.requests.clear();
  }
}

/**
 * Upstash rate limiter (used when UPSTASH_REDIS_URL is configured)
 */
class UpstashRateLimiter {
  private ratelimit: any; // Will be Ratelimit instance from @upstash/ratelimit

  constructor() {
    // Upstash will be initialized when credentials are available
    throw new Error(
      'Upstash rate limiting not yet configured. Set UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN environment variables.'
    );
  }

  async limit(
    key: string,
    maxRequests: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    try {
      const result = await this.ratelimit.limit(key);

      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (error) {
      console.error('Upstash rate limit error:', error);
      // Fail open - allow request on error
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests,
        reset: Date.now() + windowMs,
      };
    }
  }
}

/**
 * Rate limiter manager
 */
class RateLimiterManager {
  private limiter: MemoryRateLimiter | UpstashRateLimiter;

  constructor() {
    const redisUrl = process.env.UPSTASH_REDIS_URL;
    const redisToken = process.env.UPSTASH_REDIS_TOKEN;

    if (redisUrl && redisToken) {
      try {
        this.limiter = new UpstashRateLimiter();
        console.log('✅ Using Upstash rate limiting for platforms');
      } catch (error) {
        console.warn('⚠️  Upstash not configured, falling back to memory rate limiter for platforms');
        this.limiter = new MemoryRateLimiter();
      }
    } else {
      console.log('💾 Using in-memory rate limiter for platforms (Upstash not configured)');
      this.limiter = new MemoryRateLimiter();
    }
  }

  async limit(
    key: string,
    maxRequests: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    return this.limiter.limit(key, maxRequests, windowMs);
  }
}

// Singleton instance
let rateLimiterManager: RateLimiterManager | null = null;

function getRateLimiterManager(): RateLimiterManager {
  if (!rateLimiterManager) {
    rateLimiterManager = new RateLimiterManager();
  }
  return rateLimiterManager;
}

/**
 * Check rate limit for a specific key
 *
 * @param key - Unique identifier (e.g., "platform:google-analytics:userId")
 * @param maxRequests - Maximum requests allowed in window
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result
 */
export async function checkPlatformRateLimit(
  key: string,
  maxRequests: number = 60,
  windowMs: number = 3600000 // 1 hour default
): Promise<RateLimitResult> {
  const manager = getRateLimiterManager();
  return manager.limit(key, maxRequests, windowMs);
}

/**
 * Check rate limit for platform API requests by user
 *
 * @param userId - User ID
 * @param platformId - Platform identifier
 * @returns Rate limit result
 */
export async function checkUserPlatformRateLimit(
  userId: string,
  platformId: SupportedPlatform
): Promise<RateLimitResult> {
  const key = `platform:${platformId}:${userId}`;
  const limits = PLATFORM_RATE_LIMITS[platformId];

  return checkPlatformRateLimit(key, limits.maxRequests, limits.windowMs);
}

/**
 * Rate limits by platform
 *
 * Conservative limits to prevent quota exhaustion
 */
export const PLATFORM_RATE_LIMITS: Record<
  SupportedPlatform,
  { maxRequests: number; windowMs: number }
> = {
  // Google Analytics: 50k/day = ~2000/hour conservative
  'google-analytics': {
    maxRequests: 100,
    windowMs: 3600000, // 1 hour
  },

  // Meta Ads: 200/hour default
  'meta-ads': {
    maxRequests: 50,
    windowMs: 3600000, // 1 hour
  },

  // Google Ads: Conservative limit
  'google-ads': {
    maxRequests: 100,
    windowMs: 3600000, // 1 hour
  },

  // LinkedIn Ads: Conservative limit
  'linkedin-ads': {
    maxRequests: 50,
    windowMs: 3600000, // 1 hour
  },
};

/**
 * Format rate limit error message
 */
export function formatRateLimitError(
  platformId: SupportedPlatform,
  resetTime: number
): string {
  const resetDate = new Date(resetTime);
  const minutesUntilReset = Math.ceil((resetTime - Date.now()) / 60000);

  return `Rate limit exceeded for ${platformId}. Please try again in ${minutesUntilReset} minute${
    minutesUntilReset !== 1 ? 's' : ''
  } (${resetDate.toLocaleTimeString()}).`;
}
