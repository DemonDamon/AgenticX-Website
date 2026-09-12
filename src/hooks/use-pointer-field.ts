'use client';

import { useEffect, type RefObject } from 'react';

export function usePointerField(
  targetRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  mode: 'parent' | 'self' = 'self',
) {
  useEffect(() => {
    const el = mode === 'parent' ? targetRef.current?.parentElement : targetRef.current;
    if (!el || !enabled) return;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches === false) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;
    let dirty = false;

    const flush = () => {
      frame = 0;
      if (!dirty) return;
      dirty = false;
      const rect = el.getBoundingClientRect();
      const x = nextX - rect.left;
      const y = nextY - rect.top;
      el.style.setProperty('--spot-x', `${x}px`);
      el.style.setProperty('--spot-y', `${y}px`);
      el.style.setProperty('--spot-nx', (x / Math.max(rect.width, 1)).toFixed(4));
      el.style.setProperty('--spot-ny', (y / Math.max(rect.height, 1)).toFixed(4));
    };

    const onMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      dirty = true;
      if (frame === 0) {
        frame = requestAnimationFrame(flush);
      }
    };

    const onEnter = () => {
      el.style.setProperty('--spot-on', '1');
    };

    const onLeave = () => {
      el.style.setProperty('--spot-on', '0');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, mode, targetRef]);
}
