import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { signToken } from "@/app/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username dan password wajib diisi" },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            return NextResponse.json(
                { error: "Username atau password salah" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Username atau password salah" },
                { status: 401 }
            );
        }

        const token = await signToken({ id: admin.id, username: admin.username });

        const response = NextResponse.json({
            message: "Login berhasil",
            admin: { id: admin.id, username: admin.username },
        });

        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return response;
    } catch {
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
