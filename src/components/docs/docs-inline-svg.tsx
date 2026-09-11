'use client';

import { useEffect, useState } from 'react';

const cache = new Map<string, string>();

function sanitizeSvg(markup: string): string {
  const trimmed = markup.trim().replace(/^\uFEFF/, '');
  if (!trimmed.includes('<svg')) return '';
  return trimmed
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '');
}

export function DocsInlineSvg({ src, alt }: { src: string; alt: string }) {
  const [svg, setSvg] = useState(() => cache.get(src) ?? '');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src.startsWith('/docs/svg/')) {
      setFailed(true);
      return;
    }
    const cached = cache.get(src);
    if (cached) {
      setSvg(cached);
      setFailed(false);
      return;
    }
    let cancelled = false;
    void fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((text) => {
        const next = sanitizeSvg(text);
        if (!next) throw new Error('invalid svg');
        cache.set(src, next);
        if (!cancelled) {
          setSvg(next);
          setFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (failed) {
    return (
      <p className="my-6 text-center text-sm text-muted-foreground">{alt}</p>
    );
  }

  if (!svg) {
    return <div className="my-2 h-48 animate-pulse rounded-lg bg-muted" aria-hidden />;
  }

  return (
    <div
      className="docs-flow w-full overflow-hidden rounded-xl border border-border [&_svg]:h-auto [&_svg]:w-full"
      role="img"
      aria-label={alt}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
