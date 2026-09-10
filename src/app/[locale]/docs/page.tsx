import Link from 'next/link';
import { DocContent } from '@/components/docs/content';
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

      <div className="not-prose my-8 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/diagrams/product-stack.svg" alt={d.architecture} className="block h-auto w-full" />
      </div>

      <h2>{d.quickStartHeading}</h2>
      <div className="grid gap-4 not-prose md:grid-cols-2">
        <Link
          href={localizedPath('/docs/getting-started/installation', locale)}
          className="group flex items-start gap-4 rounded-lg border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
        >
          <div className="rounded-lg bg-neutral-900 p-3">
            <Rocket className="h-6 w-6 text-neutral-300" />
          </div>
          <div>
            <h3 className="font-medium text-white">{d.installation}</h3>
            <p className="mt-1 text-sm text-neutral-400">{d.installationDesc}</p>
          </div>
        </Link>
        <Link
          href={localizedPath('/docs/getting-started/quickstart', locale)}
          className="group flex items-start gap-4 rounded-lg border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
        >
          <div className="rounded-lg bg-neutral-900 p-3">
            <Code className="h-6 w-6 text-neutral-300" />
          </div>
          <div>
            <h3 className="font-medium text-white">{d.quickstart}</h3>
            <p className="mt-1 text-sm text-neutral-400">{d.quickstartDesc}</p>
          </div>
        </Link>
      </div>

      <h2>{d.coreConceptsHeading}</h2>
      <div className="grid gap-4 not-prose md:grid-cols-3">
        <Link
          href={localizedPath('/docs/concepts/architecture', locale)}
          className="group rounded-lg border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
        >
          <Layers className="h-8 w-8 text-neutral-300" />
          <h3 className="mt-4 font-medium text-white">{d.architecture}</h3>
          <p className="mt-2 text-sm text-neutral-400">{d.architectureDesc}</p>
        </Link>
        <Link
          href={localizedPath('/docs/concepts/near', locale)}
          className="group rounded-lg border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
        >
          <Monitor className="h-8 w-8 text-neutral-300" />
          <h3 className="mt-4 font-medium text-white">{d.near}</h3>
          <p className="mt-2 text-sm text-neutral-400">{d.nearDesc}</p>
        </Link>
        <Link
          href={localizedPath('/docs/concepts/agent', locale)}
          className="group rounded-lg border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
        >
          <Cpu className="h-8 w-8 text-neutral-300" />
          <h3 className="mt-4 font-medium text-white">{d.agent}</h3>
          <p className="mt-2 text-sm text-neutral-400">{d.agentDesc}</p>
        </Link>
      </div>

      <h2>{t.frameworkDocs.landing.referenceHeading}</h2>
      <div className="grid gap-4 not-prose md:grid-cols-2">
        <Link
          href={localizedPath('/docs/cli', locale)}
          className="group flex items-start gap-4 rounded-lg border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
        >
          <Terminal className="h-6 w-6 text-gray-400" />
          <div>
            <h3 className="font-medium text-white">{d.cliRef}</h3>
            <p className="mt-1 text-sm text-gray-400">{d.cliRefDesc}</p>
          </div>
        </Link>
        <Link
          href={localizedPath('/docs/faq', locale)}
          className="group flex items-start gap-4 rounded-lg border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
        >
          <HelpCircle className="h-6 w-6 text-gray-400" />
          <div>
            <h3 className="font-medium text-white">{d.faq}</h3>
            <p className="mt-1 text-sm text-gray-400">{d.faqDesc}</p>
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
