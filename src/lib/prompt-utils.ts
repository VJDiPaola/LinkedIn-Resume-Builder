/**
 * Escapes user-provided text for safe interpolation into XML-style prompt tags.
 * Prevents delimiter break and instruction injection (e.g. </job_description>).
 */
export function escapeForXmlTag(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\]/g, "&#93;");
}
