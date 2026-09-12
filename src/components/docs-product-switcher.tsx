'use client';

import Link from 'next/link';
import { localizedPath } from '@/i18n/config';
import { useLocale, useTranslations } from '@/i18n/locale-context';

type DocsDoor = 'framework' | 'near' | 'enterprise';

const DOORS: { id: DocsDoor; href: string }[] = [
  { id: 'framework', href: '/docs' },
  { id: 'near', href: '/near/docs' },
  { id: 'enterprise', href: '/enterprise/docs' },
];

export function DocsProductSwitcher({ active }: { active: DocsDoor }) {
  const { locale } = useLocale();
  const t = useTranslations();

  return (
    <nav className="flex items-center gap-1 border-b border-border px-3 py-2" aria-label="Product docs">
      {DOORS.map((door) => {
        const isActive = door.id === active;
        return (
          <Link
            key={door.id}
            href={localizedPath(door.href, locale)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {t.docsSwitcher[door.id]}
          </Link>
        );
      })}
    </nav>
  );
}
