import { existsSync, readdirSync } from 'node:fs';
import { getCollection, getEntry } from 'astro:content';
import { entrySlug, type Lang } from '../i18n/utils';

export async function getProfile() {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('Missing profile entry "main" in src/content/profile.yaml');
  return entry.data;
}

export async function getExperience() {
  return (await getCollection('experience')).sort((a, b) => a.data.order - b.data.order);
}

export async function getSkills() {
  return (await getCollection('skills')).sort((a, b) => a.data.order - b.data.order);
}

export async function getLocalizedEntries<C extends 'projects' | 'caseStudies'>(collection: C, lang: Lang) {
  const entries = await getCollection(collection, (e) => entrySlug(e.id).lang === lang);
  return entries
    .map((entry) => ({ entry, slug: entrySlug(entry.id).slug }))
    .sort((a, b) => a.entry.data.order - b.entry.data.order);
}

export async function getRecommendations() {
  const dir = 'data/recommendations';
  const hasFiles = existsSync(dir) && readdirSync(dir).some((f) => f.endsWith('.md'));
  if (!hasFiles) return [];
  return (await getCollection('recommendations')).sort((a, b) => a.data.order - b.data.order);
}
