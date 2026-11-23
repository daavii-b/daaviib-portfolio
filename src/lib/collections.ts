import { getCollection, type CollectionEntry } from 'astro:content';

import type { Locale } from '@/i18n/config';

import { byPublishedDesc, isPublished } from './content';

const SHOW_DRAFTS = import.meta.env.DEV;

export async function getPosts(lang: Locale): Promise<CollectionEntry<'posts'>[]> {
  const all = await getCollection('posts', (entry) => isPublished(entry, lang, new Date(), SHOW_DRAFTS));
  return all.sort(byPublishedDesc);
}

export async function getProjects(lang: Locale): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects', (entry) => isPublished(entry, lang, new Date(), SHOW_DRAFTS));
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getExperiences(): Promise<CollectionEntry<'experiences'>[]> {
  const all = await getCollection('experiences');
  return all.sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
}
