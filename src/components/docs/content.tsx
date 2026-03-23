'use client';

import Link from 'next/link';
import { getPrevNext } from './navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DocContentProps {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
  slug: string;
}

export function DocContent({
  title,
  description,
  lastUpdated,
  children,
  slug,
}: DocContentProps) {
  const { prev, next } = getPrevNext(slug);

  return (
    <article className="prose prose-invert prose-blue max-w-none">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400 not-prose">
        <Link href="/" className="hover:text-white transition-colors">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
        <span className="text-gray-600">/</span>
        <Link href="/docs" className="hover:text-white transition-colors">
          Docs
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-white">{title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8 border-b border-gray-800 pb-8 not-prose">
        <h1 className="mb-4 text-4xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-lg text-gray-400">{description}</p>
        )}
        {lastUpdated && (
          <p className="mt-4 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        )}
      </header>

      {/* Content */}
      <div className="doc-content">
        {children}
      </div>

      {/* Navigation */}
      <nav className="mt-16 flex items-center justify-between border-t border-gray-800 pt-8 not-prose">
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
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
            href={`/docs/${next.slug}`}
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
