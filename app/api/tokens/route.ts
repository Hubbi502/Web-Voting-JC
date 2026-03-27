import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { generateTokens } from "@/app/lib/token";
import crypto from "crypto";

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

        const tokens = await prisma.$transaction(
            tokenValues.map((token) => prisma.voteToken.create({ 
                data: { 
                    token
                } 
            }))
        );

        return NextResponse.json(
            {
                message: `${tokens.length} token berhasil dibuat`,
                tokens,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating tokens:", error);
        return NextResponse.json(
            { error: "Gagal membuat token", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
