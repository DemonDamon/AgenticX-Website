import { notFound } from 'next/navigation';
import { EnterpriseDocContent } from '@/components/enterprise-docs/content';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import { listEnterpriseDocSlugs } from '@/lib/enterprise-docs/list-docs';
import {
  loadEnterpriseDocBySlug,
  enterpriseDocsRootExists,
} from '@/lib/enterprise-docs/load-doc';
import { rewriteEnterpriseDocLinks } from '@/lib/enterprise-docs/rewrite-links';
import { isLocale, locales, type Locale } from '@/i18n/config';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  if (!enterpriseDocsRootExists()) {
    return [];
  }

  const slugs = listEnterpriseDocSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug: slug.split('/'),
    })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return { title: 'Documentation | AgenticX Enterprise' };
  const locale = rawLocale as Locale;
  const slugPath = slug.join('/');
  const doc = loadEnterpriseDocBySlug(slugPath, locale);

  if (!doc) {
    return {
      title: 'Documentation | AgenticX Enterprise',
    };
  }

  return {
    title: `${doc.title} | AgenticX Enterprise`,
    description: doc.description,
  };
}

export default async function EnterpriseDocPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const slugPath = slug.join('/');

  if (!enterpriseDocsRootExists()) {
    notFound();
  }

  const doc = loadEnterpriseDocBySlug(slugPath, locale);
  if (!doc) {
    notFound();
  }

  const content = rewriteEnterpriseDocLinks(doc.content, slugPath, locale);

  return (
    <EnterpriseDocContent
      title={doc.title}
      description={doc.description}
      slug={slugPath}
      fallbackUsed={doc.fallbackUsed}
    >
      <MarkdownRenderer content={content} />
    </EnterpriseDocContent>
  );
}
