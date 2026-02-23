import { NextResponse } from "next/server";

/**
 * GET /api/session - Ensures session cookie is set (via proxy) and returns 200.
 * API-only clients can call this first to obtain a session before calling /api/optimize.
 */
export async function GET() {
    return NextResponse.json({ ok: true });
}
