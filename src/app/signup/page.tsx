'use client';
import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
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
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
    });

    const goToLogin = (
        event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
        event.preventDefault();
        window.location.href = '/login';
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
        console.log('Form submitted', formData);
        // Handle signup logic here
    };

    const formFields = {
        header: 'Join TARANG',
        subHeader: 'Create your account to connect with amazing artists',
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
                        <AnimatedForm
                            {...formFields}
                            fieldPerRow={1}
                            onSubmit={handleSubmit}
                            goTo={goToLogin}
                            googleLogin="Sign up with Google"
                        />
                    </div>
                </span>
            </section>

            <Footer />
        </main>
    );
}
