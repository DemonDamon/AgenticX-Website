'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { docNavigation } from './navigation';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, FileText } from 'lucide-react';

interface SidebarItemProps {
  title: string;
  slug: string;
  isActive: boolean;
  depth?: number;
}

function SidebarItem({ title, slug, isActive, depth = 0 }: SidebarItemProps) {
  return (
    <Link
      href={`/docs/${slug}`}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
        isActive
          ? 'bg-blue-500/20 text-blue-400 font-medium'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
  items: { title: string; slug: string }[];
  currentSlug: string;
  defaultOpen?: boolean;
}

function SidebarSection({ title, items, currentSlug, defaultOpen = true }: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasActiveItem = items.some((item) => item.slug === currentSlug);

  return (
    <div className="mb-4">
      <button
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

export function DocSidebar() {
  const pathname = usePathname();
  const currentSlug = pathname.replace('/docs/', '') || 'index';

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-800 bg-[#0a0a0a] overflow-hidden flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-800 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold">
            AX
          </div>
          <span className="text-lg font-semibold text-white">AgenticX</span>
        </Link>
      </div>

      {/* Search */}
      <div className="border-b border-gray-800 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search docs..."
            className="w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {docNavigation.map((section) => (
          <SidebarSection
            key={section.title}
            title={section.title}
            items={section.items}
            currentSlug={currentSlug}
            defaultOpen={true}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Version</span>
          <select className="rounded border border-gray-800 bg-gray-900 px-2 py-1 text-xs text-white focus:outline-none">
            <option value="latest">latest</option>
            <option value="v0.1.0">v0.1.0</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
