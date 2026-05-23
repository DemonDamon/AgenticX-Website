import fs from 'fs';
import path from 'path';

export const ENTERPRISE_DOCS_ROOT = path.join(process.cwd(), 'content/enterprise');

/** Map a relative file path under content/enterprise to a URL slug, or null for root README. */
export function filePathToSlug(relativePath: string): string | null {
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized === 'README.md') {
    return null;
  }
  if (normalized.endsWith('/README.md')) {
    return normalized.slice(0, -'/README.md'.length);
  }
  if (normalized.endsWith('.md')) {
    return normalized.slice(0, -'.md'.length);
  }
  return null;
}

function walkMarkdownFiles(dir: string, base = ''): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const relative = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(full, relative));
    } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.endsWith('.en.md')) {
      files.push(relative.replace(/\\/g, '/'));
    }
  }

  return files;
}

export function listEnterpriseDocSlugs(): string[] {
  if (!fs.existsSync(ENTERPRISE_DOCS_ROOT)) {
    return [];
  }

  return walkMarkdownFiles(ENTERPRISE_DOCS_ROOT)
    .map(filePathToSlug)
    .filter((slug): slug is string => slug !== null)
    .sort();
}

export function slugToFilePath(slug: string): string | null {
  const direct = path.join(ENTERPRISE_DOCS_ROOT, `${slug}.md`);
  if (fs.existsSync(direct)) {
    return direct;
  }

  const readme = path.join(ENTERPRISE_DOCS_ROOT, slug, 'README.md');
  if (fs.existsSync(readme)) {
    return readme;
  }

  return null;
}

export function loadRootReadmePath(): string {
  return path.join(ENTERPRISE_DOCS_ROOT, 'README.md');
}
