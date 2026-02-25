import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { uploadImage } from "@/app/lib/cloudinary";

// GET - List all candidates (public)
export async function GET() {
    try {
        const candidates = await prisma.candidate.findMany({
            orderBy: { order: "asc" },
            include: {
                _count: {
                    select: { votes: true },
                },
            },
        });

        return NextResponse.json(candidates);
    } catch {
        return NextResponse.json(
            { error: "Gagal mengambil data kandidat" },
            { status: 500 }
        );
    }
}

// POST - Create candidate (admin only)
export async function POST(request: Request) {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const name = formData.get("name") as string;
        const className = formData.get("className") as string;
        const visi = formData.get("visi") as string;
        const misi = formData.get("misi") as string;
        const programKerja = formData.get("programKerja") as string;
        const photo = formData.get("photo") as File;
        const order = parseInt(formData.get("order") as string) || 0;

        if (!name || !className || !visi || !misi || !programKerja || !photo) {
            return NextResponse.json(
                { error: "Semua field wajib diisi" },
                { status: 400 }
            );
        }

        // Upload image to Cloudinary
        const { url, publicId } = await uploadImage(photo);

        const candidate = await prisma.candidate.create({
            data: {
                name,
                className,
                visi,
                misi,
                programKerja,
                photoUrl: url,
                photoPublicId: publicId,
                order,
            },
        });

        return NextResponse.json(candidate, { status: 201 });
    } catch (error) {
        console.error("Error creating candidate:", error);
        return NextResponse.json(
            { error: "Gagal membuat kandidat" },
            { status: 500 }
        );
    }
}
