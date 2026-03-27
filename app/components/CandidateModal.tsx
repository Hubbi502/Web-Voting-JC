"use client";

import Image from "next/image";

interface Candidate {
    id: string;
    name: string;
    className: string;
    visi: string;
    misi: string;
    programKerja: string;
    photoUrl: string;
}

interface CandidateModalProps {
    candidate: Candidate;
    onClose: () => void;
}

export default function CandidateModal({ candidate, onClose }: CandidateModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header with image */}
                <div className="relative h-48 sm:h-80">
                    <Image
                        src={candidate.photoUrl}
                        alt={candidate.name}
                        fill
                        className="object-cover sm:rounded-t-xl"
                        sizes="(max-width: 640px) 100vw, 700px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jp-navy via-jp-navy/50 to-transparent sm:rounded-t-xl" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-jp-dark/60 backdrop-blur-sm flex items-center justify-center text-jp-cream hover:bg-jp-red/60 transition-all border border-jp-pink/20"
                    >
                        ✕
                    </button>

                    {/* Name overlay */}
                    <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-jp-cream drop-shadow-lg">
                            {candidate.name}
                        </h2>
                        <p className="text-jp-pink font-medium mt-1">{candidate.className}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                    {/* Visi */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <span className="text-lg sm:text-xl">🎯</span>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-jp-gold tracking-wider">VISI</h3>
                        </div>
                        <p className="text-jp-cream/80 text-sm leading-relaxed pl-4 sm:pl-8 whitespace-pre-line">
                            {candidate.visi}
                        </p>
                    </div>

                    <div className="border-t border-jp-pink/10" />

                    {/* Misi */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <span className="text-lg sm:text-xl">📋</span>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-jp-gold tracking-wider">MISI</h3>
                        </div>
                        <p className="text-jp-cream/80 text-sm leading-relaxed pl-4 sm:pl-8 whitespace-pre-line">
                            {candidate.misi}
                        </p>
                    </div>

                    <div className="border-t border-jp-pink/10" />

                    {/* Program Kerja */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <span className="text-lg sm:text-xl">🏯</span>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-jp-gold tracking-wider">PROGRAM KERJA</h3>
                        </div>
                        <p className="text-jp-cream/80 text-sm leading-relaxed pl-4 sm:pl-8 whitespace-pre-line">
                            {candidate.programKerja}
                        </p>
                    </div>
                </div>

                {/* Footer - larger button for thumb reach on mobile */}
                <div className="p-4 sm:p-6 pt-0 safe-bottom">
                    <button
                        onClick={onClose}
                        className="btn-secondary w-full text-center"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
