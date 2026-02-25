import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function signToken(payload: { id: string; username: string }): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .setIssuedAt()
        .sign(secret);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as { id: string; username: string };
    } catch {
        return null;
    }
}

export async function getAdminFromCookies() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function requireAdmin(request?: NextRequest) {
    if (request) {
        const token = request.cookies.get("admin_token")?.value;
        if (!token) return null;
        return verifyToken(token);
    }
    return getAdminFromCookies();
}
