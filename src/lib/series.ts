import type { Locale } from '@/i18n/config';

interface SeriesPost {
  id: string;
  data: { title: string; slug: string; lang: Locale; series?: string | undefined; publishedAt: Date };
}

export interface SeriesItem {
  id: string;
  title: string;
  href: string;
  current: boolean;
}

export interface SeriesPosition {
  name: string;
  /** 1-based position of the post in its series. */
  index: number;
  total: number;
  items: SeriesItem[];
}

/**
 * Where a post sits in its series, among `posts` (already filtered to published ones): same series name and locale,
 * ordered by publication date. `undefined` when the post has no series or is not among `posts`.
 */
export function seriesPosition<T extends SeriesPost>(
  post: T,
  posts: readonly T[],
  hrefFor: (post: T) => string,
): SeriesPosition | undefined {
  const name = post.data.series;
  if (!name) return undefined;
  const inSeries = byPublication(name, post.data.lang, posts);
  const index = inSeries.findIndex((p) => p.id === post.id);
  if (index === -1) return undefined;
  return {
    name,
    index: index + 1,
    total: inSeries.length,
    items: inSeries.map((p) => ({
      id: p.id,
      title: p.data.title,
      href: hrefFor(p),
      current: p.id === post.id,
    })),
  };
}

function byPublication<T extends SeriesPost>(name: string, lang: Locale, posts: readonly T[]): T[] {
  return posts
    .filter((p) => p.data.series === name && p.data.lang === lang)
    .sort((a, b) => a.data.publishedAt.getTime() - b.data.publishedAt.getTime());
}

export interface NumberedSeriesPost {
  id: string;
  title: string;
  href: string;
  /** Two-digit position in the series: "01", "02"… */
  number: string;
}

/** Posts of a series in a locale, among `posts` (already filtered to published ones), in series order and numbered. */
export function seriesPosts<T extends SeriesPost>(
  name: string,
  lang: Locale,
  posts: readonly T[],
  hrefFor: (post: T) => string,
): NumberedSeriesPost[] {
  return byPublication(name, lang, posts).map((p, i) => ({
    id: p.id,
    title: p.data.title,
    href: hrefFor(p),
    number: String(i + 1).padStart(2, '0'),
  }));
}
