'use client';

import { motion } from 'motion/react';
import { Star, MapPin, Music } from 'lucide-react';
import Image from 'next/image';

interface ArtistCardProps {
    id: string;
    name: string;
    image: string;
    category: string;
    rating: number;
    location: string;
    price: number;
    onBook: () => void;
}

export default function ArtistCard({
    name,
    image,
    category,
    rating,
    location,
    price,
    onBook,
}: ArtistCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />

                {/* Category Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium text-white flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-accent" />
                    {category}
                </span>

                {/* Rating Badge */}
                <span className="absolute top-4 right-4 px-2 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {rating}
                </span>
            </div>

            {/* Content Section */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors">
                    {name}
                </h3>

                <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {location}
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Starting from</p>
                        <p className="text-white font-bold">₹{price.toLocaleString()}</p>
                    </div>

                    <button
                        onClick={onBook}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 hover:text-white border border-white/10 rounded-xl text-white/80 text-sm font-medium transition-all"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
