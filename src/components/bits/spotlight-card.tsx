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
  spotlightColor,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const setSpot = (opacity: number, x?: number, y?: number) => {
    const spot = spotRef.current;
    if (!spot) return;
    spot.style.opacity = String(opacity);
    if (x !== undefined && y !== undefined) {
      const color = spotlightColor ?? 'var(--spotlight)';
      spot.style.background = `radial-gradient(circle at ${x}px ${y}px, ${color}, transparent 72%)`;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl border border-border bg-card transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)] ${className}`}
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
