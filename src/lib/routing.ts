import type { UserProfile } from '@/types/domain';

export function isArtistVerificationComplete(profile: UserProfile | null | undefined): boolean {
    const v = profile?.artistVerification;
    return Boolean(v?.idProof && v?.introVideo && v?.performanceClip);
}

export function isClientOnboardingComplete(profile: UserProfile | null | undefined): boolean {
    return Boolean(
        profile?.clientVerification?.location || profile?.location?.address
    );
}

export function getPostAuthRedirect(
    profile: UserProfile | null | undefined,
    userType?: 'artist' | 'client'
): string {
    const role = profile?.role ?? userType ?? 'client';

    if (role === 'artist') {
        const approvalStatus = profile?.adminApproval?.status;

        if (approvalStatus === 'approved') {
            return '/artist/dashboard';
        }
        if (approvalStatus === 'pending') {
            return '/artist/verification-pending';
        }
        if (approvalStatus === 'rejected') {
            return '/artist/onboarding';
        }
        if (!isArtistVerificationComplete(profile)) {
            return '/artist/onboarding';
        }
        return '/artist/onboarding';
    }

    if (isClientOnboardingComplete(profile)) {
        return '/client/dashboard';
    }

    return '/onboarding/client';
}

export const ARTIST_ONBOARDING_PATHS = [
    '/artist/onboarding',
    '/artist/verification-pending',
];

export const CLIENT_ONBOARDING_PATHS = ['/onboarding/client'];

export function shouldArtistAccessPortal(profile: UserProfile | null | undefined): boolean {
    return profile?.adminApproval?.status === 'approved';
}

export function getArtistGuardRedirect(
    pathname: string,
    profile: UserProfile | null | undefined
): string | null {
    if (ARTIST_ONBOARDING_PATHS.some((path) => pathname.startsWith(path))) {
        if (pathname === '/artist/onboarding' && profile?.adminApproval?.status === 'pending') {
            return '/artist/verification-pending';
        }
        if (pathname === '/artist/verification-pending') {
            const status = profile?.adminApproval?.status;
            if (status === 'approved') return '/artist/dashboard';
            if (status === 'rejected') return '/artist/onboarding';
        }
        return null;
    }

    if (!isArtistVerificationComplete(profile)) {
        return '/artist/onboarding';
    }

    const approvalStatus = profile?.adminApproval?.status;
    if (approvalStatus === 'pending') {
        return '/artist/verification-pending';
    }
    if (approvalStatus === 'rejected') {
        return '/artist/onboarding';
    }
    if (approvalStatus !== 'approved') {
        return '/artist/onboarding';
    }

    return null;
}

export function getClientGuardRedirect(
    pathname: string,
    profile: UserProfile | null | undefined
): string | null {
    if (CLIENT_ONBOARDING_PATHS.some((path) => pathname.startsWith(path))) {
        if (isClientOnboardingComplete(profile)) {
            return '/client/dashboard';
        }
        return null;
    }

    if (!isClientOnboardingComplete(profile)) {
        return '/onboarding/client';
    }

    return null;
}
