'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useSiteUiTheme } from '@/hooks/use-site-ui-theme';

async function renderMermaid(source: string, renderId: string, theme: 'dark' | 'default') {
  const mermaid = (await import('mermaid')).default;
  mermaid.initialize({
    startOnLoad: false,
    theme,
    securityLevel: 'loose',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  });
  return mermaid.render(renderId, source);
}

export function MermaidBlock({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, '');
  const { resolved } = useSiteUiTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const source = chart.trim();
    if (!source) return;

    void (async () => {
      try {
        const theme = resolved === 'light' ? 'default' : 'dark';
        const renderId = `mermaid-${reactId}-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await renderMermaid(source, renderId, theme);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, reactId, resolved]);

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Mermaid 渲染失败：{error}</p>
        <pre className="mt-2 overflow-x-auto text-xs text-muted-foreground">{chart.trim()}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-6 [&_svg]:h-auto [&_svg]:max-w-full"
      aria-label="Mermaid diagram"
    />
  );
}
