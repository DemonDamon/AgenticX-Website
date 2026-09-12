'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { GravityGrid } from '@/components/bits/gravity-grid';
import { usePointerField } from '@/hooks/use-pointer-field';

const DarkVeil = dynamic(() => import('./dark-veil'), { ssr: false });

interface HeroBackdropProps {
  opacity?: number;
  speed?: number;
  lightMode?: boolean;
}

export function HeroBackdrop({ opacity = 0.28, speed = 0.28, lightMode = false }: HeroBackdropProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  usePointerField(rootRef, !reduceMotion, 'parent');

  if (lightMode) {
    return (
      <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="hero-light-wash" />
        <GravityGrid tone="light" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/15 to-background" />
      </div>
    );
  }

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_58%)]" />
      {!reduceMotion && (
        <div className="absolute inset-0" style={{ opacity }}>
          <DarkVeil speed={speed} resolutionScale={0.65} hueShift={6} />
        </div>
      )}
      <GravityGrid tone="dark" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/35 to-background" />
    </div>
  );
}
