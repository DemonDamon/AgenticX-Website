'use client';

import Link from 'next/link';
import { SiteMark } from '@/components/site-mark';
import { localizedPath } from '@/i18n/config';
import { useLocale } from '@/i18n/locale-context';

export function DocsSidebarBrand({ product }: { product: string }) {
  const { locale } = useLocale();

  return (
    <div className="flex h-16 items-center border-b border-border px-6">
      <Link href={localizedPath('/', locale)} className="flex min-w-0 items-center gap-2">
        <SiteMark />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-lg font-semibold text-foreground">AgenticX</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {product}
          </span>
        </div>
      </Link>
    </div>
  );
}
