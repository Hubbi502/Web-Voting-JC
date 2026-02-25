"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SakuraAnimation from "@/app/components/SakuraAnimation";
import Link from "next/link";

export default function VotePage() {
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/vote/verify-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token.toUpperCase() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            // Store token in sessionStorage and redirect to candidate selection
            sessionStorage.setItem("voteToken", data.token);
            router.push("/vote/select");
        } catch {
            setError("Terjadi kesalahan. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 relative">
            <SakuraAnimation />

            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-10 text-8xl opacity-5">🗳️</div>
                <div className="absolute bottom-1/3 right-10 text-6xl opacity-5">⛩️</div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <span className="text-5xl block mb-3">🗳️</span>
                    <h1 className="font-serif text-3xl font-bold text-jp-cream tracking-wider">
                        Sesi Voting
                    </h1>
                    <p className="text-jp-cream/40 text-sm mt-2">投票セッション</p>
                    <p className="text-jp-cream/50 text-sm mt-4">
                        Masukkan token voting yang telah diberikan untuk memulai proses pemilihan
                    </p>
                </div>

                {/* Token Input */}
                <div className="glass-card rounded-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-jp-cream/60 text-sm font-medium mb-2">
                                Token Voting
                            </label>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value.toUpperCase())}
                                className="input-jp text-center text-2xl tracking-[0.5em] font-mono uppercase"
                                placeholder="XXXXXXXX"
                                maxLength={8}
                                required
                                autoFocus
                            />
                            <p className="text-jp-cream/30 text-xs mt-2 text-center">
                                Token terdiri dari 8 karakter
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || token.length !== 8}
                            className="btn-gold w-full flex items-center justify-center gap-2 text-lg py-4"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Memverifikasi...
                                </>
                            ) : (
                                "🗳️ Mulai Voting"
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <Link href="/" className="text-jp-cream/30 text-sm hover:text-jp-cream/60 transition-colors">
                        ← Kembali ke Halaman Utama
                    </Link>
                </div>
            </div>
        </main>
    );
}
