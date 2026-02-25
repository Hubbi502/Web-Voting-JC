import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST - Verify if token is valid
export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: "Token wajib diisi" },
                { status: 400 }
            );
        }

        const voteToken = await prisma.voteToken.findUnique({
            where: { token: token.toUpperCase() },
        });

        if (!voteToken) {
            return NextResponse.json(
                { valid: false, error: "Token tidak valid" },
                { status: 400 }
            );
        }

        if (voteToken.isUsed) {
            return NextResponse.json(
                { valid: false, error: "Token sudah digunakan" },
                { status: 400 }
            );
        }

        return NextResponse.json({ valid: true, token: voteToken.token });
    } catch {
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
