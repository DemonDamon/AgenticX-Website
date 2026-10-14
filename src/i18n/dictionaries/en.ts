const sidebarItems: Record<string, string> = {
  index: 'Introduction',
  'architecture/overview': 'Overview',
  'architecture/data-flow': 'Data Flow',
  'architecture/plugin-runtime': 'Plugin Runtime',
  'architecture/mcp-hosting': 'MCP Hosting',
  'architecture/cache-and-pricing': 'Cache & Pricing',
  'architecture/protocol-translation': 'Protocol Translation',
  apps: 'Apps',
  features: 'Features',
  packages: 'Packages',
  api: 'Index',
  'api/web-portal': 'Web Portal',
  'api/admin-console': 'Admin Console',
  'api/gateway': 'Gateway',
  'api/internal-api': 'Internal API',
  'gateway/overview': 'Overview',
  'gateway/policy-engine': 'Policy Engine',
  'gateway/runtime-config': 'Runtime Config',
  'gateway/api-tokens': 'API Tokens',
  'gateway/keypool-pat-overview': 'Keypool / PAT',
  'gateway/mcp-hosting-overview': 'MCP Hosting',
  'database/schema': 'Database Schema',
  'rbac/scopes': 'RBAC Scopes',
  'configuration/env-vars': 'Env Vars',
  'plugin-protocol': 'Plugin Protocol',
  'development/local-dev': 'Local Dev',
  'development/troubleshooting': 'Troubleshooting',
  testing: 'Testing',
  'perf-baselines': 'Perf Baselines',
  observability: 'Overview',
  deployment: 'Deployment Index',
  'deployment/local-selfhost': 'Local / Self-Hosted (Docker)',
  'deployment/vercel-env-checklist': 'Vercel Env Checklist',
  'deployment/vercel-git-autodeploy': 'Vercel Git Autodeploy',
  'deployment/supabase-migration-guide': 'Supabase Migration Guide',
  'deployment/2026-05-12-supabase-seed-tls-pitfall': 'Supabase Seed TLS Pitfall',
  'runbooks/sso-oidc-setup': 'SSO OIDC Setup',
  'runbooks/sso-saml-setup': 'SSO SAML Setup',
  'runbooks/sso-acceptance-checklist': 'SSO Acceptance Checklist',
  'runbooks/audit-pg-backfill': 'Audit PG Backfill',
  'runbooks/policy-snapshot-rollback': 'Policy Snapshot Rollback',
  'runbooks/postgres-ddl-lock-waiting': 'PostgreSQL DDL Lock Waiting',
  'runbooks/gateway-channel-relay': 'Gateway Channel Relay',
  'runbooks/cloudflare-quick-tunnel-setup': 'Cloudflare Quick Tunnel',
  'runbooks/ngrok-demo-setup': 'ngrok Demo Setup',
  'runbooks/ai-cache': 'AI Cache',
  'runbooks/multi-protocol': 'Multi-Protocol',
  'runbooks/mcp-hosting': 'MCP Hosting',
  'runbooks/wasm-plugins': 'WASM Plugins',
  'adr/0001-oss-foundations-selection': '0001 OSS Foundations Selection',
  'mvp-acceptance-checklist-v20260422': 'MVP Acceptance Checklist',
  'sales/sso-demo-script': 'SSO Demo Script',
  'guides/enterprise-customers-collaboration': 'Enterprise Customers Collaboration',
  'legal/third-party-implementation-policy': 'Third-Party Implementation Policy',
};

export default {
  common: {
    home: 'Home',
    enterprise: 'Enterprise',
    docs: 'Docs',
    documentation: 'Documentation',
    github: 'GitHub',
    backToHome: 'Back to home',
    search: 'Search',
    loading: 'Loading…',
    previous: 'Previous',
    next: 'Next',
    learnMore: 'Learn more',
    license: 'License',
    pypi: 'PyPI',
  },
  nav: {
    features: 'Features',
    framework: 'Agx Framework',
    near: 'Near Desktop',
    enterprise: 'Enterprise Control Plane',
    examples: 'Examples',
    ontology: 'Ontology',
    documentation: 'Documentation',
    getStarted: 'Get Started',
    viewOnGithub: 'View on GitHub',
  },
  docsSwitcher: {
    framework: 'Framework',
    near: 'Near',
    enterprise: 'Enterprise',
  },
  nearDownload: {
    mac: 'Download for macOS',
    windows: 'Download for Windows',
    note: 'macOS is Apple silicon; Windows is x64',
  },
  localeSwitcher: {
    label: 'Language',
    zh: '中文',
    en: 'English',
  },
  theme: {
    label: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  securityBanner: {
    title: 'Security advisory — ',
    bodyBefore: 'Malicious ',
    bodyAfter:
      ' versions 1.82.7 and 1.82.8 were removed from PyPI (potential API key exfiltration). Uninstall them, rotate exposed credentials, and upgrade to a safe release (e.g. 1.82.9+). Run ',
    bodyVerify: ' to verify.',
  },
  sidebar: {
    brand: 'Enterprise',
    sections: {
      overview: 'Overview',
      architecture: 'Architecture',
      appsModules: 'Apps & Modules',
      apiReference: 'API Reference',
      gateway: 'AI Gateway',
      dataPermissions: 'Data & Permissions',
      configuration: 'Configuration',
      plugins: 'Plugins',
      devTesting: 'Development & Testing',
      observability: 'Observability',
      deployment: 'Deployment',
      runbooks: 'Runbooks',
      adr: 'ADR',
      sales: 'Sales & Acceptance',
      legal: 'Legal',
    },
    items: sidebarItems,
    searchPlaceholder: 'Search enterprise docs...',
    searchTitle: 'Search enterprise documentation',
    searchDescription: 'Jump to an enterprise documentation page.',
    searchEmpty: 'No results found.',
    backToEnterprise: '← Back to Enterprise overview',
  },
  docs: {
    breadcrumbHome: 'Home',
    breadcrumbEnterprise: 'Enterprise',
    breadcrumbDocs: 'Docs',
    englishUnavailableBanner:
      'This page is not yet available in English. Showing the Chinese original.',
    supportingAssets: 'Supporting assets',
    metadataTitle: 'Documentation | AgenticX Enterprise',
    metadataDescription:
      'AgenticX Enterprise documentation: architecture, API, AI gateway, deployment, and operations.',
  },
  frameworkDocs: {
    brand: 'AgenticX',
    breadcrumbDocs: 'Docs',
    searchButton: 'Search docs...',
    searchTitle: 'Search documentation',
    searchDescription: 'Jump to a documentation page.',
    searchEmpty: 'No results found.',
    version: 'Version',
    comingSoonTitle: 'Coming Soon',
    comingSoonBodyBefore:
      'This documentation page is being written. Please check back later or contribute on ',
    comingSoonBodyAfter: '.',
    expectedPath: 'Expected path:',
    metadataTitle: 'Documentation | AgenticX',
    zhFallbackNotice:
      'A Chinese version of this page is not yet available. Showing the English original.',
    enFallbackNotice:
      'This page is not yet available in English. Showing the Chinese original.',
    landing: {
      title: 'Framework documentation',
      description:
        'Python SDK, Studio Server, and Agent Runtime — the capability core shared by Near and Enterprise.',
      intro:
        'This door is the embeddable stack: Python SDK, Studio Server, and Agent Runtime. Near is the local desktop workspace. Enterprise is the governed web portal and Go gateway. Each product has its own docs entry.',
      siblingHeading: 'Other product docs',
      siblingNear: 'Near Desktop docs',
      siblingNearDesc: 'Local-first Electron workspace on top of agx serve.',
      siblingEnterprise: 'Enterprise docs',
      siblingEnterpriseDesc: 'Portal, admin console, and Go AI Gateway.',
      quickStartHeading: 'Quick Start',
      coreConceptsHeading: 'Core Concepts',
      referenceHeading: 'Reference',
      resourcesHeading: 'Resources',
      installation: 'Installation',
      installationDesc: 'Get started with AgenticX in minutes',
      quickstart: 'Quick Start',
      quickstartDesc: 'Create your first agent and run tasks',
      architecture: 'Architecture',
      architectureDesc: 'Three product forms and runtime paths',
      near: 'Near Desktop',
      nearDesc: 'Local-first multi-agent workspace',
      agent: 'Agent',
      agentDesc: 'The fundamental building block for intelligent agents',
      tools: 'Tools',
      toolsDesc: 'Extend agent capabilities with function tools',
      workflow: 'Workflow',
      workflowDesc: 'Orchestrate complex multi-agent interactions',
      cliRef: 'CLI Reference',
      cliRefDesc: 'Complete command-line interface documentation',
      faq: 'FAQ',
      faqDesc: 'Frequently asked questions and answers',
      githubRepo: 'GitHub Repository',
      pypiPackage: 'PyPI Package',
      communityDiscussions: 'Community Discussions',
    },
  },
  home: {
    metadata: {
      title: 'AgenticX | Unified Agent Stack',
      description:
        'One agent stack across the Python Runtime, Near Desktop, and Enterprise. Local-first workspace, enterprise compliance gateway.',
    },
    hero: {
      titleLine1: 'One agent platform',
      titleLine2: 'Local workspace, runtime,\nand enterprise governance',
      subtitle:
        'The SDK, Near Desktop, and the employee portal share one Python Runtime. Identity, policy, quota, and audit stay on the enterprise gateway.',
      getStarted: 'Get Started',
      viewGithub: 'View on GitHub',
      downloadNear: 'Download Near',
      viewDocs: 'Read the docs',
    },
    motion: {
      heroLive: 'Local runtime connected',
      terminal: {
        ready: 'Studio ready',
        host: '127.0.0.1',
      },
      route: {
        user: '@researcher look at this diff',
        meta: 'Meta · routed to researcher',
        reply: 'The auth branch still needs a regression.',
        tool: 'knowledge_search',
        busy: 'searching',
        done: 'done',
      },
    },
    promises: [
      {
        title: 'Three doors, one runtime',
        description: 'SDK, Near, and the enterprise portal share the Python Runtime, with separate deploy paths.',
      },
      {
        title: 'Avatars and group chat',
        description: 'A named avatar answers directly. Otherwise Meta coordinates, in a real session.',
      },
      {
        title: 'Identity and governance',
        description: 'Policy, audit, and quota stay on the enterprise gateway. The gateway does not replace the Python Runtime.',
      },
      {
        title: 'Local-first, open channels',
        description: 'Near runs on your machine. Feishu and WeChat messages land in the bound session.',
      },
    ],
    map: {
      title: 'Product map',
      intro:
        'Developers, the local workspace, and the employee portal enter from different doors. Capabilities sit in the Python Runtime. Identity, policy, quota, and audit are handled by the Go gateway.',
      caption: 'The Python Runtime is the capability core. The Enterprise gateway governs it and does not replace it.',
      columns: [
        { title: 'Entry', items: ['SDK', 'Near', 'Feishu / WeChat', 'Employee portal'] },
        { title: 'Runtime', items: ['Agent', 'Tools', 'Memory', 'Skills'] },
        { title: 'Collaboration', items: ['Avatars', 'Group chat', 'Meta dispatch'] },
        { title: 'Governance', items: ['Identity', 'Policy', 'Audit', 'Quota'] },
        { title: 'Assets', items: ['Models', 'MCP', 'Knowledge'] },
      ],
    },
    capabilities: {
      title: 'Capabilities',
      items: [
        {
          title: 'Three doors, one runtime',
          description: 'SDK snippets, the Near window, and portal chat meet in the same Runtime.',
        },
        {
          title: 'Avatars and group chat',
          description: 'A named member answers. Tool progress folds into one status card.',
        },
        {
          title: 'Memory, skills, knowledge',
          description: 'Sessions write workspace memory, skills enable per session, and documents enter the reply.',
        },
        {
          title: 'Policy, audit, quota',
          description: 'A block states the reason in user language. Audit is searchable by person and session. Tokens are metered per turn.',
        },
      ],
    },
    scenes: {
      title: 'Ways to use it',
      items: [
        {
          title: 'Embed as a developer',
          description: 'Install the Runtime and run it locally with the SDK or agx serve.',
          tags: [
            { title: 'Install', detail: 'pip install agenticx' },
            { title: 'Local server', detail: 'agx serve' },
            { title: 'Docs', detail: 'SDK and Studio' },
          ],
        },
        {
          title: 'Near on your machine',
          description: 'Multi-pane chat, avatars, group chat, terminal, and Voice Focus, wired to the local Runtime.',
          tags: [
            { title: 'Local-first', detail: 'Data stays on device' },
            { title: 'Group chat', detail: 'Meta coordinates' },
            { title: 'Feishu / WeChat', detail: 'Messages join the session' },
          ],
        },
        {
          title: 'Enterprise portal',
          description: 'Employee chat, the admin console, and the Go gateway for policy, audit, quota, and model relay.',
          tags: [
            { title: 'Employee portal', detail: 'Chat and model choice' },
            { title: 'Admin console', detail: 'Identity and policy' },
            { title: 'Gateway', detail: 'Audit and quota' },
          ],
        },
      ],
    },
    trust: {
      title: 'Safety and metering',
      items: [
        {
          title: 'Keys stay local or on the gateway',
          description: 'Desktop and the Runtime read local config. Enterprise calls relay through the gateway, without writing keys into the transcript.',
        },
        {
          title: 'Block and redact stay distinct',
          description: 'A warning is not a block. Redaction replaces the match. The next turn is evaluated on its own.',
        },
        {
          title: 'Audit by person and session',
          description: 'The gateway records each call and can be filtered by time, person, and session.',
        },
        {
          title: 'Tokens metered per turn',
          description: 'Model calls write usage back. The portal and admin console read the same record.',
        },
      ],
    },
    stack: {
      title: 'Product forms',
      subtitle: 'Use the SDK and Studio to build, Near as a local workspace, and Enterprise for governed web access.',
      readDocs: 'Read documentation',
      core: {
        title: 'Core / Runtime',
        description: 'Python SDK, Studio Server, and Agent Runtime for orchestration, tools, memory, knowledge, and skills.',
        caption: 'SDK and Studio share one Python Runtime. This is the framework door.',
      },
      near: {
        title: 'Near Desktop',
        description: 'Electron local-first workspace with multi-pane chat, avatars, group chat, terminal, automation, and Voice Focus.',
        caption: 'Near talks to the local Runtime by default over REST and SSE.',
      },
      enterprise: {
        title: 'Enterprise',
        description: 'Employee portal, admin console, and Go AI Gateway for identity, policy, quota, audit, and model relay.',
        caption: 'Enterprise currently uses a separate Go gateway path, not the Python Agent Runtime.',
      },
    },
    features: {
      title: 'Core capabilities',
      subtitle: 'From an embeddable ReAct loop to long-horizon coding, on one set of abstractions.',
      agentCore: {
        title: 'Agent Core',
        description: 'Meta-Agent dispatch, an embeddable ReActAgent, plus self-repair and overflow recovery.',
      },
      orchestration: {
        title: 'Orchestration',
        description: 'Graph workflows and Flow decorators with conditional routing and parallel execution.',
      },
      memory: {
        title: 'Memory System',
        description: 'Hierarchical memory, workspace memory, and Mem0 with compaction and hybrid search.',
      },
      stepDemo: {
        parse: 'Parse task',
        parseDesc: 'Analyze user request and extract intent',
        select: 'Select tools',
        selectDesc: 'Choose appropriate tools from registry',
        execute: 'Execute & respond',
        executeDesc: 'Run tools and format output',
        processing: 'Processing...',
      },
      memoryDemo: {
        stored: 'Session stored',
        retrieved: 'Context retrieved',
        consolidated: 'Memory consolidated',
      },
    },
    grid: {
      a2a: { title: 'A2A Communication', desc: 'Inter-agent messaging protocol' },
      mcp: { title: 'MCP Protocol', desc: 'Multi-server aggregation and resource access' },
      observability: { title: 'Observability', desc: 'Traces, metrics, and evaluation' },
      skills: { title: 'Skill evolution', desc: 'Observe tool calls and distill new skills' },
      brains: { title: 'Multi-brain knowledge', desc: 'Mountable doc brain and code brain' },
      longrun: { title: 'Long-horizon coding', desc: 'Isolated workspaces and a disk state machine' },
    },
    code: {
      title: 'Simple to use',
      subtitle: 'Build complex systems with minimal code.',
      tabs: { agent: 'Agent', workflow: 'Workflow', tools: 'Tools' },
    },
    quickstart: {
      title: 'Quick start',
      subtitle: 'Get up and running in minutes.',
      install: 'Install',
      configure: 'Configure',
      build: 'Build',
    },
    cta: {
      title: 'Start building today',
      subtitle: 'Join developers building the next generation of AI applications.',
      starGithub: 'Star on GitHub',
      pypiPackage: 'PyPI Package',
    },
    footer: {
      license: 'Apache-2.0 License',
    },
  },
  enterprisePage: {
    metadata: {
      title: 'Enterprise | AgenticX',
      description:
        'Employee portal, admin console, and Go AI Gateway for identity, policy, quota, audit, and model relay.',
    },
    badge: 'AgenticX Enterprise',
    hero: {
      titleLine1: 'Enterprise LLM applications',
      titleLine2: 'one control plane',
      subtitle:
        'Portal, admin console, and gateway share Postgres and unified RBAC. The gateway is compliance and model relay, not the Python Agent Runtime.',
      viewDocs: 'View documentation',
    },
    pillars: {
      webPortal: {
        title: 'Web Portal',
        description:
          'Employee-facing web chat workspace, model selection, session history, and compliance UX for end users.',
      },
      adminConsole: {
        title: 'Admin Console',
        description:
          'Admin console: IAM, policy rules, audit, metering, model services, and channel management for operators.',
      },
      aiGateway: {
        title: 'AI Gateway',
        description:
          'OpenAI-compatible API, three-channel policy evaluation, audit chain, token metering, and multi-upstream routing.',
      },
    },
    architecture: {
      title: 'Three-tier architecture',
      subtitle:
        'Portal for employees, Admin Console for operators, and the Go gateway for auth, policy, quota, and model relay.',
      caption: 'Edge Agent is a non-default MVP. Cluster Agent Runtime remains planned.',
      overviewTitle: 'Current online path',
      readFull: 'Read full architecture docs',
    },
    capabilities: {
      title: 'Core capabilities',
      iam: 'IAM & RBAC',
      policy: 'Policy Engine',
      routing: 'Gateway Routing',
      sso: 'SSO / OIDC',
    },
    footer: {
      brand: 'AgenticX Enterprise',
    },
  },
  nearPage: {
    metadata: {
      title: 'Near Desktop | AgenticX',
      description:
        'Local-first Electron workspace: multi-pane chat, avatars, group chat, terminal, automation, and Voice Focus on a local agx serve.',
    },
    badge: 'Near Desktop',
    hero: {
      titleLine1: 'Local-first workspace',
      titleLine2: 'on your own machine',
      subtitle:
        'Near is the desktop UI on top of a local agx serve. It is not a second agent runtime, and it is not the hosted Enterprise portal.',
      viewDocs: 'View documentation',
    },
    architecture: {
      title: 'How Near attaches',
      subtitle: 'Electron starts a local Runtime, writes the port and token, then talks REST and SSE.',
      caption: 'A remote agx serve mode is not the default product path.',
      overviewTitle: 'Near Desktop architecture',
      readFull: 'Read Near documentation',
    },
    pillars: {
      workspace: {
        title: 'Workspace',
        description:
          'Multi-pane chat, avatars, and group chat. Folders bind per Meta or avatar. @file keeps an absolute source path.',
      },
      runtime: {
        title: 'Local Runtime',
        description:
          'The default path spawns agx serve on this machine. Empty avatar lists usually mean the local server process died, not lost data.',
      },
      studio: {
        title: 'Studio Server',
        description:
          'Near is the renderer. Studio is the FastAPI process that owns sessions, tools, and the agent loop.',
      },
    },
    footer: {
      brand: 'Near Desktop',
    },
  },
  nearDocs: {
    brand: 'Near',
    breadcrumb: 'Near docs',
    backToNear: '← Back to Near',
    overview: 'Near Desktop',
    studio: 'Studio Server',
    runtime: 'Agent Runtime',
    configuration: 'Configuration',
  },
  privacy: {
    metadata: {
      title: 'Privacy Policy — Machi',
      description: 'Machi Privacy Policy',
    },
    backToLogin: '← Back to login',
    title: 'Machi Privacy Policy',
    effectiveDate: 'Effective: April 15, 2025 | Last updated: April 15, 2025',
  },
  terms: {
    metadata: {
      title: 'Terms of Service — Machi',
      description: 'Machi Terms of Service',
    },
    backToLogin: '← Back to login',
    title: 'Machi Terms of Service',
    effectiveDate: 'Effective: April 15, 2025 | Last updated: April 15, 2025',
  },
  site: {
    metadata: {
      titleDefault: 'AgenticX | Unified Agent Stack',
      titleTemplate: '%s | AgenticX',
      description:
        'One agent stack across the Python Runtime, Near Desktop, and Enterprise.',
    },
  },
};
