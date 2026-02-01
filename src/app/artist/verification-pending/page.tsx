'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import { Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Inline Lottie animation data for a waiting/loading animation
const waitingAnimationData = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Loading",
    ddd: 0,
    assets: [],
    layers: [
        {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Circle 1",
            sr: 1,
            ks: {
                o: { a: 1, k: [{ t: 0, s: [100], h: 0, i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } }, { t: 30, s: [30], h: 0, i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } }, { t: 60, s: [100] }] },
                r: { a: 0, k: 0 },
                p: { a: 0, k: [100, 100, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 1, k: [{ t: 0, s: [100, 100, 100], h: 0, i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } }, { t: 30, s: [120, 120, 100], h: 0, i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } }, { t: 60, s: [100, 100, 100] }] }
            },
            ao: 0,
            shapes: [
                {
                    ty: "el",
                    s: { a: 0, k: [80, 80] },
                    p: { a: 0, k: [0, 0] },
                    nm: "Ellipse"
                },
                {
                    ty: "st",
                    c: { a: 0, k: [0.2, 0.8, 0.7, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 6 },
                    lc: 2,
                    lj: 2,
                    nm: "Stroke"
                }
            ],
            ip: 0,
            op: 60,
            st: 0,
            bm: 0
        },
        {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: "Circle 2",
            sr: 1,
            ks: {
                o: { a: 1, k: [{ t: 0, s: [30], h: 0, i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } }, { t: 30, s: [100], h: 0, i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } }, { t: 60, s: [30] }] },
                r: { a: 0, k: 0 },
                p: { a: 0, k: [100, 100, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 1, k: [{ t: 0, s: [120, 120, 100], h: 0, i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } }, { t: 30, s: [100, 100, 100], h: 0, i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } }, { t: 60, s: [120, 120, 100] }] }
            },
            ao: 0,
            shapes: [
                {
                    ty: "el",
                    s: { a: 0, k: [50, 50] },
                    p: { a: 0, k: [0, 0] },
                    nm: "Ellipse"
                },
                {
                    ty: "fl",
                    c: { a: 0, k: [0.2, 0.8, 0.7, 0.3] },
                    o: { a: 0, k: 100 },
                    nm: "Fill"
                }
            ],
            ip: 0,
            op: 60,
            st: 0,
            bm: 0
        }
    ]
};

export default function VerificationPendingPage() {
    const router = useRouter();
    const { profile } = useAuth();

    useEffect(() => {
        if (profile) {
            router.replace('/artist/dashboard');
        }
    }, [profile, router]);

    const steps = [
        { icon: CheckCircle2, text: 'Mobile Number Verified', completed: true },
        { icon: CheckCircle2, text: 'ID Proof Uploaded', completed: true },
        { icon: CheckCircle2, text: 'Intro Video Submitted', completed: true },
        { icon: CheckCircle2, text: 'Performance Clip Submitted', completed: true },
        { icon: Clock, text: 'Platform Verification', completed: false, current: true },
    ];

    return (
        <main className="min-h-screen bg-[#0a0a0f]">
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/30 pointer-events-none" />

            <section className="relative min-h-screen py-12 px-4 md:px-8 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-lg w-full"
                >
                    {/* Main Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl text-center">
                        {/* Lottie Animation */}
                        <div className="flex justify-center mb-8">
                            <div className="w-40 h-40 relative">
                                <Lottie
                                    animationData={waitingAnimationData}
                                    loop={true}
                                    className="w-full h-full"
                                />
                                {/* Shield icon in center */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShieldCheck className="w-12 h-12 text-accent" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl md:text-3xl font-bold text-white mb-4"
                        >
                            Verification In Progress
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/60 mb-8"
                        >
                            Your application for the Platform Verified badge is being reviewed by our team.
                            This usually takes 24-48 hours.
                        </motion.p>

                        {/* Progress Steps */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-3 mb-8"
                        >
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${step.current
                                        ? 'bg-accent/10 border border-accent/30'
                                        : step.completed
                                            ? 'bg-white/5'
                                            : 'bg-white/5 opacity-50'
                                        }`}
                                >
                                    <step.icon
                                        className={`w-5 h-5 ${step.current
                                            ? 'text-accent animate-pulse'
                                            : step.completed
                                                ? 'text-accent'
                                                : 'text-white/40'
                                            }`}
                                    />
                                    <span className={`text-sm ${step.current ? 'text-white font-medium' : 'text-white/60'}`}>
                                        {step.text}
                                    </span>
                                    {step.current && (
                                        <span className="ml-auto text-xs text-accent bg-accent/20 px-2 py-1 rounded-full">
                                            In Review
                                        </span>
                                    )}
                                </div>
                            ))}
                        </motion.div>

                        {/* Info Box */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-8"
                        >
                            <p className="text-sm text-white/70">
                                <strong className="text-accent">What happens next?</strong>
                                <br />
                                Once verified, you'll receive a notification and can start accepting gigs!
                            </p>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-3"
                        >
                            <button
                                onClick={() => router.push('/artist/dashboard')}
                                className="w-full px-6 py-3 rounded-full bg-accent hover:bg-accent-light text-white font-medium transition-all hover:shadow-lg hover:shadow-accent/20"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full px-6 py-3 rounded-full border border-white/20 text-white/70 hover:bg-white/5 transition-all"
                            >
                                Go to Home
                            </button>
                        </motion.div>
                    </div>

                    {/* Estimated Time */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-center text-white/40 text-sm mt-6"
                    >
                        Estimated review time: 24-48 hours
                    </motion.p>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
