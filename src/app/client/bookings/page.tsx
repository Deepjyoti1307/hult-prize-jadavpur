'use client';

import { Calendar, Clock, MapPin, MoreVertical, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

const BOOKINGS = [
    {
        id: 1,
        artist: 'The Midnight Jazz',
        date: '2026-06-15',
        time: '19:00',
        location: 'Taj Land\'s End, Mumbai',
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2664&auto=format&fit=crop',
    },

];

export default function BookingsPage() {
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold text-white mb-8">My Bookings</h1>

            <div className="space-y-4 max-w-5xl">
                {BOOKINGS.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-6 hover:bg-white/10 transition-all"
                    >
                        {/* Image */}
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                                src={booking.image}
                                alt={booking.artist}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-xl font-bold text-white">{booking.artist}</h3>
                                <StatusBadge status={booking.status} />
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-3">
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <Calendar className="w-4 h-4 text-accent" />
                                    {booking.date}
                                </div>
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <Clock className="w-4 h-4 text-accent" />
                                    {booking.time}
                                </div>
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <MapPin className="w-4 h-4 text-accent" />
                                    {booking.location}
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'Confirmed') {
        return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Confirmed
            </span>
        );
    }
    if (status === 'Pending') {
        return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/20">
                <Loader2 className="w-3 h-3 animate-spin" />
                Pending
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-bold border border-white/10">
            <CheckCircle2 className="w-3 h-3" />
            Completed
        </span>
    );
}
