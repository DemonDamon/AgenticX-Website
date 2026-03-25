// Documentation Navigation structure based on AgenticX docs directory
export interface DocNavItem {
  title: string;
  slug: string;
  children?: DocNavItem[];
  /** Extra tokens for cmdk search (e.g. litellm for LLM Providers). */
  searchAliases?: string;
}

export interface DocNavSection {
  title: string;
  items: DocNavItem[];
}

export const docNavigation: DocNavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', slug: 'index' },
      { title: 'Installation', slug: 'getting-started/installation' },
      { title: 'Quick Start', slug: 'getting-started/quickstart' },
      { title: 'Configuration', slug: 'getting-started/configuration' },
    ],
  },
  {
    title: 'Concepts',
    items: [
      { title: 'Architecture', slug: 'concepts/architecture' },
      { title: 'Agent Runtime', slug: 'concepts/agent' },
      { title: 'Tools', slug: 'concepts/tools' },
      { title: 'Memory', slug: 'concepts/memory' },
      { title: 'Orchestration', slug: 'concepts/orchestration' },
      { title: 'Flow & Workflow', slug: 'concepts/flow' },
      {
        title: 'LLM Providers',
        slug: 'concepts/llm-providers',
        searchAliases: 'litellm LiteLLM OpenAI Anthropic Ollama Gemini',
      },
      { title: 'Hooks', slug: 'concepts/hooks' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'First Agent', slug: 'guides/first-agent' },
      { title: 'Multi-Agent', slug: 'guides/multi-agent' },
      { title: 'Studio Server', slug: 'guides/studio' },
      { title: 'Knowledge & RAG', slug: 'guides/knowledge' },
      { title: 'Extensions & Skill Ecosystem', slug: 'guides/extensions' },
      { title: 'Deployment', slug: 'guides/deployment' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Agents', slug: 'api/agents' },
      { title: 'LLMs', slug: 'api/llms' },
      { title: 'Tools', slug: 'api/tools' },
      { title: 'Memory', slug: 'api/memory' },
      { title: 'Flow', slug: 'api/flow' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { title: 'CLI', slug: 'cli' },
      { title: 'FAQ', slug: 'faq' },
      { title: 'Changelog', slug: 'changelog' },
      { title: 'Roadmap', slug: 'roadmap' },
    ],
  },
];

// Flatten navigation for easier lookup
export const flatNavigation = docNavigation.flatMap((section) => 
  section.items.map((item) => ({
    ...item,
    section: section.title,
  }))
);

// Get previous and next navigation items
export function getPrevNext(currentSlug: string) {
  const currentIndex = flatNavigation.findIndex((item) => item.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? flatNavigation[currentIndex - 1] : null,
    next: currentIndex < flatNavigation.length - 1 ? flatNavigation[currentIndex + 1] : null,
  };
}

// Get navigation tree for sidebar
export function getNavigationTree() {
  return docNavigation;
}
