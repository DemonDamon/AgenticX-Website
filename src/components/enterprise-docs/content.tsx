'use client';

import Link from 'next/link';
import { getEnterprisePrevNext } from './navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EnterpriseDocContentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  slug: string;
}

function docHref(slug: string): string {
  return slug === 'index' ? '/enterprise/docs' : `/enterprise/docs/${slug}`;
}

export function EnterpriseDocContent({
  title,
  description,
  children,
  slug,
}: EnterpriseDocContentProps) {
  const { prev, next } = getEnterprisePrevNext(slug);

  return (
    <article className="prose prose-invert prose-violet max-w-none">
      <nav className="not-prose mb-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <span className="text-gray-600">/</span>
        <Link href="/enterprise" className="transition-colors hover:text-white">
          Enterprise
        </Link>
        <span className="text-gray-600">/</span>
        <Link href="/enterprise/docs" className="transition-colors hover:text-white">
          Docs
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-white">{title}</span>
      </nav>

      <header className="not-prose mb-8 border-b border-gray-800 pb-8">
        <h1 className="mb-4 text-4xl font-bold text-white">{title}</h1>
        {description && <p className="text-lg text-gray-400">{description}</p>}
      </header>

      <div className="doc-content">{children}</div>

      <nav className="not-prose mt-16 flex items-center justify-between border-t border-gray-800 pt-8">
        {prev ? (
          <Link
            href={docHref(prev.slug)}
            className="group flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 transition-colors hover:border-gray-700 hover:bg-gray-900"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500 transition-transform group-hover:-translate-x-1" />
            <div>
              <div className="text-xs text-gray-500">Previous</div>
              <div className="font-medium text-white">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={docHref(next.slug)}
            className="group flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-right transition-colors hover:border-gray-700 hover:bg-gray-900"
          >
            <div>
              <div className="text-xs text-gray-500">Next</div>
              <div className="font-medium text-white">{next.title}</div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
