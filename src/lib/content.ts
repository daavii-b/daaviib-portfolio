import type { Locale } from '@/i18n/config';

const WORDS_PER_MINUTE = 200;

/** Reading time in whole minutes (minimum 1), ignoring code fences and markup. */
export function readingTime(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()!-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

interface Publishable {
  data: { lang: Locale; draft: boolean; publishedAt?: Date };
}

/**
 * Entries visible for a locale: not drafts, and (for posts) not scheduled in the future.
 * Drafts are shown in development so they can be previewed.
 */
export function isPublished(entry: Publishable, lang: Locale, now = new Date(), showDrafts = false): boolean {
  if (entry.data.lang !== lang) return false;
  if (entry.data.draft && !showDrafts) return false;
  if (entry.data.publishedAt && entry.data.publishedAt > now && !showDrafts) return false;
  return true;
}

/** Newest first. */
export function byPublishedDesc<T extends { data: { publishedAt: Date } }>(a: T, b: T): number {
  return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
}

/** Find the translation of an entry in another locale via its `translationKey`. */
export function findTranslation<T extends { data: { lang: Locale; translationKey: string } }>(
  entries: readonly T[],
  entry: T,
  lang: Locale,
): T | undefined {
  return entries.find((e) => e.data.lang === lang && e.data.translationKey === entry.data.translationKey);
}
