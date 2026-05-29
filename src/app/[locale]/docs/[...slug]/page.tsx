import { DocContent } from '@/components/docs/content';
import { flatNavigation } from '@/components/docs/navigation';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import { defaultLocale, isLocale, localizedPath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { resolveDoc, type LocalizedDoc } from './content/_types';

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
import { extensionsContent } from './content/extensions';
import { deploymentContent } from './content/deployment';
import { apiAgentsContent } from './content/api-agents';
import { cliContent } from './content/cli';
import { faqContent } from './content/faq';
import { changelogContent } from './content/changelog';
import { roadmapContent } from './content/roadmap';

// Document content map. Entries may be a bare English `DocEntry` (legacy) or a
// bilingual `{ en, zh }` object; `resolveDoc` handles both with fallback.
const docsMap: Record<string, LocalizedDoc> = {
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
  'guides/extensions': extensionsContent,
  'guides/deployment': deploymentContent,
  'api/agents': apiAgentsContent,
  'cli': cliContent,
  'faq': faqContent,
  'changelog': changelogContent,
  'roadmap': roadmapContent,
};

interface PageProps {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
}

function resolveLocale(raw: string): Locale {
  return isLocale(raw) ? raw : defaultLocale;
}

export async function generateStaticParams() {
  return flatNavigation.map((item) => ({
    slug: item.slug.split('/'),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const slugPath = slug?.join('/') || 'index';
  const resolved = resolveDoc(docsMap[slugPath], locale);
  const t = await getDictionary(locale);

  if (!resolved) {
    return {
      title: t.frameworkDocs.metadataTitle,
    };
  }

  return {
    title: `${resolved.entry.title} | ${t.frameworkDocs.brand}`,
    description: resolved.entry.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const slugPath = slug?.join('/') || 'index';
  const resolved = resolveDoc(docsMap[slugPath], locale);
  const t = await getDictionary(locale);
  const td = t.frameworkDocs;

  if (!resolved) {
    // Return a placeholder page for missing docs
    return (
      <DocContent title={td.comingSoonTitle} slug={slugPath}>
        <p className="text-zinc-400">
          {td.comingSoonBodyBefore}
          <a
            href="https://github.com/DemonDamon/AgenticX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline"
          >
            GitHub
          </a>
          {td.comingSoonBodyAfter}
        </p>
        <p className="mt-4 text-zinc-500">
          <strong>{td.expectedPath}</strong>{' '}
          <code className="px-2 py-1 bg-zinc-800 rounded text-emerald-400">
            {localizedPath(`/docs/${slugPath}`, locale)}
          </code>
        </p>
      </DocContent>
    );
  }

  const fallbackNotice = resolved.fellBack
    ? locale === 'zh'
      ? td.zhFallbackNotice
      : td.enFallbackNotice
    : undefined;

  return (
    <DocContent
      title={resolved.entry.title}
      description={resolved.entry.description}
      slug={slugPath}
      fallbackNotice={fallbackNotice}
    >
      <MarkdownRenderer content={resolved.entry.content} />
    </DocContent>
  );
}
