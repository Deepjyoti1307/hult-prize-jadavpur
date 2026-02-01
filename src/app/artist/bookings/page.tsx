'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import ArtistSidebar from '@/components/ArtistSidebar';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import {
    Calendar,
    MapPin,
    Clock,
    Search,
    Filter,
    MessageCircle,
    Navigation,
    MoreVertical
} from 'lucide-react';

export default function ArtistBookings() {
    const { artistBookings } = useAuth();
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    const filteredBookings = useMemo(() => {
        if (activeTab === 'Upcoming') {
            return artistBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
        }
        return artistBookings.filter(b => b.status === activeTab);
    }, [artistBookings, activeTab]);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex relative">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />
            <ArtistSidebar />

            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="p-8 pt-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
                            <p className="text-white/60">Manage your gigs and schedule</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-accent/50 w-64"
                                />
                            </div>
                            <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit mb-8 border border-white/10">
                        {['Upcoming', 'Completed', 'Cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Bookings List */}
                    <div className="space-y-4">
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                                <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <h3 className="text-white font-medium text-lg">No {activeTab.toLowerCase()} bookings</h3>
                                <p className="text-white/40">Your {activeTab.toLowerCase()} gigs will appear here.</p>
                            </div>
                        ) : (
                            filteredBookings.map((booking) => (
                                <div key={booking.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Date Box */}
                                        <div className="flex flex-col items-center justify-center w-full md:w-24 bg-white/5 rounded-xl border border-white/10 p-4">
                                            <span className="text-white/40 text-xs font-medium uppercase">{booking.date?.split(',')[0] || 'TBD'}</span>
                                            <span className="text-white text-2xl font-bold my-1">{booking.date?.split(',')[1]?.trim().split(' ')[0] || '00'}</span>
                                            <span className="text-accent text-xs font-bold uppercase">{booking.time}</span>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">{booking.clientName}</h3>
                                                    <p className="text-white/60 text-sm">{booking.eventType} • {booking.durationHours} Hours</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                            booking.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                    <p className="text-white font-bold mt-2">₹{booking.fee?.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/60">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-accent" />
                                                    {booking.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-accent" />
                                                    {booking.time} ({booking.durationHours} hrs)
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {activeTab === 'Upcoming' && (
                                                <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-xl text-sm font-medium transition-all">
                                                        <MessageCircle className="w-4 h-4" />
                                                        Chat with Client
                                                    </button>
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-medium transition-all">
                                                        <Navigation className="w-4 h-4" />
                                                        Get Directions
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
