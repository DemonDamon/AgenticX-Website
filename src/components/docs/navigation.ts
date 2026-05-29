import type { Locale } from '@/i18n/config';

// Documentation Navigation structure based on AgenticX docs directory
export interface DocNavItem {
  title: string;
  /** Simplified Chinese label; falls back to `title` when absent. */
  titleZh?: string;
  slug: string;
  children?: DocNavItem[];
  /** Extra tokens for cmdk search (e.g. litellm for LLM Providers). */
  searchAliases?: string;
}

export interface DocNavSection {
  title: string;
  titleZh?: string;
  items: DocNavItem[];
}

/** Resolve a nav title for the active locale, falling back to English. */
export function navTitle(
  item: { title: string; titleZh?: string },
  locale: Locale,
): string {
  return locale === 'zh' ? item.titleZh ?? item.title : item.title;
}

export const docNavigation: DocNavSection[] = [
  {
    title: 'Getting Started',
    titleZh: '快速开始',
    items: [
      { title: 'Introduction', titleZh: '简介', slug: 'index' },
      { title: 'Installation', titleZh: '安装', slug: 'getting-started/installation' },
      { title: 'Quick Start', titleZh: '快速上手', slug: 'getting-started/quickstart' },
      { title: 'Configuration', titleZh: '配置', slug: 'getting-started/configuration' },
    ],
  },
  {
    title: 'Concepts',
    titleZh: '核心概念',
    items: [
      { title: 'Architecture', titleZh: '架构', slug: 'concepts/architecture' },
      { title: 'Agent Runtime', titleZh: '智能体运行时', slug: 'concepts/agent' },
      { title: 'Tools', titleZh: '工具', slug: 'concepts/tools' },
      { title: 'Memory', titleZh: '记忆', slug: 'concepts/memory' },
      { title: 'Orchestration', titleZh: '编排', slug: 'concepts/orchestration' },
      { title: 'Flow & Workflow', titleZh: 'Flow 与工作流', slug: 'concepts/flow' },
      {
        title: 'LLM Providers',
        titleZh: 'LLM 供应商',
        slug: 'concepts/llm-providers',
        searchAliases: 'litellm LiteLLM OpenAI Anthropic Ollama Gemini',
      },
      { title: 'Hooks', titleZh: 'Hooks', slug: 'concepts/hooks' },
    ],
  },
  {
    title: 'Guides',
    titleZh: '指南',
    items: [
      { title: 'First Agent', titleZh: '第一个智能体', slug: 'guides/first-agent' },
      { title: 'Multi-Agent', titleZh: '多智能体', slug: 'guides/multi-agent' },
      { title: 'Studio Server', titleZh: 'Studio 服务', slug: 'guides/studio' },
      { title: 'Knowledge & RAG', titleZh: '知识库与 RAG', slug: 'guides/knowledge' },
      { title: 'Extensions & Skill Ecosystem', titleZh: '扩展与技能生态', slug: 'guides/extensions' },
      { title: 'Deployment', titleZh: '部署', slug: 'guides/deployment' },
    ],
  },
  {
    title: 'API Reference',
    titleZh: 'API 参考',
    items: [
      { title: 'Agents', titleZh: 'Agents', slug: 'api/agents' },
      { title: 'LLMs', titleZh: 'LLMs', slug: 'api/llms' },
      { title: 'Tools', titleZh: 'Tools', slug: 'api/tools' },
      { title: 'Memory', titleZh: 'Memory', slug: 'api/memory' },
      { title: 'Flow', titleZh: 'Flow', slug: 'api/flow' },
    ],
  },
  {
    title: 'Reference',
    titleZh: '参考',
    items: [
      { title: 'CLI', titleZh: 'CLI', slug: 'cli' },
      { title: 'FAQ', titleZh: '常见问题', slug: 'faq' },
      { title: 'Changelog', titleZh: '更新日志', slug: 'changelog' },
      { title: 'Roadmap', titleZh: '路线图', slug: 'roadmap' },
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
