"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if admin is authenticated by trying to access a protected endpoint
        fetch("/api/tokens", { method: "GET" })
            .then((res) => {
                if (res.ok) {
                    setIsAuthed(true);
                } else {
                    setIsAuthed(false);
                    router.push("/admin/login");
                }
            })
            .catch(() => {
                setIsAuthed(false);
                router.push("/admin/login");
            });
    }, [router]);

    // Show loading while checking auth
    if (isAuthed === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-jp-dark">
                <div className="text-center">
                    <svg className="animate-spin w-8 h-8 text-jp-pink mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-jp-cream/50">Memverifikasi akses...</p>
                </div>
            </div>
        );
    }

    if (!isAuthed) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-jp-dark">
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 border-b border-jp-pink/10 bg-jp-navy">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">⛩️</span>
                        <span className="font-serif text-jp-gold font-bold text-sm tracking-wider">
                            ADMIN PANEL
                        </span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-jp-cream/80 hover:text-jp-cream p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
