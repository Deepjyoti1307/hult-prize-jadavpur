import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/artist', '/client', '/onboarding/client', '/admin'];
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

function isProtectedPath(pathname: string): boolean {
    if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
        return false;
    }
    return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getLoginRedirect(pathname: string): string {
    if (pathname.startsWith('/artist')) return '/login?type=artist';
    if (pathname.startsWith('/client') || pathname.startsWith('/onboarding/client')) {
        return '/login?type=client';
    }
    if (pathname.startsWith('/admin')) return '/admin/login';
    return '/login?type=client';
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!isProtectedPath(pathname)) {
        return NextResponse.next();
    }

    const authCookie = request.cookies.get('tarang_auth');
    if (!authCookie?.value) {
        const loginUrl = new URL(getLoginRedirect(pathname), request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/artist/:path*', '/client/:path*', '/onboarding/client', '/admin/:path*'],
};
