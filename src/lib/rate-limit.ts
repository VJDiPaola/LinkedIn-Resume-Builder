import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

// Use Upstash in production when env vars are configured, otherwise fall back to in-memory for local dev
const useUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const upstashLimiter = useUpstash
    ? new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "60 s"),
      })
    : null;

// In-memory fallback for local development
interface TokenBucket {
    timestamps: number[];
}

const buckets = new Map<string, TokenBucket>();

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
    lastCleanup = now;

    for (const [key, bucket] of buckets) {
        bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
        if (bucket.timestamps.length === 0) {
            buckets.delete(key);
        }
    }
}

function inMemoryRateLimit(sessionToken: string): { success: boolean; remaining: number } {
    cleanup();

    const now = Date.now();
    let bucket = buckets.get(sessionToken);

    if (!bucket) {
        bucket = { timestamps: [] };
        buckets.set(sessionToken, bucket);
    }

    bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

    if (bucket.timestamps.length >= MAX_REQUESTS) {
        return { success: false, remaining: 0 };
    }

    bucket.timestamps.push(now);
    return { success: true, remaining: MAX_REQUESTS - bucket.timestamps.length };
}

export async function rateLimit(sessionToken: string): Promise<{ success: boolean; remaining: number }> {
    if (upstashLimiter) {
        const result = await upstashLimiter.limit(sessionToken);
        return { success: result.success, remaining: result.remaining };
    }

    return inMemoryRateLimit(sessionToken);
}
