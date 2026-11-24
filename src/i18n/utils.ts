import { getRelativeLocaleUrl } from 'astro:i18n';

import { DEFAULT_LOCALE, HTML_LANG, isLocale, type Locale } from './config';
import { ui, type UiKey } from './ui';

/** Translate a UI key, replacing `{name}` placeholders with `params`. */
export function t(lang: Locale, key: UiKey, params: Record<string, string | number> = {}): string {
  const template = ui[lang][key];
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/**
 * Narrow `Astro.currentLocale` (a plain string, computed by Astro from the URL) to a `Locale`,
 * falling back to the default locale.
 */
export function toLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Build a URL path for a locale with Astro's `getRelativeLocaleUrl`, so it follows the
 * `i18n`, `trailingSlash` and `build.format` settings in `astro.config.mjs`.
 * Route segments are always English; only the default locale has no prefix.
 * `localizePath('/blog/x', 'en')` → `/en/blog/x`, `localizePath('/', 'pt')` → `/`.
 */
export function localizePath(path: string, lang: Locale): string {
  return getRelativeLocaleUrl(lang, path);
}

export function formatDate(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(HTML_LANG[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
