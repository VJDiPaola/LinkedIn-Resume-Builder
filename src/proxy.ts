import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/session";

const COOKIE_NAME = "session_token";

export function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const existingToken = request.cookies.get(COOKIE_NAME);

    if (!existingToken) {
        const token = createSessionToken();
        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });
    }

    return response;
}

export const config = {
    matcher: ["/", "/api/:path*"],
};
