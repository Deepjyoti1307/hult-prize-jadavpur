'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import ArtistSidebar from '@/components/ArtistSidebar';
import {
    Music,
    Users,
    Wallet,
    Calendar,
    MapPin,
    MessageSquare,
    ChevronRight,
    CheckCircle2,
    Bell,
    ChevronDown,
    Shield,
    User,
} from 'lucide-react';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    iconBg: string;
}

function StatCard({ icon, label, value, iconBg }: StatCardProps) {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                    {icon}
                </div>
                <div>
                    <p className="text-white/60 text-sm">{label}</p>
                    <p className="text-white text-2xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
}

export default function ArtistDashboard() {
    const [selectedLocation, setSelectedLocation] = useState('Mumbai');
    const userName = 'New Artist'; // Will come from auth context
    const walletBalance = 0;

    // Stats for new user
    const stats = [
        {
            icon: <Music className="w-6 h-6 text-purple-400" />,
            label: 'Upcoming Gigs',
            value: 0,
            iconBg: 'bg-purple-500/20',
        },
        {
            icon: <Users className="w-6 h-6 text-blue-400" />,
            label: 'Pending Requests',
            value: 0,
            iconBg: 'bg-blue-500/20',
        },
        {
            icon: <Wallet className="w-6 h-6 text-accent" />,
            label: 'Wallet Balance',
            value: 0,
            iconBg: 'bg-accent/20',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            {/* Sidebar */}
            <ArtistSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Bar */}
                <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                    {/* Location Selector */}
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                        <ChevronRight className="w-5 h-5 text-white/60 rotate-180" />
                        <span className="text-white font-medium">{selectedLocation}</span>
                        <ChevronDown className="w-4 h-4 text-white/60" />
                    </button>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Wallet Balance */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <User className="w-5 h-5 text-white/60" />
                            <span className="text-white font-medium">₹{walletBalance.toLocaleString()}</span>
                            <ChevronDown className="w-4 h-4 text-white/60" />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-xl bg-accent/20 border border-accent/30 hover:bg-accent/30 transition-all">
                            <Bell className="w-5 h-5 text-accent" />
                            {/* Notification badge */}
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                                0
                            </span>
                        </button>
                    </div>
                </header>

                <div className="flex gap-6 p-8">
                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6">
                        {/* Welcome Section */}
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Welcome, {userName} 👋
                            </h1>
                            <p className="text-white/60">Here's what's happening today</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <StatCard {...stat} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Upcoming Booking Section */}
                        {/* Pending Requests & Bookings */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">Pending Requests</h2>

                            {/* Request Card 1 */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            JD
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">John Doe</h3>
                                            <p className="text-white/60 text-sm">Wedding Reception • 4 Hours</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-green-400 text-xs font-bold uppercase tracking-wide">Payment Secured in Escrow</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-xl p-3">
                                        <p className="text-white/40 text-xs">Date</p>
                                        <p className="text-white font-medium">Aug 24, 2026</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3">
                                        <p className="text-white/40 text-xs">Location</p>
                                        <p className="text-white font-medium">Grand Hyatt, Mumbai</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3">
                                        <p className="text-white/40 text-xs">Your Fee</p>
                                        <p className="text-white font-bold">₹25,000</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button className="flex-1 py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-xl transition-all">
                                        Accept Booking
                                    </button>
                                    <button className="flex-1 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-white/10 text-white font-medium rounded-xl transition-all">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Safety Panel */}
                    <aside className="w-80 space-y-6">
                        {/* Safety Status */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-accent" />
                                <h3 className="text-white font-semibold">Safety Status</h3>
                            </div>

                            {/* Verification Items */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                    <div>
                                        <p className="text-white font-medium text-sm">Booking Verified</p>
                                        <p className="text-white/50 text-xs">Securely processed and verified</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                                    <div>
                                        <p className="text-white font-medium text-sm">24/7 Support Available</p>
                                        <p className="text-white/50 text-xs">Always here to assist you</p>
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Button */}
                            <button className="w-full mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-all flex items-center justify-center gap-2">
                                <Bell className="w-4 h-4" />
                                Emergency Button
                            </button>
                        </div>

                        {/* Safety Profile */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <button className="w-full flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-accent" />
                                    <span className="text-white font-medium">Safety</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between mt-3 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-accent rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-white/80 text-sm">{userName}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Contact Support */}
                        <button className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all">
                            Contact Support
                        </button>
                    </aside>
                </div>
            </main>
        </div>
    );
}
