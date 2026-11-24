import { getCollection, render, type CollectionEntry } from 'astro:content';

import type { Locale } from '@/i18n/config';
import { localizePath } from '@/i18n/utils';

import { byPublishedDesc, isPublished } from './content';
import { sortExperiences } from './experience';
import { normalizePath } from './links';

const SHOW_DRAFTS = import.meta.env.DEV;

/** A post plus its reading time, computed by the `reading-time` Markdown plugin. */
export type Post = CollectionEntry<'posts'> & { minutesRead: number };

async function withReadingTime(entry: CollectionEntry<'posts'>): Promise<Post> {
  const { remarkPluginFrontmatter } = await render(entry);
  const minutesRead = Number(remarkPluginFrontmatter['minutesRead']);
  return { ...entry, minutesRead: Number.isFinite(minutesRead) ? minutesRead : 1 };
}

export async function getPosts(lang: Locale): Promise<Post[]> {
  const all = await getCollection('posts', (entry) => isPublished(entry, lang, new Date(), SHOW_DRAFTS));
  const posts = await Promise.all(all.map(withReadingTime));
  return posts.sort(byPublishedDesc);
}

export async function getProjects(lang: Locale): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects', (entry) => isPublished(entry, lang, new Date(), SHOW_DRAFTS));
  return all.sort((a, b) => a.data.order - b.data.order);
}

export type Experience = CollectionEntry<'experiences'>;

/** Experiences newest first; pass a kind to keep only work roles (Home) or study periods. */
export async function getExperiences(kind?: Experience['data']['kind']): Promise<Experience[]> {
  const all = await getCollection('experiences', (entry) => kind === undefined || entry.data.kind === kind);
  return sortExperiences(all);
}

/** The "Now" entry for a locale (Home panel and /now), if one exists. */
export async function getNow(lang: Locale): Promise<CollectionEntry<'now'> | undefined> {
  const all = await getCollection('now', (entry) => entry.data.lang === lang);
  return all[0];
}

/** About-page content for a locale, if one exists. */
export async function getAboutProfile(lang: Locale): Promise<CollectionEntry<'about'> | undefined> {
  const all = await getCollection('about', (entry) => entry.data.lang === lang);
  return all[0];
}

/** Static pages of every locale; dynamic ones come from the collections below. */
const STATIC_ROUTES = ['/', '/blog', '/projects', '/about', '/now'];

/**
 * Every page path built for a locale (static pages plus published posts and projects), normalised.
 * Content links are checked against it so a draft never becomes a 404 link.
 */
export async function getPublishedPaths(lang: Locale): Promise<Set<string>> {
  const [posts, projects] = await Promise.all([
    getCollection('posts', (entry) => isPublished(entry, lang, new Date(), SHOW_DRAFTS)),
    getProjects(lang),
  ]);
  const paths = [
    ...STATIC_ROUTES,
    ...posts.map((post) => `/blog/${post.data.slug}`),
    ...projects.map((project) => `/projects/${project.data.slug}`),
  ];
  return new Set(paths.map((path) => normalizePath(localizePath(path, lang))));
}
