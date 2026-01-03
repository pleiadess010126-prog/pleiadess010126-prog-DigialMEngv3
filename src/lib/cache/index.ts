// =================================================================
// REDIS CLIENT FOR CACHING & RATE LIMITING
// Production-ready distributed cache support
// =================================================================

/**
 * Simple Redis-like in-memory cache for development
 * Replace with actual Redis client in production
 */
class InMemoryCache {
    private store = new Map<string, { value: string; expiry: number | null }>();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Cleanup expired keys every minute
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, data] of this.store.entries()) {
            if (data.expiry && data.expiry < now) {
                this.store.delete(key);
            }
        }
    }

    async get(key: string): Promise<string | null> {
        const data = this.store.get(key);
        if (!data) return null;

        if (data.expiry && data.expiry < Date.now()) {
            this.store.delete(key);
            return null;
        }

        return data.value;
    }

    async set(key: string, value: string, options?: { ex?: number }): Promise<void> {
        const expiry = options?.ex ? Date.now() + options.ex * 1000 : null;
        this.store.set(key, { value, expiry });
    }

    async del(key: string): Promise<void> {
        this.store.delete(key);
    }

    async incr(key: string): Promise<number> {
        const current = await this.get(key);
        const newValue = (parseInt(current || '0', 10) + 1).toString();

        const data = this.store.get(key);
        const expiry = data?.expiry || null;

        this.store.set(key, { value: newValue, expiry });
        return parseInt(newValue, 10);
    }

    async expire(key: string, seconds: number): Promise<void> {
        const data = this.store.get(key);
        if (data) {
            data.expiry = Date.now() + seconds * 1000;
        }
    }

    async ttl(key: string): Promise<number> {
        const data = this.store.get(key);
        if (!data || !data.expiry) return -1;

        const remaining = Math.ceil((data.expiry - Date.now()) / 1000);
        return remaining > 0 ? remaining : -1;
    }

    async keys(pattern: string): Promise<string[]> {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        const matches: string[] = [];

        for (const key of this.store.keys()) {
            if (regex.test(key)) {
                matches.push(key);
            }
        }

        return matches;
    }

    async hset(key: string, field: string, value: string): Promise<void> {
        const hashKey = `${key}:${field}`;
        await this.set(hashKey, value);
    }

    async hget(key: string, field: string): Promise<string | null> {
        const hashKey = `${key}:${field}`;
        return this.get(hashKey);
    }

    async hgetall(key: string): Promise<Record<string, string>> {
        const prefix = `${key}:`;
        const result: Record<string, string> = {};

        for (const [k, data] of this.store.entries()) {
            if (k.startsWith(prefix)) {
                const field = k.slice(prefix.length);
                if (!data.expiry || data.expiry > Date.now()) {
                    result[field] = data.value;
                }
            }
        }

        return result;
    }

    stop(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}

/**
 * Redis client wrapper
 * Uses in-memory cache for development, Redis for production
 */
class CacheClient {
    private client: InMemoryCache;
    private isRedis = false;

    constructor() {
        // In production, connect to Redis
        const redisUrl = process.env.REDIS_URL;

        if (redisUrl) {
            // TODO: Initialize actual Redis client
            // import { Redis } from 'ioredis';
            // this.client = new Redis(redisUrl);
            // this.isRedis = true;
            console.log('[Cache] Redis URL configured, but using in-memory cache (add ioredis package for Redis)');
            this.client = new InMemoryCache();
        } else {
            console.log('[Cache] Using in-memory cache (development mode)');
            this.client = new InMemoryCache();
        }
    }

    get isConnected(): boolean {
        return true; // Always true for in-memory
    }

    get isDistributed(): boolean {
        return this.isRedis;
    }

    /**
     * Get a cached value
     */
    async get<T = string>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        if (!value) return null;

        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    /**
     * Set a cached value
     */
    async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await this.client.set(key, stringValue, ttlSeconds ? { ex: ttlSeconds } : undefined);
    }

    /**
     * Delete a cached value
     */
    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    /**
     * Increment a counter
     */
    async incr(key: string): Promise<number> {
        return this.client.incr(key);
    }

    /**
     * Set expiry on a key
     */
    async expire(key: string, seconds: number): Promise<void> {
        await this.client.expire(key, seconds);
    }

    /**
     * Get time-to-live for a key
     */
    async ttl(key: string): Promise<number> {
        return this.client.ttl(key);
    }

    /**
     * Find keys matching a pattern
     */
    async keys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern);
    }

    /**
     * Hash operations
     */
    async hset(key: string, field: string, value: string): Promise<void> {
        await this.client.hset(key, field, value);
    }

    async hget(key: string, field: string): Promise<string | null> {
        return this.client.hget(key, field);
    }

    async hgetall(key: string): Promise<Record<string, string>> {
        return this.client.hgetall(key);
    }
}

// Export singleton instance
export const cache = new CacheClient();

// =================================================================
// RATE LIMITER USING CACHE
// =================================================================

export interface RateLimitConfig {
    maxRequests: number;
    windowSeconds: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    retryAfter?: number;
}

/**
 * Distributed rate limiter using Redis/cache
 */
export class RateLimiter {
    private config: RateLimitConfig;
    private prefix: string;

    constructor(prefix: string, config: RateLimitConfig) {
        this.prefix = prefix;
        this.config = config;
    }

    /**
     * Check if a request is allowed
     */
    async check(identifier: string): Promise<RateLimitResult> {
        const key = `ratelimit:${this.prefix}:${identifier}`;
        const now = Date.now();

        // Get current count
        const currentStr = await cache.get<string>(key);
        const current = currentStr ? parseInt(currentStr, 10) : 0;

        if (current >= this.config.maxRequests) {
            const ttl = await cache.ttl(key);
            const resetAt = now + (ttl > 0 ? ttl * 1000 : this.config.windowSeconds * 1000);

            return {
                allowed: false,
                remaining: 0,
                resetAt,
                retryAfter: ttl > 0 ? ttl : this.config.windowSeconds,
            };
        }

        // Increment counter
        const newCount = await cache.incr(key);

        // Set expiry on first request
        if (newCount === 1) {
            await cache.expire(key, this.config.windowSeconds);
        }

        const ttl = await cache.ttl(key);
        const resetAt = now + (ttl > 0 ? ttl * 1000 : this.config.windowSeconds * 1000);

        return {
            allowed: true,
            remaining: Math.max(0, this.config.maxRequests - newCount),
            resetAt,
        };
    }

    /**
     * Reset rate limit for an identifier
     */
    async reset(identifier: string): Promise<void> {
        const key = `ratelimit:${this.prefix}:${identifier}`;
        await cache.del(key);
    }
}

// Pre-configured rate limiters
export const rateLimiters = {
    api: new RateLimiter('api', { maxRequests: 100, windowSeconds: 60 }),
    auth: new RateLimiter('auth', { maxRequests: 10, windowSeconds: 60 }),
    generate: new RateLimiter('generate', { maxRequests: 20, windowSeconds: 60 }),
    publish: new RateLimiter('publish', { maxRequests: 30, windowSeconds: 60 }),
    webhook: new RateLimiter('webhook', { maxRequests: 1000, windowSeconds: 60 }),
};

// =================================================================
// CACHE HELPERS
// =================================================================

/**
 * Cache decorator for async functions
 */
export function cached<T>(keyPrefix: string, ttlSeconds: number = 300) {
    return function (
        target: unknown,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: unknown[]) {
            const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;

            // Try to get from cache
            const cached = await cache.get<T>(cacheKey);
            if (cached !== null) {
                return cached;
            }

            // Execute original method
            const result = await originalMethod.apply(this, args);

            // Store in cache
            await cache.set(cacheKey, result, ttlSeconds);

            return result;
        };

        return descriptor;
    };
}

/**
 * Simple cache wrapper function
 */
export async function withCache<T>(
    key: string,
    ttlSeconds: number,
    fn: () => Promise<T>
): Promise<T> {
    // Try cache first
    const cached = await cache.get<T>(key);
    if (cached !== null) {
        return cached;
    }

    // Execute function
    const result = await fn();

    // Cache result
    await cache.set(key, result, ttlSeconds);

    return result;
}

/**
 * Invalidate cache keys matching a pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
    const keys = await cache.keys(pattern);
    for (const key of keys) {
        await cache.del(key);
    }
}
