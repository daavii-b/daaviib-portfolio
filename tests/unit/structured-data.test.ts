import { describe, expect, it } from 'vitest';

import { blogPostingJsonLd, serializeJsonLd } from '@/lib/structured-data';

const base = {
  title: 'Por que escolhi Astro para este site',
  description: 'Resumo.',
  url: 'https://example.com/blog/por-que-escolhi-astro',
  publishedAt: new Date('2026-11-24T00:00:00Z'),
  tags: ['astro', 'arquitetura'],
  lang: 'pt' as const,
  author: { name: 'Davi Brito', url: 'https://example.com/' },
};

describe('blogPostingJsonLd', () => {
  it('describes the post as a BlogPosting', () => {
    expect(blogPostingJsonLd(base)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: base.title,
      description: base.description,
      url: base.url,
      mainEntityOfPage: base.url,
      datePublished: '2026-11-24T00:00:00.000Z',
      dateModified: '2026-11-24T00:00:00.000Z',
      inLanguage: 'pt-BR',
      keywords: 'astro, arquitetura',
      author: { '@type': 'Person', name: 'Davi Brito', url: 'https://example.com/' },
    });
  });

  it('uses the update date as dateModified when there is one', () => {
    const data = blogPostingJsonLd({ ...base, updatedAt: new Date('2026-12-01T00:00:00Z') });
    expect(data['dateModified']).toBe('2026-12-01T00:00:00.000Z');
  });
});

describe('serializeJsonLd', () => {
  it('produces JSON that cannot close the script element', () => {
    const json = serializeJsonLd({ headline: '</script><b>' });
    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toEqual({ headline: '</script><b>' });
  });
});
