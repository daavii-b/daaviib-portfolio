// @ts-check
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { DEFAULT_LOCALE, HTML_LANG, LOCALES } from './src/i18n/config.ts';
import { readingTimePlugin } from './src/lib/reading-time.ts';
import { codeFrameTransformer } from './src/lib/code-frame.ts';

/**
 * Public URL for canonical links, sitemap, RSS and robots.txt.
 * 1. SITE_URL, when set explicitly.
 * 2. On Vercel, the project's production domain (VERCEL_PROJECT_PRODUCTION_URL is set by Vercel at build
 *    time and follows the custom domain once one is added).
 * 3. Local development.
 */
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const SITE_URL =
  process.env.SITE_URL ?? (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'http://localhost:4321');

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
    // MDX extends this config, so the plugin also runs for .mdx files.
    processor: satteri({ mdastPlugins: [readingTimePlugin] }),
    shikiConfig: {
      // Token colours come from the design system (see `--astro-code-*` in global.css), so both themes follow it.
      theme: 'css-variables',
      // File-name header + copy button for code blocks. The transformer is typed with minimal local hast types
      // (no direct `shiki` dependency), so it is asserted to Shiki's wider transformer type here.
      transformers: [/** @type {never} */ (codeFrameTransformer)],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
