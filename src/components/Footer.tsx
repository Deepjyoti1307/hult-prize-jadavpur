import Link from "next/link";
import { Twitter, Instagram, Linkedin, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0f] text-white border-t border-white/10">
            <div className="container-custom py-16 md:py-20 px-4 md:px-6 lg:px-8">
                {/* Main footer content */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex flex-col gap-1 mb-6">
                            <span className="text-2xl font-bold text-white italic">TARANG</span>
                            <span className="text-sm text-white/60">Where music finds its stage</span>
                        </Link>
                        <p className="text-white/60 max-w-md mb-6">
                            A safety-first platform connecting verified artists with clients for live events.
                            Empowering talent with respect, security, and fair compensation.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#how-it-works" className="text-white/60 hover:text-white transition-colors duration-300">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="#for-artists" className="text-white/60 hover:text-white transition-colors duration-300">
                                    For Artists
                                </Link>
                            </li>
                            <li>
                                <Link href="#for-clients" className="text-white/60 hover:text-white transition-colors duration-300">
                                    For Clients
                                </Link>
                            </li>
                            <li>
                                <Link href="#safety" className="text-white/60 hover:text-white transition-colors duration-300">
                                    Safety
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">Legal & Support</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/privacy" className="text-white/60 hover:text-white transition-colors duration-300">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/safety" className="text-white/60 hover:text-white transition-colors duration-300">
                                    Safety Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-white/60 hover:text-white transition-colors duration-300">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-white/60 hover:text-white transition-colors duration-300">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/40 text-sm">
                            © 2024 TARANG. All rights reserved.
                        </p>
                        <p className="text-white/40 text-sm flex items-center gap-2">
                            Made with
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            for artists in India
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
