import { HTML_LANG, type Locale } from '@/i18n/config';
import { t } from '@/i18n/utils';

/** Per-locale text as stored in content files; `pt` is required and is the fallback. */
export interface LocalizedText {
  pt: string;
  en?: string | undefined;
}

interface Dated {
  data: { start: Date; end?: Date | undefined };
}

/** Text for the locale, falling back to Portuguese while a translation is missing. */
export function localized(text: LocalizedText, lang: Locale): string {
  return (lang === 'en' ? text.en : undefined) ?? text.pt;
}

/** Newest start first; on equal starts the current role (no end) comes first. Returns a new array. */
export function sortExperiences<T extends Dated>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => {
    const byStart = b.data.start.getTime() - a.data.start.getTime();
    if (byStart !== 0) return byStart;
    const aEnd = a.data.end?.getTime() ?? Number.POSITIVE_INFINITY;
    const bEnd = b.data.end?.getTime() ?? Number.POSITIVE_INFINITY;
    return aEnd === bEnd ? 0 : bEnd > aEnd ? 1 : -1;
  });
}

function formatMonth(date: Date, lang: Locale): string {
  const parts = new Intl.DateTimeFormat(HTML_LANG[lang], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(date);
  const month = parts.find((p) => p.type === 'month')?.value.replace(/\.$/, '') ?? '';
  const year = parts.find((p) => p.type === 'year')?.value ?? '';
  return `${month} ${year}`;
}

/**
 * Period of an experience, e.g. `ago 2023 — atual` / `Aug 2023 — present`, or `2020 — 2023` with year precision.
 * Dates are read in UTC so `YYYY-MM` content never shifts a month.
 */
export function formatPeriod(
  start: Date,
  end: Date | undefined,
  lang: Locale,
  precision: 'month' | 'year',
): string {
  const format = (date: Date) =>
    precision === 'year' ? String(date.getUTCFullYear()) : formatMonth(date, lang);
  return `${format(start)} — ${end ? format(end) : t(lang, 'about.present')}`;
}
