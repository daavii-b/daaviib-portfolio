import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { DEFAULT_LOCALE } from '@/i18n/config';
import { localizePath, t } from '@/i18n/utils';
import { getPosts } from '@/lib/collections';

export async function GET(context: APIContext) {
  const lang = DEFAULT_LOCALE;
  const posts = await getPosts(lang);
  return rss({
    title: t(lang, 'site.title'),
    description: t(lang, 'site.description'),
    site: context.site ?? 'http://localhost:4321',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: localizePath(`/blog/${post.data.slug}`, lang),
      categories: post.data.tags,
    })),
    customData: '<language>pt-BR</language>',
  });
}
