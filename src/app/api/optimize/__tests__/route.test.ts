import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
    verifySessionToken: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
    buildLimitKey: vi.fn(() => "test-key"),
    rateLimit: vi.fn(),
}));

vi.mock("ai", () => ({
    streamObject: vi.fn(() => ({
        toTextStreamResponse: () => new Response("stream", { status: 200 }),
        usage: Promise.resolve({ inputTokens: 0, outputTokens: 0, totalTokens: 0 }),
    })),
}));

import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

function buildValidPayload() {
    return {
        jobDescription: "A".repeat(50),
        currentRole: "Software Engineer",
        targetRole: "Senior Software Engineer",
        resumeText: "B".repeat(50),
        website: "",
        formStartedAt: Date.now() - 5_000,
    };
}

describe("POST /api/optimize", () => {
    beforeEach(() => {
        vi.mocked(cookies).mockResolvedValue({
            get: () => undefined,
        } as Awaited<ReturnType<typeof cookies>>);
        vi.mocked(verifySessionToken).mockReturnValue(null);
        vi.mocked(rateLimit).mockResolvedValue({ success: true, remaining: 3 });
    });

    it("returns 400 with INVALID_JSON for non-JSON body", async () => {
        const req = new Request("http://localhost/api/optimize", {
            method: "POST",
            body: "not json",
            headers: { "Content-Type": "application/json" },
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.code).toBe("INVALID_JSON");
        expect(data.error).toContain("Invalid JSON");
    });

    it("returns 401 with SESSION_REQUIRED when session cookie is missing", async () => {
        vi.mocked(cookies).mockResolvedValue({
            get: () => undefined,
        } as Awaited<ReturnType<typeof cookies>>);
        vi.mocked(verifySessionToken).mockReturnValue(null);

        const req = new Request("http://localhost/api/optimize", {
            method: "POST",
            body: JSON.stringify(buildValidPayload()),
            headers: { "Content-Type": "application/json" },
        });
        const res = await POST(req);
        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.code).toBe("SESSION_REQUIRED");
    });

    it("returns 401 when cookie is present but signature is invalid", async () => {
        vi.mocked(cookies).mockResolvedValue({
            get: () => ({ value: "tampered.token" }),
        } as Awaited<ReturnType<typeof cookies>>);
        vi.mocked(verifySessionToken).mockReturnValue(null);

        const req = new Request("http://localhost/api/optimize", {
            method: "POST",
            body: JSON.stringify(buildValidPayload()),
            headers: { "Content-Type": "application/json" },
        });
        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    it("returns 429 when rate limit is exceeded", async () => {
        vi.mocked(cookies).mockResolvedValue({
            get: () => ({ value: "valid.token" }),
        } as Awaited<ReturnType<typeof cookies>>);
        vi.mocked(verifySessionToken).mockReturnValue("session-id");
        vi.mocked(rateLimit).mockResolvedValue({ success: false, remaining: 0 });

        const req = new Request("http://localhost/api/optimize", {
            method: "POST",
            body: JSON.stringify(buildValidPayload()),
            headers: { "Content-Type": "application/json" },
        });
        const res = await POST(req);
        expect(res.status).toBe(429);
        expect(res.headers.get("Retry-After")).toBe("60");
        const data = await res.json();
        expect(data.code).toBe("RATE_LIMIT_EXCEEDED");
    });

    it("returns 400 with VALIDATION_ERROR for invalid schema", async () => {
        vi.mocked(cookies).mockResolvedValue({
            get: () => ({ value: "valid.token" }),
        } as Awaited<ReturnType<typeof cookies>>);
        vi.mocked(verifySessionToken).mockReturnValue("session-id-12345");

        const req = new Request("http://localhost/api/optimize", {
            method: "POST",
            body: JSON.stringify({
                ...buildValidPayload(),
                jobDescription: "too short",
            }),
            headers: { "Content-Type": "application/json" },
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.code).toBe("VALIDATION_ERROR");
    });

    it("returns 403 with BOT_DETECTED when honeypot field is filled", async () => {
        vi.mocked(cookies).mockResolvedValue({
            get: () => ({ value: "valid.token" }),
        } as Awaited<ReturnType<typeof cookies>>);
        vi.mocked(verifySessionToken).mockReturnValue("session-id-12345");

        const req = new Request("http://localhost/api/optimize", {
            method: "POST",
            body: JSON.stringify({
                ...buildValidPayload(),
                website: "spam.example",
            }),
            headers: { "Content-Type": "application/json" },
        });
        const res = await POST(req);
        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.code).toBe("BOT_DETECTED");
    });

    it("returns 200 and stream when valid session and body", async () => {
        vi.mocked(cookies).mockResolvedValue({
            get: () => ({ value: "valid.token" }),
        } as Awaited<ReturnType<typeof cookies>>);
        vi.mocked(verifySessionToken).mockReturnValue("session-id-12345");

        const req = new Request("http://localhost/api/optimize", {
            method: "POST",
            body: JSON.stringify(buildValidPayload()),
            headers: { "Content-Type": "application/json" },
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });
});
