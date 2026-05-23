import type { MetadataRoute } from 'next';
import { listEnterpriseDocSlugs } from '@/lib/enterprise-docs/list-docs';
import { localizedPath } from '@/i18n/config';

const BASE = 'https://agenticx.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/enterprise', '/enterprise/docs', '/docs', '/privacy', '/terms', '/auth', '/agents'];
  const docSlugs = listEnterpriseDocSlugs();

  const zhEntries: MetadataRoute.Sitemap = [
    ...staticPaths.map((path) => ({
      url: `${BASE}${path || '/'}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'zh-CN': `${BASE}${path || '/'}`,
          en: `${BASE}${localizedPath(path || '/', 'en')}`,
        },
      },
    })),
    ...docSlugs.map((slug) => ({
      url: `${BASE}/enterprise/docs/${slug}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'zh-CN': `${BASE}/enterprise/docs/${slug}`,
          en: `${BASE}${localizedPath(`/enterprise/docs/${slug}`, 'en')}`,
        },
      },
    })),
  ];

  const enEntries: MetadataRoute.Sitemap = [
    ...staticPaths.map((path) => ({
      url: `${BASE}${localizedPath(path || '/', 'en')}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'zh-CN': `${BASE}${path || '/'}`,
          en: `${BASE}${localizedPath(path || '/', 'en')}`,
        },
      },
    })),
    ...docSlugs.map((slug) => ({
      url: `${BASE}${localizedPath(`/enterprise/docs/${slug}`, 'en')}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'zh-CN': `${BASE}/enterprise/docs/${slug}`,
          en: `${BASE}${localizedPath(`/enterprise/docs/${slug}`, 'en')}`,
        },
      },
    })),
  ];

  return [...zhEntries, ...enEntries];
}
