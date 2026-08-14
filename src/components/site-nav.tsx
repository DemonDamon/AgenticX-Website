'use client';

import Link from 'next/link';
import { Github, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';
import { useState } from 'react';

export function SiteNav({ active }: { active?: 'enterprise' | 'home' | 'ontology' }) {
  const { locale } = useLocale();
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = (isActive: boolean) =>
    `text-sm transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900 bg-black/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href={localizedPath('/', locale)} className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <span className="text-sm font-bold text-black">AX</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">AgenticX</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a href={localizedPath('/#features', locale)} className={linkClass(false)}>
            {t.nav.features}
          </a>
          <Link href={localizedPath('/enterprise', locale)} className={linkClass(active === 'enterprise')}>
            {t.nav.enterprise}
          </Link>
          <a href={localizedPath('/#code', locale)} className={linkClass(false)}>
            {t.nav.examples}
          </a>
          <a href="/prototype/orion" className={linkClass(active === 'ontology')}>
            {t.nav.ontology}
          </a>
          <Link href={localizedPath('/docs', locale)} className={linkClass(false)}>
            {t.nav.documentation}
          </Link>
          <LocaleSwitcher />
          <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
            <Button
              size="sm"
              variant="outline"
              className="border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white"
            >
              <Github className="mr-2 h-4 w-4" />
              {t.common.github}
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher />
          <button
            type="button"
            className="text-neutral-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-neutral-900 bg-black md:hidden">
          <div className="space-y-4 px-6 py-4">
            <a href={localizedPath('/#features', locale)} className="block text-sm text-neutral-400">
              {t.nav.features}
            </a>
            <Link href={localizedPath('/enterprise', locale)} className="block text-sm text-neutral-400">
              {t.nav.enterprise}
            </Link>
            <a href={localizedPath('/#code', locale)} className="block text-sm text-neutral-400">
              {t.nav.examples}
            </a>
            <a href="/prototype/orion" className="block text-sm text-neutral-400">
              {t.nav.ontology}
            </a>
            <Link href={localizedPath('/docs', locale)} className="block text-sm text-neutral-400">
              {t.nav.documentation}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
