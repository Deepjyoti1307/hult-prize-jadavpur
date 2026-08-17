'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ClientSidebar from '@/components/ClientSidebar';
import { useAuth } from '@/contexts/auth-context';
import { getClientGuardRedirect } from '@/lib/routing';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { profile, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (!profile) {
            router.replace('/login?type=client');
            return;
        }
        if (profile.role && profile.role !== 'client') {
            router.replace('/artist/dashboard');
            return;
        }

        const redirect = getClientGuardRedirect(pathname, profile);
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

    return (
        <div className="flex min-h-screen bg-[#0a0a0f]">
            <ClientSidebar />
            <div className="flex-1 w-full bg-[#0a0a0f] relative overflow-hidden">
                {children}
            </div>
        </div>
    );
}
