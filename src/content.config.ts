import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { LOCALES } from '@/i18n/config';

/** Entry id = path without extension (e.g. `pt/prumo`), so equal slugs in different locales never collide. */
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.(mdx?|json)$/, '');

const localized = {
  lang: z.enum(LOCALES),
  /** Shared key that links translations of the same item across locales. */
  translationKey: z.string().min(1),
  /** Translated URL slug, e.g. `construindo-o-prumo` / `building-prumo`. */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case ASCII'),
};

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts', generateId }),
  schema: ({ image }) =>
    z.object({
      ...localized,
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(160),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      project: reference('projects').optional(),
      cover: image().optional(),
      /** Short word shown big on the typographic cover (defaults to the first tag). */
      keyword: z.string().max(14).optional(),
      draft: z.boolean().default(false),
      /** Newsletter list slugs this post is sent to (post-v1). */
      newsletter: z.array(z.string()).optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects', generateId }),
  schema: ({ image }) =>
    z.object({
      ...localized,
      name: z.string().min(1),
      summary: z.string().min(1).max(160),
      status: z.enum(['active', 'paused', 'done']),
      stack: z.array(z.string()).default([]),
      links: z
        .object({
          repo: z.url().optional(),
          site: z.url().optional(),
        })
        .default({}),
      cover: image().optional(),
      /** Short word shown big on the typographic cover (defaults to the name). */
      keyword: z.string().max(14).optional(),
      featured: z.boolean().default(false),
      order: z.number().int().default(0),
      draft: z.boolean().default(false),
    }),
});

const localizedText = z.object({ pt: z.string().min(1), en: z.string().min(1).optional() });

const experiences = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experiences', generateId }),
  schema: z.object({
    company: z.string().min(1),
    role: localizedText,
    /** `work` shows on the Home page with month precision; `study` only on About, in years. */
    kind: z.enum(['work', 'study']).default('work'),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    location: z.string().optional(),
    /** One line shown on the Home page. */
    summary: localizedText.optional(),
    highlights: z.array(localizedText).default([]),
    stack: z.array(z.string()).default([]),
  }),
});

/** What I'm focused on right now (Home panel and /now). One file per locale: `now/pt.json`. */
const now = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/now', generateId }),
  schema: z.object({
    lang: z.enum(LOCALES),
    updatedAt: z.coerce.date(),
    items: z
      .array(
        z.object({
          label: z.string().min(1),
          text: z.string().min(1),
          /** A site path (`/projects/prumo`) or an https URL. Unpublished site paths render as text. */
          href: z
            .string()
            .regex(/^(\/|https:\/\/)/, 'href must be a site path or an https URL')
            .optional(),
        }),
      )
      .min(1),
  }),
});

/** About-page content per locale: `about/pt.json`. Headings and buttons live in `src/i18n/ui.ts`. */
const about = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/about', generateId }),
  schema: z.object({
    lang: z.enum(LOCALES),
    lead: z.string().min(1),
    story: z.array(z.string().min(1)).min(1),
    tools: z.array(z.object({ label: z.string().min(1), items: z.array(z.string().min(1)).min(1) })).min(1),
    education: z
      .array(
        z.object({ period: z.string().min(1), title: z.string().min(1), institution: z.string().min(1) }),
      )
      .default([]),
    languages: z.string().min(1).optional(),
  }),
});

export const collections = { posts, projects, experiences, now, about };
