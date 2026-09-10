interface DiagramFigureProps {
  name: 'product-stack' | 'runtime-path' | 'enterprise-path' | 'knowledge-brains';
  alt: string;
  caption?: string;
}

export function DiagramFigure({ name, alt, caption }: DiagramFigureProps) {
  return (
    <figure className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/diagrams/${name}.svg`} alt={alt} className="block h-auto w-full" />
      {caption ? (
        <figcaption className="border-t border-neutral-900 px-4 py-3 text-sm text-neutral-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
