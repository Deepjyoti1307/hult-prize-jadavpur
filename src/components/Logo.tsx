'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
    linkTo?: string;
    variant?: 'default' | 'light' | 'dark';
}

export default function Logo({
    size = 'md',
    showText = true,
    className = '',
    linkTo = '/',
    variant = 'default',
}: LogoProps) {
    const sizeClasses = {
        sm: { container: 'h-8', image: 32 },
        md: { container: 'h-10', image: 40 },
        lg: { container: 'h-14', image: 56 },
    };

    const textSizeClasses = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    // For dark backgrounds, use the inverted (white) version
    // For light backgrounds, use the default (dark) version
    const logoSrc = variant === 'light' ? '/logo-dark.png' : '/logo.png';

    const content = (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`relative ${sizeClasses[size].container}`} style={{ aspectRatio: '1.5' }}>
                <Image
                    src={logoSrc}
                    alt="TARANG Logo"
                    width={sizeClasses[size].image * 1.5}
                    height={sizeClasses[size].image}
                    className="object-contain h-full w-auto"
                    priority
                />
            </div>
            {showText && (
                <span className={`font-bold text-white ${textSizeClasses[size]}`}>
                    TARANG
                </span>
            )}
        </div>
    );

    if (linkTo) {
        return <Link href={linkTo}>{content}</Link>;
    }

    return content;
}
