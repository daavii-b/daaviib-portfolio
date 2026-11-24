import { HTML_LANG, type Locale } from '@/i18n/config';

export interface BlogPostingInput {
  title: string;
  description: string;
  /** Canonical, absolute URL of the post. */
  url: string;
  publishedAt: Date;
  updatedAt?: Date | undefined;
  tags: string[];
  lang: Locale;
  author: { name: string; url: string };
  /** Absolute URL of the share image. */
  image?: string | undefined;
}

/** schema.org `BlogPosting` for an article page. */
export function blogPostingJsonLd(input: BlogPostingInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.publishedAt.toISOString(),
    dateModified: (input.updatedAt ?? input.publishedAt).toISOString(),
    inLanguage: HTML_LANG[input.lang],
    keywords: input.tags.join(', '),
    author: { '@type': 'Person', name: input.author.name, url: input.author.url },
    ...(input.image ? { image: input.image } : {}),
  };
}

/** JSON for a `<script type="application/ld+json">`, with `<` escaped so the content can never close the element. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
