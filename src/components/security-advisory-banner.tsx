'use client';

import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SecurityAdvisoryBanner({
  align = 'marketing',
}: {
  align?: 'marketing' | 'docs';
}) {
  return (
    <div className="border-b border-amber-500/35 bg-amber-950/90">
      <div
        className={cn(
          'mx-auto flex items-start gap-3 py-3',
          align === 'docs' ? 'max-w-4xl px-8' : 'max-w-6xl px-6'
        )}
      >
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
        <div className="text-sm leading-relaxed text-amber-100/90">
          <span className="font-semibold text-amber-200">Security advisory — </span>
          Malicious <code className="rounded bg-black/30 px-1 text-amber-100/95">litellm</code> versions{' '}
          <strong>1.82.7</strong> and <strong>1.82.8</strong> were removed from PyPI (potential API key
          exfiltration). Uninstall them, rotate exposed credentials, and upgrade to a safe release (e.g.{' '}
          <strong>1.82.9+</strong> per upstream). Run{' '}
          <code className="rounded bg-black/30 px-1 text-amber-100/95">pip show litellm</code> to verify.{' '}
          <Link
            href="https://pypi.org/project/litellm/"
            target="_blank"
            className="text-amber-300 underline underline-offset-2 hover:text-amber-200"
          >
            PyPI
          </Link>
          {' · '}
          <Link
            href="https://github.com/DemonDamon/AgenticX/blob/main/README.md#security-advisory"
            target="_blank"
            className="text-amber-300 underline underline-offset-2 hover:text-amber-200"
          >
            README
          </Link>
        </div>
      </div>
    </div>
  );
}
