const JSON_HEADERS = { "Content-Type": "application/json" } as const;

export function jsonError(message: string, code: string, status: number, extra?: Record<string, unknown>): Response {
    const body = { error: message, code, ...extra };
    return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}
