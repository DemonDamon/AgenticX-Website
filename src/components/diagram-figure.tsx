'use client';

import { useRef } from 'react';
import { usePointerField } from '@/hooks/use-pointer-field';
import { useLocale } from '@/i18n/locale-context';

type OfficialName = 'product' | 'near' | 'enterprise';
type LegacyName = 'product-stack' | 'runtime-path' | 'enterprise-path' | 'knowledge-brains';

const OFFICIAL_MAP: Record<string, OfficialName> = {
  product: 'product',
  'product-stack': 'product',
  near: 'near',
  'runtime-path': 'near',
  enterprise: 'enterprise',
  'enterprise-path': 'enterprise',
};

interface DiagramFigureProps {
  name: OfficialName | LegacyName;
  alt: string;
  caption?: string;
}

export function DiagramFigure({ name, alt, caption }: DiagramFigureProps) {
  const { locale } = useLocale();
  const plateRef = useRef<HTMLDivElement>(null);
  const official = OFFICIAL_MAP[name];
  const src = official
    ? `/diagrams/${official}-architecture-${locale}.jpg`
    : `/diagrams/${name}.svg`;

  usePointerField(plateRef, true);

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-[box-shadow,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-violet-400/35 hover:shadow-[0_22px_56px_rgba(124,92,246,0.16)] dark:shadow-none dark:hover:border-violet-300/25">
      <div ref={plateRef} className="diagram-plate relative overflow-hidden bg-neutral-950 p-1.5 sm:p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block h-auto w-full rounded-lg bg-neutral-950" />
        <div className="diagram-pointer-glow" />
      </div>
      {caption ? (
        <figcaption className="border-t border-border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
