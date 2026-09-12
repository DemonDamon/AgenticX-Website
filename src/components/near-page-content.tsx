'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Folder, Github, Monitor, Server } from 'lucide-react';
import { HeroBackdrop } from '@/components/bits/hero-backdrop';
import { DiagramFigure } from '@/components/diagram-figure';
import { SiteMark } from '@/components/site-mark';
import { SecurityAdvisoryBanner } from '@/components/security-advisory-banner';
import { SiteNav } from '@/components/site-nav';
import { useSiteUiTheme } from '@/hooks/use-site-ui-theme';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';

export function NearPageContent() {
  const { locale } = useLocale();
  const t = useTranslations();
  const { resolved } = useSiteUiTheme();
  const np = t.nearPage;

  const pillars = [
    {
      title: np.pillars.workspace.title,
      description: np.pillars.workspace.description,
      href: localizedPath('/near/docs', locale),
      icon: Folder,
    },
    {
      title: np.pillars.runtime.title,
      description: np.pillars.runtime.description,
      href: localizedPath('/docs/concepts/agent', locale),
      icon: Monitor,
    },
    {
      title: np.pillars.studio.title,
      description: np.pillars.studio.description,
      href: localizedPath('/docs/guides/studio', locale),
      icon: Server,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="near" />

      <main className="pt-16">
        <SecurityAdvisoryBanner align="marketing" />

        <section className="relative overflow-hidden px-6 pb-20 pt-8">
          <HeroBackdrop opacity={0.16} speed={0.18} lightMode={resolved === 'light'} />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {np.badge}
              </p>
              <h1 className="mb-6 text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl">
                {np.hero.titleLine1}
                <br />
                <span className="text-muted-foreground">{np.hero.titleLine2}</span>
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {np.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={localizedPath('/near/docs', locale)}>
                  <Button size="lg" className="rounded-full bg-foreground text-background hover:opacity-90">
                    {np.hero.viewDocs}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://github.com/DemonDamon/AgenticX/tree/main/desktop" target="_blank">
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
              <DiagramFigure name="near" alt={np.architecture.overviewTitle} caption={np.architecture.caption} />
              <div className="mt-6">
                <Link href={localizedPath('/near/docs', locale)}>
                  <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground">
                    {np.architecture.readFull}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-3xl font-semibold">{np.architecture.title}</h2>
            <p className="mb-10 max-w-2xl text-muted-foreground">{np.architecture.subtitle}</p>
            <div className="grid gap-6 md:grid-cols-3">
              {pillars.map((pillar) => (
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

        <footer className="border-t border-border px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <SiteMark className="h-6 w-6" />
              <span className="text-sm text-muted-foreground">{np.footer.brand}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href={localizedPath('/', locale)}>{t.common.home}</Link>
              <Link href={localizedPath('/near/docs', locale)}>{t.common.docs}</Link>
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
