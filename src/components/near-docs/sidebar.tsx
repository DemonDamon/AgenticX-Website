'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText } from 'lucide-react';
import { DocsProductSwitcher } from '@/components/docs-product-switcher';
import { DocsSidebarBrand } from '@/components/docs-sidebar-brand';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';
import { cn } from '@/lib/utils';

export function NearDocSidebar() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = useTranslations();
  const nd = t.nearDocs;
  const isOverview = /\/near\/docs\/?$/.test(pathname);

  const items = [
    { href: localizedPath('/near/docs', locale), label: nd.overview, current: isOverview },
    { href: localizedPath('/docs/guides/studio', locale), label: nd.studio, current: false },
    { href: localizedPath('/docs/concepts/agent', locale), label: nd.runtime, current: false },
    { href: localizedPath('/docs/getting-started/configuration', locale), label: nd.configuration, current: false },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-border bg-background">
      <DocsSidebarBrand product={nd.brand} />

      <DocsProductSwitcher active="near" />

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                  item.current
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-3 border-t border-border p-4">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher className="flex-1 justify-center" />
        </div>
        <Link
          href={localizedPath('/near', locale)}
          className="block text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {nd.backToNear}
        </Link>
      </div>
    </aside>
  );
}
