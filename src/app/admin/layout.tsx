'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const ADMIN_EMAIL_ALLOWLIST = ['tarang130704@gmail.com'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.replace('/admin/login');
                return;
            }
            const userEmail = user.email ?? '';
            const adminRef = doc(db, 'Admin', user.uid);
            const adminSnap = await getDoc(adminRef);
            if (!ADMIN_EMAIL_ALLOWLIST.includes(userEmail) || !adminSnap.exists()) {
                await signOut(auth);
                router.replace('/admin/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    return <>{children}</>;
}
