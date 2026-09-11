'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { docNavigation, navTitle } from './navigation';
import { DocSearchCommand } from './doc-search-command';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, FileText } from 'lucide-react';
import { useLocale } from '@/i18n/locale-context';
import { localizedPath } from '@/i18n/config';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { SiteMark } from '@/components/site-mark';
import { ThemeToggle } from '@/components/theme-toggle';

interface SidebarItemProps {
  title: string;
  slug: string;
  href: string;
  isActive: boolean;
  depth?: number;
}

function SidebarItem({ title, href, isActive, depth = 0 }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
        isActive
          ? 'bg-muted text-foreground font-medium'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
      style={{ paddingLeft: `${12 + depth * 12}px` }}
    >
      <FileText className="h-3.5 w-3.5 flex-shrink-0" />
      {title}
    </Link>
  );
}

interface SidebarSectionProps {
  title: string;
  href?: string;
  items: { title: string; slug: string; href: string }[];
  currentSlug: string;
  defaultOpen?: boolean;
}

function SidebarSection({ title, href, items, currentSlug, defaultOpen = true }: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const headingClass =
    'text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground';

  return (
    <div className="mb-4">
      <div className="flex w-full items-center justify-between px-3 py-2">
        {href ? (
          <Link href={href} className={headingClass}>
            {title}
          </Link>
        ) : (
          <button type="button" onClick={() => setIsOpen(!isOpen)} className={headingClass}>
            {title}
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-foreground"
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
      {isOpen && (
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.slug}>
              <SidebarItem
                title={item.title}
                slug={item.slug}
                href={item.href}
                isActive={item.slug === currentSlug}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DocSidebar() {
  const pathname = usePathname();
  const { locale, dictionary: t } = useLocale();
  const td = t.frameworkDocs;
  // Strip locale prefix and the `/docs` base to derive the active slug.
  const currentSlug =
    pathname
      .replace(/^\/en(?=\/|$)/, '')
      .replace(/^\/docs\/?/, '')
      .replace(/\/$/, '') || 'index';
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 overflow-hidden flex flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href={localizedPath('/', locale)} className="flex items-center gap-2">
          <SiteMark />
          <span className="text-lg font-semibold text-foreground">{td.brand}</span>
        </Link>
      </div>

      {/* Search */}
      <div className="border-b border-border p-4">
        <DocSearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="relative w-full rounded-lg border border-border bg-card py-2 pl-10 pr-14 text-left text-sm text-muted-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <span>{td.searchButton}</span>
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {docNavigation.map((section) => (
          <SidebarSection
            key={section.title}
            title={navTitle(section, locale)}
            href={section.slug ? localizedPath(`/docs/${section.slug}`, locale) : undefined}
            items={section.items.map((item) => ({
              title: navTitle(item, locale),
              slug: item.slug,
              href: localizedPath(`/docs/${item.slug}`, locale),
            }))}
            currentSlug={currentSlug}
            defaultOpen={true}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-border p-4">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher className="flex-1 justify-center" />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{td.version}</span>
          <select className="rounded border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none">
            <option value="latest">latest</option>
            <option value="v0.1.0">v0.1.0</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
