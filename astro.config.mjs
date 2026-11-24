// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { DEFAULT_LOCALE, HTML_LANG, LOCALES } from './src/i18n/config.ts';

// TODO: replace with the real domain once it is purchased.
const SITE_URL = process.env.SITE_URL ?? 'https://portfolio.vercel.app';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { format: 'file' },
  // Locales come from src/i18n/config.ts, the single source of truth.
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: HTML_LANG,
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
