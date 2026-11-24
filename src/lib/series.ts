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
  const inSeries = posts
    .filter((p) => p.data.series === name && p.data.lang === post.data.lang)
    .sort((a, b) => a.data.publishedAt.getTime() - b.data.publishedAt.getTime());
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
