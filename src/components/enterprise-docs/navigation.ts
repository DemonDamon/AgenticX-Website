import type { Dictionary } from '@/i18n/types';

export interface EnterpriseDocNavItem {
  title: string;
  slug: string;
  searchAliases?: string;
}

export interface EnterpriseDocNavSection {
  title: string;
  items: EnterpriseDocNavItem[];
}

export function getEnterpriseDocNavigation(t: Dictionary): EnterpriseDocNavSection[] {
  const i = t.sidebar.items;
  const s = t.sidebar.sections;

  const itemTitle = (slug: string, fallback: string) => i[slug] ?? fallback;

  return [
    {
      title: s.overview,
      items: [{ title: itemTitle('index', 'Introduction'), slug: 'index' }],
    },
    {
      title: s.architecture,
      items: [
        { title: i['architecture/overview'], slug: 'architecture/overview' },
        { title: i['architecture/data-flow'], slug: 'architecture/data-flow' },
        { title: i['architecture/plugin-runtime'], slug: 'architecture/plugin-runtime' },
        { title: i['architecture/mcp-hosting'], slug: 'architecture/mcp-hosting' },
        { title: i['architecture/cache-and-pricing'], slug: 'architecture/cache-and-pricing' },
        { title: i['architecture/protocol-translation'], slug: 'architecture/protocol-translation' },
      ],
    },
    {
      title: s.appsModules,
      items: [
        { title: i.apps, slug: 'apps' },
        { title: i.features, slug: 'features' },
        { title: i.packages, slug: 'packages' },
      ],
    },
    {
      title: s.apiReference,
      items: [
        { title: i.api, slug: 'api' },
        { title: i['api/web-portal'], slug: 'api/web-portal' },
        { title: i['api/admin-console'], slug: 'api/admin-console' },
        { title: i['api/gateway'], slug: 'api/gateway' },
        { title: i['api/internal-api'], slug: 'api/internal-api' },
      ],
    },
    {
      title: s.gateway,
      items: [
        { title: i['gateway/overview'], slug: 'gateway/overview' },
        { title: i['gateway/policy-engine'], slug: 'gateway/policy-engine' },
        { title: i['gateway/runtime-config'], slug: 'gateway/runtime-config' },
        { title: i['gateway/api-tokens'], slug: 'gateway/api-tokens' },
        { title: i['gateway/keypool-pat-overview'], slug: 'gateway/keypool-pat-overview' },
        { title: i['gateway/mcp-hosting-overview'], slug: 'gateway/mcp-hosting-overview' },
      ],
    },
    {
      title: s.dataPermissions,
      items: [
        { title: i['database/schema'], slug: 'database/schema' },
        { title: i['rbac/scopes'], slug: 'rbac/scopes' },
      ],
    },
    {
      title: s.configuration,
      items: [{ title: i['configuration/env-vars'], slug: 'configuration/env-vars' }],
    },
    {
      title: s.plugins,
      items: [{ title: i['plugin-protocol'], slug: 'plugin-protocol' }],
    },
    {
      title: s.devTesting,
      items: [
        { title: i['development/local-dev'], slug: 'development/local-dev' },
        { title: i['development/troubleshooting'], slug: 'development/troubleshooting' },
        { title: i.testing, slug: 'testing' },
        { title: i['perf-baselines'], slug: 'perf-baselines' },
      ],
    },
    {
      title: s.observability,
      items: [
        {
          title: i.observability,
          slug: 'observability',
          searchAliases: 'grafana metrics prometheus 可观测性',
        },
      ],
    },
    {
      title: s.deployment,
      items: [
        { title: i.deployment, slug: 'deployment' },
        {
          title: i['deployment/local-selfhost'],
          slug: 'deployment/local-selfhost',
          searchAliases: '本地 本地化 私有化 docker self-host selfhost 自托管 部署',
        },
        { title: i['deployment/vercel-env-checklist'], slug: 'deployment/vercel-env-checklist' },
        { title: i['deployment/vercel-git-autodeploy'], slug: 'deployment/vercel-git-autodeploy' },
        { title: i['deployment/supabase-migration-guide'], slug: 'deployment/supabase-migration-guide' },
        {
          title: i['deployment/2026-05-12-supabase-seed-tls-pitfall'],
          slug: 'deployment/2026-05-12-supabase-seed-tls-pitfall',
        },
      ],
    },
    {
      title: s.runbooks,
      items: [
        { title: i['runbooks/sso-oidc-setup'], slug: 'runbooks/sso-oidc-setup', searchAliases: 'sso oidc' },
        { title: i['runbooks/sso-saml-setup'], slug: 'runbooks/sso-saml-setup', searchAliases: 'sso saml' },
        { title: i['runbooks/sso-acceptance-checklist'], slug: 'runbooks/sso-acceptance-checklist' },
        { title: i['runbooks/audit-pg-backfill'], slug: 'runbooks/audit-pg-backfill', searchAliases: 'audit 审计' },
        { title: i['runbooks/policy-snapshot-rollback'], slug: 'runbooks/policy-snapshot-rollback', searchAliases: 'policy 策略' },
        {
          title: i['runbooks/postgres-ddl-lock-waiting'],
          slug: 'runbooks/postgres-ddl-lock-waiting',
          searchAliases: 'postgres postgresql ddl lock create table waiting migrate 迁移 锁 等待',
        },
        { title: i['runbooks/gateway-channel-relay'], slug: 'runbooks/gateway-channel-relay' },
        { title: i['runbooks/cloudflare-quick-tunnel-setup'], slug: 'runbooks/cloudflare-quick-tunnel-setup' },
        { title: i['runbooks/ngrok-demo-setup'], slug: 'runbooks/ngrok-demo-setup' },
        { title: i['runbooks/ai-cache'], slug: 'runbooks/ai-cache' },
        { title: i['runbooks/multi-protocol'], slug: 'runbooks/multi-protocol' },
        { title: i['runbooks/mcp-hosting'], slug: 'runbooks/mcp-hosting' },
        { title: i['runbooks/wasm-plugins'], slug: 'runbooks/wasm-plugins' },
      ],
    },
    {
      title: s.adr,
      items: [
        {
          title: i['adr/0001-oss-foundations-selection'],
          slug: 'adr/0001-oss-foundations-selection',
        },
      ],
    },
    {
      title: s.sales,
      items: [
        { title: i['mvp-acceptance-checklist-v20260422'], slug: 'mvp-acceptance-checklist-v20260422' },
        { title: i['sales/sso-demo-script'], slug: 'sales/sso-demo-script', searchAliases: 'sso demo sales' },
        {
          title: i['guides/enterprise-customers-collaboration'],
          slug: 'guides/enterprise-customers-collaboration',
        },
      ],
    },
    {
      title: s.legal,
      items: [
        {
          title: i['legal/third-party-implementation-policy'],
          slug: 'legal/third-party-implementation-policy',
        },
      ],
    },
  ];
}

export function getFlatEnterpriseNavigation(t: Dictionary) {
  return getEnterpriseDocNavigation(t).flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      section: section.title,
    })),
  );
}

export function getEnterprisePrevNext(t: Dictionary, currentSlug: string) {
  const flat = getFlatEnterpriseNavigation(t);
  const currentIndex = flat.findIndex((item) => item.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? flat[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < flat.length - 1
        ? flat[currentIndex + 1]
        : null,
  };
}

/** @deprecated Use getEnterpriseDocNavigation(t) with dictionary */
export const enterpriseDocNavigation: EnterpriseDocNavSection[] = [];

/** @deprecated Use getFlatEnterpriseNavigation(t) */
export const flatEnterpriseNavigation: ReturnType<typeof getFlatEnterpriseNavigation> = [];

/** @deprecated Use getEnterpriseDocNavigation(t) */
export function getEnterpriseNavigationTree() {
  return enterpriseDocNavigation;
}

/** @deprecated Use getEnterprisePrevNext(t, slug) */
export function getEnterprisePrevNextLegacy(currentSlug: string) {
  return { prev: null, next: null };
}
