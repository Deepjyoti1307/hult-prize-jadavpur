'use client';

import { ArrowLeft, Star, MapPin, Music, Play, Share2, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import BookingModal from '@/components/BookingModal';

export default function ArtistDetailsPage({ params }: { params: { id: string } }) {
    const [bookingModalOpen, setBookingModalOpen] = useState(false);

    // Mock Data - In real app, fetch based on params.id
    const artist = {
        name: 'The Midnight Jazz',
        category: 'Jazz Band',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2664&auto=format&fit=crop',
        rating: 4.8,
        reviews: 124,
        location: 'Mumbai, MH',
        price: 15000,
        bio: 'The Midnight Jazz is a premium jazz ensemble based in Mumbai, specializing in smooth jazz, bossa nova, and classic standards. Perfect for corporate events, weddings, and upscale cocktail parties. With over 10 years of experience, we bring sophisticated ambience to any venue.',
        tags: ['Jazz', 'Live Music', 'Saxophone', 'Instrumental'],
        gallery: [
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2664&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1459749411177-d4a428948843?q=80&w=2670&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2670&auto=format&fit=crop',
        ]
    };

    return (
        <div className="min-h-screen relative">
            {/* Hero Image / Banner */}
            <div className="h-[40vh] w-full relative">
                <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />

                <Link href="/client/dashboard" className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Info */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{artist.name}</h1>
                                <div className="flex items-center gap-4 text-white/60">
                                    <span className="flex items-center gap-1.5">
                                        <Music className="w-4 h-4 text-accent" />
                                        {artist.category}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-accent" />
                                        {artist.location}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-pink-500 transition-all">
                                    <Heart className="w-5 h-5 fill-pink-500" />
                                </button>
                            </div>
                        </div>

                        {/* Rating Card */}
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-8">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-white font-bold">{artist.rating}</span>
                            <span className="text-white/40">({artist.reviews} reviews)</span>
                        </div>

                        {/* Bio */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-white mb-4">About the Artist</h2>
                            <p className="text-white/70 leading-relaxed text-lg">
                                {artist.bio}
                            </p>
                        </div>

                        {/* Gallery */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-white mb-4">Gallery</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {artist.gallery.map((img, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                                        <Image
                                            src={img}
                                            alt={`Gallery ${idx}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="w-full lg:w-[400px]">
                        <div className="sticky top-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-white/60 font-medium">Starting Price</span>
                                <span className="text-2xl font-bold text-white">₹{artist.price.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={() => setBookingModalOpen(true)}
                                className="w-full py-4 bg-accent hover:bg-accent-light text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 mb-4"
                            >
                                Book Now
                            </button>

                            <p className="text-center text-white/40 text-sm">
                                You won't be charged yet
                            </p>

                            <hr className="my-6 border-white/10" />

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-white/80">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-green-500" />
                                    </div>
                                    <span className="text-sm">Verified Artist</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/80">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Share2 className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <span className="text-sm">Instant Response</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                artistName={artist.name}
                artistImage={artist.image}
            />
        </div>
    );
}
