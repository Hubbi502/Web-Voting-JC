"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SakuraAnimation from "@/app/components/SakuraAnimation";

export default function VoteSuccessPage() {
    const [votedFor, setVotedFor] = useState<string>("");

    useEffect(() => {
        const name = sessionStorage.getItem("votedFor") || "";
        setVotedFor(name);
        // Clear after reading
        sessionStorage.removeItem("votedFor");
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center px-4 relative">
            <SakuraAnimation />

            <div className="w-full max-w-md text-center relative z-10">
                {/* Success Animation */}
                <div className="mb-6">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <span className="text-5xl">✅</span>
                    </div>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-jp-cream tracking-wider mb-3">
                    Voting Berhasil!
                </h1>
                <p className="text-jp-cream/40 text-sm mb-6">投票成功</p>

                {votedFor && (
                    <div className="glass-card rounded-xl p-6 mb-8">
                        <p className="text-jp-cream/50 text-sm mb-2">Anda telah memberikan suara untuk:</p>
                        <p className="text-jp-gold font-serif text-2xl font-bold">{votedFor}</p>
                    </div>
                )}

                <div className="glass-card rounded-xl p-6 mb-8">
                    <p className="text-jp-cream/60 text-sm leading-relaxed">
                        Terima kasih telah berpartisipasi dalam pemilihan Ketua Japanese Club 2026/2027.
                        Suara Anda telah tercatat dan tidak dapat diubah.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link href="/" className="btn-primary w-full inline-block text-center">
                        🏠 Kembali ke Halaman Utama
                    </Link>
                </div>

                {/* Decorative */}
                <div className="mt-12 flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-jp-red"></div>
                    <span className="text-jp-pink/30 text-2xl">🌸</span>
                    <div className="h-px w-12 bg-jp-red"></div>
                </div>
                <p className="text-jp-cream/20 text-xs mt-4">
                    © 2026 Japanese Club — 日本クラブ
                </p>
            </div>
        </main>
    );
}
