import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST - Submit vote
export async function POST(request: Request) {
    try {
        const { token, candidateId } = await request.json();

        if (!token || !candidateId) {
            return NextResponse.json(
                { error: "Token dan kandidat wajib diisi" },
                { status: 400 }
            );
        }

        // Verify token
        const voteToken = await prisma.voteToken.findUnique({
            where: { token: token.toUpperCase() },
        });

        if (!voteToken) {
            return NextResponse.json(
                { error: "Token tidak valid" },
                { status: 400 }
            );
        }

        if (voteToken.isUsed) {
            return NextResponse.json(
                { error: "Token sudah digunakan" },
                { status: 400 }
            );
        }

        // Verify candidate exists
        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
        });

        if (!candidate) {
            return NextResponse.json(
                { error: "Kandidat tidak ditemukan" },
                { status: 400 }
            );
        }

        // Create vote and mark token as used in a transaction
        const vote = await prisma.$transaction(async (tx) => {
            // Mark token as used
            await tx.voteToken.update({
                where: { id: voteToken.id },
                data: { isUsed: true, usedAt: new Date() },
            });

            // Create vote record
            return tx.vote.create({
                data: {
                    candidateId,
                    tokenId: voteToken.id,
                },
                include: {
                    candidate: {
                        select: { name: true },
                    },
                },
            });
        });

        return NextResponse.json({
            message: `Vote berhasil untuk ${vote.candidate.name}`,
            vote,
        });
    } catch (error) {
        console.error("Error voting:", error);
        return NextResponse.json(
            { error: "Gagal melakukan voting" },
            { status: 500 }
        );
    }
}
