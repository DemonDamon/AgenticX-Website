import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Building2,
  Github,
  Globe,
  Server,
  Shield,
  Users,
} from 'lucide-react';
import { SecurityAdvisoryBanner } from '@/components/security-advisory-banner';

const pillars = [
  {
    title: 'Web Portal',
    description:
      '员工前台：Web 聊天工作区、模型选择、会话历史与合规拦截体验，面向企业终端用户。',
    href: '/enterprise/docs/api/web-portal',
    icon: Globe,
  },
  {
    title: 'Admin Console',
    description:
      '管理后台：IAM、策略规则、审计、计量、模型服务与 Channel 管理，面向运维与管理员。',
    href: '/enterprise/docs/api/admin-console',
    icon: Building2,
  },
  {
    title: 'AI Gateway',
    description:
      'OpenAI 兼容 API、三通道策略评估、审计链、Token 计量与多上游路由，统一模型接入与管控。',
    href: '/enterprise/docs/gateway/overview',
    icon: Server,
  },
];

const capabilities = [
  { icon: Users, label: 'IAM & RBAC', href: '/enterprise/docs/rbac/scopes' },
  { icon: Shield, label: 'Policy Engine', href: '/enterprise/docs/gateway/policy-engine' },
  { icon: Server, label: 'Gateway Routing', href: '/enterprise/docs/gateway/overview' },
  { icon: Globe, label: 'SSO / OIDC', href: '/enterprise/docs/runbooks/sso-oidc-setup' },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <span className="text-sm font-bold text-black">AX</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">AgenticX</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#features" className="text-sm text-neutral-400 transition-colors hover:text-white">
              Features
            </Link>
            <Link href="/enterprise" className="text-sm text-white transition-colors">
              Enterprise
            </Link>
            <Link href="/#code" className="text-sm text-neutral-400 transition-colors hover:text-white">
              Examples
            </Link>
            <Link href="/docs" className="text-sm text-neutral-400 transition-colors hover:text-white">
              Documentation
            </Link>
            <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
              <Button
                size="sm"
                variant="outline"
                className="border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </Link>
          </div>

          <Link href="/enterprise/docs" className="md:hidden">
            <Button size="sm" variant="outline" className="border-neutral-800 text-neutral-300">
              Docs
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-16">
        <SecurityAdvisoryBanner align="marketing" />

        <section className="px-6 pb-20 pt-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-violet-400">
                AgenticX Enterprise
              </p>
              <h1 className="mb-6 text-5xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
                企业级大模型应用
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  一体化平台
                </span>
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
                员工前台、管理后台与 AI 网关三端联动，共享 Postgres 多租户数据层与统一 RBAC。
                面向企业客户的 Web 端管控与模型接入，与 Machi Desktop 端侧闭环互补。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/enterprise/docs">
                  <Button size="lg" className="bg-white text-black hover:bg-neutral-200">
                    查看文档
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://github.com/DemonDamon/AgenticX/tree/main/enterprise" target="_blank">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-3xl font-semibold">三端架构</h2>
            <p className="mb-10 max-w-2xl text-neutral-400">
              web-portal（:3000）面向员工，admin-console（:3001）面向管理员，gateway（:8088）统一模型 API 与策略执行。
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {pillars.map((pillar) => (
                <Link
                  key={pillar.title}
                  href={pillar.href}
                  className="group rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:border-violet-500/40 hover:bg-neutral-900/50"
                >
                  <pillar.icon className="mb-4 h-8 w-8 text-violet-400" />
                  <h3 className="mb-2 text-xl font-medium">{pillar.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-neutral-400">{pillar.description}</p>
                  <span className="inline-flex items-center text-sm text-violet-300 group-hover:text-violet-200">
                    了解更多
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-3xl font-semibold">核心能力</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((cap) => (
                <Link
                  key={cap.label}
                  href={cap.href}
                  className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
                >
                  <cap.icon className="h-5 w-5 text-violet-400" />
                  <span className="text-sm font-medium text-neutral-200">{cap.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900 px-6 py-20">
          <div className="mx-auto max-w-6xl rounded-2xl border border-neutral-800 bg-neutral-950 p-8 md:p-12">
            <h2 className="mb-4 text-2xl font-semibold">架构概览</h2>
            <pre className="overflow-x-auto rounded-lg border border-neutral-800 bg-black p-4 text-sm leading-relaxed text-neutral-300">
{`员工浏览器 ──► web-portal (Next.js :3000)
管理员浏览器 ──► admin-console (Next.js :3001)
                    │
                    ├── PostgreSQL (IAM · Chat · Policy · Audit · Usage)
                    └── gateway (Go :8088) ──► OpenAI 兼容上游`}
            </pre>
            <div className="mt-6">
              <Link href="/enterprise/docs/architecture/overview">
                <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:text-white">
                  阅读完整架构文档
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-neutral-900 px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
                <span className="text-xs font-bold text-black">AX</span>
              </div>
              <span className="text-sm text-neutral-400">AgenticX Enterprise</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <Link href="/">Home</Link>
              <Link href="/enterprise/docs">Docs</Link>
              <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
                GitHub
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
