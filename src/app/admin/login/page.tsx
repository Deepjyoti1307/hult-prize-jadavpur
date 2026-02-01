'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { BoxReveal } from '@/components/ui/modern-animated-sign-in';

const ADMIN_EMAIL_ALLOWLIST = ['tarang130704@gmail.com'];

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loading) return;
        setError('');
        setLoading(true);
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const userEmail = credential.user.email ?? '';
            const adminRef = doc(db, 'Admin', credential.user.uid);
            const adminSnap = await getDoc(adminRef);
            if (!ADMIN_EMAIL_ALLOWLIST.includes(userEmail) || !adminSnap.exists()) {
                await signOut(auth);
                setError('This account is not authorized for admin access.');
                return;
            }
            router.replace('/admin');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unable to sign in.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <BoxReveal boxColor="var(--skeleton)" duration={0.3}>
                    <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                </BoxReveal>
                <BoxReveal boxColor="var(--skeleton)" duration={0.3}>
                    <p className="text-white/60 text-sm mt-2">Sign in with admin credentials</p>
                </BoxReveal>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-white/70">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent/50"
                            placeholder="admin@tarang.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-white/70">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent/50"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all disabled:opacity-60"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </main>
    );
}
