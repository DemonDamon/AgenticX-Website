'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DarkVeil = dynamic(() => import('./dark-veil'), { ssr: false });

interface HeroBackdropProps {
  opacity?: number;
  speed?: number;
}

export function HeroBackdrop({ opacity = 0.28, speed = 0.28 }: HeroBackdropProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_58%)]" />
      {!reduceMotion && (
        <div className="absolute inset-0" style={{ opacity }}>
          <DarkVeil speed={speed} resolutionScale={0.65} hueShift={6} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black" />
    </div>
  );
}
