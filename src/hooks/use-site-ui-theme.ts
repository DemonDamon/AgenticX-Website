'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { SITE_UI_THEME_STORAGE_KEY } from '@/lib/site-theme-bootstrap';

export { SITE_UI_THEME_STORAGE_KEY, SITE_THEME_BOOTSTRAP_SCRIPT } from '@/lib/site-theme-bootstrap';

export type SiteUiTheme = 'system' | 'dark' | 'light';

const listeners = new Set<() => void>();

export function readSiteUiTheme(): SiteUiTheme {
  if (typeof window === 'undefined') return 'system';
  try {
    const value = window.localStorage.getItem(SITE_UI_THEME_STORAGE_KEY);
    if (value === 'dark' || value === 'light' || value === 'system') return value;
  } catch {
    /* ignore */
  }
  return 'system';
}

export function isSiteDarkMode(theme: SiteUiTheme): boolean {
  if (typeof window === 'undefined') return true;
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applySiteUiTheme(theme: SiteUiTheme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', isSiteDarkMode(theme));
}

export function setSiteUiTheme(next: SiteUiTheme): void {
  try {
    window.localStorage.setItem(SITE_UI_THEME_STORAGE_KEY, next);
  } catch {
    /* ignore quota */
  }
  applySiteUiTheme(next);
  listeners.forEach((handler) => handler());
}

export function subscribeSiteUiTheme(handler: () => void): () => void {
  listeners.add(handler);
  return () => {
    listeners.delete(handler);
  };
}

export function useSiteUiTheme(): {
  theme: SiteUiTheme;
  resolved: 'light' | 'dark';
  setTheme: (next: SiteUiTheme) => void;
} {
  const [theme, setThemeState] = useState<SiteUiTheme>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('dark');

  useLayoutEffect(() => {
    const next = readSiteUiTheme();
    setThemeState(next);
    applySiteUiTheme(next);
    setResolved(isSiteDarkMode(next) ? 'dark' : 'light');
  }, []);

  useEffect(
    () =>
      subscribeSiteUiTheme(() => {
        const next = readSiteUiTheme();
        setThemeState(next);
        setResolved(isSiteDarkMode(next) ? 'dark' : 'light');
      }),
    [],
  );

  useEffect(() => {
    if (theme !== 'system') return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      applySiteUiTheme('system');
      setResolved(query.matches ? 'dark' : 'light');
    };
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((next: SiteUiTheme) => {
    setThemeState(next);
    setSiteUiTheme(next);
    setResolved(isSiteDarkMode(next) ? 'dark' : 'light');
  }, []);

  return { theme, resolved, setTheme };
}
