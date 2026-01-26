'use client';

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
    AlertCircle,
    Music2,
} from 'lucide-react';

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

    return (
        <aside className="w-64 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center">
                        <Music2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">TARANG</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
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

            {/* Emergency Help */}
            <div className="p-4 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Emergency Help</span>
                </button>
            </div>
        </aside>
    );
}
