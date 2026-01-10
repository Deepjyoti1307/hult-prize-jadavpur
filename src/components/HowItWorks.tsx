"use client";

import { useEffect, useRef, useState } from "react";
import { Users, ShieldCheck, Calendar, Sparkles } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Choose Your Role",
        description: "Sign up as an Artist to showcase your talent, or as a Client to discover amazing performers.",
        icon: Users,
    },
    {
        number: "02",
        title: "Get Verified",
        description: "Complete your profile with verified credentials. Artists and clients both go through our trust verification process.",
        icon: ShieldCheck,
    },
    {
        number: "03",
        title: "Discover & Book",
        description: "Browse verified artists by category, location, and reviews. Book with confidence using our secure escrow system.",
        icon: Calendar,
    },
    {
        number: "04",
        title: "Perform Safely",
        description: "Real-time safety tracking, emergency support, and secure payouts after successful events.",
        icon: Sparkles,
    },
];

export default function HowItWorks() {
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute("data-index") || "0");
                        setVisibleItems((prev) => Array.from(new Set([...prev, index])));
                    }
                });
            },
            { threshold: 0.2 }
        );

        const items = sectionRef.current?.querySelectorAll("[data-index]");
        items?.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="how-it-works"
            className="py-24 md:py-32 px-4 md:px-6 lg:px-8 bg-[#0a0a0f]"
            ref={sectionRef}
        >
            <div className="container-custom">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-accent font-medium text-sm uppercase tracking-wider">Simple Process</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">How It Works</h2>
                    <p className="text-white/60 text-lg">
                        A straightforward journey from signup to successful events.
                        Safety and trust are built into every step.
                    </p>
                </div>

                {/* Steps grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        return (
                            <div
                                key={step.number}
                                data-index={index}
                                className={`relative group transition-all duration-700 ease-out ${visibleItems.includes(index)
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                    }`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                {/* Glassmorphism Card */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 h-full group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                                    {/* Step number */}
                                    <div className="text-5xl font-bold text-white/10 mb-4 font-mono">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-14 h-14 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full flex items-center justify-center text-accent mb-5 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
                                        <IconComponent className="w-7 h-7" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Connector line (hidden on last item and mobile) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent/30" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
