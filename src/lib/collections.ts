import { getCollection, render, type CollectionEntry } from 'astro:content';

import type { Locale } from '@/i18n/config';

import { byPublishedDesc, isPublished } from './content';

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

export async function getExperiences(): Promise<CollectionEntry<'experiences'>[]> {
  const all = await getCollection('experiences');
  return all.sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
}
