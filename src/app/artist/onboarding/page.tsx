'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArtistOnboarding,
    VerificationStep,
    VerificationBadge,
} from '@/components/ui/artist-onboarding';
import {
    FileUploadModal,
    OTPVerificationModal,
} from '@/components/ui/verification-modals';
import Footer from '@/components/Footer';
import {
    Phone,
    FileCheck,
    Video,
    Music,
    Star,
    ShieldCheck,
    IdCard,
} from 'lucide-react';

type UploadType = 'id-proof' | 'intro-video' | 'performance-clip' | null;

interface UploadConfig {
    title: string;
    description: string;
    acceptedTypes: string;
    maxSizeMB: number;
}

const uploadConfigs: Record<string, UploadConfig> = {
    'id-proof': {
        title: 'Upload ID Proof',
        description: 'Upload Aadhaar, PAN, Voter ID, or College ID (PDF or Image)',
        acceptedTypes: 'image/*,.pdf',
        maxSizeMB: 5,
    },
    'intro-video': {
        title: 'Upload Intro Video',
        description: 'Upload a brief self-introduction video (30 seconds to 2 minutes)',
        acceptedTypes: 'video/*',
        maxSizeMB: 50,
    },
    'performance-clip': {
        title: 'Upload Performance Clip',
        description: 'Showcase your talent with a performance video',
        acceptedTypes: 'video/*',
        maxSizeMB: 100,
    },
};

export default function ArtistOnboardingPage() {
    const router = useRouter();

    // Modal states
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [currentUpload, setCurrentUpload] = useState<UploadType>(null);

    // Verification status
    const [verificationStatus, setVerificationStatus] = useState({
        mobile: false,
        idProof: false,
        introVideo: false,
        performanceClip: false,
        firstGig: false,
    });

    // Build steps based on verification status
    const getSteps = (): VerificationStep[] => [
        {
            id: 'mobile',
            icon: <Phone className="w-5 h-5 text-accent" />,
            title: verificationStatus.mobile ? 'Mobile Number Verified' : 'Verify Mobile Number',
            description: verificationStatus.mobile ? 'OTP Verified' : 'Verify with OTP',
            status: verificationStatus.mobile ? 'completed' : 'action',
            actionText: verificationStatus.mobile ? undefined : 'Verify',
            onAction: () => setShowOTPModal(true),
        },
        {
            id: 'id-proof',
            icon: <FileCheck className="w-5 h-5 text-white/70" />,
            badgeIcon: <IdCard className="w-4 h-4 text-white/50" />,
            title: verificationStatus.idProof ? 'ID Proof Uploaded' : 'Upload ID Proof',
            description: verificationStatus.idProof ? 'Document Verified' : 'Aadhaar, PAN or College ID',
            status: verificationStatus.idProof ? 'completed' : 'action',
            actionText: verificationStatus.idProof ? undefined : 'Upload',
            onAction: () => handleOpenUpload('id-proof'),
        },
        {
            id: 'intro-video',
            icon: <Video className="w-5 h-5 text-white/70" />,
            title: verificationStatus.introVideo ? 'Intro Video Uploaded' : 'Upload Intro Video',
            description: verificationStatus.introVideo ? 'Video Submitted' : 'Brief self-introduction video',
            status: verificationStatus.introVideo ? 'completed' : 'action',
            actionText: verificationStatus.introVideo ? undefined : 'Upload',
            onAction: () => handleOpenUpload('intro-video'),
        },
        {
            id: 'performance-clip',
            icon: <Music className="w-5 h-5 text-white/70" />,
            badgeIcon: <Star className="w-4 h-4 text-yellow-500" />,
            title: verificationStatus.performanceClip ? 'Performance Clip Uploaded' : 'Upload Performance Clip',
            description: verificationStatus.performanceClip ? 'Clip Submitted' : 'Showcase your talent',
            status: verificationStatus.performanceClip ? 'completed' : 'action',
            actionText: verificationStatus.performanceClip ? undefined : 'Upload',
            onAction: () => handleOpenUpload('performance-clip'),
        },
        {
            id: 'first-gig',
            icon: <Star className="w-5 h-5 text-yellow-500" />,
            title: verificationStatus.firstGig ? 'First Gig Completed' : 'First Gig Completed',
            description: verificationStatus.firstGig ? 'Reviews Earned' : 'Earn reviews & ratings',
            status: verificationStatus.firstGig ? 'completed' : 'locked',
            statusText: 'Pending',
        },
        // Add more steps here easily - just add to array and verificationStatus
    ];

    const badge: VerificationBadge = {
        icon: <ShieldCheck className="w-8 h-8 text-accent" />,
        title: 'Get "Platform Verified" Badge',
        description: 'Full ID & Video Verification for Top Trust Level',
        actionText: 'Apply Now',
        onAction: () => handleApplyForBadge(),
    };

    const handleOpenUpload = (type: UploadType) => {
        setCurrentUpload(type);
        setShowUploadModal(true);
    };

    const handleUpload = (file: File) => {
        console.log(`File uploaded for ${currentUpload}:`, file.name);

        // Update verification status based on upload type
        if (currentUpload === 'id-proof') {
            setVerificationStatus(prev => ({ ...prev, idProof: true }));
        } else if (currentUpload === 'intro-video') {
            setVerificationStatus(prev => ({ ...prev, introVideo: true }));
        } else if (currentUpload === 'performance-clip') {
            setVerificationStatus(prev => ({ ...prev, performanceClip: true }));
        }

        setCurrentUpload(null);
    };

    const handleOTPVerify = (otp: string, phoneNumber: string) => {
        console.log('OTP verified:', otp, 'Phone:', phoneNumber);
        setVerificationStatus(prev => ({ ...prev, mobile: true }));
    };

    const handleApplyForBadge = () => {
        console.log('Apply for Platform Verified Badge');
        // Check if all required steps are completed
        const allCompleted = verificationStatus.mobile &&
            verificationStatus.idProof &&
            verificationStatus.introVideo &&
            verificationStatus.performanceClip;

        if (!allCompleted) {
            alert('Please complete all verification steps before applying for the badge.');
            return;
        }

        // Submit badge application (would normally save to backend/database here)
        console.log('Badge application submitted - redirecting to pending page');

        // Redirect to verification pending page
        router.push('/artist/verification-pending');
    };

    const handleBack = () => {
        router.back();
    };

    const currentConfig = currentUpload ? uploadConfigs[currentUpload] : null;

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
                            title="Artist Verification"
                            subtitle="Verify your profile to gain trust and more bookings."
                            steps={getSteps()}
                            badge={badge}
                            onBack={handleBack}
                        />
                    </div>
                </div>
            </section>

            {/* OTP Verification Modal */}
            <OTPVerificationModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onVerify={handleOTPVerify}
            />

            {/* File Upload Modal */}
            <FileUploadModal
                isOpen={showUploadModal}
                onClose={() => {
                    setShowUploadModal(false);
                    setCurrentUpload(null);
                }}
                onUpload={handleUpload}
                title={currentConfig?.title || 'Upload File'}
                description={currentConfig?.description}
                acceptedTypes={currentConfig?.acceptedTypes}
                maxSizeMB={currentConfig?.maxSizeMB}
            />

            <Footer />
        </main>
    );
}
