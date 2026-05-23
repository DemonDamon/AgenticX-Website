import fs from 'fs';
import {
  ENTERPRISE_DOCS_ROOT,
  loadRootReadmePath,
  slugToFilePath,
} from './list-docs';

export interface EnterpriseDoc {
  slug: string;
  title: string;
  description?: string;
  content: string;
  filePath: string;
}

function stripFrontmatter(text: string): string {
  if (!text.startsWith('---\n')) {
    return text;
  }
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) {
    return text;
  }
  return text.slice(end + 5);
}

function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? 'Untitled';
}

function extractDescription(markdown: string): string | undefined {
  const lines = markdown.split('\n');
  let passedTitle = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!passedTitle) {
      if (trimmed.startsWith('# ')) {
        passedTitle = true;
      }
      continue;
    }
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('>')) continue;
    if (trimmed.startsWith('```')) continue;
    if (trimmed.startsWith('|')) continue;
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) continue;

    return trimmed
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .slice(0, 200);
  }

  return undefined;
}

function readDocFile(filePath: string, slug: string): EnterpriseDoc {
  const raw = fs.readFileSync(filePath, 'utf8');
  const content = stripFrontmatter(raw);
  return {
    slug,
    title: extractTitle(content),
    description: extractDescription(content),
    content,
    filePath,
  };
}

export function loadEnterpriseDocBySlug(slug: string): EnterpriseDoc | null {
  const filePath = slugToFilePath(slug);
  if (!filePath) {
    return null;
  }
  return readDocFile(filePath, slug);
}

export function loadEnterpriseDocIndex(): EnterpriseDoc | null {
  const filePath = loadRootReadmePath();
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readDocFile(filePath, 'index');
}

export function enterpriseDocsRootExists(): boolean {
  return fs.existsSync(ENTERPRISE_DOCS_ROOT);
}
