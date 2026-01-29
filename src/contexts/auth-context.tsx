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
    query,
    serverTimestamp,
    setDoc,
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

export type UserProfile = {
    uid: string;
    name?: string;
    email?: string;
    role?: 'artist' | 'client' | string;
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
    artistVerification?: Record<string, boolean>;
    clientVerification?: Record<string, boolean>;
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
    toggleFavorite: (artist: ArtistProfile) => Promise<void>;
    createBooking: (input: Omit<Booking, 'id' | 'clientId' | 'status'> & { status?: Booking['status'] }) => Promise<void>;
    updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
    deleteBooking: (bookingId: string) => Promise<void>;
    refreshProfile: () => Promise<void>;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
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
                setProfile(null);
                setFavorites([]);
                setBookings([]);
                setArtistBookings([]);
                setLoading(false);
                return;
            }

            try {
                await ensureUserDocuments(authUser);
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
        });

        return () => {
            unsubscribeAuth();
            unsubscribeProfile?.();
            unsubscribeFavorites?.();
            unsubscribeBookings?.();
            unsubscribeArtistBookings?.();
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
            toggleFavorite,
            createBooking,
            updateBookingStatus,
            deleteBooking,
            refreshProfile,
            setProfile,
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
