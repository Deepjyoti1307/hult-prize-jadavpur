'use client';

import PulsatingDots from '@/components/ui/pulsating-loader';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <PulsatingDots />
        </div>
    );
}
