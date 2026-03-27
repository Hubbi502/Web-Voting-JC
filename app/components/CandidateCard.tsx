"use client";

import Image from "next/image";

interface CandidateCardProps {
    id: string;
    name: string;
    className: string;
    photoUrl: string;
    visi: string;
    onClick: () => void;
}

export default function CandidateCard({ name, className, photoUrl, visi, onClick }: CandidateCardProps) {
    return (
        <button
            onClick={onClick}
            className="glass-card rounded-xl text-left cursor-pointer group w-full active:scale-[0.98] transition-transform duration-150"
        >
            {/* Desktop/Tablet: Vertical layout */}
            <div className="hidden sm:block">
                <div className="candidate-img-wrapper aspect-[3/4] relative">
                    <Image
                        src={photoUrl}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                        <h3 className="font-serif text-xl font-bold text-jp-cream drop-shadow-lg">
                            {name}
                        </h3>
                        <p className="text-jp-pink text-sm font-medium">{className}</p>
                    </div>
                </div>
                <div className="p-4 pt-2">
                    <p className="text-jp-cream/60 text-sm line-clamp-2 leading-relaxed">
                        {visi}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-jp-navy/40 border border-jp-pink/20 text-jp-gold text-xs font-semibold hover:bg-jp-navy/60 hover:border-jp-pink/40 hover:text-jp-gold-light group-hover:-translate-y-0.5 transition-all duration-200">
                        <span>📋 Lihat Detail</span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Mobile: Horizontal compact layout */}
            <div className="sm:hidden candidate-card-mobile">
                <div className="candidate-img-mobile">
                    <Image
                        src={photoUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="120px"
                    />
                </div>
                <div className="candidate-info-mobile">
                    <h3 className="font-serif text-base font-bold text-jp-cream leading-tight">
                        {name}
                    </h3>
                    <p className="text-jp-pink text-xs font-medium mt-0.5">{className}</p>
                    <p className="text-jp-cream/50 text-xs line-clamp-2 mt-2 leading-relaxed">
                        {visi}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-jp-navy/40 border border-jp-pink/20 text-jp-gold text-[11px] sm:text-xs font-semibold hover:bg-jp-navy/60 hover:border-jp-pink/40 hover:text-jp-gold-light transition-all w-fit">
                        <span>📋 Lihat Detail</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </button>
    );
}
