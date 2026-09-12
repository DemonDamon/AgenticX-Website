import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import { nearContent } from '@/app/[locale]/docs/[...slug]/content/near';
import { defaultLocale, isLocale, localizedPath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const entry = nearContent[locale];
  return {
    title: `${entry.title} | AgenticX`,
    description: entry.description,
  };
}

export default async function NearDocsPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  if (!isLocale(rawLocale)) notFound();
  const t = await getDictionary(locale);
  const entry = nearContent[locale];

  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground not-prose">
        <Link href={localizedPath('/', locale)} className="transition-colors hover:text-foreground">
          {t.common.home}
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-foreground">{t.nearDocs.breadcrumb}</span>
      </nav>
      <header className="mb-8 border-b border-border pb-8 not-prose">
        <h1 className="mb-4 text-4xl font-bold text-foreground">{entry.title}</h1>
        <p className="text-lg text-muted-foreground">{entry.description}</p>
      </header>
      <div className="doc-content">
        <MarkdownRenderer content={entry.content.replace(/^# .+\n+/, '')} />
      </div>
    </article>
  );
}
