'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getEnterpriseDocNavigation } from './navigation';
import { EnterpriseDocSearchCommand } from './doc-search-command';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, FileText } from 'lucide-react';
import { localizedPath, localeFromPathname } from '@/i18n/config';
import { useTranslations } from '@/i18n/locale-context';

interface SidebarItemProps {
  title: string;
  slug: string;
  isActive: boolean;
  locale: ReturnType<typeof localeFromPathname>;
}

function sidebarHref(slug: string, locale: ReturnType<typeof localeFromPathname>): string {
  const path = slug === 'index' ? '/enterprise/docs' : `/enterprise/docs/${slug}`;
  return localizedPath(path, locale);
}

function SidebarItem({ title, slug, isActive, locale }: SidebarItemProps) {
  return (
    <Link
      href={sidebarHref(slug, locale)}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
        isActive
          ? 'bg-violet-500/20 text-violet-300 font-medium'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white',
      )}
    >
      <FileText className="h-3.5 w-3.5 flex-shrink-0" />
      {title}
    </Link>
  );
}

interface SidebarSectionProps {
  title: string;
  items: { title: string; slug: string }[];
  currentSlug: string;
  locale: ReturnType<typeof localeFromPathname>;
}

function SidebarSection({ title, items, currentSlug, locale }: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-400"
      >
        {title}
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.slug}>
              <SidebarItem
                title={item.title}
                slug={item.slug}
                isActive={item.slug === currentSlug}
                locale={locale}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function resolveCurrentSlug(pathname: string): string {
  const docsPath = pathname.replace(/^\/en/, '').replace(/^\/enterprise\/docs\/?/, '');
  if (!docsPath || pathname.endsWith('/enterprise/docs')) {
    return 'index';
  }
  return docsPath;
}

export function EnterpriseDocSidebar() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const t = useTranslations();
  const navigation = getEnterpriseDocNavigation(t);
  const currentSlug = resolveCurrentSlug(pathname);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-gray-800 bg-[#0a0a0a]">
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        <Link href={localizedPath('/', locale)} className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold">
            AX
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-lg font-semibold text-white">AgenticX</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-violet-400">
              {t.sidebar.brand}
            </span>
          </div>
        </Link>
        <LocaleSwitcher className="shrink-0 px-2 py-1 text-xs" />
      </div>

      <div className="border-b border-gray-800 p-4">
        <EnterpriseDocSearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="relative w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 pl-10 pr-14 text-left text-sm text-gray-500 hover:border-gray-700 hover:bg-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <span>{t.sidebar.searchPlaceholder}</span>
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-500">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((section) => (
          <SidebarSection
            key={section.title}
            title={section.title}
            items={section.items}
            currentSlug={currentSlug}
            locale={locale}
          />
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <Link
          href={localizedPath('/enterprise', locale)}
          className="text-xs text-gray-500 transition-colors hover:text-violet-300"
        >
          {t.sidebar.backToEnterprise}
        </Link>
      </div>
    </aside>
  );
}
