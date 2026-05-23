export interface EnterpriseDocNavItem {
  title: string;
  slug: string;
  searchAliases?: string;
}

export interface EnterpriseDocNavSection {
  title: string;
  items: EnterpriseDocNavItem[];
}

export const enterpriseDocNavigation: EnterpriseDocNavSection[] = [
  {
    title: 'Overview',
    items: [{ title: 'Introduction', slug: 'index' }],
  },
  {
    title: 'Architecture',
    items: [
      { title: 'Overview', slug: 'architecture/overview' },
      { title: 'Data Flow', slug: 'architecture/data-flow' },
      { title: 'Plugin Runtime', slug: 'architecture/plugin-runtime' },
      { title: 'MCP Hosting', slug: 'architecture/mcp-hosting' },
      { title: 'Cache & Pricing', slug: 'architecture/cache-and-pricing' },
      { title: 'Protocol Translation', slug: 'architecture/protocol-translation' },
    ],
  },
  {
    title: 'Apps & Modules',
    items: [
      { title: 'Apps', slug: 'apps' },
      { title: 'Features', slug: 'features' },
      { title: 'Packages', slug: 'packages' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Index', slug: 'api' },
      { title: 'Web Portal', slug: 'api/web-portal' },
      { title: 'Admin Console', slug: 'api/admin-console' },
      { title: 'Gateway', slug: 'api/gateway' },
      { title: 'Internal API', slug: 'api/internal-api' },
    ],
  },
  {
    title: 'AI Gateway',
    items: [
      { title: 'Overview', slug: 'gateway/overview' },
      { title: 'Policy Engine', slug: 'gateway/policy-engine' },
      { title: 'Runtime Config', slug: 'gateway/runtime-config' },
      { title: 'API Tokens', slug: 'gateway/api-tokens' },
      { title: 'Keypool / PAT', slug: 'gateway/keypool-pat-overview' },
      { title: 'MCP Hosting', slug: 'gateway/mcp-hosting-overview' },
    ],
  },
  {
    title: 'Data & Permissions',
    items: [
      { title: 'Database Schema', slug: 'database/schema' },
      { title: 'RBAC Scopes', slug: 'rbac/scopes' },
    ],
  },
  {
    title: 'Configuration',
    items: [{ title: 'Env Vars', slug: 'configuration/env-vars' }],
  },
  {
    title: 'Plugins',
    items: [{ title: 'Plugin Protocol', slug: 'plugin-protocol' }],
  },
  {
    title: 'Development & Testing',
    items: [
      { title: 'Local Dev', slug: 'development/local-dev' },
      { title: 'Troubleshooting', slug: 'development/troubleshooting' },
      { title: 'Testing', slug: 'testing' },
      { title: 'Perf Baselines', slug: 'perf-baselines' },
    ],
  },
  {
    title: 'Observability',
    items: [
      {
        title: 'Overview',
        slug: 'observability',
        searchAliases: 'grafana metrics prometheus',
      },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { title: 'Deployment Index', slug: 'deployment' },
      { title: 'Vercel Env Checklist', slug: 'deployment/vercel-env-checklist' },
      { title: 'Vercel Git Autodeploy', slug: 'deployment/vercel-git-autodeploy' },
      { title: 'Supabase Migration', slug: 'deployment/supabase-migration-guide' },
      {
        title: 'Supabase Seed TLS Pitfall',
        slug: 'deployment/2026-05-12-supabase-seed-tls-pitfall',
      },
    ],
  },
  {
    title: 'Runbooks',
    items: [
      { title: 'SSO OIDC Setup', slug: 'runbooks/sso-oidc-setup', searchAliases: 'sso oidc' },
      { title: 'SSO SAML Setup', slug: 'runbooks/sso-saml-setup', searchAliases: 'sso saml' },
      { title: 'SSO Acceptance Checklist', slug: 'runbooks/sso-acceptance-checklist' },
      { title: 'Audit PG Backfill', slug: 'runbooks/audit-pg-backfill', searchAliases: 'audit' },
      { title: 'Policy Snapshot Rollback', slug: 'runbooks/policy-snapshot-rollback', searchAliases: 'policy' },
      { title: 'Gateway Channel Relay', slug: 'runbooks/gateway-channel-relay' },
      { title: 'Cloudflare Quick Tunnel', slug: 'runbooks/cloudflare-quick-tunnel-setup' },
      { title: 'ngrok Demo Setup', slug: 'runbooks/ngrok-demo-setup' },
      { title: 'AI Cache', slug: 'runbooks/ai-cache' },
      { title: 'Multi-Protocol', slug: 'runbooks/multi-protocol' },
      { title: 'MCP Hosting', slug: 'runbooks/mcp-hosting' },
      { title: 'WASM Plugins', slug: 'runbooks/wasm-plugins' },
    ],
  },
  {
    title: 'ADR',
    items: [
      {
        title: '0001 OSS Foundations Selection',
        slug: 'adr/0001-oss-foundations-selection',
      },
    ],
  },
  {
    title: 'Sales & Acceptance',
    items: [
      { title: 'MVP Acceptance Checklist', slug: 'mvp-acceptance-checklist-v20260422' },
      { title: 'SSO Demo Script', slug: 'sales/sso-demo-script', searchAliases: 'sso demo sales' },
      {
        title: 'Enterprise Customers Collaboration',
        slug: 'guides/enterprise-customers-collaboration',
      },
    ],
  },
  {
    title: 'Legal',
    items: [
      {
        title: 'Third-Party Implementation Policy',
        slug: 'legal/third-party-implementation-policy',
      },
    ],
  },
];

export const flatEnterpriseNavigation = enterpriseDocNavigation.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    section: section.title,
  })),
);

export function getEnterprisePrevNext(currentSlug: string) {
  const currentIndex = flatEnterpriseNavigation.findIndex(
    (item) => item.slug === currentSlug,
  );
  return {
    prev: currentIndex > 0 ? flatEnterpriseNavigation[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < flatEnterpriseNavigation.length - 1
        ? flatEnterpriseNavigation[currentIndex + 1]
        : null,
  };
}

export function getEnterpriseNavigationTree() {
  return enterpriseDocNavigation;
}
