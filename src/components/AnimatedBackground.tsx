'use client';

import { useEffect } from 'react';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';

export default function AnimatedBackground() {
    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    return <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />;
}
