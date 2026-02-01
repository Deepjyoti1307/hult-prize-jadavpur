'use client';

import { useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import ArtistSidebar from '@/components/ArtistSidebar';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import {
    Music,
    Users,
    Wallet,
    Calendar,
    MapPin,
    ChevronRight,
    ShieldCheck,
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
    const { profile, artistBookings, updateBookingStatus, artists } = useAuth();

    const currentArtist = useMemo(() => artists.find((a) => a.id === profile?.uid), [artists, profile]);

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

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
        <div className="min-h-screen bg-[#0a0a0f] flex relative">
            {/* Full-page canvas background */}
            <canvas
                className="pointer-events-none fixed inset-0 z-0"
                id="canvas"
            />

            {/* Sidebar */}
            <ArtistSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="p-8 pt-20">
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
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-accent/20 transition-all duration-500" />
                            
                            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                {/* Artist Image */}
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-accent to-purple-500">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a0f] relative">
                                            {currentArtist?.image ? (
                                                <img 
                                                    src={currentArtist.image} 
                                                    alt={currentArtist.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-2xl font-bold text-white">
                                                    {userName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {profile?.adminApproval?.status === 'approved' && (
                                        <div className="absolute bottom-0 right-0 bg-accent text-white p-1.5 rounded-full border-4 border-[#0a0a0f] shadow-lg">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-white text-2xl font-bold mb-1">
                                        {currentArtist?.name || profile?.name || 'Artist'}
                                    </h2>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/5">
                                            {currentArtist?.category || 'Musician'}
                                        </span>
                                        <span className="text-white/40 text-sm flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {currentArtist?.location || profile?.location?.address || 'Location not set'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                                        <div>
                                            <p className="text-white/40 mb-0.5">Base Price</p>
                                            <p className="text-white font-semibold">₹{currentArtist?.price?.toLocaleString() || '0'}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 mb-0.5">Rating</p>
                                            <p className="text-white font-semibold flex items-center gap-1">
                                                ★ {currentArtist?.rating || 'New'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 mb-0.5">Verification</p>
                                            <p className="text-accent font-semibold">{verifiedSteps}/5 Steps</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-medium transition-all">
                                        Edit Profile
                                    </button>
                                    <button className="px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/20 rounded-xl text-sm font-medium transition-all">
                                        View Public Page
                                    </button>
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
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">Gig Requests</h2>
                                <span className="text-sm text-white/40">{pendingRequests.length} pending</span>
                            </div>

                            {pendingRequests.length === 0 ? (
                                <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Music className="w-8 h-8 text-white/20" />
                                    </div>
                                    <h3 className="text-white font-medium mb-1">No gig requests yet</h3>
                                    <p className="text-white/40 text-sm max-w-xs mx-auto">
                                        Ensure your profile is complete and verified to start receiving bookings from clients.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {pendingRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="group relative bg-[#12121a]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 transition-all duration-300"
                                        >
                                            {/* Top Banner / Ticket Stub Look */}
                                            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-accent opacity-50 group-hover:opacity-100 transition-opacity" />
                                            
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white font-bold text-lg border border-white/10">
                                                            {(request.initials || request.clientName)
                                                                .split(' ')
                                                                .map((part) => part[0])
                                                                .slice(0, 2)
                                                                .join('')
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-bold text-lg leading-tight">{request.clientName}</h3>
                                                            <p className="text-white/50 text-xs font-medium uppercase tracking-wider mt-0.5">{request.eventType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-accent text-xl font-bold">₹{request.fee.toLocaleString()}</p>
                                                        <p className="text-white/30 text-xs">Total Fee</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-6 bg-white/5 rounded-xl p-4 border border-white/5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-white/40 text-xs">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>Date & Time</span>
                                                        </div>
                                                        <p className="text-white/90 text-sm font-medium truncate">{request.dateLabel}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-white/40 text-xs">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span>Location</span>
                                                        </div>
                                                        <p className="text-white/90 text-sm font-medium truncate">{request.locationLabel}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => updateBookingStatus(request.id, 'Confirmed')}
                                                        className="flex-1 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all shadow-lg shadow-accent/10 hover:shadow-accent/30 active:scale-[0.98]"
                                                    >
                                                        Accept Gig
                                                    </button>
                                                    <button
                                                        onClick={() => updateBookingStatus(request.id, 'Cancelled')}
                                                        className="px-4 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-white/60 font-medium rounded-xl transition-all active:scale-[0.98]"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
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
