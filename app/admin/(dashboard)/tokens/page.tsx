"use client";

import { useEffect, useState } from "react";

interface Token {
    id: string;
    token: string;
    isUsed: boolean;
    usedAt: string | null;
    createdAt: string;
    vote?: {
        candidate: {
            name: string;
        };
    } | null;
}

export default function AdminTokensPage() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [count, setCount] = useState("10");
    const [filter, setFilter] = useState<"all" | "available" | "used">("all");

    const fetchTokens = () => {
        fetch("/api/tokens")
            .then((res) => res.json())
            .then((data) => {
                setTokens(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchTokens();
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await fetch("/api/tokens", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ count: parseInt(count) }),
            });

            if (res.ok) {
                fetchTokens();
            }
        } catch {
            alert("Gagal membuat token");
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus token ini?")) return;

        try {
            const res = await fetch(`/api/tokens/${id}`, { method: "DELETE" });
            if (res.ok) {
                setTokens((prev) => prev.filter((t) => t.id !== id));
            }
        } catch {
            alert("Gagal menghapus token");
        }
    };

    const filteredTokens = tokens.filter((t) => {
        if (filter === "available") return !t.isUsed;
        if (filter === "used") return t.isUsed;
        return true;
    });

    const availableCount = tokens.filter((t) => !t.isUsed).length;
    const usedCount = tokens.filter((t) => t.isUsed).length;

    const copyAllAvailable = () => {
        const availableTokens = tokens
            .filter((t) => !t.isUsed)
            .map((t) => t.token)
            .join("\n");
        navigator.clipboard.writeText(availableTokens);
        alert(`${availableCount} token tersedia berhasil disalin!`);
    };

    const handleExportCSV = () => {
        const csvRows = ["Nomor,Token"];

        filteredTokens.forEach((t, index) => {
            csvRows.push(`${index + 1},${t.token}`);
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);

        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `tokens-${filter}-${new Date().toISOString().split("T")[0]}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-jp-cream tracking-wider">
                    🎟️ Token Voting
                </h1>
                <p className="text-jp-cream/40 text-sm mt-1">Kelola token untuk voting</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass-card rounded-xl p-4">
                    <p className="text-jp-cream/40 text-xs uppercase tracking-wider">Total Token</p>
                    <p className="text-2xl font-bold text-jp-cream mt-1">{tokens.length}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                    <p className="text-jp-cream/40 text-xs uppercase tracking-wider">Tersedia</p>
                    <p className="text-2xl font-bold text-green-400 mt-1">{availableCount}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                    <p className="text-jp-cream/40 text-xs uppercase tracking-wider">Terpakai</p>
                    <p className="text-2xl font-bold text-jp-pink mt-1">{usedCount}</p>
                </div>
            </div>

            {/* Generate */}
            <div className="glass-card rounded-xl p-4 md:p-6 mb-6">
                <h2 className="text-jp-cream font-medium mb-4">Generate Token Baru</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-jp-cream/60 text-sm">Jumlah:</label>
                        <input
                            type="number"
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                            className="input-jp w-full sm:w-20 text-center"
                            min="1"
                            max="100"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            {generating ? "Generating..." : "🎲 Generate"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                    {(["all", "available", "used"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none text-center ${filter === f
                                ? "bg-jp-red/20 text-jp-pink border border-jp-red/30"
                                : "text-jp-cream/40 hover:text-jp-cream hover:bg-jp-gray/30 bg-jp-navy/30"
                                }`}
                        >
                            {f === "all" ? `Semua (${tokens.length})` : f === "available" ? `Tersedia (${availableCount})` : `Terpakai (${usedCount})`}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {availableCount > 0 && (
                        <button onClick={copyAllAvailable} className="btn-secondary text-sm flex-1 md:flex-none">
                            📋 Copy Tersedia
                        </button>
                    )}
                    {filteredTokens.length > 0 && (
                        <button onClick={handleExportCSV} className="btn-secondary text-sm flex-1 md:flex-none bg-jp-navy/30">
                            📄 Export CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Token List */}
            <div className="glass-card rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-4 md:p-8 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="shimmer h-12 rounded-lg" />
                        ))}
                    </div>
                ) : filteredTokens.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <span className="text-4xl block mb-2">🎟️</span>
                        <p className="text-jp-cream/40">Tidak ada token</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="admin-table w-full whitespace-nowrap">
                            <thead>
                                <tr>
                                    <th>Token</th>
                                    <th>Status</th>
                                    <th>Waktu Pakai</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTokens.map((token) => (
                                    <tr key={token.id}>
                                        <td>
                                            <code className="bg-jp-gray/50 px-2 py-1 rounded text-jp-gold font-mono text-sm tracking-wider">
                                                {token.token}
                                            </code>
                                        </td>
                                        <td>
                                            <span className={token.isUsed ? "badge-used" : "badge-available"}>
                                                {token.isUsed ? "Terpakai" : "Tersedia"}
                                            </span>
                                        </td>
                                        <td className="text-jp-cream/40 text-sm">
                                            {token.usedAt
                                                ? new Date(token.usedAt).toLocaleString("id-ID")
                                                : "-"}
                                        </td>
                                        <td>
                                            {!token.isUsed && (
                                                <button
                                                    onClick={() => handleDelete(token.id)}
                                                    className="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
