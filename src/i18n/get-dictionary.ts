import type { Locale } from './config';
import type { Dictionary } from './types';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  zh: () => import('./dictionaries/zh').then((m) => m.default as Dictionary),
  en: () => import('./dictionaries/en').then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
