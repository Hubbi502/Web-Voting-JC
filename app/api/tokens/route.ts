import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { generateTokens } from "@/app/lib/token";

// GET - List all tokens (admin only)
export async function GET() {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tokens = await prisma.voteToken.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                vote: {
                    include: {
                        candidate: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        return NextResponse.json(tokens);
    } catch {
        return NextResponse.json(
            { error: "Gagal mengambil data token" },
            { status: 500 }
        );
    }
}

// POST - Generate new tokens (admin only)
export async function POST(request: Request) {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { count } = await request.json();
        const tokenCount = Math.min(Math.max(parseInt(count) || 1, 1), 100);

        const tokenValues = generateTokens(tokenCount);

        const created = await prisma.voteToken.createMany({
            data: tokenValues.map((token) => ({ token })),
        });

        // Fetch the created tokens to return
        const tokens = await prisma.voteToken.findMany({
            where: {
                token: { in: tokenValues },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(
            {
                message: `${created.count} token berhasil dibuat`,
                tokens,
            },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Gagal membuat token" },
            { status: 500 }
        );
    }
}
