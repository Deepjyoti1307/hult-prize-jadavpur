import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Safety Guidelines | TARANG",
    description: "Our commitment to keeping artists and clients safe on every booking.",
};

export default function SafetyPage() {
    return (
        <main className="min-h-screen bg-secondary-light">
            {/* Header */}
            <header className="bg-primary text-white py-6">
                <div className="container-custom px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-3 w-fit">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-accent"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-bold">TARANG</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div className="section-padding">
                <div className="container-custom max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
                        {/* Safety commitment banner */}
                        <div className="bg-accent/10 rounded-2xl p-6 md:p-8 mb-8 flex items-start gap-4">
                            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-primary mb-2">Our Safety Commitment</h2>
                                <p className="text-text-secondary">
                                    Safety is not an afterthought — it's the foundation of TARANG.
                                    Every feature we build starts with the question: "How does this keep our users safe?"
                                </p>
                            </div>
                        </div>

                        <h1 className="heading-lg text-primary mb-8">Safety Guidelines</h1>

                        <div className="prose prose-lg max-w-none space-y-8">
                            <section>
                                <h2 className="heading-md text-primary mb-4">For Artists</h2>
                                <ul className="text-text-secondary space-y-3 list-none">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Choose your comfort zone:</strong> Only accept event types you're comfortable with. You can always decline bookings that don't feel right.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Verify before accepting:</strong> Review client profiles, ratings, and reviews before accepting any booking. Look for verified badges.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Use safety tracking:</strong> Enable location sharing with your trusted contacts during events. Check in regularly.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Trust your instincts:</strong> If something feels wrong, use our emergency support immediately. We're available 24/7.</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">For Clients</h2>
                                <ul className="text-text-secondary space-y-3 list-none">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Complete verification:</strong> Verify your identity to build trust with artists. Verified clients get faster responses.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Provide clear details:</strong> Be transparent about event type, venue, expected audience, and any special requirements.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Respect boundaries:</strong> Artists have the right to decline requests. Never pressure or coerce an artist.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span><strong>Use escrow payments:</strong> Always pay through our secure platform. This protects both you and the artist.</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">Emergency Support</h2>
                                <div className="bg-alert/10 rounded-xl p-6">
                                    <p className="text-text-primary font-medium mb-2">
                                        If you ever feel unsafe, help is just a tap away:
                                    </p>
                                    <ul className="text-text-secondary space-y-2">
                                        <li>• Use the emergency button in the app for immediate assistance</li>
                                        <li>• Call our 24/7 helpline: <strong className="text-primary">1800-XXX-XXXX</strong></li>
                                        <li>• Email: <a href="mailto:safety@tarang.in" className="text-accent hover:underline">safety@tarang.in</a></li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">Zero Tolerance Policy</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    We have zero tolerance for harassment, discrimination, or any behavior that makes
                                    users feel unsafe. Violations result in immediate account suspension and may be
                                    reported to relevant authorities. Together, we're building a platform where
                                    talent is celebrated and respected.
                                </p>
                            </section>
                        </div>

                        <div className="mt-12 pt-8 border-t border-primary/10">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
