import { describe, expect, it } from 'vitest';

import { relatedPosts } from '@/lib/related';

const post = (id: string, date: string, tags: string[], lang: 'pt' | 'en' = 'pt') => ({
  id,
  data: { tags, lang, publishedAt: new Date(date) },
});

describe('relatedPosts', () => {
  const current = post('current', '2026-11-24', ['astro', 'arquitetura']);

  it('ranks shared tags first (more shared first), then the newest, up to the limit', () => {
    const posts = [
      current,
      post('newest-unrelated', '2026-11-23', ['carreira']),
      post('one-tag-old', '2026-10-01', ['astro']),
      post('two-tags', '2026-09-01', ['arquitetura', 'astro']),
      post('one-tag-new', '2026-11-01', ['arquitetura']),
      post('older-unrelated', '2026-08-01', ['testes']),
    ];
    expect(relatedPosts(current, posts).map((p) => p.id)).toEqual(['two-tags', 'one-tag-new', 'one-tag-old']);
    expect(relatedPosts(current, posts, 5).map((p) => p.id)).toEqual([
      'two-tags',
      'one-tag-new',
      'one-tag-old',
      'newest-unrelated',
      'older-unrelated',
    ]);
  });

  it('excludes the current post and other locales, and is empty when nothing else exists', () => {
    expect(relatedPosts(current, [current])).toEqual([]);
    expect(relatedPosts(current, [current, post('en', '2026-11-01', ['astro'], 'en')])).toEqual([]);
  });

  it('does not mutate the input', () => {
    const posts = [current, post('a', '2026-01-01', []), post('b', '2026-02-01', [])];
    relatedPosts(current, posts);
    expect(posts.map((p) => p.id)).toEqual(['current', 'a', 'b']);
  });
});
