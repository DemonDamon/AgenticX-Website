'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Github,
  ArrowRight,
  Cpu,
  Layers,
  Database,
  Activity,
  MessageSquare,
  Terminal,
  Check,
  Copy,
} from 'lucide-react';
import { FadeContent } from '@/components/bits/fade-content';
import { HeroBackdrop } from '@/components/bits/hero-backdrop';
import { SplitHeading } from '@/components/bits/split-heading';
import { SpotlightCard } from '@/components/bits/spotlight-card';
import { DiagramFigure } from '@/components/diagram-figure';
import { SecurityAdvisoryBanner } from '@/components/security-advisory-banner';
import { SiteNav } from '@/components/site-nav';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';

function StaticAgentCode() {
  return (
    <div className="rounded-lg bg-neutral-900 p-4 font-mono text-sm">
      <pre className="whitespace-pre-wrap leading-relaxed text-neutral-300">
{`agent = Agent(id="assistant")
result = executor.run(task)`}
      </pre>
    </div>
  );
}

function StaticSteps() {
  const t = useTranslations();

  const stepContent = [
    { title: t.home.features.stepDemo.parse, desc: t.home.features.stepDemo.parseDesc },
    { title: t.home.features.stepDemo.select, desc: t.home.features.stepDemo.selectDesc },
    { title: t.home.features.stepDemo.execute, desc: t.home.features.stepDemo.executeDesc },
  ];

  return (
    <div className="rounded-lg bg-neutral-900 p-4">
      <div className="space-y-3">
        {stepContent.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/15">
              <Check className="h-3 w-3 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{step.title}</div>
              <div className="text-xs text-neutral-500">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaticMemory() {
  const t = useTranslations();

  const items = [
    t.home.features.memoryDemo.stored,
    t.home.features.memoryDemo.retrieved,
    t.home.features.memoryDemo.consolidated,
  ];

  return (
    <div className="flex min-h-[120px] flex-col justify-center rounded-lg bg-neutral-900 p-4">
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-neutral-400">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomePageContent() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const features = [
    {
      icon: <Cpu className="w-5 h-5" />,
      title: t.home.features.agentCore.title,
      description: t.home.features.agentCore.description,
      demo: <StaticAgentCode />,
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: t.home.features.orchestration.title,
      description: t.home.features.orchestration.description,
      demo: <StaticSteps />,
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: t.home.features.memory.title,
      description: t.home.features.memory.description,
      demo: <StaticMemory />,
    },
  ];

  const clusters = [
    {
      title: locale === 'en' ? 'Connect' : '连接',
      items: [
        { icon: <MessageSquare className="w-5 h-5" />, title: t.home.grid.a2a.title, desc: t.home.grid.a2a.desc },
        { icon: <Terminal className="w-5 h-5" />, title: t.home.grid.mcp.title, desc: t.home.grid.mcp.desc },
      ],
    },
    {
      title: locale === 'en' ? 'Observe' : '观察',
      items: [
        { icon: <Activity className="w-5 h-5" />, title: t.home.grid.observability.title, desc: t.home.grid.observability.desc },
        { icon: <Cpu className="w-5 h-5" />, title: t.home.grid.skills.title, desc: t.home.grid.skills.desc },
      ],
    },
    {
      title: locale === 'en' ? 'Expand' : '扩展',
      items: [
        { icon: <Database className="w-5 h-5" />, title: t.home.grid.brains.title, desc: t.home.grid.brains.desc },
        { icon: <Layers className="w-5 h-5" />, title: t.home.grid.longrun.title, desc: t.home.grid.longrun.desc },
      ],
    },
  ];

  const agentExample = `from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

agent = Agent(
    id="research-agent",
    name="Research Assistant",
    role="Information gatherer",
    goal="Find and synthesize information"
)

task = Task(
    description="Research latest AI frameworks",
    expected_output="Comprehensive analysis"
)

executor = AgentExecutor(agent=agent, llm=OpenAIProvider())
result = executor.run(task)`;

  const copyStep = async (step: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStep(step);
      setTimeout(() => {
        setCopiedStep((cur) => (cur === step ? null : cur));
      }, 1500);
    } catch {
      setCopiedStep(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav />

      <main className="pt-16">
        <SecurityAdvisoryBanner align="marketing" />

        <section className="relative overflow-hidden px-6 pb-20 pt-8">
          <HeroBackdrop />
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                {locale === 'en' ? 'Local-first agent stack' : '本地优先智能体技术栈'}
              </p>
              <h1 className="mb-6 text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl">
                <SplitHeading text={t.home.hero.titleLine1} />
                <br />
                <SplitHeading
                  text={t.home.hero.titleLine2}
                  className="text-neutral-200"
                  delayMs={t.home.hero.titleLine1.length * 32}
                />
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-neutral-400">{t.home.hero.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="#quickstart">
                  <Button size="lg" className="group rounded-full bg-white text-black hover:bg-neutral-200">
                    {t.home.hero.getStarted}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
                  <Button size="lg" variant="outline" className="rounded-full border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white">
                    {t.home.hero.viewGithub}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:col-span-6">
              <FadeContent>
                <DiagramFigure name="runtime-path" alt={t.home.stack.title} caption={t.home.stack.caption} />
              </FadeContent>
              <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-sm">
                <p className="text-neutral-300">$ agx serve --host 127.0.0.1 --port 8000</p>
                <p className="mt-2 text-emerald-400">Studio ready on 127.0.0.1:8000</p>
              </div>
            </div>
          </div>
        </section>

        <section id="stack" className="border-t border-neutral-900 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <FadeContent>
              <div className="mb-10">
                <h2 className="mb-3 text-3xl font-semibold">{t.home.stack.title}</h2>
                <p className="max-w-2xl text-neutral-400">{t.home.stack.subtitle}</p>
              </div>
            </FadeContent>
            <FadeContent>
              <DiagramFigure name="product-stack" alt={t.home.stack.title} caption={t.home.stack.caption} />
            </FadeContent>
            <div className="mt-8 border-t border-neutral-900">
              {[
                { title: t.home.stack.core.title, description: t.home.stack.core.description, href: localizedPath('/docs/concepts/architecture', locale) },
                { title: t.home.stack.near.title, description: t.home.stack.near.description, href: localizedPath('/docs/concepts/near', locale) },
                { title: t.home.stack.enterprise.title, description: t.home.stack.enterprise.description, href: localizedPath('/enterprise', locale) },
              ].map((item) => (
                <Link key={item.title} href={item.href} className="group flex items-center justify-between gap-6 border-b border-neutral-900 py-5">
                  <div>
                    <h3 className="font-medium group-hover:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-400">{item.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-neutral-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-neutral-900 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <FadeContent>
              <div className="mb-12">
                <h2 className="mb-3 text-3xl font-semibold">{t.home.features.title}</h2>
                <p className="text-neutral-400">{t.home.features.subtitle}</p>
              </div>
            </FadeContent>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <FadeContent key={feature.title} delayMs={index * 40} className={index === 0 ? 'md:col-span-2' : ''}>
                  <SpotlightCard className="h-full group">
                    <div className="flex h-full flex-col p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-neutral-400 transition-colors group-hover:text-white">
                          {feature.icon}
                        </div>
                        <h3 className="font-medium">{feature.title}</h3>
                      </div>
                      <p className="mb-4 text-sm text-neutral-400">{feature.description}</p>
                      <div className="mt-auto">{feature.demo}</div>
                    </div>
                  </SpotlightCard>
                </FadeContent>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900 px-6 py-20">
          <FadeContent className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
              {clusters.map((cluster) => (
                <div key={cluster.title} className="rounded-2xl border border-neutral-800 bg-black p-6">
                  <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-neutral-500">{cluster.title}</h3>
                  <div>
                    {cluster.items.map((item) => (
                      <div key={item.title} className="flex items-start gap-3 border-t border-neutral-900 py-4 first:border-t-0 first:pt-2 last:pb-0">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-neutral-500">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="mb-1 font-medium">{item.title}</h4>
                          <p className="text-sm text-neutral-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeContent>
        </section>

        <section id="code" className="border-t border-neutral-900 px-6 py-20">
          <FadeContent className="mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="mb-3 text-3xl font-semibold">{t.home.code.title}</h2>
              <p className="text-neutral-400">{t.home.code.subtitle}</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2 border-b border-neutral-900 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-neutral-700" />
                  <div className="h-3 w-3 rounded-full bg-neutral-700" />
                  <div className="h-3 w-3 rounded-full bg-neutral-700" />
                </div>
                <span className="ml-2 font-mono text-xs text-neutral-500">example.py</span>
              </div>
              <pre className="overflow-x-auto bg-neutral-950 p-6 text-sm">
                <code className="font-mono leading-relaxed text-neutral-300">
                  {agentExample}
                </code>
              </pre>
            </div>
          </FadeContent>
        </section>

        <section id="quickstart" className="border-t border-neutral-900 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <FadeContent>
              <div className="mb-12">
                <h2 className="mb-3 text-3xl font-semibold">{t.home.quickstart.title}</h2>
                <p className="text-neutral-400">{t.home.quickstart.subtitle}</p>
              </div>
            </FadeContent>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { step: '01', title: t.home.quickstart.install, code: 'pip install agenticx' },
                { step: '02', title: t.home.quickstart.configure, code: 'export OPENAI_API_KEY="..."' },
                { step: '03', title: t.home.quickstart.build, code: 'agx serve' },
              ].map((item, index) => (
                <FadeContent key={item.step} delayMs={index * 40}>
                  <SpotlightCard>
                    <div className="p-6">
                      <div className="mb-3 font-mono text-xs text-neutral-600">{item.step}</div>
                      <h3 className="mb-3 font-medium">{item.title}</h3>
                      <div className="flex items-center justify-between gap-3 rounded-lg bg-neutral-900 px-4 py-3 font-mono text-sm text-emerald-400">
                        <span className="truncate">$ {item.code}</span>
                        <button
                          type="button"
                          onClick={() => copyStep(item.step, item.code)}
                          className="flex-shrink-0 text-neutral-500 transition-colors hover:text-white"
                          aria-label="Copy command"
                        >
                          {copiedStep === item.step ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </SpotlightCard>
                </FadeContent>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900 px-6 py-20">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="mb-4 text-3xl font-semibold">{t.home.cta.title}</h2>
            <p className="mx-auto mb-8 max-w-xl text-neutral-400">{t.home.cta.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
                <Button size="lg" className="group rounded-full bg-white text-black hover:bg-neutral-200">
                  <Github className="mr-2 h-4 w-4" />
                  {t.home.cta.starGithub}
                </Button>
              </Link>
              <Link href="https://pypi.org/project/agenticx/" target="_blank">
                <Button size="lg" variant="outline" className="rounded-full border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white">
                  {t.home.cta.pypiPackage}
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
              <span className="text-sm text-neutral-400">AgenticX</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">{t.common.github}</Link>
              <Link href="https://pypi.org/project/agenticx/" target="_blank">{t.common.pypi}</Link>
              <Link href="https://github.com/DemonDamon/AgenticX/blob/main/LICENSE" target="_blank">{t.common.license}</Link>
            </div>
            <p className="text-sm text-neutral-600">{t.home.footer.license}</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
