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
import { HeroBackdrop } from '@/components/bits/hero-backdrop';
import { DiagramFigure } from '@/components/diagram-figure';
import { SiteMark } from '@/components/site-mark';
import { SecurityAdvisoryBanner } from '@/components/security-advisory-banner';
import { SiteNav } from '@/components/site-nav';
import { useSiteUiTheme } from '@/hooks/use-site-ui-theme';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';

export function EnterprisePageContent() {
  const { locale } = useLocale();
  const t = useTranslations();
  const { resolved } = useSiteUiTheme();
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

  const [portalPillar, adminPillar, gatewayPillar] = pillars as [typeof pillars[number], typeof pillars[number], typeof pillars[number]];

  const capabilities = [
    { icon: Users, label: ep.capabilities.iam, href: localizedPath('/enterprise/docs/rbac/scopes', locale) },
    { icon: Shield, label: ep.capabilities.policy, href: localizedPath('/enterprise/docs/gateway/policy-engine', locale) },
    { icon: Server, label: ep.capabilities.routing, href: localizedPath('/enterprise/docs/gateway/overview', locale) },
    { icon: Globe, label: ep.capabilities.sso, href: localizedPath('/enterprise/docs/runbooks/sso-oidc-setup', locale) },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="enterprise" />

      <main className="pt-16">
        <SecurityAdvisoryBanner align="marketing" />

        <section className="relative overflow-hidden px-6 pb-20 pt-8">
          <HeroBackdrop opacity={0.16} speed={0.18} lightMode={resolved === 'light'} />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {ep.badge}
              </p>
              <h1 className="mb-6 text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl">
                {ep.hero.titleLine1}
                <br />
                <span className="text-muted-foreground">
                  {ep.hero.titleLine2}
                </span>
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {ep.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={localizedPath('/enterprise/docs', locale)}>
                  <Button size="lg" className="rounded-full bg-foreground text-background hover:opacity-90">
                    {ep.hero.viewDocs}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://github.com/DemonDamon/AgenticX/tree/main/enterprise" target="_blank">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    {t.common.github}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12">
              <DiagramFigure name="enterprise" alt={ep.architecture.overviewTitle} caption={ep.architecture.caption} />
              <div className="mt-6">
                <Link href={localizedPath('/enterprise/docs/architecture/overview', locale)}>
                  <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground">
                    {ep.architecture.readFull}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-3xl font-semibold">{ep.architecture.title}</h2>
            <p className="mb-10 max-w-2xl text-muted-foreground">{ep.architecture.subtitle}</p>
            <Link
              href={gatewayPillar.href}
              className="group mb-6 flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 transition-colors hover:bg-muted md:flex-row md:items-center"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                <gatewayPillar.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-medium">{gatewayPillar.title}</h3>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{gatewayPillar.description}</p>
              </div>
              <span className="inline-flex flex-shrink-0 items-center text-sm text-muted-foreground group-hover:text-foreground">
                {t.common.learnMore}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <div className="grid gap-6 md:grid-cols-2">
              {[portalPillar, adminPillar].map((pillar) => (
                <Link
                  key={pillar.title}
                  href={pillar.href}
                  className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted"
                >
                  <pillar.icon className="mb-4 h-8 w-8 text-muted-foreground" />
                  <h3 className="mb-2 text-xl font-medium">{pillar.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                  <span className="inline-flex items-center text-sm text-muted-foreground group-hover:text-foreground">
                    {t.common.learnMore}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-3xl font-semibold">{ep.capabilities.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((cap) => (
                <Link
                  key={cap.label}
                  href={cap.href}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-4 transition-colors hover:bg-muted"
                >
                  <cap.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{cap.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-border px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <SiteMark className="h-6 w-6" />
              <span className="text-sm text-muted-foreground">{ep.footer.brand}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
