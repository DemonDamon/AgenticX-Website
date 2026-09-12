'use client';

import Link from 'next/link';
import { Github, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { SiteMark } from '@/components/site-mark';
import { ThemeToggle } from '@/components/theme-toggle';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';
import { useState } from 'react';

export function SiteNav({
  active,
}: {
  active?: 'enterprise' | 'framework' | 'home' | 'near' | 'ontology';
}) {
  const { locale } = useLocale();
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = (isActive: boolean) =>
    `text-sm transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`;

  const links = [
    { href: localizedPath('/docs', locale), label: t.nav.framework, active: active === 'framework', anchor: false },
    { href: localizedPath('/near', locale), label: t.nav.near, active: active === 'near', anchor: false },
    { href: localizedPath('/enterprise', locale), label: t.nav.enterprise, active: active === 'enterprise', anchor: false },
    { href: '/prototype/orion', label: t.nav.ontology, active: active === 'ontology', anchor: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href={localizedPath('/', locale)} className="flex items-center gap-3">
          <SiteMark />
          <span className="text-lg font-semibold tracking-tight">AgenticX</span>
        </Link>

        <div className="hidden items-center gap-4 lg:gap-6 md:flex">
          {links.map((item) =>
            item.anchor ? (
              <a key={item.label} href={item.href} className={linkClass(item.active)}>
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className={linkClass(item.active)}>
                {item.label}
              </Link>
            ),
          )}
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
            {links.map((item) =>
              item.anchor ? (
                <a key={item.label} href={item.href} className="block text-sm text-muted-foreground">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href} className="block text-sm text-muted-foreground">
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
