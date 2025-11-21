/**
 * Rate Limiter
 *
 * Simple in-memory rate limiter for message sending
 * Limits users to 50 messages per hour
 *
 * Production Note: For multi-instance deployments, replace with Redis-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limits
// Key: userId, Value: { count, resetTime }
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_MESSAGES_PER_HOUR = 50;
const WINDOW_SIZE_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Check if a user has exceeded the rate limit
 *
 * @param userId - User ID to check
 * @returns Object with allowed status and remaining count
 */
export function checkRateLimit(userId: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  // No entry or expired entry - allow and create new entry
  if (!entry || now >= entry.resetTime) {
    const resetTime = now + WINDOW_SIZE_MS;
    rateLimitStore.set(userId, {
      count: 1,
      resetTime,
    });

    return {
      allowed: true,
      remaining: MAX_MESSAGES_PER_HOUR - 1,
      resetTime,
    };
  }

  // Entry exists and is still valid
  if (entry.count >= MAX_MESSAGES_PER_HOUR) {
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
    remaining: MAX_MESSAGES_PER_HOUR - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get remaining messages for a user
 *
 * @param userId - User ID to check
 * @returns Number of messages remaining
 */
export function getRemainingMessages(userId: string): number {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry || now >= entry.resetTime) {
    return MAX_MESSAGES_PER_HOUR;
  }

  return Math.max(0, MAX_MESSAGES_PER_HOUR - entry.count);
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
