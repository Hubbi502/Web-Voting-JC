import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import { uploadImage, deleteImage } from "@/app/lib/cloudinary";

// GET - Get single candidate (public)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const candidate = await prisma.candidate.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { votes: true },
                },
            },
        });

        if (!candidate) {
            return NextResponse.json(
                { error: "Kandidat tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json(candidate);
    } catch {
        return NextResponse.json(
            { error: "Gagal mengambil data kandidat" },
            { status: 500 }
        );
    }
}

// PUT - Update candidate (admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const className = formData.get("className") as string;
        const visi = formData.get("visi") as string;
        const misi = formData.get("misi") as string;
        const programKerja = formData.get("programKerja") as string;
        const photo = formData.get("photo") as File | null;
        const order = parseInt(formData.get("order") as string) || 0;

        const existing = await prisma.candidate.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json(
                { error: "Kandidat tidak ditemukan" },
                { status: 404 }
            );
        }

        let photoUrl = existing.photoUrl;
        let photoPublicId = existing.photoPublicId;

        // If new photo uploaded, replace old one
        if (photo && photo.size > 0) {
            // Delete old image from Cloudinary
            await deleteImage(existing.photoPublicId);
            // Upload new image
            const uploaded = await uploadImage(photo);
            photoUrl = uploaded.url;
            photoPublicId = uploaded.publicId;
        }

        const candidate = await prisma.candidate.update({
            where: { id },
            data: {
                name: name || existing.name,
                className: className || existing.className,
                visi: visi || existing.visi,
                misi: misi || existing.misi,
                programKerja: programKerja || existing.programKerja,
                photoUrl,
                photoPublicId,
                order,
            },
        });

        return NextResponse.json(candidate);
    } catch (error) {
        console.error("Error updating candidate:", error);
        return NextResponse.json(
            { error: "Gagal mengupdate kandidat" },
            { status: 500 }
        );
    }
}

// DELETE - Delete candidate (admin only)
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
        const candidate = await prisma.candidate.findUnique({ where: { id } });
        if (!candidate) {
            return NextResponse.json(
                { error: "Kandidat tidak ditemukan" },
                { status: 404 }
            );
        }

        // Delete image from Cloudinary
        await deleteImage(candidate.photoPublicId);

        // Delete candidate (votes will cascade)
        await prisma.candidate.delete({ where: { id } });

        return NextResponse.json({ message: "Kandidat berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting candidate:", error);
        return NextResponse.json(
            { error: "Gagal menghapus kandidat" },
            { status: 500 }
        );
    }
}
