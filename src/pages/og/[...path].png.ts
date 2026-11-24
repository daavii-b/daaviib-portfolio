import type { APIRoute, GetStaticPaths } from 'astro';

import { SITE } from '@/config/site';
import { ENABLED_LOCALES } from '@/i18n/config';
import { getOgPages } from '@/lib/collections';
import { ogRouteParam, type OgPage } from '@/lib/og';
import { renderOgImage } from '@/lib/og-image';

/** One share image (Open Graph) per page, rendered at build time: `/og/index.png`, `/og/blog/{slug}.png`… */
export const getStaticPaths = (async () => {
  const pages = (await Promise.all(ENABLED_LOCALES.map((lang) => getOgPages(lang)))).flat();
  return pages.map((page) => ({ params: { path: ogRouteParam(page.imagePath) }, props: { page } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ page: OgPage }> = async ({ props }) => {
  const png = await renderOgImage({
    title: props.page.title,
    label: props.page.label,
    byline: `${SITE.author} · ${SITE.role}`,
    site: SITE.domain,
  });
  return new Response(png as Uint8Array<ArrayBuffer>, { headers: { 'Content-Type': 'image/png' } });
};
