'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Home,
    Calendar,
    MessageSquare,
    Wallet,
    Shield,
    Settings,
    Siren,
    Menu,
    X,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const navigationItems = [
    { name: 'Home', href: '/artist/dashboard', icon: Home },
    { name: 'Bookings', href: '/artist/bookings', icon: Calendar },
    { name: 'Messages', href: '/artist/messages', icon: MessageSquare, badge: 0 },
    { name: 'Earnings', href: '/artist/earnings', icon: Wallet },
    { name: 'Safety', href: '/artist/safety', icon: Shield },
    { name: 'Settings', href: '/artist/settings', icon: Settings },
];

export default function ArtistSidebar() {
    const pathname = usePathname();
    const { profile } = useAuth();
    const isApproved = profile?.adminApproval?.status === 'approved';
    const [open, setOpen] = useState(false);

    const visibleItems = isApproved
        ? navigationItems
        : navigationItems.filter((item) => item.href !== '/artist/dashboard');

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed top-5 left-5 z-50 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-white/90 border border-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:bg-white/15 hover:scale-105 active:scale-95 transition-all duration-200"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {open && (
                <button
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50"
                    aria-label="Close menu overlay"
                />
            )}

            <aside
                className={cn(
                    'w-64 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col fixed top-0 left-0 z-50 transition-transform',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white border border-white/20"
                    aria-label="Close menu"
                >
                    <X className="w-4 h-4" />
                </button>
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="flex flex-col">
                    <span className="text-2xl font-bold text-white italic">TARANG</span>
                    <span className="text-xs text-white/50">Where music finds its stage</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {visibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all group',
                                isActive
                                    ? 'bg-accent/20 text-white'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <Icon className={cn('w-5 h-5', isActive && 'text-accent')} />
                            <span className="font-medium">{item.name}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Emergency Button - Movie Style */}
            <div className="p-4 border-t border-white/10">
                <Link href="/artist/emergency" onClick={() => setOpen(false)}>
                    <div className="relative group cursor-pointer">
                        {/* Pulsing background glow */}
                        <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-lg group-hover:bg-red-500/30 transition-all animate-pulse" />

                        {/* Button */}
                        <div
                            className="relative w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 border-2 border-red-400/50 shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 group-hover:scale-[1.02] transition-all duration-300"
                            style={{
                                boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1), inset 0 -2px 10px rgba(0,0,0,0.2), 0 4px 20px rgba(239,68,68,0.4)',
                            }}
                        >
                            {/* Inner highlight */}
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-b from-white/20 to-transparent rounded-full" />

                            <Siren className="w-5 h-5 text-white group-hover:animate-pulse" />
                            <span className="font-bold text-white tracking-wide">SOS Emergency</span>
                        </div>
                    </div>
                </Link>
            </div>
        </aside>
        </>
    );
}
