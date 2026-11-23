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
      description: z.string().min(1).max(200),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      project: reference('projects').optional(),
      cover: image().optional(),
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
      summary: z.string().min(1).max(200),
      status: z.enum(['active', 'paused', 'done']),
      stack: z.array(z.string()).default([]),
      links: z
        .object({
          repo: z.url().optional(),
          site: z.url().optional(),
        })
        .default({}),
      cover: image().optional(),
      featured: z.boolean().default(false),
      order: z.number().int().default(0),
      draft: z.boolean().default(false),
    }),
});

const localizedText = z.object({ pt: z.string(), en: z.string().optional() });

const experiences = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experiences', generateId }),
  schema: z.object({
    company: z.string().min(1),
    role: localizedText,
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    location: z.string().optional(),
    highlights: z.array(localizedText).default([]),
    stack: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, projects, experiences };
