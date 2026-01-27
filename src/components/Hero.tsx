"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Music, Search, CheckCircle, Lock, MapPin, ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-transparent">
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/30 pointer-events-none" />

            {/* Guitar Visual Element - Right Side */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[800px] pointer-events-none">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-l from-accent/30 via-accent/10 to-transparent blur-3xl" />
                <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[400px] h-[600px]">
                    {/* Guitar SVG */}
                    <svg
                        viewBox="0 0 200 500"
                        className="w-full h-full opacity-40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Guitar Headstock */}
                        <path
                            d="M85 10 L115 10 L115 60 L85 60 Z"
                            fill="url(#guitarGradient)"
                            className="drop-shadow-[0_0_15px_rgba(45,139,122,0.5)]"
                        />
                        {/* Tuning Pegs */}
                        <circle cx="75" cy="20" r="8" fill="url(#guitarGradient)" />
                        <circle cx="75" cy="40" r="8" fill="url(#guitarGradient)" />
                        <circle cx="75" cy="60" r="8" fill="url(#guitarGradient)" />
                        <circle cx="125" cy="20" r="8" fill="url(#guitarGradient)" />
                        <circle cx="125" cy="40" r="8" fill="url(#guitarGradient)" />
                        <circle cx="125" cy="60" r="8" fill="url(#guitarGradient)" />

                        {/* Guitar Neck */}
                        <rect
                            x="90"
                            y="60"
                            width="20"
                            height="150"
                            fill="url(#guitarGradient)"
                            className="drop-shadow-[0_0_20px_rgba(45,139,122,0.6)]"
                        />
                        {/* Frets */}
                        <line x1="90" y1="80" x2="110" y2="80" stroke="#2D8B7A" strokeWidth="2" opacity="0.6" />
                        <line x1="90" y1="100" x2="110" y2="100" stroke="#2D8B7A" strokeWidth="2" opacity="0.6" />
                        <line x1="90" y1="120" x2="110" y2="120" stroke="#2D8B7A" strokeWidth="2" opacity="0.6" />
                        <line x1="90" y1="140" x2="110" y2="140" stroke="#2D8B7A" strokeWidth="2" opacity="0.6" />
                        <line x1="90" y1="160" x2="110" y2="160" stroke="#2D8B7A" strokeWidth="2" opacity="0.6" />
                        <line x1="90" y1="180" x2="110" y2="180" stroke="#2D8B7A" strokeWidth="2" opacity="0.6" />

                        {/* Guitar Body */}
                        <ellipse
                            cx="100"
                            cy="320"
                            rx="80"
                            ry="120"
                            fill="url(#guitarGradient)"
                            className="drop-shadow-[0_0_30px_rgba(45,139,122,0.7)]"
                        />
                        {/* Body Curve (Upper) */}
                        <ellipse
                            cx="100"
                            cy="240"
                            rx="50"
                            ry="40"
                            fill="url(#guitarGradient)"
                        />
                        {/* Sound Hole */}
                        <circle
                            cx="100"
                            cy="300"
                            r="25"
                            fill="#0a0a0f"
                            stroke="#2D8B7A"
                            strokeWidth="3"
                            className="drop-shadow-[0_0_10px_rgba(45,139,122,0.5)]"
                        />
                        {/* Bridge */}
                        <rect
                            x="85"
                            y="360"
                            width="30"
                            height="8"
                            rx="2"
                            fill="#2D8B7A"
                        />
                        {/* Strings */}
                        <line x1="92" y1="60" x2="92" y2="368" stroke="#2D8B7A" strokeWidth="1" opacity="0.8" />
                        <line x1="96" y1="60" x2="96" y2="368" stroke="#2D8B7A" strokeWidth="1" opacity="0.8" />
                        <line x1="100" y1="60" x2="100" y2="368" stroke="#2D8B7A" strokeWidth="1" opacity="0.8" />
                        <line x1="104" y1="60" x2="104" y2="368" stroke="#2D8B7A" strokeWidth="1" opacity="0.8" />
                        <line x1="108" y1="60" x2="108" y2="368" stroke="#2D8B7A" strokeWidth="1" opacity="0.8" />

                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="guitarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1E3A5F" />
                                <stop offset="50%" stopColor="#2D8B7A" />
                                <stop offset="100%" stopColor="#1E3A5F" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                {/* Additional glow layers */}
                <div className="absolute right-20 top-1/2 -translate-y-1/2 w-32 h-96 bg-accent/20 blur-[100px] rounded-full" />
                <div className="absolute right-40 top-1/3 w-24 h-48 bg-blue-500/10 blur-[80px] rounded-full" />
            </div>

            <div className="container-custom relative z-10 px-4 md:px-6 pt-24">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Safety badge */}
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-accent px-5 py-2.5 rounded-full mb-8">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium text-white/90">Safety-First Platform</span>
                    </div>

                    {/* Main headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                        Empowering Artists.
                        <br />
                        <span className="text-accent">Connecting Safely.</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                        A trusted digital platform that connects verified artists with clients for live events.
                        Secure payments, verified profiles, and safety at every step.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link href="/signup?type=artist">
                            <Button variant="primary" size="xl" className="w-full sm:w-auto">
                                <Music className="w-5 h-5 mr-2" />
                                Join as Artist
                            </Button>
                        </Link>
                        <Link href="/signup?type=client">
                            <Button variant="outline" size="xl" className="w-full sm:w-auto">
                                <Search className="w-5 h-5 mr-2" />
                                Book an Artist
                            </Button>
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-2 text-white/50">
                            <div className="p-2 rounded-full bg-white/5 backdrop-blur-sm">
                                <CheckCircle className="w-4 h-4 text-accent" />
                            </div>
                            <span className="text-sm font-medium">Verified Clients</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/50">
                            <div className="p-2 rounded-full bg-white/5 backdrop-blur-sm">
                                <Lock className="w-4 h-4 text-accent" />
                            </div>
                            <span className="text-sm font-medium">Escrow Payments</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/50">
                            <div className="p-2 rounded-full bg-white/5 backdrop-blur-sm">
                                <MapPin className="w-4 h-4 text-accent" />
                            </div>
                            <span className="text-sm font-medium">Safety Tracking</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
                    <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
                </div>
            </div>
        </section>
    );
}
