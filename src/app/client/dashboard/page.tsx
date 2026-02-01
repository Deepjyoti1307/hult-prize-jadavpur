'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Search, MapPin, SlidersHorizontal, AlertTriangle, Sparkles, Filter, Music, Loader2 } from 'lucide-react';
import ArtistCard from '@/components/ArtistCard';
import BookingModal from '@/components/BookingModal';
import IncidentModal from '@/components/IncidentModal';
import { useRouter } from 'next/navigation';

interface Artist {
    id: string;
    name: string;
    category: string;
    image: string;
    rating: number;
    location: string;
    price: number;
}

interface UserLocation {
    address: string;
    coords: { lat: number; lng: number } | null;
}

const CATEGORIES = ['All', 'Live Bands', 'DJs', 'Solo Singers', 'Classical', 'Folk', 'Jazz', 'Instrumental'];

export default function ClientDashboard() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const { profile, artists, artistsLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [incidentModalOpen, setIncidentModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const router = useRouter();

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    useEffect(() => {
        const storedLocation = localStorage.getItem('userLocation');
        if (storedLocation) {
            setUserLocation(JSON.parse(storedLocation));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (profile?.location?.address) {
            setUserLocation({
                address: profile.location.address,
                coords: profile.location.coords ?? null,
            });
        }
    }, [profile]);

    useEffect(() => {
        if (!artistsLoading) setIsLoading(false);
    }, [artistsLoading]);

    const handleBook = (artist: Artist) => {
        setSelectedArtist(artist);
        setBookingModalOpen(true);
    };

    const handleCardClick = (id: string) => {
        router.push(`/client/artist/${id}`);
    };

    const filteredArtists = artists.filter(artist => {
        const matchesCategory = selectedCategory === 'All' || artist.category.includes(selectedCategory);
        const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artist.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative font-sans text-slate-200 selection:bg-accent/30">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />

            <div className="p-6 md:p-8 pt-20 relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Hello, {profile?.name?.split(' ')[0] || 'Client'}
                            </h1>
                            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                        </div>
                        <p className="text-white/60 text-lg max-w-xl">Find and book the perfect sound for your next event.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIncidentModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-medium transition-all hover:scale-105 active:scale-95"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            <span className="hidden sm:inline">Report Issue</span>
                        </button>
                    </div>
                </header>

                {/* Search & Filter Bar */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 sticky top-5 z-20 shadow-2xl shadow-black/50 ring-1 ring-white/5">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, category, or genre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-0 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                            />
                        </div>

                        <div className="flex gap-2 p-1 overflow-x-auto">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white/70 hover:text-white whitespace-nowrap transition-all font-medium">
                                <MapPin className="w-4 h-4 text-white/50" />
                                {userLocation?.address?.split(',')[0] || 'Location'}
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-2xl shadow-lg shadow-accent/20 whitespace-nowrap transition-all font-bold hover:scale-105 active:scale-95">
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mask-fade-r">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${selectedCategory === category
                                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/10'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Artists Grid */}
                <div className="min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <Loader2 className="w-10 h-10 text-accent animate-spin" />
                            <p className="text-white/40 font-medium">Finding nearby talent...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-end mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {selectedCategory === 'All' ? 'Trending Artists' : `Top ${selectedCategory}`}
                                    <span className="text-sm font-normal text-white/40 bg-white/5 px-2 py-0.5 rounded-md ml-2 border border-white/5">{filteredArtists.length}</span>
                                </h2>
                            </div>

                            {filteredArtists.length === 0 ? (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed backdrop-blur-sm">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Music className="w-10 h-10 text-white/20" />
                                    </div>
                                    <h3 className="text-white text-xl font-bold mb-2">No artists found</h3>
                                    <p className="text-white/50 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredArtists.map((artist) => (
                                        <div key={artist.id} onClick={() => handleCardClick(artist.id)} className="cursor-pointer">
                                            <ArtistCard
                                                {...artist}
                                                onBook={() => handleBook(artist)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                artistName={selectedArtist?.name || ''}
                artistId={selectedArtist?.id || ''}
                artistImage={selectedArtist?.image || ''}
                artistPrice={selectedArtist?.price}
            />

            <IncidentModal
                isOpen={incidentModalOpen}
                onClose={() => setIncidentModalOpen(false)}
            />
        </div>
    );
}
