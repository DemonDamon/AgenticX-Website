export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'zh') return normalized;
  if (normalized === '/') return '/en';
  return `/en${normalized}`;
}

export function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const withoutEn = pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) : pathname;
  return localizedPath(withoutEn === '' ? '/' : withoutEn, nextLocale);
}

export function localeFromPathname(pathname: string): Locale {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  return 'zh';
}

export function htmlLang(locale: Locale): string {
  return locale === 'en' ? 'en' : 'zh-CN';
}

export function openGraphLocale(locale: Locale): string {
  return locale === 'en' ? 'en_US' : 'zh_CN';
}
