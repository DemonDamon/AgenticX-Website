'use client';

import { useRef } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.08)',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const setSpot = (opacity: number, x?: number, y?: number) => {
    const spot = spotRef.current;
    if (!spot) return;
    spot.style.opacity = String(opacity);
    if (x !== undefined && y !== undefined) {
      spot.style.background = `radial-gradient(circle at ${x}px ${y}px, ${spotlightColor}, transparent 72%)`;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl border border-border bg-card ${className}`}
      onMouseMove={(event) => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches === false) {
          return;
        }
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        setSpot(1, event.clientX - rect.left, event.clientY - rect.top);
      }}
      onMouseLeave={() => setSpot(0)}
    >
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out"
        aria-hidden
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
