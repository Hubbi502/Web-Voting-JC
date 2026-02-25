"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SakuraAnimation from "./components/SakuraAnimation";
import CandidateCard from "./components/CandidateCard";
import CandidateModal from "./components/CandidateModal";

interface Candidate {
  id: string;
  name: string;
  className: string;
  visi: string;
  misi: string;
  programKerja: string;
  photoUrl: string;
}

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/candidates")
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen relative">
      <SakuraAnimation />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        {/* Background decorations removed */}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="text-5xl sm:text-6xl">⛩️</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-jp-cream mb-4 tracking-wide">
            Pemilihan Ketua
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-jp-gold"></div>
            <span className="font-serif text-jp-gold text-lg tracking-[0.3em]">日本クラブ</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-jp-gold"></div>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-jp-pink font-semibold mb-2">
            Japanese Club
          </h2>
          <p className="text-jp-cream/50 text-lg">
            Periode 2026 / 2027
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <div className="glass-card px-6 py-3 rounded-full flex items-center gap-2">
              <span className="text-lg">👥</span>
              <span className="text-jp-cream/80 text-sm font-medium">
                {loading ? "..." : `${candidates.length} Kandidat`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Candidates Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-jp-cream mb-2">
            Kandidat Ketua
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-jp-red"></div>
            <span className="text-jp-pink text-sm">候補者</span>
            <div className="h-px w-12 bg-jp-red"></div>
          </div>
        </div>

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
        ) : candidates.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🌸</span>
            <p className="text-jp-cream/50 text-lg">Belum ada kandidat terdaftar</p>
            <p className="text-jp-cream/30 text-sm mt-2">Kandidat akan muncul di sini setelah ditambahkan oleh admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                {...candidate}
                onClick={() => setSelectedCandidate(candidate)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-jp-pink/10 py-8 text-center">
        <p className="text-jp-cream/30 text-sm">
          © 2026 Japanese Club — 日本クラブ | Pemilihan Ketua Periode 2026/2027
        </p>
      </footer>

      {/* Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </main>
  );
}
