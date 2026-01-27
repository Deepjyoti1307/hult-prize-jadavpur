"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

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
                <div className="container-custom max-w-5xl">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Contact Info */}
                        <div>
                            <h1 className="heading-lg text-primary mb-4">Get in Touch</h1>
                            <p className="body-md text-text-secondary mb-8">
                                Have questions or need help? We're here for you.
                                Reach out through any of the channels below or use the contact form.
                            </p>

                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">Email Us</h3>
                                        <p className="text-text-secondary text-sm mb-1">For general inquiries</p>
                                        <a href="mailto:hello@tarang.in" className="text-accent hover:underline">
                                            hello@tarang.in
                                        </a>
                                    </div>
                                </div>

                                {/* Support */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">24/7 Support</h3>
                                        <p className="text-text-secondary text-sm mb-1">For urgent assistance</p>
                                        <a href="tel:1800XXXXXXX" className="text-accent hover:underline">
                                            1800-XXX-XXXX
                                        </a>
                                    </div>
                                </div>

                                {/* Safety */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-alert/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-alert" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">Safety Concerns</h3>
                                        <p className="text-text-secondary text-sm mb-1">Report safety issues immediately</p>
                                        <a href="mailto:safety@tarang.in" className="text-accent hover:underline">
                                            safety@tarang.in
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Office Info */}
                            <div className="mt-10 pt-8 border-t border-primary/10">
                                <h3 className="font-semibold text-primary mb-4">Our Office</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    TARANG India Pvt. Ltd.<br />
                                    Sector V, Salt Lake<br />
                                    Kolkata, West Bengal 700091<br />
                                    India
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-2xl shadow-soft p-8">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-primary mb-2">Message Sent!</h3>
                                    <p className="text-text-secondary mb-6">
                                        Thank you for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setIsSubmitted(false);
                                            setFormState({ name: "", email: "", subject: "", message: "" });
                                        }}
                                        className="text-accent hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold text-primary mb-6">Send us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                required
                                                value={formState.name}
                                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-primary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                value={formState.email}
                                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-primary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300"
                                                placeholder="you@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                                                Subject
                                            </label>
                                            <select
                                                id="subject"
                                                required
                                                value={formState.subject}
                                                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-primary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
                                            >
                                                <option value="">Select a topic</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="artist">Artist Support</option>
                                                <option value="client">Client Support</option>
                                                <option value="payment">Payment Issue</option>
                                                <option value="safety">Safety Concern</option>
                                                <option value="partnership">Partnership Inquiry</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                required
                                                rows={5}
                                                value={formState.message}
                                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-primary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 resize-none"
                                                placeholder="Tell us how we can help..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Sending...
                                                </span>
                                            ) : (
                                                "Send Message"
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Back link */}
                    <div className="mt-12">
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

            <Footer />
        </main>
    );
}
