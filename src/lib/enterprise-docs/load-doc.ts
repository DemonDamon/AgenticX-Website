import fs from 'fs';
import path from 'path';
import type { Locale } from '@/i18n/config';
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
  fallbackUsed: boolean;
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

function readDocFile(filePath: string, slug: string, fallbackUsed: boolean): EnterpriseDoc {
  const raw = fs.readFileSync(filePath, 'utf8');
  const content = stripFrontmatter(raw);
  return {
    slug,
    title: extractTitle(content),
    description: extractDescription(content),
    content,
    filePath,
    fallbackUsed,
  };
}

function slugToEnglishFilePath(slug: string): string | null {
  if (slug === 'index') {
    const rootEn = path.join(ENTERPRISE_DOCS_ROOT, 'README.en.md');
    if (fs.existsSync(rootEn)) {
      return rootEn;
    }
    return null;
  }

  const direct = path.join(ENTERPRISE_DOCS_ROOT, `${slug}.en.md`);
  if (fs.existsSync(direct)) {
    return direct;
  }

  const readme = path.join(ENTERPRISE_DOCS_ROOT, slug, 'README.en.md');
  if (fs.existsSync(readme)) {
    return readme;
  }

  return null;
}

export function loadEnterpriseDocBySlug(slug: string, locale: Locale = 'zh'): EnterpriseDoc | null {
  if (locale === 'en') {
    const enPath = slugToEnglishFilePath(slug);
    if (enPath) {
      return readDocFile(enPath, slug, false);
    }
  }

  const filePath = slug === 'index' ? loadRootReadmePath() : slugToFilePath(slug);
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  return readDocFile(filePath, slug, locale === 'en');
}

export function loadEnterpriseDocIndex(locale: Locale = 'zh'): EnterpriseDoc | null {
  return loadEnterpriseDocBySlug('index', locale);
}

export function enterpriseDocsRootExists(): boolean {
  return fs.existsSync(ENTERPRISE_DOCS_ROOT);
}
