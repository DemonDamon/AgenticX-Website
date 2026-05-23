'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  LOCALE_COOKIE,
  swapLocaleInPath,
  type Locale,
} from '@/i18n/config';
import { useLocale } from '@/i18n/locale-context';
import { cn } from '@/lib/utils';

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, dictionary: t } = useLocale();

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    setLocaleCookie(nextLocale);
    router.replace(swapLocaleInPath(pathname, nextLocale));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={cn(
            'border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white',
            className,
          )}
          aria-label={t.localeSwitcher.label}
        >
          <Languages className="mr-2 h-4 w-4" />
          {locale === 'zh' ? t.localeSwitcher.zh : t.localeSwitcher.en}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-neutral-800 bg-neutral-950 text-neutral-100">
        <DropdownMenuItem
          className="cursor-pointer focus:bg-neutral-900 focus:text-white"
          onSelect={() => switchLocale('zh')}
        >
          {t.localeSwitcher.zh}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer focus:bg-neutral-900 focus:text-white"
          onSelect={() => switchLocale('en')}
        >
          {t.localeSwitcher.en}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
