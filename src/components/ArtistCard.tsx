'use client';

import { motion } from 'motion/react';
import { Star, MapPin, Music, MessageCircle, Sparkles } from 'lucide-react';
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
    onChat?: () => void;
}

export default function ArtistCard({
    name,
    image,
    category,
    rating,
    location,
    price,
    onBook,
    onChat,
}: ArtistCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            viewport={{ once: true }}
            className="group relative rounded-3xl overflow-hidden"
        >
            {/* Glass border glow on hover */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-accent/30 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

            {/* Main card */}
            <div className="relative z-10 bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl overflow-hidden group-hover:border-white/[0.15] transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

                {/* Image Section */}
                <div className="relative h-52 w-full overflow-hidden">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Multi-layer gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-full text-[11px] font-semibold text-white/90 flex items-center gap-1.5 shadow-lg">
                        <Music className="w-3 h-3 text-accent" />
                        {category}
                    </span>

                    {/* Rating Badge */}
                    <span className="absolute top-4 right-4 px-2.5 py-1.5 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-xl text-[11px] font-bold text-white flex items-center gap-1 shadow-lg">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
                        {rating}
                    </span>

                    {/* Bottom name overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg group-hover:text-accent transition-colors duration-300 tracking-tight">
                            {name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-white/60 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {location}
                        </div>
                    </div>
                </div>

                {/* Bottom Glass Section */}
                <div className="p-5 pt-4 bg-gradient-to-b from-transparent to-white/[0.02]">
                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

                    <div className="flex items-end justify-between gap-3">
                        {/* Price */}
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-0.5">Starting from</p>
                            <p className="text-xl font-bold text-white">
                                ₹{price.toLocaleString()}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {onChat && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChat();
                                    }}
                                    className="px-3.5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-md border border-white/[0.1] hover:border-accent/30 rounded-xl text-white/70 hover:text-accent text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 group/chat"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 group-hover/chat:scale-110 transition-transform" />
                                    Chat
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onBook();
                                }}
                                className="px-4 py-2.5 bg-accent/20 hover:bg-accent text-accent hover:text-white border border-accent/30 hover:border-accent rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 hover:shadow-[0_0_20px_rgba(45,139,122,0.3)]"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
