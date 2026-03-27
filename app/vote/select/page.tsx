"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function VoteSelectContent() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Get token from URL query parameter
        const token = searchParams.get("token");
        if (!token) {
            router.push("/vote");
            return;
        }

        // Verify token is valid
        fetch("/api/vote/verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.valid) {
                    alert(data.error || "Token tidak valid");
                    router.push("/vote");
                    return;
                }
                
                // Token valid, load candidates
                return fetch("/api/candidates");
            })
            .then((res) => res?.json())
            .then((data) => {
                if (data) {
                    setCandidates(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                alert("Terjadi kesalahan saat memuat data");
                setLoading(false);
            });
    }, [router, searchParams]);

    const handleVote = async () => {
        const token = searchParams.get("token");
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
                    router.push("/vote");
                }
                return;
            }

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
            <div className="bg-jp-navy/80 backdrop-blur-xl border-b border-jp-pink/10 py-4 sm:py-6 px-4 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="font-serif text-xl sm:text-3xl font-bold text-jp-cream tracking-wider">
                        Pilih Kandidat
                    </h1>
                    <p className="text-jp-cream/40 text-xs sm:text-sm mt-1">Klik pada kandidat pilihan Anda</p>
                </div>
            </div>

            {/* Candidates Grid */}
            <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 relative z-10">
                {loading ? (
                    <>
                        {/* Mobile shimmer: horizontal cards */}
                        <div className="sm:hidden space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="glass-card rounded-xl overflow-hidden flex">
                                    <div className="shimmer w-[120px] min-h-[140px]" />
                                    <div className="p-4 flex-1 space-y-3">
                                        <div className="shimmer h-5 w-3/4" />
                                        <div className="shimmer h-4 w-1/2" />
                                        <div className="shimmer h-3 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Desktop shimmer: grid */}
                        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
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
                    </>
                ) : (
                    <>
                        {/* Mobile: horizontal compact cards */}
                        <div className="sm:hidden space-y-3">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.id}
                                    onClick={() => setSelected(candidate.id)}
                                    className={`glass-card rounded-xl text-left cursor-pointer w-full transition-all duration-300 active:scale-[0.98] relative overflow-hidden ${selected === candidate.id
                                        ? "ring-2 ring-jp-gold border-jp-gold/50"
                                        : ""
                                        }`}
                                >
                                    {/* Selection indicator */}
                                    {selected === candidate.id && (
                                        <div className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-jp-gold flex items-center justify-center">
                                            <svg className="w-4 h-4 text-jp-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="candidate-card-mobile">
                                        <div className="candidate-img-mobile">
                                            <Image
                                                src={candidate.photoUrl}
                                                alt={candidate.name}
                                                fill
                                                className="object-cover"
                                                sizes="120px"
                                            />
                                        </div>
                                        <div className="candidate-info-mobile">
                                            <h3 className="font-serif text-base font-bold text-jp-cream leading-tight">
                                                {candidate.name}
                                            </h3>
                                            <p className="text-jp-pink text-xs font-medium mt-0.5">{candidate.className}</p>
                                            <p className="text-jp-cream/50 text-xs line-clamp-2 mt-2 leading-relaxed">{candidate.visi}</p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDetailCandidate(candidate);
                                                }}
                                                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-jp-navy/40 border border-jp-pink/20 text-jp-gold text-xs font-semibold hover:bg-jp-navy/60 hover:border-jp-pink/40 hover:text-jp-gold-light active:scale-95 transition-all w-fit"
                                            >
                                                <span>📋 Lihat Detail</span>
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop/Tablet: vertical grid */}
                        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
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
                                            sizes="(max-width: 1024px) 50vw, 33vw"
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
                                            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-jp-navy/40 border border-jp-pink/20 text-jp-gold text-xs font-semibold hover:bg-jp-navy/60 hover:border-jp-pink/40 hover:text-jp-gold-light hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                        >
                                            <span>📋 Lihat Detail Lengkap</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Fixed Bottom Bar */}
            {selected && (
                <div className="fixed bottom-0 left-0 right-0 z-30 bg-jp-navy/90 backdrop-blur-xl border-t border-jp-pink/20 p-3 sm:p-4 safe-bottom">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            {selectedCandidate && (
                                <>
                                    <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                                        <Image
                                            src={selectedCandidate.photoUrl}
                                            alt={selectedCandidate.name}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-jp-cream text-sm font-medium truncate">{selectedCandidate.name}</p>
                                        <p className="text-jp-cream/40 text-xs truncate">{selectedCandidate.className}</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="btn-gold flex items-center gap-2 text-sm sm:text-lg flex-shrink-0 whitespace-nowrap"
                        >
                            🗳️ <span className="hidden sm:inline">Vote Sekarang</span><span className="sm:hidden">Vote</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirm && selectedCandidate && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal-content max-w-md sm:max-h-[90vh] sm:h-auto sm:rounded-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 sm:p-8 text-center flex flex-col justify-center min-h-full sm:min-h-0">
                            <span className="text-4xl sm:text-5xl block mb-4">🗳️</span>
                            <h2 className="font-serif text-xl sm:text-2xl font-bold text-jp-cream mb-2">
                                Konfirmasi Pilihan
                            </h2>
                            <p className="text-jp-cream/50 text-sm mb-6">
                                Anda akan memberikan suara untuk:
                            </p>

                            <div className="glass-card rounded-xl p-4 mb-6 flex items-center gap-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                                    <Image
                                        src={selectedCandidate.photoUrl}
                                        alt={selectedCandidate.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="text-jp-cream font-bold text-base sm:text-lg">{selectedCandidate.name}</p>
                                    <p className="text-jp-pink text-sm">{selectedCandidate.className}</p>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
                                <p className="text-yellow-400/80 text-sm">
                                    ⚠️ Pilihan tidak dapat diubah setelah dikonfirmasi
                                </p>
                            </div>

                            <div className="flex gap-3 safe-bottom">
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
                        <div className="relative h-48 sm:h-64">
                            <Image
                                src={detailCandidate.photoUrl}
                                alt={detailCandidate.name}
                                fill
                                className="object-cover sm:rounded-t-xl"
                                sizes="(max-width: 640px) 100vw, 700px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-jp-navy via-jp-navy/50 to-transparent sm:rounded-t-xl" />
                            <button
                                onClick={() => setDetailCandidate(null)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-jp-dark/60 backdrop-blur-sm flex items-center justify-center text-jp-cream hover:bg-jp-red/60 transition-all border border-jp-pink/20"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-4 left-4 sm:left-6">
                                <h2 className="font-serif text-xl sm:text-2xl font-bold text-jp-cream">{detailCandidate.name}</h2>
                                <p className="text-jp-pink text-sm">{detailCandidate.className}</p>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                            <div>
                                <h3 className="font-serif text-sm font-bold text-jp-gold tracking-wider mb-2">🎯 VISI</h3>
                                <p className="text-jp-cream/80 text-sm leading-relaxed whitespace-pre-line pl-4 sm:pl-6">{detailCandidate.visi}</p>
                            </div>
                            <div className="border-t border-jp-pink/10" />
                            <div>
                                <h3 className="font-serif text-sm font-bold text-jp-gold tracking-wider mb-2">📋 MISI</h3>
                                <p className="text-jp-cream/80 text-sm leading-relaxed whitespace-pre-line pl-4 sm:pl-6">{detailCandidate.misi}</p>
                            </div>
                            <div className="border-t border-jp-pink/10" />
                            <div>
                                <h3 className="font-serif text-sm font-bold text-jp-gold tracking-wider mb-2">🏯 PROGRAM KERJA</h3>
                                <p className="text-jp-cream/80 text-sm leading-relaxed whitespace-pre-line pl-4 sm:pl-6">{detailCandidate.programKerja}</p>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 pt-0 safe-bottom">
                            <button
                                onClick={() => setDetailCandidate(null)}
                                className="btn-secondary w-full text-center"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function VoteSelectPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-jp-navy flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-shogi-pattern opacity-5" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-jp-gold/20 border-t-jp-gold rounded-full animate-spin" />
                    <p className="text-jp-gold font-serif text-xl tracking-widest animate-pulse">Memuat...</p>
                </div>
            </main>
        }>
            <VoteSelectContent />
        </Suspense>
    );
}
