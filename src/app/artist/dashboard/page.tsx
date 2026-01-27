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
    ChevronRight,
    Bell,
    ChevronDown,
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

                <div className="p-8">
                    {/* Main Content Area */}
                    <div className="space-y-6">
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

                        {/* Pending Requests - Two Floating Cards */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">Pending Requests</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Request Card 1 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10"
                                >
                                    {/* Floating gradient accent */}
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-accent/20 via-purple-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                                                JD
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-lg">John Doe</h3>
                                                <p className="text-white/50 text-sm">Wedding Reception</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                                            <span className="text-green-400 text-xs font-semibold">Escrow Secured</span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3 mb-5">
                                        <div className="flex items-center gap-3 text-white/60">
                                            <Calendar className="w-4 h-4 text-accent" />
                                            <span className="text-sm">Aug 24, 2026 • 4 Hours</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/60">
                                            <MapPin className="w-4 h-4 text-accent" />
                                            <span className="text-sm">Grand Hyatt, Mumbai</span>
                                        </div>
                                    </div>

                                    {/* Fee */}
                                    <div className="bg-white/5 rounded-2xl p-4 mb-5">
                                        <p className="text-white/40 text-xs mb-1">Your Fee</p>
                                        <p className="text-white text-2xl font-bold">₹25,000</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40">
                                            Accept
                                        </button>
                                        <button className="flex-1 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-white/80 font-medium rounded-xl transition-all">
                                            Decline
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Request Card 2 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
                                >
                                    {/* Floating gradient accent */}
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-accent/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-500/30">
                                                SP
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-lg">Sarah Parker</h3>
                                                <p className="text-white/50 text-sm">Corporate Event</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                                            <span className="text-yellow-400 text-xs font-semibold">Pending Payment</span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3 mb-5">
                                        <div className="flex items-center gap-3 text-white/60">
                                            <Calendar className="w-4 h-4 text-accent" />
                                            <span className="text-sm">Sep 10, 2026 • 3 Hours</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/60">
                                            <MapPin className="w-4 h-4 text-accent" />
                                            <span className="text-sm">Taj Lands End, Mumbai</span>
                                        </div>
                                    </div>

                                    {/* Fee */}
                                    <div className="bg-white/5 rounded-2xl p-4 mb-5">
                                        <p className="text-white/40 text-xs mb-1">Your Fee</p>
                                        <p className="text-white text-2xl font-bold">₹18,000</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40">
                                            Accept
                                        </button>
                                        <button className="flex-1 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-white/80 font-medium rounded-xl transition-all">
                                            Decline
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
