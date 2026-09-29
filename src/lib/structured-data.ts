import { site } from '../config/site';
import { localizedPath, type Lang } from '../i18n/utils';

const abs = (path: string, base: URL) => new URL(path, base).href;

export function personSchema(base: URL) {
  return {
    '@type': 'Person',
    '@id': abs('/#person', base),
    name: site.name,
    jobTitle: 'Solutions Architect',
    url: abs('/', base),
    image: abs('/images/pedro-bengoa.jpg', base),
    email: `mailto:${site.email}`,
    worksFor: { '@type': 'Organization', name: 'ITX Corp.' },
    address: { '@type': 'PostalAddress', addressLocality: 'La Plata', addressRegion: 'Buenos Aires', addressCountry: 'AR' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Nacional de La Plata' },
    knowsLanguage: ['es', 'en'],
    knowsAbout: [
      'Software architecture',
      'Solution architecture',
      'Technical leadership',
      'Distributed systems',
      'Microservices',
      'Enterprise integration',
      'Java',
      'Spring Boot',
      'CI/CD',
      'AI-enabled software development',
      'Spec-driven Development',
      'Engineering enablement',
    ],
    sameAs: [site.linkedin, ...(site.github ? [site.github] : [])],
  };
}

export function profilePageSchema(lang: Lang, base: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: abs(localizedPath(lang, '/'), base),
    inLanguage: lang,
    mainEntity: personSchema(base),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[], base: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path, base),
    })),
  };
}

export function projectSchema(opts: { lang: Lang; path: string; title: string; summary: string; tech: string[]; website?: string; repo?: string }, base: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.title,
    description: opts.summary,
    url: abs(opts.path, base),
    inLanguage: opts.lang,
    keywords: opts.tech.join(', '),
    author: { '@id': abs('/#person', base), '@type': 'Person', name: site.name },
    ...(opts.website || opts.repo ? { sameAs: [opts.website, opts.repo].filter(Boolean) } : {}),
  };
}

export function articleSchema(opts: { lang: Lang; path: string; title: string; summary: string }, base: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.summary,
    url: abs(opts.path, base),
    inLanguage: opts.lang,
    author: { '@id': abs('/#person', base), '@type': 'Person', name: site.name },
  };
}
