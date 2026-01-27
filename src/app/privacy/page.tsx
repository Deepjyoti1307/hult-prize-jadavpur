import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Privacy Policy | TARANG",
    description: "Learn how TARANG protects your privacy and handles your personal data.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-secondary-light">
            {/* Header */}
            <header className="bg-primary text-white py-6">
                <div className="container-custom px-4 md:px-6">
                    <Link href="/" className="flex flex-col w-fit">
                        <span className="text-2xl font-bold text-white italic">TARANG</span>
                        <span className="text-xs text-white/60">Where music finds its stage</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div className="section-padding">
                <div className="container-custom max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
                        <h1 className="heading-lg text-primary mb-8">Privacy Policy</h1>
                        <p className="text-text-secondary mb-8">
                            Last updated: January 2024
                        </p>

                        <div className="prose prose-lg max-w-none space-y-8">
                            <section>
                                <h2 className="heading-md text-primary mb-4">1. Information We Collect</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    We collect information you provide directly to us, including your name, email address,
                                    phone number, profile information, payment details, and any content you share on our platform.
                                    For safety purposes, we may also collect location data during events with your explicit consent.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">2. How We Use Your Information</h2>
                                <ul className="text-text-secondary space-y-2 list-disc pl-6">
                                    <li>To verify your identity and maintain account security</li>
                                    <li>To facilitate bookings between artists and clients</li>
                                    <li>To process payments securely through our escrow system</li>
                                    <li>To provide safety features including event tracking</li>
                                    <li>To communicate important updates about your bookings</li>
                                    <li>To improve our platform and develop new features</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">3. Information Sharing</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    We share your information only as necessary to provide our services. This includes sharing
                                    relevant booking details between artists and clients, and with payment processors. We never
                                    sell your personal information to third parties.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">4. Data Security</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    We implement industry-standard security measures to protect your personal information.
                                    All payment data is encrypted and processed through secure payment gateways.
                                    Location data used for safety tracking is encrypted and automatically deleted after events.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">5. Your Rights</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    You have the right to access, correct, or delete your personal information at any time.
                                    You can manage your privacy settings from your account dashboard or contact our support team
                                    for assistance.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">6. Contact Us</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    If you have questions about this Privacy Policy or our data practices, please contact us at{" "}
                                    <a href="mailto:privacy@tarang.in" className="text-accent hover:underline">
                                        privacy@tarang.in
                                    </a>
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
