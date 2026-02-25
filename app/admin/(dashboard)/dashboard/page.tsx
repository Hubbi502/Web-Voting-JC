"use client";

import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";

interface CandidateResult {
    id: string;
    name: string;
    className: string;
    photoUrl: string;
    votes: number;
}

interface Stats {
    totalVotes: number;
    totalTokens: number;
    usedTokens: number;
    remainingTokens: number;
}

interface TimelineData {
    time: string;
    votes: number;
}

export default function AdminDashboard() {
    const [candidates, setCandidates] = useState<CandidateResult[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = () => {
        fetch("/api/vote/results")
            .then((res) => res.json())
            .then((data) => {
                setCandidates(data.candidates || []);
                setStats(data.stats || null);
                setTimeline(data.timeline || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchResults();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchResults, 10000);
        return () => clearInterval(interval);
    }, []);

    const maxVotes = Math.max(...candidates.map((c) => c.votes), 1);

    // Data for Token Pie Chart
    const tokenData = stats
        ? [
            { name: "Terpakai", value: stats.usedTokens, color: "#FF6B6B" },
            { name: "Sisa", value: stats.remainingTokens, color: "#4ECDC4" },
        ]
        : [];

    // Data for Candidate Bar Chart
    const candidateData = candidates.map((c) => ({
        name: c.name.split(" ")[0], // First name for shorter labels
        votes: c.votes,
    }));

    return (
        <div className="pb-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-jp-cream tracking-wider">
                    📊 Dashboard
                </h1>
                <p className="text-jp-cream/40 text-sm mt-1">Pantau hasil voting secara real-time</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="glass-card rounded-xl p-4 md:p-5">
                        <p className="text-jp-cream/40 text-[10px] md:text-xs font-medium uppercase tracking-wider">Total Suara</p>
                        <p className="text-2xl md:text-3xl font-bold text-jp-cream mt-1 md:mt-2">{stats.totalVotes}</p>
                    </div>
                    <div className="glass-card rounded-xl p-4 md:p-5">
                        <p className="text-jp-cream/40 text-[10px] md:text-xs font-medium uppercase tracking-wider">Total Token</p>
                        <p className="text-2xl md:text-3xl font-bold text-jp-cream mt-1 md:mt-2">{stats.totalTokens}</p>
                    </div>
                    <div className="glass-card rounded-xl p-4 md:p-5">
                        <p className="text-jp-cream/40 text-[10px] md:text-xs font-medium uppercase tracking-wider">Token Terpakai</p>
                        <p className="text-2xl md:text-3xl font-bold text-jp-pink mt-1 md:mt-2">{stats.usedTokens}</p>
                    </div>
                    <div className="glass-card rounded-xl p-4 md:p-5">
                        <p className="text-jp-cream/40 text-[10px] md:text-xs font-medium uppercase tracking-wider">Sisa Token</p>
                        <p className="text-2xl md:text-3xl font-bold text-green-400 mt-1 md:mt-2">{stats.remainingTokens}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* 1. Leaderboard / Progress */}
                <div className="glass-card rounded-xl p-4 md:p-6 flex flex-col h-[400px]">
                    <h2 className="font-serif text-lg md:text-xl font-bold text-jp-cream mb-4">🏆 Leaderboard</h2>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="shimmer h-16 rounded-lg" />
                                ))}
                            </div>
                        ) : candidates.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-jp-cream/40">Belum ada data voting</p>
                            </div>
                        ) : (
                            <div className="space-y-4 md:space-y-5">
                                {candidates
                                    .sort((a, b) => b.votes - a.votes)
                                    .map((candidate, index) => (
                                        <div key={candidate.id} className="flex items-center gap-3 md:gap-4">
                                            <div className="w-6 md:w-8 text-center shrink-0">
                                                <span className="text-jp-gold font-bold text-base md:text-lg">
                                                    {index === 0 ? "👑" : `#${index + 1}`}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="truncate pr-2">
                                                        <span className="text-jp-cream font-medium text-sm md:text-base mr-2">{candidate.name}</span>
                                                        <span className="text-jp-cream/30 text-[10px] md:text-xs hidden sm:inline-block">{candidate.className}</span>
                                                    </div>
                                                    <span className="text-jp-pink font-bold text-sm md:text-base shrink-0">{candidate.votes} suara</span>
                                                </div>
                                                <div className="h-2 md:h-3 bg-jp-gray/50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${(candidate.votes / maxVotes) * 100}%`,
                                                            background: index === 0
                                                                ? "linear-gradient(90deg, #D4A574, #E8C99B)"
                                                                : index === 1
                                                                    ? "linear-gradient(90deg, #8B0000, #C41E3A)"
                                                                    : "linear-gradient(90deg, #FFB7C5, #FFD6E0)",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Candidate Votes Bar Chart */}
                <div className="glass-card rounded-xl p-4 md:p-6 flex flex-col h-[400px]">
                    <h2 className="font-serif text-lg md:text-xl font-bold text-jp-cream mb-4">📊 Perbandingan Suara</h2>
                    <div className="flex-1 w-full relative">
                        {loading ? (
                            <div className="shimmer w-full h-full rounded-lg" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={candidateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                                    <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff10' }}
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="votes" fill="#D4A574" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                        {candidateData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? "#D4A574" : index === 1 ? "#C41E3A" : "#FFB7C5"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* 3. Voting Timeline Line Chart */}
                <div className="glass-card rounded-xl p-4 md:p-6 flex flex-col h-[350px]">
                    <h2 className="font-serif text-lg md:text-xl font-bold text-jp-cream mb-4">📈 Tren Voting</h2>
                    <div className="flex-1 w-full relative">
                        {loading ? (
                            <div className="shimmer w-full h-full rounded-lg" />
                        ) : timeline.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-jp-cream/40">Belum ada data timeline</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                                    <XAxis dataKey="time" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="votes" stroke="#D4A574" strokeWidth={3} dot={{ r: 4, fill: '#1a1a1a', stroke: '#D4A574', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* 4. Token Usage Pie Chart */}
                <div className="glass-card rounded-xl p-4 md:p-6 flex flex-col h-[350px]">
                    <h2 className="font-serif text-lg md:text-xl font-bold text-jp-cream mb-4">🎟️ Penggunaan Token</h2>
                    <div className="flex-1 w-full relative">
                        {loading ? (
                            <div className="shimmer w-full h-full rounded-lg" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={tokenData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {tokenData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                        formatter={(value) => [`${value} Tokens`, '']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        {!loading && tokenData.length > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <p className="text-jp-cream/40 text-[10px] uppercase font-bold tracking-wider">Total Token</p>
                                    <p className="text-2xl font-bold text-jp-cream">{stats?.totalTokens}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Legend manual biar lebih bisa di-custom stylenya */}
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
                            <span className="text-xs text-jp-cream/70">Terpakai ({stats?.usedTokens})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#4ECDC4]" />
                            <span className="text-xs text-jp-cream/70">Sisa ({stats?.remainingTokens})</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
