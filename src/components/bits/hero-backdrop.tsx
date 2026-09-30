'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const RibbonGlow = dynamic(() => import('./ribbon-glow'), { ssr: false });

interface HeroBackdropProps {
  lightMode?: boolean;
}

export function HeroBackdrop({ lightMode = false }: HeroBackdropProps) {
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
      {reduceMotion ? (
        lightMode ? <div className="hero-light-wash" /> : null
      ) : (
        <RibbonGlow
          background={lightMode ? '#F6F5F8' : '#0B0A10'}
          color1={lightMode ? '#E87810' : '#FFB01A'}
          color2={lightMode ? '#A8184E' : '#C2185B'}
          size={70}
          angle={0}
        />
      )}
      {!lightMode && <div className="hero-dark-type-scrim" />}
      <div
        className={
          lightMode
            ? 'absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background'
            : 'absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background'
        }
      />
    </div>
  );
}
