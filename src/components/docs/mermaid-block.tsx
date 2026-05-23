'use client';

import { useEffect, useId, useRef, useState } from 'react';

let mermaidInitialized = false;

async function ensureMermaid() {
  const mermaid = (await import('mermaid')).default;
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    });
    mermaidInitialized = true;
  }
  return mermaid;
}

export function MermaidBlock({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const source = chart.trim();
    if (!source) return;

    void (async () => {
      try {
        const mermaid = await ensureMermaid();
        const renderId = `mermaid-${reactId}-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(renderId, source);
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
  }, [chart, reactId]);

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-red-900/50 bg-red-950/30 p-4">
        <p className="text-sm text-red-400">Mermaid 渲染失败：{error}</p>
        <pre className="mt-2 overflow-x-auto text-xs text-zinc-500">{chart.trim()}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-900/50 p-6 [&_svg]:max-w-full [&_svg]:h-auto"
      aria-label="Mermaid diagram"
    />
  );
}
