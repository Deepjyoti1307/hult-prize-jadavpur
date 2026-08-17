'use client';

import { Suspense } from 'react';
import MessagesView from '@/components/messaging/MessagesView';

function MessagesLoading() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/60">
            Loading messages...
        </div>
    );
}

export default function ArtistMessages() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] relative font-sans">
            <Suspense fallback={<MessagesLoading />}>
                <MessagesView
                    emptyStateSubtitle="Messages appear when clients contact you."
                    emptyStateActionLabel="View bookings"
                    emptyStateActionHref="/artist/bookings"
                />
            </Suspense>
        </div>
    );
}
