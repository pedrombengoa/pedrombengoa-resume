import { ui, type UIKey } from './ui';

export const languages = { en: 'English', es: 'Español' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const ogLocale: Record<Lang, string> = { en: 'en_US', es: 'es_AR' };

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}

export function getLangFromUrl(url: URL): Lang {
  return url.pathname === '/es' || url.pathname.startsWith('/es/') ? 'es' : 'en';
}

/** Builds a locale-prefixed path with a trailing slash. `path` is locale-less, e.g. "/projects/x/". */
export function localizedPath(lang: Lang, path = '/'): string {
  let p = path.startsWith('/') ? path : `/${path}`;
  const [pathname, hash] = p.split('#');
  p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const prefixed = lang === defaultLang ? p : `/${lang}${p}`;
  return hash ? `${prefixed}#${hash}` : prefixed;
}

export function useTranslations(lang: Lang) {
  return (key: UIKey) => ui[lang][key];
}

export function formatYearMonth(value: string | null, lang: Lang, presentLabel: string): string {
  if (!value) return presentLabel;
  if (value.length === 4) return value;
  const [y, m] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

export function formatRange(start: string, end: string | null, lang: Lang, presentLabel: string): string {
  const s = formatYearMonth(start, lang, presentLabel);
  const e = formatYearMonth(end, lang, presentLabel);
  return s === e ? s : `${s} – ${e}`;
}

export function entrySlug(id: string): { lang: Lang; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}
