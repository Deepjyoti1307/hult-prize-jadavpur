'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { profile, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (!profile) {
            router.replace('/login?type=artist');
            return;
        }
        if (profile.role && profile.role !== 'artist') {
            router.replace('/client/dashboard');
        }
    }, [loading, profile, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/60">
                Loading...
            </div>
        );
    }

    return <>{children}</>;
}