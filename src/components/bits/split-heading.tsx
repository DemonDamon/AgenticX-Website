'use client';

import { useEffect, useState } from 'react';

interface SplitHeadingProps {
  text: string;
  className?: string;
  delayMs?: number;
}

function splitUnits(text: string): string[] {
  if (/[\u4e00-\u9fff]/.test(text)) {
    return Array.from(text);
  }
  return text.split(/(\s+)/).filter((part) => part.length > 0);
}

export function SplitHeading({ text, className = '', delayMs = 0 }: SplitHeadingProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const units = splitUnits(text);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return (
    <span className={`inline-block ${className}`}>
      {units.map((unit, index) => (
        <span
          key={`${unit}-${index}`}
          className={reduceMotion ? undefined : 'split-heading-unit'}
          style={
            reduceMotion
              ? undefined
              : {
                  animationDelay: `${delayMs + index * 32}ms`,
                }
          }
        >
          {unit === ' ' ? '\u00a0' : unit}
        </span>
      ))}
    </span>
  );
}
