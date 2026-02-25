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
            className="glass-card rounded-xl text-left cursor-pointer group w-full"
        >
            {/* Image */}
            <div className="candidate-img-wrapper aspect-[3/4] relative">
                <Image
                    src={photoUrl}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-serif text-xl font-bold text-jp-cream drop-shadow-lg">
                        {name}
                    </h3>
                    <p className="text-jp-pink text-sm font-medium">{className}</p>
                </div>
            </div>

            {/* Brief info */}
            <div className="p-4 pt-2">
                <p className="text-jp-cream/60 text-sm line-clamp-2 leading-relaxed">
                    {visi}
                </p>
                <div className="mt-3 flex items-center gap-1 text-jp-gold text-xs font-medium group-hover:text-jp-gold-light transition-colors">
                    <span>Lihat Detail</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </button>
    );
}
