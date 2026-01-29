'use client';

import { useState } from 'react';
import ArtistCard from '@/components/ArtistCard';
import BookingModal from '@/components/BookingModal';
import { useAuth } from '@/contexts/auth-context';

export default function FavoritesPage() {
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<{ id: string; name: string; image: string; price: number } | null>(null);
    const { favorites, toggleFavorite } = useAuth();

    const handleBook = (artist: any) => {
        setSelectedArtist({ id: artist.id, name: artist.name, image: artist.image, price: artist.price });
        setBookingModalOpen(true);
    };

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((artist) => (
                    <div key={artist.id} className="relative">
                        <ArtistCard
                            {...artist}
                            onBook={() => handleBook(artist)}
                        />
                        <button
                            onClick={() => toggleFavorite(artist)}
                            className="mt-3 w-full py-2 bg-white/5 border border-white/10 text-white/70 rounded-xl hover:bg-white/10 hover:text-white transition-all"
                        >
                            Remove from Favorites
                        </button>
                    </div>
                ))}
            </div>

            {favorites.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-white/40">No favorites yet.</p>
                </div>
            )}

            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                artistId={selectedArtist?.id || ''}
                artistName={selectedArtist?.name || ''}
                artistImage={selectedArtist?.image || ''}
                artistPrice={selectedArtist?.price}
            />
        </div>
    );
}
