'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Github,
  KeyRound,
  Laptop,
  MessagesSquare,
  Scale,
  Shield,
  Waypoints,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroBackdrop } from '@/components/bits/hero-backdrop';
import { DiagramFigure } from '@/components/diagram-figure';
import { NearDownloadButtons, NearDownloadNote } from '@/components/near-download-buttons';
import { SecurityAdvisoryBanner } from '@/components/security-advisory-banner';
import { SiteMark } from '@/components/site-mark';
import { SiteNav } from '@/components/site-nav';
import { useSiteUiTheme } from '@/hooks/use-site-ui-theme';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';

const promiseIcons = [Waypoints, MessagesSquare, Shield, Laptop];
const trustIcons = [KeyRound, Shield, Scale, MessagesSquare];

export function HomePageContent() {
  const t = useTranslations();
  const { locale } = useLocale();
  const { resolved } = useSiteUiTheme();
  const home = t.home;

  const architectures = [
    { name: 'product' as const, copy: home.stack.core, href: localizedPath('/docs', locale) },
    { name: 'near' as const, copy: home.stack.near, href: localizedPath('/near/docs', locale) },
    { name: 'enterprise' as const, copy: home.stack.enterprise, href: localizedPath('/enterprise/docs', locale) },
  ];
  const capabilityArt = [
    '/diagrams/capabilities/runtime.jpg',
    '/diagrams/capabilities/collab.jpg',
    '/diagrams/capabilities/assets.jpg',
    '/diagrams/capabilities/governance.jpg',
  ];
  const sceneArt = [
    '/diagrams/scenes/developer.jpg',
    '/diagrams/scenes/team.jpg',
    '/diagrams/scenes/enterprise.jpg',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="home" />

      <main className="pt-16">
        <SecurityAdvisoryBanner align="marketing" />

        <section className="relative overflow-hidden px-6 pb-6 pt-14 md:pt-20">
          <HeroBackdrop lightMode={resolved === 'light'} />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="mb-4 text-sm font-medium tracking-wide text-[#7C6A5A] dark:text-[#D6C4B0]">
                  AgenticX
                </p>
                <h1 className="max-w-3xl font-semibold leading-[1.15] tracking-tight">
                  <span className="block text-4xl text-[#7C6A5A] dark:text-[#D6C4B0] sm:text-5xl">{home.hero.titleLine1}</span>
                  <span className="mt-3 block text-3xl text-foreground sm:text-4xl">
                    {home.hero.titleLine2.split('\n').map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {home.hero.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="#quickstart">
                    <Button size="lg" className="group rounded-full bg-foreground text-background hover:opacity-90">
                      {home.hero.getStarted}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <NearDownloadButtons />
                  <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
                    <Button size="lg" variant="outline" className="rounded-full border-border text-muted-foreground hover:bg-muted hover:text-foreground">
                      {home.hero.viewGithub}
                    </Button>
                  </Link>
                </div>
                <NearDownloadNote className="mt-4 text-sm text-muted-foreground" />
              </div>
              <div className="lg:col-span-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero/near-desktop.png"
                  alt={locale === 'en' ? 'Near Desktop' : 'Near 桌面'}
                  className="block w-full rounded-2xl border border-border bg-card shadow-[0_18px_48px_rgba(15,23,42,0.18)]"
                />
              </div>
            </div>

            <div className="mt-14 grid gap-8 border-t border-border/80 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {home.promises.map((item, index) => {
                const Icon = promiseIcons[index] ?? Waypoints;
                return (
                  <div key={item.title}>
                    <Icon className="mb-3 h-5 w-5 text-[#7C6A5A] dark:text-[#D6C4B0]" />
                    <h2 className="text-base font-medium">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight">{home.stack.title}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-muted-foreground">
              {home.stack.subtitle}
            </p>
            <div className="mt-14 space-y-16">
              {architectures.map((item) => (
                <div key={item.name}>
                  <h3 className="mb-2 text-xl font-medium">{item.copy.title}</h3>
                  <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.copy.description}</p>
                  <DiagramFigure name={item.name} alt={item.copy.title} caption={item.copy.caption} />
                  <Link
                    href={item.href}
                    className="group mt-5 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    {home.stack.readDocs}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">{home.capabilities.title}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {home.capabilities.items.map((item, index) => (
                <article key={item.title} className="flex flex-col rounded-3xl border border-border bg-card p-6">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={capabilityArt[index]}
                    alt={item.title}
                    className="mt-5 block w-full rounded-2xl bg-[#120d0a]"
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="quickstart" className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">{home.scenes.title}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {home.scenes.items.map((scene, index) => (
                <article key={scene.title} className="overflow-hidden rounded-3xl border border-border bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sceneArt[index]} alt={scene.title} className="aspect-video w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-medium">{scene.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{scene.description}</p>
                    <div className="mt-6 space-y-2">
                      {scene.tags.map((tag) => (
                        <div key={tag.title} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2">
                          <div className="text-sm font-medium">{tag.title}</div>
                          <div className="text-right text-xs text-muted-foreground">{tag.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">{home.trust.title}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {home.trust.items.map((item, index) => {
                const Icon = trustIcons[index] ?? Shield;
                return (
                  <article key={item.title} className="rounded-3xl border border-border bg-card p-5">
                    <Icon className="mb-4 h-5 w-5 text-[#7C6A5A] dark:text-[#D6C4B0]" />
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="mb-4 text-3xl font-semibold">{home.cta.title}</h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">{home.cta.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
                <Button size="lg" className="rounded-full bg-foreground text-background hover:opacity-90">
                  <Github className="h-4 w-4" />
                  {home.cta.starGithub}
                </Button>
              </Link>
              <Link href="https://pypi.org/project/agenticx/" target="_blank">
                <Button size="lg" variant="outline" className="rounded-full border-border text-foreground hover:bg-muted">
                  {home.cta.pypiPackage}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-border px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <SiteMark className="h-6 w-6" />
              <span className="text-sm text-muted-foreground">AgenticX</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">{t.common.github}</Link>
              <Link href="https://pypi.org/project/agenticx/" target="_blank">{t.common.pypi}</Link>
              <Link href="https://github.com/DemonDamon/AgenticX/blob/main/LICENSE" target="_blank">{t.common.license}</Link>
            </div>
            <p className="text-sm text-muted-foreground">{home.footer.license}</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
