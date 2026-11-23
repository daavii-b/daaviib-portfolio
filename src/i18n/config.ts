export const LOCALES = ['pt', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'pt';

/** Locales that already have published content. The language switcher stays hidden until this has more than one entry. */
export const ENABLED_LOCALES: readonly Locale[] = ['pt'];

export const HTML_LANG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
