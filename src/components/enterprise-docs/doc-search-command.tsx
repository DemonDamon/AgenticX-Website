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
import { enterpriseDocNavigation } from '@/components/enterprise-docs/navigation';

function docHref(slug: string): string {
  return slug === 'index' ? '/enterprise/docs' : `/enterprise/docs/${slug}`;
}

export function EnterpriseDocSearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

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
      title="Search enterprise documentation"
      description="Jump to an enterprise documentation page."
    >
      <CommandInput placeholder="Search enterprise docs..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {enterpriseDocNavigation.map((section) => (
          <CommandGroup key={section.title} heading={section.title}>
            {section.items.map((item) => (
              <CommandItem
                key={item.slug}
                value={`${item.title} ${item.slug} ${section.title} ${item.searchAliases ?? ''}`}
                onSelect={() => {
                  router.push(docHref(item.slug));
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
