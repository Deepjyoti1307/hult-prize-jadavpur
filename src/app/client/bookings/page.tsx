'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, MoreVertical, MessageCircle, ChevronRight, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookingsPage() {
    const { bookings } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'Active' | 'History' | 'Cancelled'>('Active');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    const filteredBookings = bookings.filter(b => {
        const status = b.status || 'Pending';
        const matchesTab =
            activeTab === 'Active' ? ['Pending', 'Confirmed', 'In Progress'].includes(status) :
                activeTab === 'History' ? ['Completed'].includes(status) :
                    ['Cancelled', 'Declined'].includes(status);

        const matchesSearch = b.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.eventType?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative font-sans">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />

            <div className="p-8 pt-20 relative z-10 max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">My Bookings</h1>
                        <p className="text-white/60 text-lg">Manage your upcoming events and history</p>
                    </div>

                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-accent/50 focus:ring-1 focus:ring-accent/50 focus:outline-none transition-all placeholder:text-white/30"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl w-full md:w-fit border border-white/10 overflow-x-auto">
                    {['Active', 'History', 'Cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 md:flex-none px-8 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="space-y-4 min-h-[400px]">
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed min-h-[300px] flex flex-col justify-center items-center">
                            <Calendar className="w-16 h-16 text-white/10 mb-4" />
                            <h3 className="text-white text-xl font-bold mb-2">No {activeTab.toLowerCase()} bookings</h3>
                            <p className="text-white/50 mb-6 max-w-sm">Your {activeTab.toLowerCase()} booking history will appear here.</p>
                            {activeTab === 'Active' && (
                                <Link href="/client/dashboard" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium border border-white/5 hover:border-white/10">
                                    Browse Artists
                                </Link>
                            )}
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Date Badge */}
                                    <div className="flex flex-col items-center justify-center w-full md:w-20 bg-white/5 rounded-xl border border-white/10 p-3 shrink-0 aspect-square md:aspect-auto h-20">
                                        <span className="text-accent font-bold text-2xl">{booking.date ? new Date(booking.date).getDate() : '--'}</span>
                                        <span className="text-white/60 text-xs uppercase font-bold tracking-wider">{booking.date ? new Date(booking.date).toLocaleString('default', { month: 'short' }) : 'TBD'}</span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3
                                                className="text-xl font-bold text-white truncate hover:underline cursor-pointer"
                                                onClick={() => router.push(`/client/artist/${booking.artistId}`)}
                                            >
                                                {booking.artistName || 'Unknown Artist'}
                                            </h3>
                                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        'bg-white/10 text-white/40 border-white/10'
                                                }`}>
                                                {booking.status || 'Pending'}
                                            </span>
                                        </div>
                                        <p className="text-white/80 font-medium">{booking.eventType} • <span className="text-white/60 font-normal">₹{booking.fee?.toLocaleString()}</span></p>

                                        <div className="flex flex-wrap gap-4 text-sm text-white/50 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-accent/70" />
                                                {booking.location || 'Location TBD'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4 text-accent/70" />
                                                {booking.time || 'Time TBD'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                        {booking.status === 'Confirmed' && (
                                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all">
                                                <MessageCircle className="w-4 h-4" />
                                                Message
                                            </button>
                                        )}
                                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-white rounded-xl text-sm font-bold shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95">
                                            View Details
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
