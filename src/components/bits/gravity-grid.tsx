'use client';

import { useEffect, useRef } from 'react';

const GAP = 12;
const SAMPLE = 4;
const RADIUS = 118;
const MAGNIFY = 0.62;
const FOLLOW = 0.52;
const STRENGTH_FOLLOW = 0.22;

function readSpot(host: HTMLElement) {
  const on = Number.parseFloat(host.style.getPropertyValue('--spot-on') || '0');
  const x = Number.parseFloat(host.style.getPropertyValue('--spot-x') || '0');
  const y = Number.parseFloat(host.style.getPropertyValue('--spot-y') || '0');
  return { on: Number.isFinite(on) ? on : 0, x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 };
}

export function GravityGrid({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const host = parent?.parentElement;
    if (!canvas || !parent || !host) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let mx = 0;
    let my = 0;
    let strength = 0;
    let frame = 0;
    let running = true;

    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (mx === 0 && my === 0) {
        mx = width * 0.5;
        my = height * 0.32;
      }
    };

    const displace = (x: number, y: number, massX: number, massY: number, mass: number): [number, number] => {
      if (mass < 0.01) return [x, y];
      const dx = x - massX;
      const dy = y - massY;
      const dist = Math.hypot(dx, dy) + 0.001;
      if (dist >= RADIUS) return [x, y];
      const t = dist / RADIUS;
      const fall = 1 - t * t;
      const mag = 1 + MAGNIFY * mass * fall * fall;
      return [massX + dx * mag, massY + dy * mag];
    };

    const drawGrid = (massX: number, massY: number, mass: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 1;

      const strokeLine = (axis: 'x' | 'y', fixed: number) => {
        let prevX = 0;
        let prevY = 0;
        const end = axis === 'x' ? width : height;
        const nearAxis =
          axis === 'x'
            ? Math.abs(fixed - massY) < RADIUS * 1.8
            : Math.abs(fixed - massX) < RADIUS * 1.8;
        const step = nearAxis ? 3 : SAMPLE;
        for (let cursor = 0; cursor <= end + step; cursor += step) {
          const rawX = axis === 'x' ? cursor : fixed;
          const rawY = axis === 'y' ? cursor : fixed;
          const [px, py] = displace(rawX, rawY, massX, massY, mass);
          if (cursor > 0) {
            ctx.strokeStyle = tone === 'dark' ? 'rgba(248, 250, 252, 0.18)' : 'rgba(15, 23, 42, 0.12)';
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
          prevX = px;
          prevY = py;
        }
      };

      for (let y = 0; y <= height + GAP; y += GAP) strokeLine('x', y);
      for (let x = 0; x <= width + GAP; x += GAP) strokeLine('y', x);
    };

    const drawGlint = (cx: number, cy: number, mass: number) => {
      if (mass < 0.08) return;
      const r = RADIUS;
      const spec = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.32, 0, cx - r * 0.28, cy - r * 0.32, r * 0.34);
      spec.addColorStop(0, `rgba(255, 255, 255, ${0.42 * mass})`);
      spec.addColorStop(0.4, `rgba(255, 255, 255, ${0.1 * mass})`);
      spec.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = spec;
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.28, cy - r * 0.32, r * 0.2, r * 0.12, -0.55, 0, Math.PI * 2);
      ctx.fill();
    };

    const paint = () => {
      if (!running) return;
      if (reduceMotion) {
        drawGrid(0, 0, 0);
        return;
      }

      const spot = readSpot(host);
      strength += (spot.on - strength) * STRENGTH_FOLLOW;
      if (spot.on > 0.5 && (spot.x > 0 || spot.y > 0)) {
        mx += (spot.x - mx) * FOLLOW;
        my += (spot.y - my) * FOLLOW;
      }

      if (strength < 0.004) strength = 0;
      drawGrid(mx, my, strength);
      drawGlint(mx, my, strength);

      if (document.hidden) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(paint);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      if (frame === 0 && !reduceMotion) {
        frame = requestAnimationFrame(paint);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    paint();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [tone]);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
}
