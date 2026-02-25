import { v4 as uuidv4 } from "uuid";

export function generateToken(): string {
    // Generate 8-character alphanumeric token
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars (0, O, I, 1)
    let token = "";
    const randomBytes = uuidv4().replace(/-/g, "");

    for (let i = 0; i < 8; i++) {
        const index = parseInt(randomBytes.substring(i * 2, i * 2 + 2), 16) % chars.length;
        token += chars[index];
    }

    return token;
}

export function generateTokens(count: number): string[] {
    const tokens: string[] = [];
    const tokenSet = new Set<string>();

    while (tokens.length < count) {
        const token = generateToken();
        if (!tokenSet.has(token)) {
            tokenSet.add(token);
            tokens.push(token);
        }
    }

    return tokens;
}
