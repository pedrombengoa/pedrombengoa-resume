import { existsSync, readdirSync } from 'node:fs';
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const l10n = z.object({ en: z.string(), es: z.string() });
const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/);

const profile = defineCollection({
  loader: file('src/content/profile.yaml'),
  schema: z.object({
    headline: l10n,
    tagline: l10n,
    intro: z.object({ en: z.array(z.string()), es: z.array(z.string()) }),
    location: l10n,
    availability: l10n,
    about: z.object({ en: z.array(z.string()), es: z.array(z.string()) }),
    reinvention: z.object({
      intro: l10n,
      listLead: l10n,
      transformations: z.array(z.object({ from: l10n, to: l10n })),
      closing: l10n,
    }),
    education: z.object({ degree: l10n, school: z.string() }),
    languages: z.array(z.object({ name: l10n, level: l10n })),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.object({
    company: z.string(),
    location: l10n,
    start: yearMonth,
    end: yearMonth.nullable(),
    order: z.number(),
    summary: l10n.optional(),
    roles: z.array(z.object({ title: z.string(), start: yearMonth, end: yearMonth.nullable() })),
    highlights: z.array(z.object({ label: l10n.optional(), text: l10n })),
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.object({
    name: l10n,
    order: z.number(),
    items: z.array(z.object({ name: z.string(), historical: z.boolean().default(false) })),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    problem: z.string(),
    kind: z.string(),
    status: z.enum(['active', 'in-progress', 'completed']),
    tech: z.array(z.string()),
    website: z.url().optional(),
    repo: z.url().optional(),
    demo: z.url().optional(),
    order: z.number(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    context: z.string(),
    shift: z.string(),
    shows: z.array(z.string()),
    order: z.number(),
  }),
});

const RECOMMENDATIONS_DIR = 'data/recommendations';
const recommendationsGlob = glob({ pattern: '*.md', base: RECOMMENDATIONS_DIR });

const recommendations = defineCollection({
  loader: {
    name: 'optional-recommendations',
    load: async (context) => {
      const hasFiles = existsSync(RECOMMENDATIONS_DIR) && readdirSync(RECOMMENDATIONS_DIR).some((f) => f.endsWith('.md'));
      if (!hasFiles) {
        context.store.clear();
        return;
      }
      await recommendationsGlob.load(context);
    },
  },
  schema: z.object({
    name: z.string(),
    role: z.string(),
    relationship: z.string().optional(),
    date: z.string().optional(),
    lang: z.enum(['en', 'es']).default('en'),
    url: z.url().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { profile, experience, skills, projects, caseStudies, recommendations };
