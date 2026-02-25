"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateCandidatePage() {
    const [form, setForm] = useState({
        name: "",
        className: "",
        visi: "",
        misi: "",
        programKerja: "",
        order: "0",
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("className", form.className);
            formData.append("visi", form.visi);
            formData.append("misi", form.misi);
            formData.append("programKerja", form.programKerja);
            formData.append("order", form.order);
            if (photo) formData.append("photo", photo);

            const res = await fetch("/api/candidates", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Gagal membuat kandidat");
                return;
            }

            router.push("/admin/candidates");
        } catch {
            setError("Terjadi kesalahan. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-jp-cream tracking-wider">
                    ➕ Tambah Kandidat
                </h1>
                <p className="text-jp-cream/40 text-sm mt-1">Isi data kandidat baru</p>
            </div>

            <div className="glass-card rounded-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Upload */}
                    <div>
                        <label className="block text-jp-cream/60 text-sm font-medium mb-2">Foto Kandidat</label>
                        <div className="flex items-start gap-4">
                            {preview ? (
                                <div className="w-32 h-40 rounded-lg overflow-hidden relative flex-shrink-0">
                                    <Image src={preview} alt="Preview" fill className="object-cover" sizes="128px" />
                                </div>
                            ) : (
                                <div className="w-32 h-40 rounded-lg bg-jp-gray/30 border border-dashed border-jp-pink/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-3xl opacity-30">📷</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="input-jp text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-jp-red/20 file:text-jp-pink file:rounded file:text-sm file:cursor-pointer"
                                    required
                                />
                                <p className="text-jp-cream/30 text-xs mt-2">Format: JPG, PNG. Maks 5MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Name & Class */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-jp-cream/60 text-sm font-medium mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="input-jp"
                                placeholder="Nama kandidat"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-jp-cream/60 text-sm font-medium mb-2">Kelas</label>
                            <input
                                type="text"
                                value={form.className}
                                onChange={(e) => setForm({ ...form, className: e.target.value })}
                                className="input-jp"
                                placeholder="Contoh: XII IPA 1"
                                required
                            />
                        </div>
                    </div>

                    {/* Order */}
                    <div>
                        <label className="block text-jp-cream/60 text-sm font-medium mb-2">Nomor Urut</label>
                        <input
                            type="number"
                            value={form.order}
                            onChange={(e) => setForm({ ...form, order: e.target.value })}
                            className="input-jp w-24"
                            min="0"
                        />
                    </div>

                    {/* Visi */}
                    <div>
                        <label className="block text-jp-cream/60 text-sm font-medium mb-2">Visi</label>
                        <textarea
                            value={form.visi}
                            onChange={(e) => setForm({ ...form, visi: e.target.value })}
                            className="textarea-jp"
                            placeholder="Tuliskan visi kandidat..."
                            required
                        />
                    </div>

                    {/* Misi */}
                    <div>
                        <label className="block text-jp-cream/60 text-sm font-medium mb-2">Misi</label>
                        <textarea
                            value={form.misi}
                            onChange={(e) => setForm({ ...form, misi: e.target.value })}
                            className="textarea-jp"
                            placeholder="Tuliskan misi kandidat..."
                            required
                        />
                    </div>

                    {/* Program Kerja */}
                    <div>
                        <label className="block text-jp-cream/60 text-sm font-medium mb-2">Program Kerja</label>
                        <textarea
                            value={form.programKerja}
                            onChange={(e) => setForm({ ...form, programKerja: e.target.value })}
                            className="textarea-jp min-h-[150px]"
                            placeholder="Tuliskan program kerja kandidat..."
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                "💾 Simpan Kandidat"
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-secondary"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
