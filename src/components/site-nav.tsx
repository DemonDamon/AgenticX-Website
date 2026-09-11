'use client';

import Link from 'next/link';
import { Github, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';
import { useState } from 'react';

export function SiteNav({ active }: { active?: 'enterprise' | 'home' | 'ontology' }) {
  const { locale } = useLocale();
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = (isActive: boolean) =>
    `text-sm transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href={localizedPath('/', locale)} className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <span className="text-sm font-bold text-background">AX</span>
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
          <ThemeToggle />
          <LocaleSwitcher />
          <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
            <Button
              size="sm"
              variant="outline"
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Github className="mr-2 h-4 w-4" />
              {t.common.github}
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LocaleSwitcher />
          <button
            type="button"
            className="text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-4 px-6 py-4">
            <a href={localizedPath('/#features', locale)} className="block text-sm text-muted-foreground">
              {t.nav.features}
            </a>
            <Link href={localizedPath('/enterprise', locale)} className="block text-sm text-muted-foreground">
              {t.nav.enterprise}
            </Link>
            <a href={localizedPath('/#code', locale)} className="block text-sm text-muted-foreground">
              {t.nav.examples}
            </a>
            <a href="/prototype/orion" className="block text-sm text-muted-foreground">
              {t.nav.ontology}
            </a>
            <Link href={localizedPath('/docs', locale)} className="block text-sm text-muted-foreground">
              {t.nav.documentation}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
