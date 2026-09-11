'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSiteUiTheme, type SiteUiTheme } from '@/hooks/use-site-ui-theme';
import { useTranslations } from '@/i18n/locale-context';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolved, setTheme } = useSiteUiTheme();
  const t = useTranslations();

  const items: Array<{ id: SiteUiTheme; label: string; icon: typeof Sun }> = [
    { id: 'light', label: t.theme.light, icon: Sun },
    { id: 'dark', label: t.theme.dark, icon: Moon },
    { id: 'system', label: t.theme.system, icon: Monitor },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={cn(
            'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
            className,
          )}
          aria-label={t.theme.label}
        >
          {resolved === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 border-border bg-popover text-popover-foreground">
        <DropdownMenuLabel>{t.theme.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            className="cursor-pointer"
            onSelect={() => setTheme(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
            {theme === item.id ? <span className="ml-auto text-xs text-foreground">✓</span> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
