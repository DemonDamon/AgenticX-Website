'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { docNavigation, navTitle } from '@/components/docs/navigation';
import { useLocale } from '@/i18n/locale-context';
import { localizedPath } from '@/i18n/config';

export function DocSearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { locale, dictionary: t } = useLocale();
  const td = t.frameworkDocs;

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
      title={td.searchTitle}
      description={td.searchDescription}
    >
      <CommandInput placeholder={td.searchButton} />
      <CommandList>
        <CommandEmpty>{td.searchEmpty}</CommandEmpty>
        {docNavigation.map((section) => {
          const sectionTitle = navTitle(section, locale);
          return (
            <CommandGroup key={section.title} heading={sectionTitle}>
              {section.items.map((item) => {
                const itemTitle = navTitle(item, locale);
                return (
                  <CommandItem
                    key={item.slug}
                    value={`${itemTitle} ${item.title} ${item.slug} ${sectionTitle} ${item.searchAliases ?? ''}`}
                    onSelect={() => {
                      router.push(localizedPath(`/docs/${item.slug}`, locale));
                      onOpenChange(false);
                    }}
                  >
                    {itemTitle}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
