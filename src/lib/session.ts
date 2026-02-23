import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const SEP = ".";
const SESSION_ID_BYTES = 16;

function getSecret(): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 16) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("SESSION_SECRET must be set in production (min 16 chars).");
        }
        return "dev-session-secret-min-16ch";
    }
    return secret;
}

/**
 * Creates a signed session token (id.signature) so the server can verify it later.
 * Used when setting the session cookie in proxy/middleware.
 */
export function createSessionToken(): string {
    const id = randomBytes(SESSION_ID_BYTES).toString("base64url");
    const secret = getSecret();
    const signature = createHmac("sha256", secret).update(id).digest("base64url");
    return `${id}${SEP}${signature}`;
}

/**
 * Verifies the session token and returns the session id (for rate-limit key) or null if invalid.
 */
export function verifySessionToken(token: string): string | null {
    const idx = token.indexOf(SEP);
    if (idx <= 0 || idx === token.length - 1) return null;
    const id = token.slice(0, idx);
    const signature = token.slice(idx + 1);
    const secret = getSecret();
    const expected = createHmac("sha256", secret).update(id).digest("base64url");
    const sigBuf = Buffer.from(signature, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expBuf.length || sigBuf.length === 0 || !timingSafeEqual(sigBuf, expBuf)) {
        return null;
    }
    return id;
}
