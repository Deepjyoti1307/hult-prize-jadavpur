'use client';

import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import ArtistSidebar from '@/components/ArtistSidebar';
import {
    Music,
    Users,
    Wallet,
    Calendar,
    MapPin,
    ChevronRight,
} from 'lucide-react';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    iconBg: string;
}

type RequestItem = {
    id: string;
    clientName: string;
    eventType: string;
    status: 'escrow-secured' | 'pending-payment' | 'pending' | 'cancelled' | string;
    dateLabel: string;
    locationLabel: string;
    fee: number;
    initials?: string;
};

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
    const { profile, artistBookings, updateBookingStatus } = useAuth();
    const verifiedSteps = useMemo(() => {
        const verification = profile?.artistVerification ?? {};
        return [
            verification.mobile,
            verification.idProof,
            verification.introVideo,
            verification.performanceClip,
            verification.firstGig,
        ].filter(Boolean).length;
    }, [profile]);

    const userName = profile?.name || 'Artist';

    const pendingRequests = useMemo(() => {
        return artistBookings
            .filter((booking) => booking.status === 'Pending')
            .map((booking) => ({
                id: booking.id,
                clientName: booking.clientName || 'Client',
                eventType: booking.eventType || 'Live Event',
                status: 'pending-payment',
                dateLabel: `${booking.date} • ${booking.durationHours} Hours`,
                locationLabel: booking.location,
                fee: booking.fee ?? 0,
                initials: (booking.clientName || 'Client')
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase(),
            }));
    }, [artistBookings]);

    const stats = useMemo(() => {
        const upcomingGigs = artistBookings.filter(
            (booking) => booking.status === 'Confirmed'
        ).length;
        const pendingCount = artistBookings.filter(
            (booking) => booking.status === 'Pending'
        ).length;
        return [
            {
                icon: <Music className="w-6 h-6 text-purple-400" />,
                label: 'Upcoming Gigs',
                value: upcomingGigs,
                iconBg: 'bg-purple-500/20',
            },
            {
                icon: <Users className="w-6 h-6 text-blue-400" />,
                label: 'Pending Requests',
                value: pendingCount,
                iconBg: 'bg-blue-500/20',
            },
            {
                icon: <Wallet className="w-6 h-6 text-accent" />,
                label: 'Wallet Balance',
                value: 0,
                iconBg: 'bg-accent/20',
            },
        ];
    }, [artistBookings]);

    const renderStatusBadge = (status: RequestItem['status']) => {
        if (status === 'escrow-secured') {
            return (
                <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="text-green-400 text-xs font-semibold">Escrow Secured</span>
                </div>
            );
        }
        if (status === 'pending-payment') {
            return (
                <div className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                    <span className="text-yellow-400 text-xs font-semibold">Pending Payment</span>
                </div>
            );
        }
        return (
            <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <span className="text-white/60 text-xs font-semibold">Pending</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            {/* Sidebar */}
            <ArtistSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
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

                        {/* Profile Summary */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/60 text-sm">Profile</p>
                                    <h2 className="text-white text-xl font-semibold">
                                        {profile?.name || 'Artist'}
                                    </h2>
                                    {profile?.email && (
                                        <p className="text-white/50 text-sm">{profile.email}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-white/60 text-sm">Verification</p>
                                    <p className="text-white text-lg font-semibold">
                                        {verifiedSteps} / 5 steps
                                    </p>
                                    <p className="text-white/40 text-xs uppercase tracking-wide">
                                        {profile?.role || 'artist'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index}>
                                    <StatCard {...stat} />
                                </div>
                            ))}
                        </div>

                        {/* Pending Requests */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">Pending Requests</h2>

                            {pendingRequests.length === 0 ? (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white/60">
                                    No pending requests yet. New booking requests will appear here.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pendingRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10"
                                        >
                                            <div className="absolute -inset-[1px] bg-gradient-to-r from-accent/20 via-purple-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                                                        {(request.initials || request.clientName)
                                                            .split(' ')
                                                            .map((part) => part[0])
                                                            .slice(0, 2)
                                                            .join('')
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg">{request.clientName}</h3>
                                                        <p className="text-white/50 text-sm">{request.eventType}</p>
                                                    </div>
                                                </div>
                                                {renderStatusBadge(request.status)}
                                            </div>

                                            <div className="space-y-3 mb-5">
                                                <div className="flex items-center gap-3 text-white/60">
                                                    <Calendar className="w-4 h-4 text-accent" />
                                                    <span className="text-sm">{request.dateLabel}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-white/60">
                                                    <MapPin className="w-4 h-4 text-accent" />
                                                    <span className="text-sm">{request.locationLabel}</span>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 rounded-2xl p-4 mb-5">
                                                <p className="text-white/40 text-xs mb-1">Your Fee</p>
                                                <p className="text-white text-2xl font-bold">₹{request.fee.toLocaleString('en-IN')}</p>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => updateBookingStatus(request.id, 'Confirmed')}
                                                    className="flex-1 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => updateBookingStatus(request.id, 'Cancelled')}
                                                    className="flex-1 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-white/80 font-medium rounded-xl transition-all"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
