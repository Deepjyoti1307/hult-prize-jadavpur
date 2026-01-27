'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, SlidersHorizontal, ChevronDown, AlertTriangle, Music, Loader2 } from 'lucide-react';
import ArtistCard from '@/components/ArtistCard';
import BookingModal from '@/components/BookingModal';
import IncidentModal from '@/components/IncidentModal';

// Artist type definition
interface Artist {
    id: string;
    name: string;
    category: string;
    image: string;
    rating: number;
    location: string;
    price: number;
}

// User location type
interface UserLocation {
    address: string;
    coords: { lat: number; lng: number } | null;
}

const CATEGORIES = ['All', 'Live Bands', 'DJs', 'Solo Singers', 'Classical', 'Folk'];

export default function ClientDashboard() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [incidentModalOpen, setIncidentModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<{ name: string; image: string } | null>(null);

    // Load user location from localStorage on mount
    useEffect(() => {
        const storedLocation = localStorage.getItem('userLocation');
        if (storedLocation) {
            const location = JSON.parse(storedLocation) as UserLocation;
            setUserLocation(location);
        }

        // TODO: Fetch artists from backend based on location
        // For now, we'll show empty state since we don't have backend yet
        // Once backend is integrated, replace this with actual API call:
        // fetchArtistsByLocation(location.coords?.lat, location.coords?.lng)
        setIsLoading(false);
    }, []);

    const handleBook = (artist: Artist) => {
        setSelectedArtist({ name: artist.name, image: artist.image });
        setBookingModalOpen(true);
    };

    const filteredArtists = artists.filter(artist => {
        const matchesCategory = selectedCategory === 'All' || artist.category.includes(selectedCategory);
        const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artist.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen p-8 relative z-10">
            {/* Header Section */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Discover Artists</h1>
                    <p className="text-white/60">Find the perfect talent for your event</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Incident Button */}
                    <button
                        onClick={() => setIncidentModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all font-medium text-sm"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Report Issue</span>
                    </button>

                    {/* Location Display */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="max-w-[200px] truncate">{userLocation?.address || 'Location not set'}</span>
                    </div>

                    {/* User Profile */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-accent p-[2px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                            <span className="text-white font-bold text-xs">JD</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search & Filters */}
            <section className="mb-10 space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search for artists, genres, or vibes..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/40 outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-colors">
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${selectedCategory === category
                                ? 'bg-accent/20 border-accent text-accent'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Section (Optional for 'District' feel) */}
            <section className="mb-10">
                <div className="relative w-full h-[300px] rounded-3xl overflow-hidden group cursor-pointer">
                    <img
                        src="https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2574&auto=format&fit=crop"
                        alt="Featured Event"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 w-full max-w-2xl">
                        <span className="px-3 py-1 bg-accent rounded-full text-xs font-bold text-white mb-4 inline-block">
                            Trending Now
                        </span>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Summer Music Festival 2026
                        </h2>
                        <p className="text-white/80 line-clamp-2 mb-6">
                            Experience the biggest gathering of indie artists and live bands in Mumbai. Book your artists now for exclusive pre-parties!
                        </p>
                        <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                            Explore Collection
                        </button>
                    </div>
                </div>
            </section>

            {/* Artists Grid */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {userLocation ? `Artists near ${userLocation.address.split(',')[0]}` : 'Recommended for You'}
                    </h2>
                    {artists.length > 0 && (
                        <button className="text-accent hover:text-accent-light text-sm font-medium transition-colors">
                            View All
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                        <p className="text-white/60">Finding artists near you...</p>
                    </div>
                ) : filteredArtists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredArtists.map((artist) => (
                            <ArtistCard
                                key={artist.id}
                                {...artist}
                                onBook={() => handleBook(artist)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-4">
                        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                            <Music className="w-12 h-12 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Artists Available Yet</h3>
                        <p className="text-white/60 text-center max-w-md mb-2">
                            {userLocation
                                ? `We're still onboarding artists in your area (${userLocation.address.split(',')[0]}). Check back soon!`
                                : 'Complete your onboarding to see artists near you.'
                            }
                        </p>
                        <p className="text-white/40 text-sm text-center">
                            Artists will appear here once they register on the platform.
                        </p>
                    </div>
                )}
            </section>

            {/* Booking Modal */}
            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                artistName={selectedArtist?.name || ''}
                artistImage={selectedArtist?.image || ''}
            />

            <IncidentModal
                isOpen={incidentModalOpen}
                onClose={() => setIncidentModalOpen(false)}
            />
        </div>
    );
}
