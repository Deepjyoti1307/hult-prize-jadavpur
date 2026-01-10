import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Terms of Service | TARANG",
    description: "Terms and conditions for using the TARANG platform.",
};

export default function TermsPage() {
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
                        <h1 className="heading-lg text-primary mb-8">Terms of Service</h1>
                        <p className="text-text-secondary mb-8">
                            Last updated: January 2024
                        </p>

                        <div className="prose prose-lg max-w-none space-y-8">
                            <section>
                                <h2 className="heading-md text-primary mb-4">1. Acceptance of Terms</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    By accessing or using TARANG, you agree to be bound by these Terms of Service.
                                    If you do not agree to these terms, please do not use our platform. We may modify these
                                    terms at any time, and your continued use constitutes acceptance of the updated terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">2. Account Registration</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    To use TARANG, you must create an account with accurate and complete information.
                                    You are responsible for maintaining the security of your account credentials and for all
                                    activities that occur under your account. You must be at least 18 years old to use our platform.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">3. User Roles</h2>
                                <p className="text-text-secondary leading-relaxed mb-4">
                                    TARANG supports two types of users:
                                </p>
                                <ul className="text-text-secondary space-y-2 list-disc pl-6">
                                    <li><strong>Artists:</strong> Performers who offer their services for live events</li>
                                    <li><strong>Clients:</strong> Individuals or organizations seeking to book artists for events</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">4. Bookings & Payments</h2>
                                <ul className="text-text-secondary space-y-2 list-disc pl-6">
                                    <li>All bookings must be made through the TARANG platform</li>
                                    <li>Payments are processed through our secure escrow system</li>
                                    <li>Funds are released to artists upon successful completion of events</li>
                                    <li>Platform fees are deducted automatically as disclosed at booking time</li>
                                    <li>Cancellation policies apply as specified at the time of booking</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">5. Conduct & Safety</h2>
                                <p className="text-text-secondary leading-relaxed mb-4">
                                    All users must:
                                </p>
                                <ul className="text-text-secondary space-y-2 list-disc pl-6">
                                    <li>Treat everyone with respect and professionalism</li>
                                    <li>Not engage in harassment, discrimination, or abusive behavior</li>
                                    <li>Provide accurate information about events and services</li>
                                    <li>Comply with all applicable laws and regulations</li>
                                    <li>Report any safety concerns to our support team immediately</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">6. Verification</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    TARANG may require identity verification for both artists and clients.
                                    Providing false information during verification will result in immediate account termination.
                                    Verified badges indicate that a user has completed our verification process.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">7. Reviews & Ratings</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Users may leave reviews after completed bookings. Reviews must be honest and based on
                                    actual experiences. Fake reviews, review manipulation, or retaliatory reviews are
                                    prohibited and may result in account suspension.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">8. Intellectual Property</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    Artists retain all rights to their original content and performances. By uploading
                                    content to TARANG, you grant us a license to display it on our platform for
                                    promotional purposes. You may not use content from other artists without their permission.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">9. Limitation of Liability</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    TARANG is a platform that connects artists and clients. We are not responsible
                                    for the quality of performances, event outcomes, or disputes between users. Our liability
                                    is limited to the fees paid to us for our services.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">10. Account Termination</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    We reserve the right to suspend or terminate accounts for violations of these terms,
                                    safety concerns, or any other reason at our discretion. Users may delete their accounts
                                    at any time through their account settings.
                                </p>
                            </section>

                            <section>
                                <h2 className="heading-md text-primary mb-4">11. Contact</h2>
                                <p className="text-text-secondary leading-relaxed">
                                    For questions about these Terms of Service, please contact us at{" "}
                                    <a href="mailto:legal@tarang.in" className="text-accent hover:underline">
                                        legal@tarang.in
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
