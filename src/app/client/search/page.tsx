'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Search, MapPin, SlidersHorizontal, Grid, List, Music, Star, Map } from 'lucide-react';
import ArtistCard from '@/components/ArtistCard';
import BookingModal from '@/components/BookingModal';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
    const { artists, artistsLoading } = useAuth();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [priceRange, setPriceRange] = useState<number>(50000);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    const categories = ['All', ...Array.from(new Set(artists.map(a => a.category)))];

    const filteredArtists = artists.filter(artist => {
        const matchesCategory = selectedCategory === 'All' || artist.category === selectedCategory;
        const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artist.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = artist.price <= priceRange;
        return matchesCategory && matchesSearch && matchesPrice;
    });

    const handleBook = (artist: any) => {
        setSelectedArtist(artist);
        setBookingModalOpen(true);
    };

    const handleCardClick = (id: string) => {
        router.push(`/client/artist/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative font-sans">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />

            <div className="p-8 pt-20 relative z-10 max-w-7xl mx-auto h-screen flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Browse Artists</h1>
                        <p className="text-white/60 text-lg">Find the perfect match with advanced filters</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-72 shrink-0 space-y-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-fit overflow-y-auto">
                        <div className="space-y-4">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Search className="w-4 h-4 text-accent" />
                                Search
                            </h3>
                            <input
                                type="text"
                                placeholder="Name or Location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 focus:outline-none transition-all placeholder:text-white/30"
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Music className="w-4 h-4 text-accent" />
                                Category
                            </h3>
                            <div className="flex flex-col gap-2">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selectedCategory === cat ? 'border-accent bg-accent' : 'border-white/30 group-hover:border-white'}`}>
                                            {selectedCategory === cat && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="category"
                                            className="hidden"
                                            checked={selectedCategory === cat}
                                            onChange={() => setSelectedCategory(cat)}
                                        />
                                        <span className={`text-sm transition-colors ${selectedCategory === cat ? 'text-white font-bold' : 'text-white/60 group-hover:text-white'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4 text-accent" />
                                    Max Price
                                </h3>
                                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-lg">₹{priceRange.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="100000"
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full accent-accent h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-white/40 font-medium">
                                <span>₹5k</span>
                                <span>₹100k+</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <div className="text-white/60 text-sm font-medium">
                                Showing <span className="text-white font-bold">{filteredArtists.length}</span> results
                            </div>
                            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Grid/List */}
                        <div className="flex-1 overflow-y-auto pr-2 pb-20 custom-scrollbar">
                            {filteredArtists.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-3xl bg-white/5">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-6 h-6 text-white/20" />
                                    </div>
                                    <p className="text-white font-bold text-lg mb-1">No artists found</p>
                                    <p className="text-white/40 text-sm max-w-xs">We couldn't find any artists matching your current filters.</p>
                                </div>
                            ) : (
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                                    {filteredArtists.map(artist => (
                                        viewMode === 'grid' ? (
                                            <div key={artist.id} onClick={() => handleCardClick(artist.id)} className="cursor-pointer">
                                                <ArtistCard {...artist} onBook={() => handleBook(artist)} />
                                            </div>
                                        ) : (
                                            <div
                                                key={artist.id}
                                                onClick={() => handleCardClick(artist.id)}
                                                className="group flex flex-col md:flex-row gap-6 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all"
                                            >
                                                <div className="w-full md:w-48 aspect-video md:aspect-square rounded-xl overflow-hidden relative shrink-0">
                                                    <img src={artist.image} alt={artist.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <div className="text-xs font-bold text-accent uppercase tracking-wider mb-1">{artist.category}</div>
                                                            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{artist.name}</h3>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                            <span className="text-xs font-bold text-white">{artist.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-white/60 text-sm flex items-center gap-2 mb-4">
                                                        <MapPin className="w-3 h-3" /> {artist.location}
                                                    </p>
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <span className="text-xl font-bold text-white">₹{artist.price.toLocaleString()}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleBook(artist);
                                                            }}
                                                            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all"
                                                        >
                                                            Book Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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
        </div>
    );
}
