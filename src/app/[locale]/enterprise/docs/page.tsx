import { notFound } from 'next/navigation';
import { EnterpriseDocContent } from '@/components/enterprise-docs/content';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import {
  loadEnterpriseDocIndex,
  enterpriseDocsRootExists,
} from '@/lib/enterprise-docs/load-doc';
import { rewriteEnterpriseDocLinks } from '@/lib/enterprise-docs/rewrite-links';
import { getDictionary } from '@/i18n/get-dictionary';
import { isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const t = await getDictionary(locale);

  return {
    title: t.docs.metadataTitle,
    description: t.docs.metadataDescription,
  };
}

export default async function EnterpriseDocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = await getDictionary(locale);

  if (!enterpriseDocsRootExists()) {
    notFound();
  }

  const doc = loadEnterpriseDocIndex(locale);
  if (!doc) {
    notFound();
  }

  const content = rewriteEnterpriseDocLinks(doc.content, 'index', locale);

  return (
    <EnterpriseDocContent
      title={doc.title}
      description={doc.description}
      slug="index"
      fallbackUsed={doc.fallbackUsed}
    >
      <MarkdownRenderer content={content} />
      <div className="not-prose mt-8 rounded-lg border border-gray-800 bg-gray-900/40 p-4 text-sm text-gray-400">
        <p className="mb-2 font-medium text-gray-300">{t.docs.supportingAssets}</p>
        <a
          href="https://github.com/DemonDamon/AgenticX/blob/main/enterprise/docs/observability/grafana-ai-gateway.json"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300"
        >
          observability/grafana-ai-gateway.json
        </a>
      </div>
    </EnterpriseDocContent>
  );
}
