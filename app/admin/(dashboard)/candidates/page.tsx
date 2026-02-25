"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Candidate {
    id: string;
    name: string;
    className: string;
    visi: string;
    photoUrl: string;
    _count: { votes: number };
}

export default function AdminCandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const router = useRouter();

    const fetchCandidates = () => {
        fetch("/api/candidates")
            .then((res) => res.json())
            .then((data) => {
                setCandidates(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Yakin ingin menghapus kandidat "${name}"? Data voting terkait juga akan dihapus.`)) {
            return;
        }

        setDeleting(id);
        try {
            const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCandidates((prev) => prev.filter((c) => c.id !== id));
            } else {
                alert("Gagal menghapus kandidat");
            }
        } catch {
            alert("Terjadi kesalahan");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-jp-cream tracking-wider">
                        👥 Kandidat
                    </h1>
                    <p className="text-jp-cream/40 text-sm mt-1">Kelola kandidat ketua Japanese Club</p>
                </div>
                <Link href="/admin/candidates/create" className="btn-primary flex items-center justify-center gap-2">
                    ➕ Tambah Kandidat
                </Link>
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-4 md:p-8 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="shimmer h-16 rounded-lg" />
                        ))}
                    </div>
                ) : candidates.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <span className="text-5xl block mb-3">🌸</span>
                        <p className="text-jp-cream/50 text-lg">Belum ada kandidat</p>
                        <Link href="/admin/candidates/create" className="btn-primary inline-block mt-4">
                            Tambah Kandidat Pertama
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="admin-table w-full whitespace-nowrap">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Foto</th>
                                    <th>Nama</th>
                                    <th>Kelas</th>
                                    <th>Votes</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((candidate, index) => (
                                    <tr key={candidate.id}>
                                        <td className="text-jp-cream/50">{index + 1}</td>
                                        <td>
                                            <div className="w-12 h-12 rounded-lg overflow-hidden relative min-w-12">
                                                <Image
                                                    src={candidate.photoUrl}
                                                    alt={candidate.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            </div>
                                        </td>
                                        <td className="text-jp-cream font-medium">{candidate.name}</td>
                                        <td className="text-jp-cream/60">{candidate.className}</td>
                                        <td>
                                            <span className="text-jp-pink font-bold">{candidate._count.votes}</span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/candidates/${candidate.id}/edit`)}
                                                    className="px-3 py-1.5 text-xs rounded-lg bg-jp-gold/20 text-jp-gold hover:bg-jp-gold/30 transition-colors"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(candidate.id, candidate.name)}
                                                    disabled={deleting === candidate.id}
                                                    className="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                                >
                                                    {deleting === candidate.id ? "..." : "🗑️ Hapus"}
                                                </button>
                                            </div>
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
