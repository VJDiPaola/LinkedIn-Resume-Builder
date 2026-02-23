import { describe, it, expect } from "vitest";
import { buildLimitKey, rateLimit } from "@/lib/rate-limit";

describe("buildLimitKey", () => {
    it("returns same key for same IP and session id", () => {
        const a = buildLimitKey("192.168.1.1", "session-abc");
        const b = buildLimitKey("192.168.1.1", "session-abc");
        expect(a).toBe(b);
    });

    it("returns different keys for different IPs", () => {
        const a = buildLimitKey("192.168.1.1", "session-abc");
        const b = buildLimitKey("192.168.1.2", "session-abc");
        expect(a).not.toBe(b);
    });

    it("returns different keys for different session ids", () => {
        const a = buildLimitKey("192.168.1.1", "session-abc");
        const b = buildLimitKey("192.168.1.1", "session-xyz");
        expect(a).not.toBe(b);
    });

    it("returns IP-only key when session id is null", () => {
        const key = buildLimitKey("192.168.1.1", null);
        expect(key).toMatch(/^rl:ip_only:[a-f0-9]+$/);
    });

    it("returns prefixed key when session id is provided", () => {
        const key = buildLimitKey("10.0.0.1", "sid");
        expect(key).toMatch(/^rl:[a-f0-9]+$/);
        expect(key).not.toContain("ip_only");
    });
});

describe("rateLimit", () => {
    it("allows requests under the limit", async () => {
        const key = buildLimitKey("127.0.0.99", "test-session-" + Math.random());
        const r1 = await rateLimit(key);
        expect(r1.success).toBe(true);
        expect(r1.remaining).toBeLessThanOrEqual(4);
    });

    it("rejects requests over the limit", async () => {
        const key = buildLimitKey("127.0.0.98", "test-session-" + Math.random());
        const results = await Promise.all([
            rateLimit(key),
            rateLimit(key),
            rateLimit(key),
            rateLimit(key),
            rateLimit(key),
        ]);
        const successCount = results.filter((r) => r.success).length;
        expect(successCount).toBe(4);
        expect(results[4].success).toBe(false);
        expect(results[4].remaining).toBe(0);
    });
});
