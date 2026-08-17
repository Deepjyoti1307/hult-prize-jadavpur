'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ArtistSidebar from '@/components/ArtistSidebar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/contexts/auth-context';
import { getArtistGuardRedirect } from '@/lib/routing';

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { profile, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (!profile) {
            router.replace('/login?type=artist');
            return;
        }
        if (profile.role && profile.role !== 'artist') {
            router.replace('/client/dashboard');
            return;
        }

        const redirect = getArtistGuardRedirect(pathname, profile);
        if (redirect && redirect !== pathname) {
            router.replace(redirect);
        }
    }, [loading, profile, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/60">
                Loading...
            </div>
        );
    }

    const showSidebar = pathname !== '/artist/onboarding' && pathname !== '/artist/verification-pending';

    return (
        <div className="flex min-h-screen bg-[#0a0a0f]">
            {showSidebar && (
                <>
                    <AnimatedBackground />
                    <ArtistSidebar />
                </>
            )}
            <div className="flex-1 w-full bg-[#0a0a0f] relative overflow-hidden">
                {children}
            </div>
        </div>
    );
}
