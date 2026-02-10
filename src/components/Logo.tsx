'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    linkTo?: string;
}

const maskStyle = {
    maskImage: 'radial-gradient(ellipse 85% 80% at center, black 50%, transparent 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at center, black 50%, transparent 100%)',
};

export default function Logo({
    size = 'md',
    className = '',
    linkTo = '/',
}: LogoProps) {
    const sizeMap = {
        sm: { height: 'h-8', width: 120, imgH: 32 },
        md: { height: 'h-10', width: 150, imgH: 40 },
        lg: { height: 'h-14', width: 200, imgH: 56 },
    };

    const s = sizeMap[size];

    const content = (
        <div className={`flex items-center ${className}`}>
            <Image
                src="/logo.png"
                alt="Tarang - Where music finds its stage"
                width={s.width}
                height={s.imgH}
                className={`${s.height} w-auto object-contain invert`}
                style={maskStyle}
                priority
            />
        </div>
    );

    if (linkTo) {
        return <Link href={linkTo}>{content}</Link>;
    }

    return content;
}
