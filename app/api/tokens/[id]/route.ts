import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";

// DELETE - Delete token (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const token = await prisma.voteToken.findUnique({ where: { id } });
        if (!token) {
            return NextResponse.json(
                { error: "Token tidak ditemukan" },
                { status: 404 }
            );
        }

        await prisma.voteToken.delete({ where: { id } });

        return NextResponse.json({ message: "Token berhasil dihapus" });
    } catch {
        return NextResponse.json(
            { error: "Gagal menghapus token" },
            { status: 500 }
        );
    }
}
