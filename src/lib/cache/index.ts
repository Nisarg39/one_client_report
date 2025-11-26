/**
 * Cache Utilities
 *
 * Provides caching layer for platform API responses
 * Supports Redis (when configured) with in-memory fallback
 */

import { SupportedPlatform } from '@/lib/platforms/types';

/**
 * Cache options
 */
export interface CacheOptions {
  ttl: number;      // Time to live in seconds
  prefix: string;   // Cache key prefix
}

/**
 * In-memory cache store (fallback when Redis is not configured)
 */
class MemoryCache {
  private cache: Map<string, { value: any; expiresAt: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

/**
 * Redis cache store (used when UPSTASH_REDIS_URL is configured)
 */
class RedisCache {
  private client: any; // Will be Redis instance from @upstash/redis

  constructor() {
    // Redis will be initialized when credentials are available
    // For now, this is a placeholder
    throw new Error(
      'Redis cache not yet configured. Set UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN environment variables.'
    );
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value as T | null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DELETE error:', error);
    }
  }

  async clear(): Promise<void> {
    // Redis doesn't have a clear all method, so this is a no-op
    console.warn('Redis clear() is not implemented');
  }
}

/**
 * Cache manager - automatically selects Redis or memory cache
 */
class CacheManager {
  private store: MemoryCache | RedisCache;

  constructor() {
    // Check if Redis is configured
    const redisUrl = process.env.UPSTASH_REDIS_URL;
    const redisToken = process.env.UPSTASH_REDIS_TOKEN;

    if (redisUrl && redisToken) {
      try {
        this.store = new RedisCache();
        console.log('✅ Using Redis cache');
      } catch (error) {
        console.warn('⚠️  Redis not configured, falling back to memory cache');
        this.store = new MemoryCache();
      }
    } else {
      console.log('💾 Using in-memory cache (Redis not configured)');
      this.store = new MemoryCache();
    }
  }

  /**
   * Get cached value
   */
  async get<T>(key: string, options: CacheOptions): Promise<T | null> {
    const fullKey = `${options.prefix}:${key}`;
    return this.store.get<T>(fullKey);
  }

  /**
   * Set cached value
   */
  async set<T>(key: string, value: T, options: CacheOptions): Promise<void> {
    const fullKey = `${options.prefix}:${key}`;
    await this.store.set(fullKey, value, options.ttl);
  }

  /**
   * Delete cached value
   */
  async delete(key: string, options: CacheOptions): Promise<void> {
    const fullKey = `${options.prefix}:${key}`;
    await this.store.delete(fullKey);
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    await this.store.clear();
  }
}

// Singleton instance
let cacheManager: CacheManager | null = null;

function getCacheManager(): CacheManager {
  if (!cacheManager) {
    cacheManager = new CacheManager();
  }
  return cacheManager;
}

/**
 * Get cached value with automatic key generation
 */
export async function getCached<T>(
  key: string,
  options: CacheOptions
): Promise<T | null> {
  const manager = getCacheManager();
  return manager.get<T>(key, options);
}

/**
 * Set cached value with automatic key generation
 */
export async function setCache<T>(
  key: string,
  value: T,
  options: CacheOptions
): Promise<void> {
  const manager = getCacheManager();
  await manager.set(key, value, options);
}

/**
 * Delete cached value
 */
export async function deleteCache(
  key: string,
  options: CacheOptions
): Promise<void> {
  const manager = getCacheManager();
  await manager.delete(key, options);
}

/**
 * Clear all cache
 */
export async function clearCache(): Promise<void> {
  const manager = getCacheManager();
  await manager.clear();
}

/**
 * Cache TTL by platform (in seconds)
 */
export const PLATFORM_CACHE_TTL: Record<SupportedPlatform, number> = {
  'google-analytics': 300,  // 5 minutes
  'meta-ads': 600,          // 10 minutes
  'google-ads': 600,        // 10 minutes
  'linkedin-ads': 900,      // 15 minutes
};

/**
 * Generate cache key for platform metrics
 */
export function generatePlatformCacheKey(
  platformId: SupportedPlatform,
  userId: string,
  clientId: string,
  queryHash: string
): string {
  return `${platformId}:${userId}:${clientId}:${queryHash}`;
}

/**
 * Generate hash from query object
 */
export function generateQueryHash(query: any): string {
  const str = JSON.stringify(query);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
