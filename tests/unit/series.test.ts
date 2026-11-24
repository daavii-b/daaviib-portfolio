import { describe, expect, it } from 'vitest';

import { seriesPosition, seriesPosts } from '@/lib/series';

const post = (id: string, date: string, series?: string, lang: 'pt' | 'en' = 'pt') => ({
  id,
  data: { title: `Title ${id}`, slug: id, lang, publishedAt: new Date(date), ...(series ? { series } : {}) },
});
const href = (p: { data: { slug: string } }) => `/blog/${p.data.slug}`;

describe('seriesPosition', () => {
  const second = post('b', '2026-11-20', 'Site');
  const posts = [
    second,
    post('a', '2026-11-10', 'Site'),
    post('c', '2026-11-30', 'Site'),
    post('x', '2026-11-15', 'Outra'),
    post('y', '2026-11-16'),
    post('en', '2026-11-01', 'Site', 'en'),
  ];

  it('orders the series by publication date and finds the position', () => {
    const position = seriesPosition(second, posts, href);
    expect(position).toEqual({
      name: 'Site',
      index: 2,
      total: 3,
      items: [
        { id: 'a', title: 'Title a', href: '/blog/a', current: false },
        { id: 'b', title: 'Title b', href: '/blog/b', current: true },
        { id: 'c', title: 'Title c', href: '/blog/c', current: false },
      ],
    });
  });

  it('works for a series with a single post', () => {
    const only = post('x', '2026-11-15', 'Outra');
    expect(seriesPosition(only, [only], href)).toMatchObject({ index: 1, total: 1 });
  });

  it('is undefined without a series or when the post is not among the published ones', () => {
    expect(seriesPosition(post('y', '2026-11-16'), posts, href)).toBeUndefined();
    expect(seriesPosition(post('draft', '2026-11-18', 'Site'), posts, href)).toBeUndefined();
  });
});

describe('seriesPosts', () => {
  const posts = [
    post('b', '2026-11-20', 'Site'),
    post('a', '2026-11-10', 'Site'),
    post('x', '2026-11-15', 'Outra'),
    post('en', '2026-11-01', 'Site', 'en'),
  ];

  it('lists the series of a locale in publication order with two-digit numbers', () => {
    expect(seriesPosts('Site', 'pt', posts, href)).toEqual([
      { id: 'a', title: 'Title a', href: '/blog/a', number: '01' },
      { id: 'b', title: 'Title b', href: '/blog/b', number: '02' },
    ]);
  });

  it('is empty for a series with no posts', () => {
    expect(seriesPosts('Nada', 'pt', posts, href)).toEqual([]);
  });
});
