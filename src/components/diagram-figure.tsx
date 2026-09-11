'use client';

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
  const official = OFFICIAL_MAP[name];
  const src = official
    ? `/diagrams/${official}-architecture-${locale}.jpg`
    : `/diagrams/${name}.svg`;

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block h-auto w-full bg-black" />
      {caption ? (
        <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
