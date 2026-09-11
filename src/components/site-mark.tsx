import { cn } from '@/lib/utils';

interface SiteMarkProps {
  className?: string;
}

export function SiteMark({ className }: SiteMarkProps) {
  return (
    <span className={cn('relative inline-flex h-8 w-8 shrink-0', className)} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-mark-dark.png"
        alt=""
        className="h-full w-full object-contain dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-mark.png"
        alt=""
        className="hidden h-full w-full object-contain dark:block"
      />
    </span>
  );
}
