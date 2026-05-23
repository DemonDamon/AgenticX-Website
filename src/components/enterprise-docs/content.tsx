'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getEnterprisePrevNext } from './navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { localizedPath, localeFromPathname } from '@/i18n/config';
import { useTranslations } from '@/i18n/locale-context';

interface EnterpriseDocContentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  slug: string;
  fallbackUsed?: boolean;
}

function docHref(slug: string, locale: ReturnType<typeof localeFromPathname>): string {
  const path = slug === 'index' ? '/enterprise/docs' : `/enterprise/docs/${slug}`;
  return localizedPath(path, locale);
}

export function EnterpriseDocContent({
  title,
  description,
  children,
  slug,
  fallbackUsed = false,
}: EnterpriseDocContentProps) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const t = useTranslations();
  const { prev, next } = getEnterprisePrevNext(t, slug);

  return (
    <article className="prose prose-invert prose-violet max-w-none">
      <nav className="not-prose mb-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href={localizedPath('/', locale)} className="transition-colors hover:text-white">
          {t.docs.breadcrumbHome}
        </Link>
        <span className="text-gray-600">/</span>
        <Link href={localizedPath('/enterprise', locale)} className="transition-colors hover:text-white">
          {t.docs.breadcrumbEnterprise}
        </Link>
        <span className="text-gray-600">/</span>
        <Link href={localizedPath('/enterprise/docs', locale)} className="transition-colors hover:text-white">
          {t.docs.breadcrumbDocs}
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-white">{title}</span>
      </nav>

      {fallbackUsed && (
        <div className="not-prose mb-6 rounded-lg border border-amber-500/35 bg-amber-950/40 px-4 py-3 text-sm text-amber-100/90">
          {t.docs.englishUnavailableBanner}
        </div>
      )}

      <header className="not-prose mb-8 border-b border-gray-800 pb-8">
        <h1 className="mb-4 text-4xl font-bold text-white">{title}</h1>
        {description && <p className="text-lg text-gray-400">{description}</p>}
      </header>

      <div className="doc-content">{children}</div>

      <nav className="not-prose mt-16 flex items-center justify-between border-t border-gray-800 pt-8">
        {prev ? (
          <Link
            href={docHref(prev.slug, locale)}
            className="group flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 transition-colors hover:border-gray-700 hover:bg-gray-900"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500 transition-transform group-hover:-translate-x-1" />
            <div>
              <div className="text-xs text-gray-500">{t.common.previous}</div>
              <div className="font-medium text-white">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={docHref(next.slug, locale)}
            className="group flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 text-right transition-colors hover:border-gray-700 hover:bg-gray-900"
          >
            <div>
              <div className="text-xs text-gray-500">{t.common.next}</div>
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
