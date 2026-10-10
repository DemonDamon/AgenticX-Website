'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/i18n/locale-context';
import { NEAR_DESKTOP_DOWNLOADS } from '@/lib/near-downloads';

const external = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

export function NearDownloadButtons({
  emphasis = 'outline',
}: {
  /** `primary` makes the macOS button the solid call to action. */
  emphasis?: 'primary' | 'outline';
}) {
  const t = useTranslations();
  const macClass =
    emphasis === 'primary'
      ? 'rounded-full bg-foreground text-background hover:opacity-90'
      : 'rounded-full border-border text-muted-foreground hover:bg-muted hover:text-foreground';

  return (
    <>
      <Button asChild size="lg" variant={emphasis === 'primary' ? 'default' : 'outline'} className={macClass}>
        <a href={NEAR_DESKTOP_DOWNLOADS.mac.href} {...external}>
          <Download className="h-4 w-4" />
          {t.nearDownload.mac}
        </a>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="rounded-full border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <a href={NEAR_DESKTOP_DOWNLOADS.windows.href} {...external}>
          <Download className="h-4 w-4" />
          {t.nearDownload.windows}
        </a>
      </Button>
    </>
  );
}

export function NearDownloadNote({ className = 'text-sm text-muted-foreground' }: { className?: string }) {
  const t = useTranslations();
  return (
    <p className={className}>
      Near {NEAR_DESKTOP_DOWNLOADS.version}
      <span className="mx-1.5">·</span>
      {t.nearDownload.note}
    </p>
  );
}

export function NearDownloadTextLinks() {
  const t = useTranslations();
  const className = 'inline-flex items-center text-sm text-muted-foreground hover:text-foreground';

  return (
    <span className="inline-flex flex-wrap items-center gap-x-5 gap-y-2">
      <a href={NEAR_DESKTOP_DOWNLOADS.mac.href} {...external} className={className}>
        <Download className="mr-1 h-4 w-4" />
        {t.nearDownload.mac}
      </a>
      <a href={NEAR_DESKTOP_DOWNLOADS.windows.href} {...external} className={className}>
        <Download className="mr-1 h-4 w-4" />
        {t.nearDownload.windows}
      </a>
    </span>
  );
}
