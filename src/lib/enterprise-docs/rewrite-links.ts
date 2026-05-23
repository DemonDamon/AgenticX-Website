import path from 'path';
import type { Locale } from '@/i18n/config';
import { localizedPath } from '@/i18n/config';

const GITHUB_MAIN_TREE =
  'https://github.com/DemonDamon/AgenticX/tree/main';
const ENTERPRISE_DOCS_PREFIX = '/enterprise/docs';

function isExternalLink(linkPath: string): boolean {
  return (
    /^(https?:|mailto:|tel:|#)/.test(linkPath) ||
    linkPath.startsWith('//')
  );
}

function normalizeResolvedSlug(resolved: string): string {
  let slug = resolved.replace(/\\/g, '/');
  if (slug.endsWith('/README.md')) {
    slug = slug.slice(0, -'/README.md'.length);
  } else if (slug.endsWith('/README')) {
    slug = slug.slice(0, -'/README'.length);
  } else if (slug.endsWith('.md')) {
    slug = slug.slice(0, -'.md'.length);
  }
  if (slug === '.' || slug === './') {
    return '';
  }
  return slug.replace(/^\.\//, '');
}

function resolveRelativeSlug(currentSlug: string, linkPath: string): string | null {
  const baseDir =
    currentSlug === 'index' || !currentSlug
      ? '.'
      : path.posix.dirname(currentSlug.replace(/\\/g, '/'));

  const resolved = path.posix.normalize(path.posix.join(baseDir, linkPath));
  if (resolved.startsWith('..')) {
    return null;
  }
  return normalizeResolvedSlug(resolved);
}

function toEnterpriseHref(slug: string, anchor: string | undefined, locale: Locale): string {
  const basePath =
    slug === '' || slug === 'index'
      ? ENTERPRISE_DOCS_PREFIX
      : `${ENTERPRISE_DOCS_PREFIX}/${slug}`;
  const localized = localizedPath(basePath, locale);
  return anchor ? `${localized}#${anchor}` : localized;
}

function toGithubFallback(linkPath: string, currentSlug: string): string {
  const baseDir =
    currentSlug === 'index' || !currentSlug
      ? 'enterprise/docs'
      : path.posix.join('enterprise/docs', path.posix.dirname(currentSlug));

  const normalized = path.posix.normalize(path.posix.join(baseDir, linkPath));
  return `${GITHUB_MAIN_TREE}/${normalized}`;
}

export function rewriteEnterpriseDocLinks(
  markdown: string,
  currentSlug: string,
  locale: Locale = 'zh',
): string {
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (full, label, rawPath) => {
    const trimmed = rawPath.trim();
    if (isExternalLink(trimmed)) {
      return full;
    }
    if (trimmed.startsWith('/')) {
      return full;
    }

    const [pathPart, ...anchorParts] = trimmed.split('#');
    const anchor = anchorParts.length > 0 ? anchorParts.join('#') : undefined;

    const resolvedSlug = resolveRelativeSlug(currentSlug, pathPart);
    if (resolvedSlug === null) {
      const fallback = toGithubFallback(pathPart, currentSlug);
      return `[${label}](${fallback}${anchor ? `#${anchor}` : ''})`;
    }

    return `[${label}](${toEnterpriseHref(resolvedSlug, anchor, locale)})`;
  });
}
