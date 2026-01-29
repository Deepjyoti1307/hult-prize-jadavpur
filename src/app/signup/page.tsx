'use client';
import { useEffect, useState, ChangeEvent, FormEvent, ReactNode, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
    Ripple,
    TechOrbitDisplay,
    AnimatedForm,
    BoxReveal,
} from '@/components/ui/modern-animated-sign-in';
import Footer from '@/components/Footer';
import {
    Music,
    Music2,
    Music3,
    Music4,
    Mic,
    Headphones,
    Piano,
    Disc3,
    Radio,
} from 'lucide-react';

type FormData = {
    name: string;
    email: string;
    password: string;
};

interface OrbitIcon {
    component: () => ReactNode;
    className: string;
    duration?: number;
    delay?: number;
    radius?: number;
    path?: boolean;
    reverse?: boolean;
}

// Musical notes and instruments orbiting around TARANG
const iconsArray: OrbitIcon[] = [
    {
        component: () => <Music className="w-6 h-6 text-accent" />,
        className: 'size-[40px] border-none bg-white/10 backdrop-blur-sm',
        duration: 20,
        delay: 0,
        radius: 100,
        path: false,
        reverse: false,
    },
    {
        component: () => <Music2 className="w-6 h-6 text-white" />,
        className: 'size-[40px] border-none bg-white/10 backdrop-blur-sm',
        duration: 20,
        delay: 10,
        radius: 100,
        path: false,
        reverse: false,
    },
    {
        component: () => <Mic className="w-7 h-7 text-accent" />,
        className: 'size-[50px] border-none bg-white/10 backdrop-blur-sm',
        radius: 160,
        duration: 25,
        delay: 5,
        path: false,
        reverse: true,
    },
    {
        component: () => <Headphones className="w-7 h-7 text-white" />,
        className: 'size-[50px] border-none bg-white/10 backdrop-blur-sm',
        radius: 160,
        duration: 25,
        delay: 17,
        path: false,
        reverse: true,
    },
    {
        component: () => <Music3 className="w-5 h-5 text-accent-light" />,
        className: 'size-[35px] border-none bg-white/10 backdrop-blur-sm',
        duration: 22,
        delay: 0,
        radius: 130,
        path: false,
        reverse: true,
    },
    {
        component: () => <Music4 className="w-5 h-5 text-white/80" />,
        className: 'size-[35px] border-none bg-white/10 backdrop-blur-sm',
        duration: 22,
        delay: 11,
        radius: 130,
        path: false,
        reverse: true,
    },
    {
        component: () => <Disc3 className="w-8 h-8 text-accent" />,
        className: 'size-[55px] border-none bg-white/10 backdrop-blur-sm',
        radius: 210,
        duration: 30,
        delay: 0,
        path: false,
        reverse: false,
    },
    {
        component: () => <Radio className="w-8 h-8 text-white" />,
        className: 'size-[55px] border-none bg-white/10 backdrop-blur-sm',
        radius: 210,
        duration: 30,
        delay: 15,
        path: false,
        reverse: false,
    },
    {
        component: () => <Piano className="w-6 h-6 text-accent" />,
        className: 'size-[45px] border-none bg-white/10 backdrop-blur-sm',
        radius: 250,
        duration: 35,
        delay: 8,
        path: false,
        reverse: true,
    },
];

export default function SignupPage() {
    return (
        <Suspense fallback={<SignupLoading />}>
            <SignupContent />
        </Suspense>
    );
}

function SignupLoading() {
    return (
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="text-white/60">Loading...</div>
        </main>
    );
}

function SignupContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialType = (searchParams.get('type') || 'client') as 'client' | 'artist';
    const [userType, setUserType] = useState<'client' | 'artist'>(initialType);
    const onboardingRoute =
        userType === 'artist' ? '/artist/onboarding' : '/onboarding/client';

    useEffect(() => {
        setUserType(initialType);
    }, [initialType]);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const goToLogin = (
        event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
        event.preventDefault();
        // Preserve user type when navigating to login
        router.push(`/login?type=${userType}`);
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>,
        name: keyof FormData
    ) => {
        const value = event.target.value;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;
        setErrorMessage('');
        setIsSubmitting(true);
        try {
            const credential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            await updateProfile(credential.user, { displayName: formData.name });
            await setDoc(
                doc(db, 'users', credential.user.uid),
                {
                    uid: credential.user.uid,
                    name: formData.name,
                    email: formData.email,
                    role: userType,
                    createdAt: serverTimestamp(),
                },
                { merge: true }
            );

            if (userType === 'artist') {
                await setDoc(
                    doc(db, 'artists', credential.user.uid),
                    {
                        name: formData.name,
                        category: 'Live Music',
                        image:
                            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2664&auto=format&fit=crop',
                        rating: 4.8,
                        location: 'India',
                        price: 15000,
                        ownerId: credential.user.uid,
                        createdAt: serverTimestamp(),
                    },
                    { merge: true }
                );
            }

            router.replace(onboardingRoute);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unable to create account. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignup = async () => {
        if (isSubmitting) return;
        setErrorMessage('');
        setIsSubmitting(true);
        try {
            const provider = new GoogleAuthProvider();
            const credential = await signInWithPopup(auth, provider);
            await setDoc(
                doc(db, 'users', credential.user.uid),
                {
                    uid: credential.user.uid,
                    name: credential.user.displayName ?? '',
                    email: credential.user.email ?? '',
                    role: userType,
                    createdAt: serverTimestamp(),
                },
                { merge: true }
            );

            if (userType === 'artist') {
                await setDoc(
                    doc(db, 'artists', credential.user.uid),
                    {
                        name: credential.user.displayName ?? 'Artist',
                        category: 'Live Music',
                        image:
                            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2664&auto=format&fit=crop',
                        rating: 4.8,
                        location: 'India',
                        price: 15000,
                        ownerId: credential.user.uid,
                        createdAt: serverTimestamp(),
                    },
                    { merge: true }
                );
            }

            router.replace(onboardingRoute);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unable to sign up with Google.';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formFields = {
        header: userType === 'artist' ? 'Join as Artist' : 'Book an Artist',
        subHeader: userType === 'artist'
            ? 'Create your artist account to showcase your talent'
            : 'Create your account to discover and book amazing artists',
        fields: [
            {
                label: 'Name',
                required: true,
                type: 'text' as const,
                placeholder: 'Enter your full name',
                onChange: (event: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(event, 'name'),
            },
            {
                label: 'Email',
                required: true,
                type: 'email' as const,
                placeholder: 'Enter your email address',
                onChange: (event: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(event, 'email'),
            },
            {
                label: 'Password',
                required: true,
                type: 'password' as const,
                placeholder: 'Create a password',
                onChange: (event: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(event, 'password'),
            },
        ],
        submitButton: 'Create Account',
        textVariantButton: 'Already have an account? Sign in',
    };

    return (
        <main className="min-h-screen bg-[#0a0a0f]">
            {/* Gradient overlays matching landing page */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/30 pointer-events-none" />

            <section className="relative flex max-lg:justify-center min-h-screen">
                {/* Left Side - Orbiting Musical Notes */}
                <span className="flex flex-col justify-center w-1/2 max-lg:hidden relative">
                    <Ripple mainCircleSize={100} />
                    <TechOrbitDisplay iconsArray={iconsArray} text="TARANG" />
                </span>

                {/* Right Side - Signup Form with Glassmorphism */}
                <span className="w-1/2 h-[100dvh] flex flex-col justify-center items-center max-lg:w-full max-lg:px-[5%]">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-8 md:px-8 md:py-10 shadow-2xl">
                        <div className="mb-6 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => setUserType('client')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${userType === 'client'
                                    ? 'bg-accent/20 border-accent text-accent'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                I&apos;m a Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('artist')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${userType === 'artist'
                                    ? 'bg-accent/20 border-accent text-accent'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                I&apos;m an Artist
                            </button>
                        </div>
                        <AnimatedForm
                            {...formFields}
                            fieldPerRow={1}
                            onSubmit={handleSubmit}
                            goTo={goToLogin}
                            googleLogin="Sign up with Google"
                            onGoogleLogin={handleGoogleSignup}
                            errorField={errorMessage}
                        />
                    </div>
                </span>
            </section>

            <Footer />
        </main>
    );
}
