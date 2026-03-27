import crypto from "crypto";

export function generateToken(): string {
    // Generate 8-character alphanumeric token
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars (0, O, I, 1)
    let token = "";
    const randomBytes = crypto.randomBytes(16);

    for (let i = 0; i < 8; i++) {
        const index = randomBytes[i] % chars.length;
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
