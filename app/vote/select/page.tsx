"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SakuraAnimation from "@/app/components/SakuraAnimation";

interface Candidate {
    id: string;
    name: string;
    className: string;
    visi: string;
    misi: string;
    programKerja: string;
    photoUrl: string;
}

export default function VoteSelectPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user has a valid token
        const token = sessionStorage.getItem("voteToken");
        if (!token) {
            router.push("/vote");
            return;
        }

        fetch("/api/candidates")
            .then((res) => res.json())
            .then((data) => {
                setCandidates(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [router]);

    const handleVote = async () => {
        const token = sessionStorage.getItem("voteToken");
        if (!token || !selected) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, candidateId: selected }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error);
                if (data.error === "Token sudah digunakan" || data.error === "Token tidak valid") {
                    sessionStorage.removeItem("voteToken");
                    router.push("/vote");
                }
                return;
            }

            sessionStorage.removeItem("voteToken");
            sessionStorage.setItem("votedFor", data.vote.candidate.name);
            router.push("/vote/success");
        } catch {
            alert("Terjadi kesalahan. Coba lagi.");
        } finally {
            setSubmitting(false);
            setShowConfirm(false);
        }
    };

    const selectedCandidate = candidates.find((c) => c.id === selected);

    return (
        <main className="min-h-screen relative pb-32">
            <SakuraAnimation />

            {/* Header */}
            <div className="bg-jp-navy/80 backdrop-blur-xl border-b border-jp-pink/10 py-6 px-4 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-jp-cream tracking-wider">
                        Pilih Kandidat
                    </h1>
                    <p className="text-jp-cream/40 text-sm mt-1">Klik pada kandidat pilihan Anda</p>
                </div>
            </div>

            {/* Candidates Grid */}
            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass-card rounded-xl overflow-hidden">
                                <div className="shimmer aspect-[3/4]" />
                                <div className="p-4 space-y-3">
                                    <div className="shimmer h-6 w-3/4" />
                                    <div className="shimmer h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidates.map((candidate) => (
                            <div
                                key={candidate.id}
                                onClick={() => setSelected(candidate.id)}
                                className={`glass-card rounded-xl text-left cursor-pointer group w-full transition-all duration-300 ${selected === candidate.id
                                    ? "ring-2 ring-jp-gold border-jp-gold/50 scale-[1.02]"
                                    : ""
                                    }`}
                            >
                                {/* Selection indicator */}
                                {selected === candidate.id && (
                                    <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-jp-gold flex items-center justify-center">
                                        <svg className="w-5 h-5 text-jp-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}

                                {/* Image */}
                                <div className="candidate-img-wrapper aspect-[3/4] relative">
                                    <Image
                                        src={candidate.photoUrl}
                                        alt={candidate.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                                        <h3 className="font-serif text-xl font-bold text-jp-cream drop-shadow-lg">
                                            {candidate.name}
                                        </h3>
                                        <p className="text-jp-pink text-sm font-medium">{candidate.className}</p>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4 pt-2">
                                    <p className="text-jp-cream/60 text-sm line-clamp-2">{candidate.visi}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDetailCandidate(candidate);
                                        }}
                                        className="mt-3 text-jp-gold text-xs font-medium hover:text-jp-gold-light transition-colors"
                                    >
                                        📋 Lihat Detail Lengkap
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Fixed Bottom Bar */}
            {selected && (
                <div className="fixed bottom-0 left-0 right-0 z-30 bg-jp-navy/90 backdrop-blur-xl border-t border-jp-pink/20 p-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {selectedCandidate && (
                                <>
                                    <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                                        <Image
                                            src={selectedCandidate.photoUrl}
                                            alt={selectedCandidate.name}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-jp-cream text-sm font-medium">{selectedCandidate.name}</p>
                                        <p className="text-jp-cream/40 text-xs">{selectedCandidate.className}</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="btn-gold flex items-center gap-2 text-lg"
                        >
                            🗳️ Vote Sekarang
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirm && selectedCandidate && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="p-8 text-center">
                            <span className="text-5xl block mb-4">🗳️</span>
                            <h2 className="font-serif text-2xl font-bold text-jp-cream mb-2">
                                Konfirmasi Pilihan
                            </h2>
                            <p className="text-jp-cream/50 text-sm mb-6">
                                Anda akan memberikan suara untuk:
                            </p>

                            <div className="glass-card rounded-xl p-4 mb-6 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                                    <Image
                                        src={selectedCandidate.photoUrl}
                                        alt={selectedCandidate.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="text-jp-cream font-bold text-lg">{selectedCandidate.name}</p>
                                    <p className="text-jp-pink text-sm">{selectedCandidate.className}</p>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
                                <p className="text-yellow-400/80 text-sm">
                                    ⚠️ Pilihan tidak dapat diubah setelah dikonfirmasi
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="btn-secondary flex-1"
                                    disabled={submitting}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleVote}
                                    disabled={submitting}
                                    className="btn-gold flex-1 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Memproses...
                                        </>
                                    ) : (
                                        "✅ Konfirmasi"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailCandidate && (
                <div className="modal-overlay" onClick={() => setDetailCandidate(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="relative h-52 sm:h-64">
                            <Image
                                src={detailCandidate.photoUrl}
                                alt={detailCandidate.name}
                                fill
                                className="object-cover rounded-t-xl"
                                sizes="700px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-jp-navy via-jp-navy/50 to-transparent rounded-t-xl" />
                            <button
                                onClick={() => setDetailCandidate(null)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-jp-dark/60 backdrop-blur-sm flex items-center justify-center text-jp-cream hover:bg-jp-red/60 transition-all border border-jp-pink/20"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-4 left-6">
                                <h2 className="font-serif text-2xl font-bold text-jp-cream">{detailCandidate.name}</h2>
                                <p className="text-jp-pink text-sm">{detailCandidate.className}</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <h3 className="font-serif text-sm font-bold text-jp-gold tracking-wider mb-2">🎯 VISI</h3>
                                <p className="text-jp-cream/80 text-sm leading-relaxed whitespace-pre-line pl-6">{detailCandidate.visi}</p>
                            </div>
                            <div className="border-t border-jp-pink/10" />
                            <div>
                                <h3 className="font-serif text-sm font-bold text-jp-gold tracking-wider mb-2">📋 MISI</h3>
                                <p className="text-jp-cream/80 text-sm leading-relaxed whitespace-pre-line pl-6">{detailCandidate.misi}</p>
                            </div>
                            <div className="border-t border-jp-pink/10" />
                            <div>
                                <h3 className="font-serif text-sm font-bold text-jp-gold tracking-wider mb-2">🏯 PROGRAM KERJA</h3>
                                <p className="text-jp-cream/80 text-sm leading-relaxed whitespace-pre-line pl-6">{detailCandidate.programKerja}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
