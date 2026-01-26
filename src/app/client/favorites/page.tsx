'use client';

import { useState } from 'react';
import ArtistCard from '@/components/ArtistCard';
import BookingModal from '@/components/BookingModal';

const FAVORITES = [

    {
        id: '5',
        name: 'Classical Strings',
        category: 'Classical',
        image: 'https://images.unsplash.com/photo-1519683109079-8436f3522616?q=80&w=2670&auto=format&fit=crop',
        rating: 4.6,
        location: 'Chennai, TN',
        price: 18000,
    },
];

export default function FavoritesPage() {
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<{ name: string; image: string } | null>(null);

    const handleBook = (artist: any) => {
        setSelectedArtist({ name: artist.name, image: artist.image });
        setBookingModalOpen(true);
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {FAVORITES.map((artist) => (
                    <ArtistCard
                        key={artist.id}
                        {...artist}
                        onBook={() => handleBook(artist)}
                    />
                ))}
            </div>

            {FAVORITES.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-white/40">No favorites yet.</p>
                </div>
            )}

            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                artistName={selectedArtist?.name || ''}
                artistImage={selectedArtist?.image || ''}
            />
        </div>
    );
}
