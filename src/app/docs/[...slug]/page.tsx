import { notFound } from 'next/navigation';
import { DocContent } from '@/components/docs/content';
import { flatNavigation } from '@/components/docs/navigation';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';

// Import document content
import { indexContent } from './content/index';
import { installationContent } from './content/installation';
import { quickstartContent } from './content/quickstart';
import { configurationContent } from './content/configuration';
import { architectureContent } from './content/architecture';
import { agentContent } from './content/agent';
import { toolsContent } from './content/tools';
import { memoryContent } from './content/memory';
import { orchestrationContent } from './content/orchestration';
import { flowContent } from './content/flow';
import { llmProvidersContent } from './content/llm-providers';
import { hooksContent } from './content/hooks';
import { firstAgentContent } from './content/first-agent';
import { multiAgentContent } from './content/multi-agent';
import { studioContent } from './content/studio';
import { knowledgeContent } from './content/knowledge';
import { deploymentContent } from './content/deployment';
import { apiAgentsContent } from './content/api-agents';
import { cliContent } from './content/cli';
import { faqContent } from './content/faq';
import { changelogContent } from './content/changelog';
import { roadmapContent } from './content/roadmap';

// Document content map
const docsMap: Record<string, { title: string; description?: string; content: string }> = {
  'index': indexContent,
  'getting-started/installation': installationContent,
  'getting-started/quickstart': quickstartContent,
  'getting-started/configuration': configurationContent,
  'concepts/architecture': architectureContent,
  'concepts/agent': agentContent,
  'concepts/tools': toolsContent,
  'concepts/memory': memoryContent,
  'concepts/orchestration': orchestrationContent,
  'concepts/flow': flowContent,
  'concepts/llm-providers': llmProvidersContent,
  'concepts/hooks': hooksContent,
  'guides/first-agent': firstAgentContent,
  'guides/multi-agent': multiAgentContent,
  'guides/studio': studioContent,
  'guides/knowledge': knowledgeContent,
  'guides/deployment': deploymentContent,
  'api/agents': apiAgentsContent,
  'cli': cliContent,
  'faq': faqContent,
  'changelog': changelogContent,
  'roadmap': roadmapContent,
};

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  return flatNavigation.map((item) => ({
    slug: item.slug.split('/'),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug?.join('/') || 'index';
  const doc = docsMap[slugPath];

  if (!doc) {
    return {
      title: 'Documentation | AgenticX',
    };
  }

  return {
    title: `${doc.title} | AgenticX Docs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug?.join('/') || 'index';
  const doc = docsMap[slugPath];

  if (!doc) {
    // Return a placeholder page for missing docs
    return (
      <DocContent title="Coming Soon" slug={slugPath}>
        <p className="text-zinc-400">
          This documentation page is being written. Please check back later or 
          contribute on{' '}
          <a 
            href="https://github.com/DemonDamon/AgenticX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline"
          >
            GitHub
          </a>.
        </p>
        <p className="mt-4 text-zinc-500">
          <strong>Expected path:</strong> <code className="px-2 py-1 bg-zinc-800 rounded text-emerald-400">{slugPath}</code>
        </p>
      </DocContent>
    );
  }

  return (
    <DocContent 
      title={doc.title} 
      description={doc.description}
      slug={slugPath}
    >
      <MarkdownRenderer content={doc.content} />
    </DocContent>
  );
}
