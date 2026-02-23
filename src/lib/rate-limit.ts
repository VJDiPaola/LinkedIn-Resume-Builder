import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 4; // Stricter for abuse control

const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

function ensureUpstashInProduction() {
    if (process.env.NODE_ENV === "production" && !hasUpstash) {
        throw new Error(
            "Upstash Redis is required in production. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
        );
    }
}

const upstashLimiter = hasUpstash
    ? new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "60 s"),
      })
    : null;

function hash(s: string): string {
    return createHash("sha256").update(s, "utf8").digest("hex").slice(0, 32);
}

/**
 * Builds a stable rate-limit key from IP and optional verified session id.
 * Same IP + same session => same key. No session => IP-only key (stricter for anonymous).
 */
export function buildLimitKey(ip: string, sessionId: string | null): string {
    const normalizedIp = (ip || "unknown").trim() || "unknown";
    if (sessionId) {
        return `rl:${hash(normalizedIp + "|" + sessionId)}`;
    }
    return `rl:ip_only:${hash(normalizedIp)}`;
}

// In-memory fallback for non-production (e.g. local dev)
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

function inMemoryRateLimit(key: string): { success: boolean; remaining: number } {
    cleanup();

    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket) {
        bucket = { timestamps: [] };
        buckets.set(key, bucket);
    }

    bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

    if (bucket.timestamps.length >= MAX_REQUESTS) {
        return { success: false, remaining: 0 };
    }

    bucket.timestamps.push(now);
    return { success: true, remaining: MAX_REQUESTS - bucket.timestamps.length };
}

/**
 * Enforces rate limit for the given key (from buildLimitKey).
 * In production uses Upstash; in dev uses in-memory when Upstash is not configured.
 */
export async function rateLimit(key: string): Promise<{ success: boolean; remaining: number }> {
    ensureUpstashInProduction();
    if (upstashLimiter) {
        const result = await upstashLimiter.limit(key);
        return { success: result.success, remaining: result.remaining };
    }

    return inMemoryRateLimit(key);
}
