"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CandidateForm {
    name: string;
    className: string;
    visi: string;
    misi: string;
    programKerja: string;
    order: string;
}

export default function EditCandidatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [form, setForm] = useState<CandidateForm>({
        name: "",
        className: "",
        visi: "",
        misi: "",
        programKerja: "",
        order: "0",
    });
    const [currentPhoto, setCurrentPhoto] = useState<string>("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/candidates/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    name: data.name,
                    className: data.className,
                    visi: data.visi,
                    misi: data.misi,
                    programKerja: data.programKerja,
                    order: String(data.order),
                });
                setCurrentPhoto(data.photoUrl);
                setFetching(false);
            })
            .catch(() => {
                setError("Gagal mengambil data kandidat");
                setFetching(false);
            });
    }, [id]);

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

            const res = await fetch(`/api/candidates/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Gagal mengupdate kandidat");
                return;
            }

            router.push("/admin/candidates");
        } catch {
            setError("Terjadi kesalahan. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="max-w-2xl">
                <div className="shimmer h-8 w-64 mb-8 rounded" />
                <div className="glass-card rounded-xl p-8 space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="shimmer h-12 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-jp-cream tracking-wider">
                    ✏️ Edit Kandidat
                </h1>
                <p className="text-jp-cream/40 text-sm mt-1">Perbarui data kandidat</p>
            </div>

            <div className="glass-card rounded-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo */}
                    <div>
                        <label className="block text-jp-cream/60 text-sm font-medium mb-2">Foto Kandidat</label>
                        <div className="flex items-start gap-4">
                            <div className="w-32 h-40 rounded-lg overflow-hidden relative flex-shrink-0">
                                <Image
                                    src={preview || currentPhoto}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="input-jp text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-jp-red/20 file:text-jp-pink file:rounded file:text-sm file:cursor-pointer"
                                />
                                <p className="text-jp-cream/30 text-xs mt-2">Kosongkan jika tidak ingin mengubah foto</p>
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
                            {loading ? "Menyimpan..." : "💾 Simpan Perubahan"}
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
