'use client';

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

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

type AuthContextValue = {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    artists: ArtistProfile[];
    artistsLoading: boolean;
    favorites: ArtistProfile[];
    bookings: Booking[];
    artistBookings: Booking[];
    conversations: Conversation[];
    messages: Message[];
    activeConversationId: string | null;
    transactions: Transaction[];
    toggleFavorite: (artist: ArtistProfile) => Promise<void>;
    createBooking: (input: Omit<Booking, 'id' | 'clientId' | 'status'> & { status?: Booking['status'] }) => Promise<void>;
    updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
    deleteBooking: (bookingId: string) => Promise<void>;
    refreshProfile: () => Promise<void>;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    startConversation: (otherUserId: string, otherUserName: string, otherUserImage: string) => Promise<string>;
    sendMessage: (conversationId: string, text: string) => Promise<void>;
    setActiveConversationId: (id: string | null) => void;
    markConversationRead: (conversationId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState<ArtistProfile[]>([]);
    const [artistsLoading, setArtistsLoading] = useState(true);
    const [favorites, setFavorites] = useState<ArtistProfile[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [artistBookings, setArtistBookings] = useState<Booking[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const artistsRef = collection(db, 'artists');
        const unsubscribeArtists = onSnapshot(
            artistsRef,
            (snapshot) => {
                const items = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...(docSnap.data() as Omit<ArtistProfile, 'id'>),
                }));
                setArtists(items);
                setArtistsLoading(false);
            },
            () => {
                setArtists([]);
                setArtistsLoading(false);
            }
        );

        return () => unsubscribeArtists();
    }, []);

    useEffect(() => {
        const ensureUserDocuments = async (authUser: User) => {
            const userRef = doc(db, 'users', authUser.uid);
            const userSnap = await getDoc(userRef);
            let role = userSnap.exists()
                ? (userSnap.data() as UserProfile).role
                : undefined;

            if (!role) {
                const artistRef = doc(db, 'artists', authUser.uid);
                const artistSnap = await getDoc(artistRef);
                role = artistSnap.exists() ? 'artist' : 'client';
            }

            if (!userSnap.exists()) {
                await setDoc(
                    userRef,
                    {
                        uid: authUser.uid,
                        name:
                            authUser.displayName ||
                            authUser.email?.split('@')[0] ||
                            '',
                        email: authUser.email ?? '',
                        role,
                        createdAt: serverTimestamp(),
                        firstLoginAt: serverTimestamp(),
                    },
                    { merge: true }
                );
            } else if (!(userSnap.data() as UserProfile).role && role) {
                await setDoc(
                    userRef,
                    {
                        role,
                        updatedAt: serverTimestamp(),
                    },
                    { merge: true }
                );
            } else if (!(userSnap.data() as UserProfile).firstLoginAt) {
                const existingCreatedAt = (userSnap.data() as UserProfile).createdAt;
                await setDoc(
                    userRef,
                    {
                        firstLoginAt: existingCreatedAt ?? serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    },
                    { merge: true }
                );
            }

            if (role === 'artist') {
                const artistRef = doc(db, 'artists', authUser.uid);
                const artistSnap = await getDoc(artistRef);
                if (!artistSnap.exists()) {
                    await setDoc(
                        artistRef,
                        {
                            name:
                                authUser.displayName ||
                                authUser.email?.split('@')[0] ||
                                'Artist',
                            category: 'Live Music',
                            image:
                                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2664&auto=format&fit=crop',
                            rating: 4.8,
                            location: 'India',
                            price: 15000,
                            ownerId: authUser.uid,
                            createdAt: serverTimestamp(),
                        },
                        { merge: true }
                    );
                }
            } else {
                const clientRef = doc(db, 'clients', authUser.uid);
                const clientSnap = await getDoc(clientRef);
                if (!clientSnap.exists()) {
                    await setDoc(
                        clientRef,
                        {
                            uid: authUser.uid,
                            name:
                                authUser.displayName ||
                                authUser.email?.split('@')[0] ||
                                'Client',
                            email: authUser.email ?? '',
                            createdAt: serverTimestamp(),
                        },
                        { merge: true }
                    );
                }
            }
        };

        let unsubscribeProfile: (() => void) | null = null;
        let unsubscribeFavorites: (() => void) | null = null;
        let unsubscribeBookings: (() => void) | null = null;
        let unsubscribeArtistBookings: (() => void) | null = null;
        let unsubscribeConversations: (() => void) | null = null;
        let unsubscribeMessages: (() => void) | null = null;
        let unsubscribeTransactions: (() => void) | null = null;
        const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
            setUser(authUser);
            setLoading(true);

            if (!authUser) {
                unsubscribeProfile?.();
                unsubscribeProfile = null;
                unsubscribeFavorites?.();
                unsubscribeFavorites = null;
                unsubscribeBookings?.();
                unsubscribeBookings = null;
                unsubscribeArtistBookings?.();
                unsubscribeArtistBookings = null;
                unsubscribeConversations?.();
                unsubscribeConversations = null;
                unsubscribeMessages?.();
                unsubscribeMessages = null;
                unsubscribeTransactions?.();
                unsubscribeTransactions = null;
                setProfile(null);
                setFavorites([]);
                setBookings([]);
                setArtistBookings([]);
                setConversations([]);
                setMessages([]);
                setTransactions([]);
                setActiveConversationId(null);
                setLoading(false);
                return;
            }

            try {
                await ensureUserDocuments(authUser);
                await setDoc(
                    doc(db, 'users', authUser.uid),
                    { lastLoginAt: serverTimestamp() },
                    { merge: true }
                );
            } catch {
                setLoading(false);
            }

            const profileRef = doc(db, 'users', authUser.uid);
            unsubscribeProfile?.();
            unsubscribeProfile = onSnapshot(
                profileRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.data() as UserProfile;
                        setProfile({
                            uid: authUser.uid,
                            name:
                                data.name ||
                                authUser.displayName ||
                                authUser.email?.split('@')[0] ||
                                '',
                            email: data.email ?? authUser.email ?? '',
                            role: data.role,
                            category: data.category,
                            bio: data.bio,
                            photoURL: data.photoURL,
                            phoneNumber: data.phoneNumber ?? authUser.phoneNumber ?? undefined,
                            location: data.location,
                            artistVerification: data.artistVerification,
                            clientVerification: data.clientVerification,
                            createdAt: data.createdAt,
                            updatedAt: data.updatedAt,
                        });
                    } else {
                        setProfile({
                            uid: authUser.uid,
                            name: authUser.displayName ?? '',
                            email: authUser.email ?? '',
                            role: undefined,
                            phoneNumber: authUser.phoneNumber ?? undefined,
                        });
                    }
                    setLoading(false);
                },
                () => {
                    setProfile(null);
                    setLoading(false);
                }
            );

            const favoritesRef = collection(db, 'users', authUser.uid, 'favorites');
            unsubscribeFavorites?.();
            unsubscribeFavorites = onSnapshot(
                favoritesRef,
                (snapshot) => {
                    const items = snapshot.docs.map((docSnap) => ({
                        id: docSnap.id,
                        ...(docSnap.data() as Omit<ArtistProfile, 'id'>),
                    }));
                    setFavorites(items);
                },
                () => setFavorites([])
            );

            const bookingsRef = query(
                collection(db, 'bookings'),
                where('clientId', '==', authUser.uid)
            );
            unsubscribeBookings?.();
            unsubscribeBookings = onSnapshot(
                bookingsRef,
                (snapshot) => {
                    const items = snapshot.docs.map((docSnap) => ({
                        id: docSnap.id,
                        ...(docSnap.data() as Omit<Booking, 'id'>),
                    }));
                    setBookings(items);
                },
                () => setBookings([])
            );

            const artistBookingsRef = query(
                collection(db, 'bookings'),
                where('artistId', '==', authUser.uid)
            );
            unsubscribeArtistBookings?.();
            unsubscribeArtistBookings = onSnapshot(
                artistBookingsRef,
                (snapshot) => {
                    const items = snapshot.docs.map((docSnap) => ({
                        id: docSnap.id,
                        ...(docSnap.data() as Omit<Booking, 'id'>),
                    }));
                    setArtistBookings(items);
                },
                () => setArtistBookings([])
            );

            // Conversations listener
            const conversationsRef = query(
                collection(db, 'conversations'),
                where('participants', 'array-contains', authUser.uid),
                orderBy('lastMessageAt', 'desc')
            );
            unsubscribeConversations?.();
            unsubscribeConversations = onSnapshot(
                conversationsRef,
                (snapshot) => {
                    const items = snapshot.docs.map((docSnap) => ({
                        id: docSnap.id,
                        ...(docSnap.data() as Omit<Conversation, 'id'>),
                    }));
                    setConversations(items);
                },
                () => setConversations([])
            );

            // Transactions listener (for artists)
            const transactionsRef = query(
                collection(db, 'transactions'),
                where('artistId', '==', authUser.uid),
                orderBy('createdAt', 'desc')
            );
            unsubscribeTransactions?.();
            unsubscribeTransactions = onSnapshot(
                transactionsRef,
                (snapshot) => {
                    const items = snapshot.docs.map((docSnap) => ({
                        id: docSnap.id,
                        ...(docSnap.data() as Omit<Transaction, 'id'>),
                    }));
                    setTransactions(items);
                },
                () => setTransactions([])
            );
        });

        return () => {
            unsubscribeAuth();
            unsubscribeProfile?.();
            unsubscribeFavorites?.();
            unsubscribeBookings?.();
            unsubscribeArtistBookings?.();
            unsubscribeConversations?.();
            unsubscribeMessages?.();
            unsubscribeTransactions?.();
        };
    }, []);

    const toggleFavorite = async (artist: ArtistProfile) => {
        if (!user) return;
        const favoriteRef = doc(db, 'users', user.uid, 'favorites', artist.id);
        const exists = favorites.some((fav) => fav.id === artist.id);
        if (exists) {
            await deleteDoc(favoriteRef);
        } else {
            await setDoc(
                favoriteRef,
                {
                    name: artist.name,
                    category: artist.category,
                    image: artist.image,
                    rating: artist.rating,
                    location: artist.location,
                    price: artist.price,
                    ownerId: artist.ownerId ?? null,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );
        }
    };

    const createBooking = async (
        input: Omit<Booking, 'id' | 'clientId' | 'status'> & { status?: Booking['status'] }
    ) => {
        if (!user) return;
        await addDoc(collection(db, 'bookings'), {
            ...input,
            clientId: user.uid,
            clientName:
                profile?.name ||
                user.displayName ||
                user.email?.split('@')[0] ||
                'Client',
            eventType: input.eventType ?? 'Live Event',
            status: input.status ?? 'Pending',
            createdAt: serverTimestamp(),
        });
    };

    const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
        await setDoc(
            doc(db, 'bookings', bookingId),
            { status, updatedAt: serverTimestamp() },
            { merge: true }
        );
    };

    const deleteBooking = async (bookingId: string) => {
        await deleteDoc(doc(db, 'bookings', bookingId));
    };

    const refreshProfile = async () => {
        if (!user) return;
        const profileRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(profileRef);
        if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            setProfile({
                uid: user.uid,
                name:
                    data.name ||
                    user.displayName ||
                    user.email?.split('@')[0] ||
                    '',
                email: data.email ?? user.email ?? '',
                role: data.role,
                phoneNumber: data.phoneNumber ?? user.phoneNumber ?? undefined,
                location: data.location,
                artistVerification: data.artistVerification,
                clientVerification: data.clientVerification,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            });
        }
    };

    // Listen for messages when activeConversationId changes
    useEffect(() => {
        if (!activeConversationId || !user) {
            setMessages([]);
            return;
        }

        const messagesRef = query(
            collection(db, 'conversations', activeConversationId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(
            messagesRef,
            (snapshot) => {
                const items = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...(docSnap.data() as Omit<Message, 'id'>),
                }));
                setMessages(items);
            },
            () => setMessages([])
        );

        return () => unsubscribe();
    }, [activeConversationId, user]);

    // Start or get existing conversation
    const startConversation = async (
        otherUserId: string,
        otherUserName: string,
        otherUserImage: string
    ): Promise<string> => {
        if (!user || !profile) throw new Error('Not authenticated');

        // Check if conversation already exists
        const existingConvo = conversations.find(
            (c) => c.participants.includes(otherUserId) && c.participants.includes(user.uid)
        );
        if (existingConvo) return existingConvo.id;

        // Create new conversation
        const convoRef = await addDoc(collection(db, 'conversations'), {
            participants: [user.uid, otherUserId],
            participantNames: {
                [user.uid]: profile.name || 'User',
                [otherUserId]: otherUserName,
            },
            participantImages: {
                [user.uid]: `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name || 'User'}`,
                [otherUserId]: otherUserImage,
            },
            lastMessage: '',
            lastMessageAt: serverTimestamp(),
            lastSenderId: user.uid,
            unreadCount: {
                [user.uid]: 0,
                [otherUserId]: 0,
            },
            createdAt: serverTimestamp(),
        });

        return convoRef.id;
    };

    // Send a message
    const sendMessage = async (conversationId: string, text: string): Promise<void> => {
        if (!user) return;

        // Add message to subcollection
        await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
            conversationId,
            senderId: user.uid,
            text,
            createdAt: serverTimestamp(),
            read: false,
        });

        // Get the other participant to update unread count
        let convo = conversations.find((c) => c.id === conversationId);
        if (!convo) {
            const convoSnap = await getDoc(doc(db, 'conversations', conversationId));
            if (convoSnap.exists()) {
                convo = {
                    id: convoSnap.id,
                    ...(convoSnap.data() as Omit<Conversation, 'id'>),
                };
            }
        }
        const otherUserId = convo?.participants.find((p) => p !== user.uid);

        // Update conversation with last message
        await setDoc(
            doc(db, 'conversations', conversationId),
            {
                lastMessage: text,
                lastMessageAt: serverTimestamp(),
                lastSenderId: user.uid,
                ...(otherUserId && {
                    [`unreadCount.${otherUserId}`]: (convo?.unreadCount?.[otherUserId] || 0) + 1,
                }),
            },
            { merge: true }
        );
    };

    // Mark conversation as read
    const markConversationRead = async (conversationId: string): Promise<void> => {
        if (!user) return;

        await setDoc(
            doc(db, 'conversations', conversationId),
            {
                [`unreadCount.${user.uid}`]: 0,
            },
            { merge: true }
        );
    };

    const value = useMemo(
        () => ({
            user,
            profile,
            loading,
            artists,
            artistsLoading,
            favorites,
            bookings,
            artistBookings,
            conversations,
            messages,
            activeConversationId,
            transactions,
            toggleFavorite,
            createBooking,
            updateBookingStatus,
            deleteBooking,
            refreshProfile,
            setProfile,
            startConversation,
            sendMessage,
            setActiveConversationId,
            markConversationRead,
        }),
        [
            user,
            profile,
            loading,
            artists,
            artistsLoading,
            favorites,
            bookings,
            artistBookings,
            conversations,
            messages,
            activeConversationId,
            transactions,
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
