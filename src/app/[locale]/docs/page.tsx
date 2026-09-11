import Link from 'next/link';
import { DocContent } from '@/components/docs/content';
import { DiagramFigure } from '@/components/diagram-figure';
import {
  Rocket,
  Code,
  Cpu,
  Layers,
  Monitor,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import { defaultLocale, isLocale, localizedPath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function DocsPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getDictionary(locale);
  const d = t.frameworkDocs.landing;

  return (
    <DocContent
      title={d.title}
      description={d.description}
      slug="index"
    >
      <p>{d.intro}</p>

      <div className="not-prose my-8">
        <DiagramFigure name="product" alt={d.architecture} />
      </div>

      <h2>{d.quickStartHeading}</h2>
      <div className="grid gap-4 not-prose md:grid-cols-1">
        <Link
          href={localizedPath('/docs/getting-started/installation', locale)}
          className="group flex items-center justify-between gap-6 border-b border-border py-5"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-muted p-3">
              <Rocket className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{d.installation}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.installationDesc}</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">-&gt;</span>
        </Link>
        <Link
          href={localizedPath('/docs/getting-started/quickstart', locale)}
          className="group flex items-center justify-between gap-6 border-b border-border py-5"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-muted p-3">
              <Code className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{d.quickstart}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.quickstartDesc}</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">-&gt;</span>
        </Link>
      </div>

      <h2>{d.coreConceptsHeading}</h2>
      <div className="not-prose border-t border-border">
        <Link
          href={localizedPath('/docs/concepts/architecture', locale)}
          className="group flex items-center justify-between gap-6 border-b border-border py-5"
        >
          <div className="flex items-start gap-4">
            <Layers className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
            <div>
              <h3 className="font-medium text-foreground">{d.architecture}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.architectureDesc}</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">-&gt;</span>
        </Link>
        <Link
          href={localizedPath('/docs/concepts/near', locale)}
          className="group flex items-center justify-between gap-6 border-b border-border py-5"
        >
          <div className="flex items-start gap-4">
            <Monitor className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
            <div>
              <h3 className="font-medium text-foreground">{d.near}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.nearDesc}</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">-&gt;</span>
        </Link>
        <Link
          href={localizedPath('/docs/concepts/agent', locale)}
          className="group flex items-center justify-between gap-6 border-b border-border py-5"
        >
          <div className="flex items-start gap-4">
            <Cpu className="mt-1 h-6 w-6 flex-shrink-0 text-muted-foreground" />
            <div>
              <h3 className="font-medium text-foreground">{d.agent}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.agentDesc}</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">-&gt;</span>
        </Link>
      </div>

      <h2>{t.frameworkDocs.landing.referenceHeading}</h2>
      <div className="grid gap-4 not-prose md:grid-cols-2">
        <Link
          href={localizedPath('/docs/cli', locale)}
          className="group flex items-start gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-muted"
        >
          <Terminal className="h-6 w-6 text-muted-foreground" />
          <div>
            <h3 className="font-medium text-foreground">{d.cliRef}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d.cliRefDesc}</p>
          </div>
        </Link>
        <Link
          href={localizedPath('/docs/faq', locale)}
          className="group flex items-start gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-muted"
        >
          <HelpCircle className="h-6 w-6 text-muted-foreground" />
          <div>
            <h3 className="font-medium text-foreground">{d.faq}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d.faqDesc}</p>
          </div>
        </Link>
      </div>

      <h2>{d.resourcesHeading}</h2>
      <ul>
        <li>
          <a href="https://github.com/DemonDamon/AgenticX" target="_blank" rel="noopener noreferrer">
            {d.githubRepo}
          </a>
        </li>
        <li>
          <a href="https://pypi.org/project/agenticx/" target="_blank" rel="noopener noreferrer">
            {d.pypiPackage}
          </a>
        </li>
        <li>
          <a href="https://github.com/DemonDamon/AgenticX/discussions" target="_blank" rel="noopener noreferrer">
            {d.communityDiscussions}
          </a>
        </li>
      </ul>
    </DocContent>
  );
}
