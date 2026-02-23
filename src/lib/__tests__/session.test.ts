import { describe, it, expect } from "vitest";
import { createSessionToken, verifySessionToken } from "@/lib/session";

describe("session", () => {
    it("creates a token that verifies and returns session id", () => {
        const token = createSessionToken();
        expect(token).toContain(".");
        const id = verifySessionToken(token);
        expect(id).not.toBeNull();
        expect(typeof id).toBe("string");
        expect(id!.length).toBeGreaterThan(0);
    });

    it("returns null for invalid token", () => {
        expect(verifySessionToken("")).toBeNull();
        expect(verifySessionToken("no-dot")).toBeNull();
        expect(verifySessionToken("a.b")).toBeNull(); // wrong signature
        expect(verifySessionToken("x.y.z")).toBeNull(); // tampered
    });

    it("returns null for tampered token", () => {
        const token = createSessionToken();
        const [id, sig] = token.split(".");
        const tamperedSig = sig.slice(0, 10) + (sig[10] === "a" ? "b" : "a") + sig.slice(11);
        const tampered = `${id}.${tamperedSig}`;
        expect(verifySessionToken(tampered)).toBeNull();
    });
});
