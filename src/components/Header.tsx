"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10 py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container-custom flex items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white italic">TARANG</span>
                    <span className="text-xs text-white/60 hidden sm:block">Where music finds its stage</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="#how-it-works"
                        className="text-white/60 hover:text-white transition-colors duration-300 font-medium text-sm"
                    >
                        How It Works
                    </Link>
                    <Link
                        href="#safety"
                        className="text-white/60 hover:text-white transition-colors duration-300 font-medium text-sm"
                    >
                        Safety
                    </Link>
                    <Link
                        href="#for-artists"
                        className="text-white/60 hover:text-white transition-colors duration-300 font-medium text-sm"
                    >
                        For Artists
                    </Link>
                    <Link
                        href="#for-clients"
                        className="text-white/60 hover:text-white transition-colors duration-300 font-medium text-sm"
                    >
                        For Clients
                    </Link>
                    <Link
                        href="/admin/login"
                        className="text-white/60 hover:text-white transition-colors duration-300 font-medium text-sm"
                    >
                        Admin
                    </Link>
                    {user && (
                        <button
                            onClick={() => signOut(auth)}
                            className="text-white/60 hover:text-white transition-colors duration-300 font-medium text-sm"
                        >
                            Logout
                        </button>
                    )}
                </nav>



                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-white/70 hover:text-white transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}
