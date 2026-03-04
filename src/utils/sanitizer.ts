import DOMPurify from "isomorphic-dompurify";

export function sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            "b",
            "i",
            "em",
            "strong",
            "p",
            "br",
            "a",
            "ul",
            "ol",
            "li",
        ],
        ALLOWED_ATTR: ["href", "title"],
    });
}

export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, "") // Remove angle brackets
        .substring(0, 255); // Limit length
}
