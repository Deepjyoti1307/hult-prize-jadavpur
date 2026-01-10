"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const artistBenefits = [
    "Free onboarding — no upfront costs",
    "Choose safe event types you're comfortable with",
    "Verified clients only — know who you're performing for",
    "Secure escrow payments — always get paid",
    "Build your verified reputation",
    "Real-time safety tracking on event day",
];

const clientBenefits = [
    "Discover verified, talented artists",
    "Browse by category, location, and ratings",
    "Transparent pricing — no hidden fees",
    "Secure payment protection",
    "Book with confidence",
    "Easy rebooking of favorite artists",
];

export default function ForUsersSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef}>
            {/* For Artists */}
            <div id="for-artists" className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Content */}
                        <div
                            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                                }`}
                        >
                            <span className="text-accent font-medium text-sm uppercase tracking-wider">
                                For Artists
                            </span>
                            <h2 className="heading-lg text-primary mt-3 mb-6">
                                Your Talent Deserves
                                <br />
                                <span className="text-accent">Respect & Security</span>
                            </h2>
                            <p className="body-md text-text-secondary mb-8">
                                We built this platform for you. No more unsafe gigs, unreliable payments,
                                or disrespectful clients. Focus on what you do best — performing.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {artistBenefits.map((benefit, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                    >
                                        <svg
                                            className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-text-primary">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/signup?role=artist" className="btn-primary">
                                Join as Artist — It's Free
                            </Link>
                        </div>

                        {/* Visual */}
                        <div
                            className={`relative transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                                }`}
                        >
                            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12">
                                <div className="aspect-square max-w-md mx-auto bg-white rounded-2xl shadow-soft-lg flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg
                                                className="w-10 h-10 text-accent"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-medium text-primary mb-2">
                                            "Finally, a platform that respects artists"
                                        </p>
                                        <p className="text-text-secondary text-sm">
                                            Join thousands of artists already earning safely
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* For Clients */}
            <div id="for-clients" className="section-padding bg-secondary">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Visual - comes first on desktop */}
                        <div
                            className={`relative order-2 lg:order-1 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                                }`}
                        >
                            <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-3xl p-8 md:p-12">
                                <div className="aspect-square max-w-md mx-auto bg-white rounded-2xl shadow-soft-lg flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg
                                                className="w-10 h-10 text-primary"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-lg font-medium text-primary mb-2">
                                            "Found the perfect artist in minutes"
                                        </p>
                                        <p className="text-text-secondary text-sm">
                                            Trusted by event organizers across India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className={`order-1 lg:order-2 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                                }`}
                        >
                            <span className="text-accent font-medium text-sm uppercase tracking-wider">
                                For Clients
                            </span>
                            <h2 className="heading-lg text-primary mt-3 mb-6">
                                Find Trusted Artists
                                <br />
                                <span className="text-accent">For Your Events</span>
                            </h2>
                            <p className="body-md text-text-secondary mb-8">
                                No more unreliable bookings or quality surprises.
                                Discover verified artists, read genuine reviews, and book with complete confidence.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {clientBenefits.map((benefit, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                    >
                                        <svg
                                            className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-text-primary">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/signup?role=client" className="btn-accent">
                                Book an Artist
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
