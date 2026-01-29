'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import {
    ArtistOnboarding,
    VerificationStep,
    VerificationBadge,
} from '@/components/ui/artist-onboarding';
import Footer from '@/components/Footer';
import {
    FileText,
    MapPin,
    ShieldCheck,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

// Google Form URL - Replace with your actual Google Form link
const GOOGLE_FORM_URL = 'https://forms.google.com/your-form-id';

// Google Form Confirmation Modal
function FormConfirmationModal({
    isOpen,
    onClose,
    onConfirm
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    const [formOpened, setFormOpened] = useState(false);

    const handleOpenForm = () => {
        window.open(GOOGLE_FORM_URL, '_blank');
        setFormOpened(true);
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
        setFormOpened(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Complete Your Profile</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-white/60" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Form Icon */}
                        <div className="flex justify-center py-4">
                            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                                <FileText className="w-10 h-10 text-accent" />
                            </div>
                        </div>

                        <p className="text-white/60 text-center text-sm">
                            {!formOpened
                                ? 'Click the button below to open the profile form. After filling it out, come back and confirm.'
                                : 'Have you completed filling out the form?'
                            }
                        </p>

                        {/* Step indicator */}
                        <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${formOpened ? 'bg-accent text-white' : 'bg-white/10 text-white/60'}`}>
                                1
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${formOpened ? 'text-white' : 'text-white/60'}`}>
                                    Open & Fill the Form
                                </p>
                            </div>
                            {formOpened && <CheckCircle2 className="w-5 h-5 text-accent" />}
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${!formOpened ? 'bg-white/10 text-white/40' : 'bg-white/10 text-white/60'}`}>
                                2
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${!formOpened ? 'text-white/40' : 'text-white/60'}`}>
                                    Confirm Submission
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!formOpened ? (
                            <button
                                onClick={handleOpenForm}
                                className="w-full py-3 bg-accent hover:bg-accent/80 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <FileText className="w-5 h-5" />
                                Open Profile Form
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={handleConfirm}
                                    className="w-full py-3 bg-accent hover:bg-accent/80 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    I&apos;ve Completed the Form
                                </button>
                                <button
                                    onClick={handleOpenForm}
                                    className="w-full py-3 border border-white/10 text-white/70 font-medium rounded-xl transition-colors hover:bg-white/5"
                                >
                                    Open Form Again
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Location Modal Component with Geolocation API
function LocationModal({
    isOpen,
    onClose,
    onSave
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (location: string, coords: { lat: number; lng: number }) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locationData, setLocationData] = useState<{
        address: string;
        coords: { lat: number; lng: number };
    } | null>(null);

    const requestLocation = () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocoding to get address from coordinates
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    const address = data.address;
                    const locationString = [
                        address.suburb || address.neighbourhood || address.village,
                        address.city || address.town || address.state_district,
                        address.state
                    ].filter(Boolean).join(', ');

                    setLocationData({
                        address: locationString || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                        coords: { lat: latitude, lng: longitude }
                    });
                } catch {
                    // If reverse geocoding fails, just use coordinates
                    setLocationData({
                        address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
                        coords: { lat: latitude, lng: longitude }
                    });
                }

                setIsLoading(false);
            },
            (err) => {
                setIsLoading(false);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError('Location permission denied. Please allow location access in your browser settings.');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError('Location information is unavailable.');
                        break;
                    case err.TIMEOUT:
                        setError('Location request timed out. Please try again.');
                        break;
                    default:
                        setError('An unknown error occurred.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleSave = () => {
        if (locationData) {
            onSave(locationData.address, locationData.coords);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Set Your Location</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-white/60" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Location Icon */}
                        <div className="flex justify-center py-4">
                            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                                <MapPin className="w-10 h-10 text-accent" />
                            </div>
                        </div>

                        <p className="text-white/60 text-center text-sm">
                            Allow location access to help us find artists near you
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Location Result */}
                        {locationData && (
                            <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/20 rounded-xl">
                                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                                <div>
                                    <p className="text-white font-medium text-sm">Location Found</p>
                                    <p className="text-white/60 text-xs">{locationData.address}</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {!locationData ? (
                            <button
                                onClick={requestLocation}
                                disabled={isLoading}
                                className="w-full py-3 bg-accent hover:bg-accent/80 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Getting Location...
                                    </>
                                ) : (
                                    <>
                                        <MapPin className="w-5 h-5" />
                                        Allow Location Access
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="w-full py-3 bg-accent hover:bg-accent/80 text-white font-medium rounded-xl transition-colors"
                            >
                                Confirm Location
                            </button>
                        )}

                        {locationData && (
                            <button
                                onClick={() => {
                                    setLocationData(null);
                                    requestLocation();
                                }}
                                className="w-full py-3 border border-white/10 text-white/70 font-medium rounded-xl transition-colors hover:bg-white/5"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default function ClientOnboardingPage() {
    const router = useRouter();
    const { user, profile } = useAuth();
    const userId = user?.uid ?? null;

    // Modal states
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    // User data
    const [userData, setUserData] = useState({
        location: '',
        coords: null as { lat: number; lng: number } | null,
    });

    // Verification status
    const [verificationStatus, setVerificationStatus] = useState({
        profile: false,
        location: false,
    });

    useEffect(() => {
        if (profile?.clientVerification) {
            setVerificationStatus({
                profile: Boolean(profile.clientVerification.profile),
                location: Boolean(profile.clientVerification.location),
            });
        }
        if (profile?.location?.address) {
            setUserData({
                location: profile.location.address,
                coords: profile.location.coords ?? null,
            });
        }
    }, [profile]);

    const saveClientProfile = async (
        updates: Partial<typeof verificationStatus>,
        dataUpdates?: { location?: { address: string; coords: { lat: number; lng: number } | null }; phoneNumber?: string }
    ) => {
        if (!userId) return;
        const profileRef = doc(db, 'users', userId);
        await setDoc(
            profileRef,
            {
                role: 'client',
                clientVerification: {
                    ...verificationStatus,
                    ...updates,
                },
                ...(dataUpdates ?? {}),
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );
    };

    // Handle Google Form completion confirmation
    const handleFormConfirm = () => {
        setVerificationStatus(prev => ({ ...prev, profile: true }));
        saveClientProfile({ profile: true });
    };

    // Build steps based on verification status
    const getSteps = (): VerificationStep[] => [
        {
            id: 'profile',
            icon: <FileText className="w-5 h-5 text-white/70" />,
            title: verificationStatus.profile ? 'Profile Form Submitted' : 'Complete Your Profile',
            description: verificationStatus.profile ? 'Form Completed' : 'Optional for now',
            status: verificationStatus.profile ? 'completed' : 'action',
            actionText: verificationStatus.profile ? undefined : 'Fill Form',
            onAction: () => setShowFormModal(true),
        },
        {
            id: 'location',
            icon: <MapPin className="w-5 h-5 text-white/70" />,
            title: verificationStatus.location ? 'Location Set' : 'Set Your Location',
            description: verificationStatus.location ? userData.location : 'Allow location access',
            status: verificationStatus.location ? 'completed' : 'action',
            actionText: verificationStatus.location ? undefined : 'Set',
            onAction: () => setShowLocationModal(true),
        },
    ];

    const badge: VerificationBadge = {
        icon: <ShieldCheck className="w-8 h-8 text-accent" />,
        title: 'Become a Verified Client',
        description: 'Get priority access to top artists and special discounts',
        actionText: 'Start Booking',
        onAction: () => handleStartBooking(),
    };

    const handleLocationSave = (location: string, coords: { lat: number; lng: number }) => {
        setUserData(prev => ({ ...prev, location, coords }));
        setVerificationStatus(prev => ({ ...prev, location: true }));
        saveClientProfile({ location: true }, { location: { address: location, coords } });
    };

    const handleStartBooking = () => {
        const allCompleted = verificationStatus.location;

        if (!allCompleted) {
            alert('Please set your location before continuing.');
            return;
        }

        // Save user data to localStorage for dashboard
        localStorage.setItem('userLocation', JSON.stringify({
            address: userData.location,
            coords: userData.coords,
        }));
        localStorage.setItem('onboardingComplete', 'true');

        saveClientProfile({ location: true, profile: verificationStatus.profile });

        console.log('Onboarding complete - redirecting to dashboard');
        router.push('/client/dashboard');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <main className="min-h-screen bg-[#0a0a0f]">
            {/* Gradient overlays matching landing page */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]/30 pointer-events-none" />

            {/* Main Content */}
            <section className="relative min-h-screen py-12 px-4 md:px-8">
                <div className="max-w-2xl mx-auto pt-8">
                    {/* Glassmorphism Container */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
                        <ArtistOnboarding
                            title="Welcome to TARANG"
                            subtitle="Complete your profile to start discovering amazing artists."
                            steps={getSteps()}
                            badge={badge}
                            onBack={handleBack}
                        />
                    </div>
                </div>
            </section>

            {/* Location Modal */}
            <LocationModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onSave={handleLocationSave}
            />

            {/* Form Confirmation Modal */}
            <FormConfirmationModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                onConfirm={handleFormConfirm}
            />

            <Footer />
        </main>
    );
}
