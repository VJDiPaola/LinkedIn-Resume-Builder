import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

describe("proxy", () => {
    it("exports proxy function and config", () => {
        expect(typeof proxy).toBe("function");
        expect(proxy).toHaveProperty("name", "proxy");
    });

    it("sets session_token cookie when request has no cookie", () => {
        const req = new NextRequest("http://localhost:3000/", {
            headers: {},
        });
        const res = proxy(req);
        const setCookie = res.headers.get("set-cookie");
        expect(setCookie).toBeTruthy();
        expect(setCookie).toContain("session_token=");
        expect(setCookie).toMatch(/HttpOnly/);
        expect(res.status).toBe(200);
    });

    it("does not overwrite existing session_token cookie", () => {
        const req = new NextRequest("http://localhost:3000/", {
            headers: {
                cookie: "session_token=existing.value.here",
            },
        });
        const res = proxy(req);
        const setCookie = res.headers.get("set-cookie");
        expect(setCookie).toBeNull();
    });
});
