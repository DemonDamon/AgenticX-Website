'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { enterpriseDocNavigation } from './navigation';
import { EnterpriseDocSearchCommand } from './doc-search-command';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, FileText } from 'lucide-react';

interface SidebarItemProps {
  title: string;
  slug: string;
  isActive: boolean;
}

function sidebarHref(slug: string): string {
  return slug === 'index' ? '/enterprise/docs' : `/enterprise/docs/${slug}`;
}

function SidebarItem({ title, slug, isActive }: SidebarItemProps) {
  return (
    <Link
      href={sidebarHref(slug)}
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
}

function SidebarSection({ title, items, currentSlug }: SidebarSectionProps) {
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
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function resolveCurrentSlug(pathname: string): string {
  if (pathname === '/enterprise/docs') {
    return 'index';
  }
  return pathname.replace(/^\/enterprise\/docs\/?/, '') || 'index';
}

export function EnterpriseDocSidebar() {
  const pathname = usePathname();
  const currentSlug = resolveCurrentSlug(pathname);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-gray-800 bg-[#0a0a0a]">
      <div className="flex h-16 items-center border-b border-gray-800 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold">
            AX
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-white">AgenticX</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-violet-400">
              Enterprise
            </span>
          </div>
        </Link>
      </div>

      <div className="border-b border-gray-800 p-4">
        <EnterpriseDocSearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="relative w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 pl-10 pr-14 text-left text-sm text-gray-500 hover:border-gray-700 hover:bg-gray-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <span>Search enterprise docs...</span>
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-500">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {enterpriseDocNavigation.map((section) => (
          <SidebarSection
            key={section.title}
            title={section.title}
            items={section.items}
            currentSlug={currentSlug}
          />
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <Link
          href="/enterprise"
          className="text-xs text-gray-500 transition-colors hover:text-violet-300"
        >
          ← Back to Enterprise overview
        </Link>
      </div>
    </aside>
  );
}
