'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
    LayoutGrid,
    Search,
    Calendar,
    Heart,
    MessageSquare,
    Settings,
    LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const sidebarItems = [
    {
        icon: LayoutGrid,
        label: 'Discover',
        href: '/client/dashboard',
    },
    {
        icon: Search,
        label: 'Browse Artists',
        href: '/client/search',
    },
    {
        icon: Calendar,
        label: 'My Bookings',
        href: '/client/bookings',
    },
    {
        icon: Heart,
        label: 'Favorites',
        href: '/client/favorites',
    },
    {
        icon: MessageSquare,
        label: 'Messages',
        href: '/client/messages',
    },
];

export default function ClientSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/login?type=client');
    };

    return (
        <aside className="w-64 h-screen sticky top-0 bg-[#0a0a0f] border-r border-white/10 flex flex-col p-6">
            {/* Logo area */}
            <Link href="/" className="flex flex-col px-2 mb-10">
                <span className="text-2xl font-bold text-white italic">TARANG</span>
                <span className="text-xs text-white/50">Where music finds its stage</span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                                isActive
                                    ? 'text-white bg-white/10'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10 rounded-xl"
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <Icon className={cn('w-5 h-5 relative z-10', isActive ? 'text-accent' : '')} />
                            <span className="font-medium relative z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
