import { notFound } from 'next/navigation';
import { EnterpriseDocContent } from '@/components/enterprise-docs/content';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import {
  loadEnterpriseDocIndex,
  enterpriseDocsRootExists,
} from '@/lib/enterprise-docs/load-doc';
import { rewriteEnterpriseDocLinks } from '@/lib/enterprise-docs/rewrite-links';

export const metadata = {
  title: 'Documentation | AgenticX Enterprise',
  description:
    'AgenticX Enterprise 文档中心：架构、API、AI 网关、部署与运维指南。',
};

export default function EnterpriseDocsIndexPage() {
  if (!enterpriseDocsRootExists()) {
    notFound();
  }

  const doc = loadEnterpriseDocIndex();
  if (!doc) {
    notFound();
  }

  const content = rewriteEnterpriseDocLinks(doc.content, 'index');

  return (
    <EnterpriseDocContent
      title={doc.title}
      description={doc.description}
      slug="index"
    >
      <MarkdownRenderer content={content} />
      <div className="not-prose mt-8 rounded-lg border border-gray-800 bg-gray-900/40 p-4 text-sm text-gray-400">
        <p className="mb-2 font-medium text-gray-300">配套资产</p>
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
