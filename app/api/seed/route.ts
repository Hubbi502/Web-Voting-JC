import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

// POST - Seed admin account (one-time setup)
export async function POST() {
    try {
        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password) {
            return NextResponse.json(
                { error: "ADMIN_USERNAME dan ADMIN_PASSWORD harus di-set di .env" },
                { status: 400 }
            );
        }

        // Check if admin already exists
        const existing = await prisma.admin.findUnique({
            where: { username },
        });

        if (existing) {
            return NextResponse.json(
                { message: "Admin sudah ada", admin: { id: existing.id, username: existing.username } },
                { status: 200 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {
                message: "Admin berhasil dibuat",
                admin: { id: admin.id, username: admin.username },
            },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Gagal membuat admin" },
            { status: 500 }
        );
    }
}
