'use client';

import { useEffect, useMemo, useState } from 'react';
import { onSnapshot, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { CheckCircle2, XCircle, ShieldCheck, Users } from 'lucide-react';

type UserDoc = {
    id: string;
    name?: string;
    email?: string;
    role?: 'artist' | 'client' | string;
    lastLoginAt?: unknown;
    artistVerification?: Record<string, boolean>;
    clientVerification?: Record<string, boolean>;
    adminApproval?: {
        status?: 'approved' | 'rejected' | 'pending';
        reviewedAt?: unknown;
    };
};

export default function AdminPage() {
    const [users, setUsers] = useState<UserDoc[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const items = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...(docSnap.data() as Omit<UserDoc, 'id'>),
            }));
            setUsers(items);
        });

        return () => unsubscribe();
    }, []);

    const artistRequests = useMemo(
        () => users.filter((user) => user.role === 'artist' && !user.adminApproval?.status),
        [users]
    );
    const clientRequests = useMemo(
        () => users.filter((user) => user.role === 'client' && !user.adminApproval?.status),
        [users]
    );

    const reviewedUsers = useMemo(
        () => users.filter((user) => Boolean(user.adminApproval?.status)),
        [users]
    );

    const formatTimestamp = (value?: unknown) => {
        if (!value) return '—';
        const anyValue = value as { toDate?: () => Date };
        if (anyValue.toDate) {
            return anyValue.toDate().toLocaleString();
        }
        return String(value);
    };

    const handleReview = async (userId: string, status: 'approved' | 'rejected') => {
        await setDoc(
            doc(db, 'users', userId),
            {
                adminApproval: {
                    status,
                    reviewedAt: serverTimestamp(),
                },
            },
            { merge: true }
        );
    };

    return (
        <main className="min-h-screen bg-[#0a0a0f] px-6 py-10">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-white/60">Review artist and client onboarding requests</p>
                    </div>
                    <button
                        onClick={() => signOut(auth)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition"
                    >
                        Logout
                    </button>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="w-5 h-5 text-accent" />
                            <h2 className="text-white font-semibold">Artist Requests</h2>
                        </div>
                        {artistRequests.length === 0 ? (
                            <p className="text-white/50">No artist requests yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {artistRequests.map((artist) => (
                                    <div key={artist.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{artist.name || 'Artist'}</p>
                                                <p className="text-white/50 text-sm">{artist.email}</p>
                                            </div>
                                            <span className="text-xs text-white/60">
                                                {artist.adminApproval?.status || 'pending'}
                                            </span>
                                        </div>
                                        <div className="mt-3 text-xs text-white/60">
                                            Verification: {
                                                artist.artistVerification
                                                    ? Object.entries(artist.artistVerification)
                                                        .map(([key, value]) => `${key}: ${value ? 'yes' : 'no'}`)
                                                        .join(' • ')
                                                    : 'not submitted'
                                            }
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <button
                                                onClick={() => handleReview(artist.id, 'approved')}
                                                className="flex-1 py-2 rounded-lg bg-accent/80 hover:bg-accent text-white text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReview(artist.id, 'rejected')}
                                                className="flex-1 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-medium"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-5 h-5 text-accent" />
                            <h2 className="text-white font-semibold">Client Requests</h2>
                        </div>
                        {clientRequests.length === 0 ? (
                            <p className="text-white/50">No client requests yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {clientRequests.map((client) => (
                                    <div key={client.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{client.name || 'Client'}</p>
                                                <p className="text-white/50 text-sm">{client.email}</p>
                                            </div>
                                            <span className="text-xs text-white/60">
                                                {client.adminApproval?.status || 'pending'}
                                            </span>
                                        </div>
                                        <div className="mt-3 text-xs text-white/60">
                                            Verification: {
                                                client.clientVerification
                                                    ? Object.entries(client.clientVerification)
                                                        .map(([key, value]) => `${key}: ${value ? 'yes' : 'no'}`)
                                                        .join(' • ')
                                                    : 'not submitted'
                                            }
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <button
                                                onClick={() => handleReview(client.id, 'approved')}
                                                className="flex-1 py-2 rounded-lg bg-accent/80 hover:bg-accent text-white text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReview(client.id, 'rejected')}
                                                className="flex-1 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-medium"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        <h2 className="text-white font-semibold">Reviewed Users</h2>
                    </div>
                    {reviewedUsers.length === 0 ? (
                        <p className="text-white/50">No reviewed users yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviewedUsers.map((user) => (
                                <div key={user.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">{user.name || 'User'}</p>
                                            <p className="text-white/50 text-sm">{user.email}</p>
                                        </div>
                                        <span className="text-xs text-white/60">
                                            {user.adminApproval?.status}
                                        </span>
                                    </div>
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/60">
                                        <div>Role: {user.role ?? 'unknown'}</div>
                                        <div>Last login: {formatTimestamp(user.lastLoginAt)}</div>
                                        <div>Reviewed: {formatTimestamp(user.adminApproval?.reviewedAt)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
