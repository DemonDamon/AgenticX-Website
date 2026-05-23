'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { getEnterpriseDocNavigation } from '@/components/enterprise-docs/navigation';
import { localizedPath, localeFromPathname } from '@/i18n/config';
import { useTranslations } from '@/i18n/locale-context';

function docHref(slug: string, locale: ReturnType<typeof localeFromPathname>): string {
  const path = slug === 'index' ? '/enterprise/docs' : `/enterprise/docs/${slug}`;
  return localizedPath(path, locale);
}

export function EnterpriseDocSearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const t = useTranslations();
  const navigation = getEnterpriseDocNavigation(t);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenChange]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.sidebar.searchTitle}
      description={t.sidebar.searchDescription}
    >
      <CommandInput placeholder={t.sidebar.searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{t.sidebar.searchEmpty}</CommandEmpty>
        {navigation.map((section) => (
          <CommandGroup key={section.title} heading={section.title}>
            {section.items.map((item) => (
              <CommandItem
                key={item.slug}
                value={`${item.title} ${item.slug} ${section.title} ${item.searchAliases ?? ''}`}
                onSelect={() => {
                  router.push(docHref(item.slug, locale));
                  onOpenChange(false);
                }}
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
