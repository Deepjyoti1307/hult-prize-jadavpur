"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Music, Search, CheckCircle, Lock, MapPin } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-transparent">
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/30 pointer-events-none" />

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
                        <Link href="/signup?role=artist">
                            <Button variant="primary" size="xl" className="w-full sm:w-auto">
                                <Music className="w-5 h-5 mr-2" />
                                Join as Artist
                            </Button>
                        </Link>
                        <Link href="/signup?role=client">
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
