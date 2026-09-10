'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeContentProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export function FadeContent({ children, className = '', delayMs = 0 }: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible || reduceMotion ? 'none' : 'translateY(12px)',
        transition: reduceMotion
          ? undefined
          : `opacity 200ms cubic-bezier(0.23, 1, 0.32, 1) ${delayMs}ms, transform 200ms cubic-bezier(0.23, 1, 0.32, 1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
