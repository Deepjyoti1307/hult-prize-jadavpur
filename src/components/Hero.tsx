"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
    Shield,
    Music,
    Search,
    CheckCircle,
    Lock,
    MapPin,
    ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PulsatingDots from "@/components/ui/pulsating-loader";

/* Dynamic-load the Three.js scene — SSR disabled */
const Hero3DScene = dynamic(() => import("@/components/Hero3DScene"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
            <PulsatingDots />
        </div>
    ),
});

/* Letter-by-letter slide-in component */
function SlidingText({
    text,
    className,
    letterClassName,
    delay = 0,
    stagger = 0.06,
    direction = "up",
}: {
    text: string;
    className?: string;
    letterClassName?: string;
    delay?: number;
    stagger?: number;
    direction?: "up" | "down" | "left" | "right";
}) {
    const dirMap = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { x: 80, y: 0 },
        right: { x: -80, y: 0 },
    };
    const { x, y } = dirMap[direction];

    return (
        <span className={className} style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, x, y, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                    transition={{
                        delay: delay + i * stagger,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className={letterClassName}
                    style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

export default function Hero() {
    const [sceneReady, setSceneReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setSceneReady(true), 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* ── Three.js 3D Canvas Background ── */}
            <div className="absolute inset-0 z-0">
                <Hero3DScene />
            </div>

            {/* ── Gradient overlays for text readability ── */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-[#0a0a0f]/30 to-[#0a0a0f]/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/40 via-transparent to-[#0a0a0f]/40" />
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a0a0f_100%)]" />
            </div>

            {/* ── Scan-line overlay ── */}
            <div className="absolute inset-0 z-[2] pointer-events-none hero-scanlines opacity-[0.03]" />

            {/* ── Content Overlay ── */}
            <AnimatePresence>
                {sceneReady && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-10 w-full"
                    >
                        <div className="container-custom px-4 md:px-6 pt-24 pb-16">
                            <div className="max-w-5xl mx-auto text-center">
                                {/* Animated safety badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="inline-flex items-center gap-2 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-accent px-5 py-2.5 rounded-full mb-10 hero-glow-badge"
                                >
                                    <Shield className="w-4 h-4 text-accent" />
                                    <span className="text-sm font-medium text-white/90 tracking-wide">
                                        Safety-First Platform
                                    </span>
                                    <span className="relative flex h-2 w-2 ml-1">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                                    </span>
                                </motion.div>

                                {/* Main title — sliding letters */}
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 leading-[0.95] hero-title">
                                    <SlidingText
                                        text="TARANG"
                                        className=""
                                        letterClassName="hero-letter-glow"
                                        delay={0.4}
                                        stagger={0.09}
                                        direction="up"
                                    />
                                </h1>

                                {/* Tagline — sliding words */}
                                <div className="mb-6">
                                    <SlidingText
                                        text="Where Music Finds Its Stage"
                                        className="text-lg md:text-xl lg:text-2xl font-medium tracking-[0.15em] uppercase"
                                        letterClassName="hero-subtitle-letter"
                                        delay={1.0}
                                        stagger={0.035}
                                        direction="left"
                                    />
                                </div>

                                {/* Decorative divider */}
                                <motion.div
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
                                    className="mx-auto mb-8 h-[1px] w-48 bg-gradient-to-r from-transparent via-accent/60 to-transparent"
                                />



                                {/* CTA Buttons — Neon style */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-col sm:flex-row gap-5 justify-center mb-14"
                                >
                                    <Link href="/signup?type=artist">
                                        <button className="neon-btn neon-btn-primary group w-full sm:w-auto">
                                            <span className="relative z-10 flex items-center justify-center gap-2.5 font-semibold text-lg">
                                                <Music className="w-6 h-6" />
                                                Join as Artist
                                            </span>
                                        </button>
                                    </Link>
                                    <Link href="/signup?type=client">
                                        <button className="neon-btn neon-btn-outline group w-full sm:w-auto">
                                            <span className="relative z-10 flex items-center justify-center gap-2.5 font-semibold text-lg">
                                                <Search className="w-6 h-6" />
                                                Book an Artist
                                            </span>
                                        </button>
                                    </Link>
                                </motion.div>


                                {/* Trust indicators */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2.6, duration: 0.8 }}
                                    className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-8 border-t border-white/[0.06]"
                                >
                                    {[
                                        { icon: CheckCircle, label: "Verified Clients" },
                                        { icon: Lock, label: "Escrow Payments" },
                                        { icon: MapPin, label: "Safety Tracking" },
                                    ].map(({ icon: Icon, label }) => (
                                        <div key={label} className="flex items-center gap-2 text-white/45 group">
                                            <div className="p-2 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] group-hover:border-accent/30 transition-colors duration-300">
                                                <Icon className="w-4 h-4 text-accent" />
                                            </div>
                                            <span className="text-sm font-medium">{label}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Scroll Indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
                <span className="text-white/25 text-[10px] uppercase tracking-[0.25em] font-medium">
                    Explore
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5 text-accent/50" />
                </motion.div>
            </motion.div>
        </section>
    );
}
