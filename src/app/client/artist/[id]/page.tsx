'use client';

import { ArrowLeft, Star, MapPin, Music, Play, Share2, Heart, CheckCircle2, Clock, Award, Shield } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import BookingModal from '@/components/BookingModal';
import { useAuth } from '@/contexts/auth-context';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { useRouter } from 'next/navigation';

export default function ArtistDetailsPage({ params }: { params: { id: string } }) {
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const { artists, favorites, toggleFavorite } = useAuth();
    const router = useRouter();

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    const artist = useMemo(() => {
        // Since params is async in latest Next.js but here likely string based on usage. 
        // We will stick to sync params access which is standard for page props in this version.
        const found = artists.find((item) => item.id === params.id);
        if (found) {
            return {
                ...found,
                reviews: 124,
                bio: found.name + ' is a professional musician with over 5 years of experience performing at weddings, corporate events, and private parties. Known for high energy and versatile setlists that get everyone dancing.',
                tags: [found.category, 'Live Performance', 'Wedding Specialist'],
                images: [found.image, found.image, found.image], // Mock gallery
                equipment: ['Professional Sound System', 'Lighting Rig', 'Wireless Mics'],
                responseTime: '1 hour'
            };
        }
        return null;
    }, [artists, params.id]);

    const isFavorite = useMemo(() => {
        if (!artist) return false;
        return favorites.some((f: any) => (f.id || f) === artist.id);
    }, [favorites, artist]);

    if (!artist) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative">
                <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />
                <div className="z-10 text-white/50 text-xl font-medium">Artist not found or loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative pb-20 font-sans">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />

            {/* Nav Bar */}
            <div className="fixed top-0 left-0 right-0 z-40 p-4 md:p-6 flex items-center justify-between pointer-events-none">
                <button
                    onClick={() => router.back()}
                    className="pointer-events-auto p-3 bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full text-white transition-all border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="pointer-events-auto flex gap-3">
                    <button
                        onClick={() => toggleFavorite(artist)}
                        className={`p-3 backdrop-blur-xl rounded-full transition-all border ${isFavorite
                                ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20'
                                : 'bg-black/20 hover:bg-black/40 text-white border-white/5'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-3 bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full text-white transition-all border border-white/5">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto md:px-6 md:pt-6">

                {/* Hero Section */}
                <div className="relative md:rounded-[2.5rem] overflow-hidden aspect-[3/4] md:aspect-[21/9] mb-8 group shadow-2xl shadow-black/50">
                    <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />

                    <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="px-4 py-1.5 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-accent/20">
                                        {artist.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-yellow-400 text-sm font-bold border border-white/10">
                                        <Star className="w-4 h-4 fill-current" />
                                        {artist.rating}
                                        <span className="text-white/60 font-medium ml-1">({artist.reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-green-500/20 backdrop-blur-md px-3 py-1.5 rounded-full text-green-400 text-xs font-bold border border-green-500/20">
                                        <Shield className="w-3 h-3" />
                                        VERIFIED
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-2 drop-shadow-lg">{artist.name}</h1>
                                    <p className="text-white/80 flex items-center gap-2 text-lg font-medium drop-shadow-md">
                                        <MapPin className="w-5 h-5 text-accent" /> {artist.location}
                                    </p>
                                </div>
                            </div>

                            <div className="block md:text-right bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 md:bg-transparent md:backdrop-blur-none md:p-0 md:border-0">
                                <p className="text-white/60 text-sm font-medium mb-1">Starting from</p>
                                <p className="text-4xl font-bold text-white tracking-tight">₹{artist.price.toLocaleString()}</p>
                                <p className="text-accent text-sm font-bold mt-1">per event</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-0">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Bio */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                About <span className="w-12 h-1 bg-accent rounded-full ml-2"></span>
                            </h2>
                            <p className="text-white/70 leading-relaxed text-lg font-light">
                                {artist.bio}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-8">
                                {artist.tags.map((tag, i) => (
                                    <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm font-medium hover:text-white hover:bg-white/10 transition-colors">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Gallery Grid */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">Gallery & Media</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {artist.images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer">
                                        <Image src={img} alt={`Gallery ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                                                <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Sticky */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 sticky top-24 shadow-2xl">
                            <div className="flex justify-between items-center mb-8 lg:hidden">
                                <span className="text-white/60">Price per event</span>
                                <span className="text-2xl font-bold text-white">₹{artist.price.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={() => setBookingModalOpen(true)}
                                className="w-full py-5 bg-accent hover:bg-accent-light text-white font-bold rounded-2xl text-lg shadow-lg shadow-accent/20 transition-all mb-8 active:scale-[0.98] group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Request to Book
                                </span>
                            </button>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-2xl text-white border border-white/5">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Fast Response</p>
                                        <p className="text-white/50 text-xs mt-0.5">Usually replies in {artist.responseTime}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-2xl text-white border border-white/5">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Experienced Pro</p>
                                        <p className="text-white/50 text-xs mt-0.5">50+ Verified Bookings</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-white/40">Includes</h3>
                                <ul className="space-y-3">
                                    {artist.equipment.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-white/70 text-sm font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                artistName={artist.name}
                artistId={artist.id}
                artistImage={artist.image}
                artistPrice={artist.price}
            />
        </div>
    );
}
