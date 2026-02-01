'use client';

import { useEffect, useState } from 'react';
import ArtistSidebar from '@/components/ArtistSidebar';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Shield, Smartphone, Share2, AlertTriangle, ChevronRight, Phone, Lock, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function ArtistSafety() {
    const { profile } = useAuth();
    const [sharingLocation, setSharingLocation] = useState(false);

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex relative">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />
            <ArtistSidebar />

            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="p-8 pt-20">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Safety Center</h1>
                        <p className="text-white/60">Tools and resources to keep you safe during gigs</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Emergency SOS Section */}
                        <div className="bg-gradient-to-br from-red-500/20 to-red-900/10 border border-red-500/30 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
                                <AlertTriangle className="w-32 h-32 text-red-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Emergency Assistance</h2>
                                </div>
                                <p className="text-white/70 mb-8 max-w-md leading-relaxed">
                                    If you feel unsafe or are in immediate danger, use the SOS button to alert our safety team and your emergency contacts immediately.
                                </p>
                                <button className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                                    TRIGGER SOS ALERT
                                </button>
                                <p className="text-white/30 text-xs text-center mt-3">
                                    This will share your live location with Tarang Safety Team.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Live Location Sharing */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                                            <Share2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Share Live Location</h3>
                                            <p className="text-white/60 text-sm">Valid only during active gigs</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSharingLocation(!sharingLocation)}
                                        className={`w-14 h-8 rounded-full transition-colors relative ${sharingLocation ? 'bg-accent' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${sharingLocation ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-white/60 text-sm">
                                        Trusted Contacts: <span className="text-white font-medium">Mom, Rahul (Manager)</span>
                                    </p>
                                    <button className="text-accent text-sm font-medium mt-2 hover:underline">Manage Contacts</button>
                                </div>
                            </div>

                            {/* Verification Badge Status */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-full text-green-400">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold text-lg">Identity Verification</h3>
                                        <p className="text-white/60 text-sm">
                                            {profile?.adminApproval?.status === 'approved'
                                                ? 'Your account is verified. This builds trust with clients.'
                                                : 'Verification Pending.'}
                                        </p>
                                    </div>
                                    {profile?.adminApproval?.status === 'approved' && (
                                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                            ACTIVE
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">Safety Resources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Smartphone, title: 'Safety Guidelines', desc: 'Best practices for gig safety' },
                                { icon: Lock, title: 'Privacy Policy', desc: 'How we protect your data' },
                                { icon: Phone, title: '24/7 Support', desc: 'Contact our support team' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 cursor-pointer transition-all group">
                                    <item.icon className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                    <p className="text-white/50 text-sm mb-4">{item.desc}</p>
                                    <div className="flex items-center text-accent text-sm font-medium">
                                        Read More <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
