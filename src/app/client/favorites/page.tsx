'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Heart, Search, Filter, Loader2, Star, Trash2 } from 'lucide-react';
import ArtistCard from '@/components/ArtistCard';
import BookingModal from '@/components/BookingModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<{ id: string; name: string; image: string; price: number } | null>(null);
    const { favorites, toggleFavorite } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    const handleBook = (artist: any) => {
        setSelectedArtist({ id: artist.id, name: artist.name, image: artist.image, price: artist.price });
        setBookingModalOpen(true);
    };

    const handleCardClick = (id: string) => {
        router.push(`/client/artist/${id}`);
    };

    const displayFavorites = favorites.filter((artist: any) =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative font-sans">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />

            <div className="p-8 pt-20 relative z-10 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Saved Artists</h1>
                        <p className="text-white/60 text-lg">Curated list of your favorite talent</p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your favorites..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-accent/50 focus:ring-1 focus:ring-accent/50 focus:outline-none transition-all placeholder:text-white/30"
                        />
                    </div>
                </div>

                {displayFavorites.length === 0 ? (
                    <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 border-dashed backdrop-blur-sm">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-white text-2xl font-bold mb-3">{searchQuery ? 'No matches found' : 'No favorites yet'}</h3>
                        <p className="text-white/50 mb-8 max-w-md mx-auto text-lg">
                            {searchQuery ? 'Try a different search term.' : 'Start exploring artists and tap the heart icon to save them for later.'}
                        </p>
                        {!searchQuery && (
                            <Link href="/client/dashboard" className="px-8 py-4 bg-accent hover:bg-accent-light text-white font-bold rounded-2xl transition-all shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 inline-block">
                                Discover Artists
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayFavorites.map((artist: any) => (
                            <div key={artist.id} className="relative group">
                                <div onClick={() => handleCardClick(artist.id)} className="cursor-pointer">
                                    <ArtistCard
                                        {...artist}
                                        onBook={() => handleBook(artist)}
                                    />
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(artist);
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                                    title="Remove from favorites"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                artistName={selectedArtist?.name || ''}
                artistId={selectedArtist?.id || ''}
                artistImage={selectedArtist?.image || ''}
                artistPrice={selectedArtist?.price}
            />
        </div>
    );
}
