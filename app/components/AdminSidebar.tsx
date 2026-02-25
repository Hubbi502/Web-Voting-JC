"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/candidates", label: "Kandidat", icon: "👥" },
    { href: "/admin/tokens", label: "Token", icon: "🎟️" },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-jp-navy border-r border-jp-pink/10 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Header */}
                <div className="p-6 border-b border-jp-pink/10 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">⛩️</span>
                        <div>
                            <span className="font-serif text-jp-gold font-bold text-sm tracking-wider block group-hover:text-jp-gold-light transition-colors">
                                ADMIN PANEL
                            </span>
                            <span className="text-jp-cream/40 text-xs">Japanese Club</span>
                        </div>
                    </Link>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden text-jp-cream/40 hover:text-jp-cream p-2"
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                    // Close sidebar on mobile when navigating
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${isActive
                                    ? "bg-jp-red/20 text-jp-pink border border-jp-red/30"
                                    : "text-jp-cream/60 hover:text-jp-cream hover:bg-jp-gray/30"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-jp-pink/10 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-jp-cream/40 hover:text-jp-cream hover:bg-jp-gray/30 transition-all text-sm"
                    >
                        <span>🏠</span>
                        Kembali ke Home
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm w-full text-left"
                    >
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
