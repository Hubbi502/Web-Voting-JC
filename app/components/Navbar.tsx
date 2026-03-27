"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 bg-jp-dark/80 backdrop-blur-xl border-b border-jp-pink/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-2xl">⛩️</span>
                            <span className="font-serif text-jp-gold font-bold text-lg tracking-wider group-hover:text-jp-gold-light transition-colors">
                                日本クラブ
                            </span>
                        </Link>

                        {/* Desktop buttons */}
                        <div className="hidden sm:flex items-center gap-3">
                            <Link href="/admin/login" className="btn-secondary text-sm">
                                🔐 Admin Login
                            </Link>
                            <Link href="/vote" className="btn-primary text-sm flex items-center gap-2">
                                🗳️ Mulai Voting
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="sm:hidden p-2 text-jp-cream hover:text-jp-pink transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile menu with animation */}
                    {menuOpen && (
                        <div className="sm:hidden pb-4 flex flex-col gap-2 border-t border-jp-pink/10 pt-3 mobile-menu-enter">
                            <Link href="/admin/login" className="btn-secondary text-sm text-center" onClick={() => setMenuOpen(false)}>
                                🔐 Admin Login
                            </Link>
                            <Link href="/vote" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>
                                🗳️ Mulai Voting
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Backdrop overlay when mobile menu is open */}
            {menuOpen && (
                <div
                    className="mobile-menu-backdrop sm:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}
