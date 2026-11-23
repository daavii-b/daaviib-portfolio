import { DEFAULT_LOCALE, HTML_LANG, isLocale, type Locale } from './config';
import { ui, type UiKey } from './ui';

/** Translate a UI key, replacing `{name}` placeholders with `params`. */
export function t(lang: Locale, key: UiKey, params: Record<string, string | number> = {}): string {
  const template = ui[lang][key];
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** Locale of a URL path: `/en/blog` → `en`, `/blog` → `pt`. */
export function getLocaleFromPath(pathname: string): Locale {
  const [, first] = pathname.split('/');
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * Build a URL path for a locale. Route segments are always English;
 * only the default locale has no prefix.
 * `localizePath('/blog/x', 'en')` → `/en/blog/x`, `localizePath('/', 'pt')` → `/`.
 */
export function localizePath(path: string, lang: Locale): string {
  const clean = `/${path.replace(/^\/+|\/+$/g, '')}`;
  if (lang === DEFAULT_LOCALE) return clean;
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

export function formatDate(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(HTML_LANG[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
