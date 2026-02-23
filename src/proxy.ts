import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/session";

const COOKIE_NAME = "session_token";

export function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const existingToken = request.cookies.get(COOKIE_NAME);

    if (!existingToken) {
        try {
            const token = createSessionToken();
            response.cookies.set(COOKIE_NAME, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24, // 24 hours
            });
        } catch (err) {
            if (process.env.NODE_ENV === "production") {
                return new NextResponse(
                    "Server misconfiguration: SESSION_SECRET must be set in production. See README.",
                    { status: 503, headers: { "Content-Type": "text/plain" } }
                );
            }
            throw err;
        }
    }

    return response;
}

export const config = {
    matcher: ["/", "/api/:path*"],
};
