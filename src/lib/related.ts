import type { Locale } from '@/i18n/config';

interface Taggable {
  id: string;
  data: { tags: string[]; lang: Locale; publishedAt: Date };
}

/**
 * "Continue lendo": other posts of the same locale, those sharing more tags first, then the newest.
 * `posts` is expected to hold published posts only.
 */
export function relatedPosts<T extends Taggable>(post: T, posts: readonly T[], limit = 3): T[] {
  const tags = new Set(post.data.tags);
  const shared = (other: T) => other.data.tags.filter((tag) => tags.has(tag)).length;
  return posts
    .filter((other) => other.id !== post.id && other.data.lang === post.data.lang)
    .map((other) => ({ other, score: shared(other) }))
    .sort(
      (a, b) => b.score - a.score || b.other.data.publishedAt.getTime() - a.other.data.publishedAt.getTime(),
    )
    .slice(0, limit)
    .map(({ other }) => other);
}
