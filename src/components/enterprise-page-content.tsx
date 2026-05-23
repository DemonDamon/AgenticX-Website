'use client';

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
import { SiteNav } from '@/components/site-nav';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';

export function EnterprisePageContent() {
  const { locale } = useLocale();
  const t = useTranslations();
  const ep = t.enterprisePage;

  const pillars = [
    {
      title: ep.pillars.webPortal.title,
      description: ep.pillars.webPortal.description,
      href: localizedPath('/enterprise/docs/api/web-portal', locale),
      icon: Globe,
    },
    {
      title: ep.pillars.adminConsole.title,
      description: ep.pillars.adminConsole.description,
      href: localizedPath('/enterprise/docs/api/admin-console', locale),
      icon: Building2,
    },
    {
      title: ep.pillars.aiGateway.title,
      description: ep.pillars.aiGateway.description,
      href: localizedPath('/enterprise/docs/gateway/overview', locale),
      icon: Server,
    },
  ];

  const capabilities = [
    { icon: Users, label: ep.capabilities.iam, href: localizedPath('/enterprise/docs/rbac/scopes', locale) },
    { icon: Shield, label: ep.capabilities.policy, href: localizedPath('/enterprise/docs/gateway/policy-engine', locale) },
    { icon: Server, label: ep.capabilities.routing, href: localizedPath('/enterprise/docs/gateway/overview', locale) },
    { icon: Globe, label: ep.capabilities.sso, href: localizedPath('/enterprise/docs/runbooks/sso-oidc-setup', locale) },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav active="enterprise" />

      <main className="pt-16">
        <SecurityAdvisoryBanner align="marketing" />

        <section className="px-6 pb-20 pt-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-violet-400">
                {ep.badge}
              </p>
              <h1 className="mb-6 text-5xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
                {ep.hero.titleLine1}
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  {ep.hero.titleLine2}
                </span>
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
                {ep.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={localizedPath('/enterprise/docs', locale)}>
                  <Button size="lg" className="bg-white text-black hover:bg-neutral-200">
                    {ep.hero.viewDocs}
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
                    {t.common.github}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-3xl font-semibold">{ep.architecture.title}</h2>
            <p className="mb-10 max-w-2xl text-neutral-400">{ep.architecture.subtitle}</p>
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
                    {t.common.learnMore}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-3xl font-semibold">{ep.capabilities.title}</h2>
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
            <h2 className="mb-4 text-2xl font-semibold">{ep.architecture.overviewTitle}</h2>
            <pre className="overflow-x-auto rounded-lg border border-neutral-800 bg-black p-4 text-sm leading-relaxed text-neutral-300">
              {ep.architecture.diagram}
            </pre>
            <div className="mt-6">
              <Link href={localizedPath('/enterprise/docs/architecture/overview', locale)}>
                <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:text-white">
                  {ep.architecture.readFull}
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
              <span className="text-sm text-neutral-400">{ep.footer.brand}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <Link href={localizedPath('/', locale)}>{t.common.home}</Link>
              <Link href={localizedPath('/enterprise/docs', locale)}>{t.common.docs}</Link>
              <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
                {t.common.github}
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
