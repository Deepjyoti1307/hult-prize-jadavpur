export type ArtistProfile = {
    id: string;
    name: string;
    category: string;
    image: string;
    rating: number;
    location: string;
    price: number;
    ownerId?: string;
};

export type Booking = {
    id: string;
    clientId: string;
    clientName?: string;
    artistId: string;
    artistName: string;
    artistImage: string;
    eventType?: string;
    date: string;
    time: string;
    durationHours: number;
    location: string;
    fee?: number;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | string;
    createdAt?: unknown;
};

export type Message = {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt?: unknown;
    read?: boolean;
};

export type Conversation = {
    id: string;
    participants: string[];
    participantNames: Record<string, string>;
    participantImages: Record<string, string>;
    lastMessage?: string;
    lastMessageAt?: unknown;
    lastSenderId?: string;
    unreadCount?: Record<string, number>;
    createdAt?: unknown;
};

export type Transaction = {
    id: string;
    artistId: string;
    clientId: string;
    clientName: string;
    bookingId?: string;
    amount: number;
    type: 'Gig Payment' | 'Advance' | 'Withdrawal' | 'Refund' | string;
    status: 'Completed' | 'Processing' | 'Pending' | 'Failed' | string;
    createdAt?: unknown;
};

export type UserProfile = {
    uid: string;
    name?: string;
    email?: string;
    role?: 'artist' | 'client' | string;
    category?: string;
    bio?: string;
    photoURL?: string;
    adminApproval?: {
        status?: 'pending' | 'approved' | 'rejected' | string;
        requestedAt?: unknown;
        reviewedAt?: unknown;
        reviewedBy?: string;
    };
    phoneNumber?: string;
    location?: {
        address: string;
        coords: { lat: number; lng: number } | null;
    };
    stats?: {
        upcomingGigs?: number;
        pendingRequests?: number;
        walletBalance?: number;
    };
    pendingRequests?: Array<{
        id: string;
        clientName: string;
        eventType: string;
        status: 'escrow-secured' | 'pending-payment' | 'pending' | 'cancelled' | string;
        dateLabel: string;
        locationLabel: string;
        fee: number;
        initials?: string;
    }>;
    artistVerification?: {
        idProof?: boolean;
        introVideo?: boolean;
        performanceClip?: boolean;
        firstGig?: boolean;
        idProofUrl?: string;
        introVideoUrl?: string;
        performanceClipUrl?: string;
        introVideoLink?: string;
        performanceClipLink?: string;
    };
    clientVerification?: Record<string, boolean>;
    firstLoginAt?: unknown;
    createdAt?: unknown;
    updatedAt?: unknown;
};
