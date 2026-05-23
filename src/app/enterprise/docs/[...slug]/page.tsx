import { notFound } from 'next/navigation';
import { EnterpriseDocContent } from '@/components/enterprise-docs/content';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import { listEnterpriseDocSlugs } from '@/lib/enterprise-docs/list-docs';
import {
  loadEnterpriseDocBySlug,
  enterpriseDocsRootExists,
} from '@/lib/enterprise-docs/load-doc';
import { rewriteEnterpriseDocLinks } from '@/lib/enterprise-docs/rewrite-links';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  if (!enterpriseDocsRootExists()) {
    return [];
  }

  return listEnterpriseDocSlugs().map((slug) => ({
    slug: slug.split('/'),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const doc = loadEnterpriseDocBySlug(slugPath);

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
  const { slug } = await params;
  const slugPath = slug.join('/');

  if (!enterpriseDocsRootExists()) {
    notFound();
  }

  const doc = loadEnterpriseDocBySlug(slugPath);
  if (!doc) {
    notFound();
  }

  const content = rewriteEnterpriseDocLinks(doc.content, slugPath);

  return (
    <EnterpriseDocContent
      title={doc.title}
      description={doc.description}
      slug={slugPath}
    >
      <MarkdownRenderer content={content} />
    </EnterpriseDocContent>
  );
}
