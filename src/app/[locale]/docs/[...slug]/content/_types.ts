import type { Locale } from '@/i18n/config';

/** A single-language documentation entry. */
export interface DocEntry {
  title: string;
  description?: string;
  content: string;
}

/**
 * A documentation module. The canonical shape is bilingual (`{ en, zh }`);
 * legacy modules that still export a bare {@link DocEntry} are treated as the
 * English source so the site keeps working while translations are filled in
 * incrementally by the `/update-agxwebsite-doc` command.
 */
export type LocalizedDoc =
  | DocEntry
  | {
      en: DocEntry;
      zh?: DocEntry;
    };

export interface ResolvedDoc {
  entry: DocEntry;
  /** The locale actually rendered (may differ from the requested one). */
  rendered: Locale;
  /** True when the requested locale was unavailable and we fell back. */
  fellBack: boolean;
}

function isBilingual(
  doc: LocalizedDoc,
): doc is { en: DocEntry; zh?: DocEntry } {
  return (
    typeof (doc as { content?: unknown }).content !== 'string' &&
    typeof (doc as { en?: unknown }).en === 'object'
  );
}

/**
 * Resolve a documentation module to a concrete {@link DocEntry} for `locale`,
 * falling back to the other language when the requested one is missing.
 */
export function resolveDoc(
  doc: LocalizedDoc | undefined,
  locale: Locale,
): ResolvedDoc | null {
  if (!doc) return null;

  if (!isBilingual(doc)) {
    // Legacy bare entry: treat as English-only source.
    return { entry: doc, rendered: 'en', fellBack: locale !== 'en' };
  }

  const requested = doc[locale];
  if (requested) {
    return { entry: requested, rendered: locale, fellBack: false };
  }

  const fallbackLocale: Locale = locale === 'zh' ? 'en' : 'zh';
  const fallback = doc[fallbackLocale] ?? doc.en;
  return { entry: fallback, rendered: fallbackLocale, fellBack: true };
}
