"use client";

export default function SakuraAnimation() {
    const petals = Array.from({ length: 8 }, (_, i) => i);
    const petalChars = ['🌸', '❀', '✿', '🌺'];

    return (
        <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
            {petals.map((i) => (
                <span key={i} className="sakura-petal">
                    {petalChars[i % petalChars.length]}
                </span>
            ))}
        </div>
    );
}
