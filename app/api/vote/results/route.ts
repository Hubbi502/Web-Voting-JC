import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";

// GET - Get vote results (admin only)
export async function GET() {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const candidates = await prisma.candidate.findMany({
            orderBy: { order: "asc" },
            include: {
                _count: {
                    select: { votes: true },
                },
            },
        });

        const totalVotes = await prisma.vote.count();
        const totalTokens = await prisma.voteToken.count();
        const usedTokens = await prisma.voteToken.count({ where: { isUsed: true } });

        // Calculate timeline data
        const allVotes = await prisma.vote.findMany({
            select: { createdAt: true },
            orderBy: { createdAt: "asc" },
        });

        // Group votes by hour
        const timelineMap = new Map<string, number>();
        allVotes.forEach((vote) => {
            const date = new Date(vote.createdAt);
            // Format: "DD MMM HH:00" e.g., "25 Feb 14:00"
            const hourStr = date.toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            }).replace(":", ":00").substring(0, 12) + "00"; // roughly grouping by hour

            timelineMap.set(hourStr, (timelineMap.get(hourStr) || 0) + 1);
        });

        const timeline: { time: string; votes: number }[] = [];
        let cumulativeVotes = 0;

        timelineMap.forEach((votes, time) => {
            cumulativeVotes += votes;
            timeline.push({ time, votes: cumulativeVotes });
        });

        return NextResponse.json({
            candidates: candidates.map((c) => ({
                id: c.id,
                name: c.name,
                className: c.className,
                photoUrl: c.photoUrl,
                votes: c._count.votes,
            })),
            stats: {
                totalVotes,
                totalTokens,
                usedTokens,
                remainingTokens: totalTokens - usedTokens,
            },
            timeline,
        });
    } catch {
        return NextResponse.json(
            { error: "Gagal mengambil hasil voting" },
            { status: 500 }
        );
    }
}
