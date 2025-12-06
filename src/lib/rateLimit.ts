/**
 * Rate Limiter
 *
 * Tier-based in-memory rate limiter for message sending
 * Respects user's maxMessagesPerDay restriction from their account tier
 *
 * Production Note: For multi-instance deployments, replace with Redis-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  hourlyLimit: number; // Store the hourly limit for this user
}

// In-memory storage for rate limits
// Key: userId, Value: { count, resetTime, hourlyLimit }
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default configuration (fallback if no restrictions provided)
const DEFAULT_MAX_MESSAGES_PER_HOUR = 50;
const WINDOW_SIZE_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Calculate hourly limit from daily limit
 * 
 * @param maxMessagesPerDay - Daily message limit (optional)
 * @returns Hourly message limit
 */
function calculateHourlyLimit(maxMessagesPerDay?: number): number {
  if (!maxMessagesPerDay) {
    // No restriction provided, use default
    return DEFAULT_MAX_MESSAGES_PER_HOUR;
  }
  
  // Calculate hourly limit: divide daily by 24, round up
  // This ensures users can use their full daily quota if spread evenly
  const hourlyLimit = Math.ceil(maxMessagesPerDay / 24);
  
  // Minimum 1 message per hour, even for very low daily limits
  return Math.max(1, hourlyLimit);
}

/**
 * Check if a user has exceeded the rate limit
 * 
 * Tier-based: Respects user's maxMessagesPerDay restriction
 *
 * @param userId - User ID to check
 * @param maxMessagesPerDay - Optional daily message limit from user restrictions
 * @returns Object with allowed status and remaining count
 */
export function checkRateLimit(
  userId: string,
  maxMessagesPerDay?: number
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const hourlyLimit = calculateHourlyLimit(maxMessagesPerDay);
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  // No entry or expired entry - allow and create new entry
  if (!entry || now >= entry.resetTime) {
    const resetTime = now + WINDOW_SIZE_MS;
    rateLimitStore.set(userId, {
      count: 1,
      resetTime,
      hourlyLimit,
    });

    return {
      allowed: true,
      remaining: hourlyLimit - 1,
      resetTime,
    };
  }

  // If hourly limit changed (e.g., user upgraded), reset the entry
  if (entry.hourlyLimit !== hourlyLimit) {
    const resetTime = now + WINDOW_SIZE_MS;
    rateLimitStore.set(userId, {
      count: 1,
      resetTime,
      hourlyLimit,
    });

    return {
      allowed: true,
      remaining: hourlyLimit - 1,
      resetTime,
    };
  }

  // Entry exists and is still valid
  if (entry.count >= entry.hourlyLimit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(userId, entry);

  return {
    allowed: true,
    remaining: entry.hourlyLimit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get remaining messages for a user
 *
 * @param userId - User ID to check
 * @param maxMessagesPerDay - Optional daily message limit from user restrictions
 * @returns Number of messages remaining
 */
export function getRemainingMessages(
  userId: string,
  maxMessagesPerDay?: number
): number {
  const hourlyLimit = calculateHourlyLimit(maxMessagesPerDay);
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry || now >= entry.resetTime) {
    return hourlyLimit;
  }

  return Math.max(0, entry.hourlyLimit - entry.count);
}

/**
 * Get time until rate limit resets
 *
 * @param userId - User ID to check
 * @returns Milliseconds until reset, or 0 if no limit active
 */
export function getTimeUntilReset(userId: string): number {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry || now >= entry.resetTime) {
    return 0;
  }

  return entry.resetTime - now;
}

/**
 * Reset rate limit for a user (useful for testing)
 *
 * @param userId - User ID to reset
 */
export function resetRateLimit(userId: string): void {
  rateLimitStore.delete(userId);
}

/**
 * Cleanup expired entries (should be called periodically)
 * This prevents memory leaks in long-running processes
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();

  for (const [userId, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(userId);
    }
  }
}

// Run cleanup every 10 minutes
if (typeof window === 'undefined') {
  // Only run on server
  setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}
