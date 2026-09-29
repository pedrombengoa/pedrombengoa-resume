# Pedro Bengoa: personal site

> Technology is a tool. The interesting part is figuring out what to build, why, and how.

The bilingual (English / Spanish) personal site of Pedro Bengoa, Solutions Architect and technical leader. It combines a personal brand, a CV and a technical portfolio. It's written for CTOs, engineering leaders, architects and senior engineers rather than keyword-matching recruiters, and it aims to show *how* problems get solved, not just which job titles were held.

The tone is "knows his stuff, but doesn't take himself too seriously."

## Tech stack

- [Astro 7](https://astro.build): static site generation. Every page ships as pre-rendered HTML.
- React 19: interactive islands only (theme toggle, mobile menu).
- TypeScript in strict mode.
- Tailwind CSS v4: CSS color tokens, with dark and light themes.
- MDX and Astro content collections: typed content with Zod schemas.
- `@astrojs/sitemap`: sitemap with hreflang.
- Cloudflare Workers static assets: hosting.

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
npm run dev       # http://localhost:4321
```

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the dev server                             |
| `npm run check`   | Type-check Astro, TS and content schemas         |
| `npm run build`   | Build the static site into `dist/`               |
| `npm run preview` | Serve the production build locally               |

## Project structure

```
src/
  config/site.ts        Site URL, name, email, social links (single source of truth)
  content/              All site content (see "Editing content")
  content.config.ts     Content collection schemas
  components/
    home/               Home page sections
    detail/             Project and case study pages
    islands/            React islands (theme toggle, mobile menu)
  i18n/                 UI strings (ui.ts) and locale helpers (utils.ts)
  layouts/              Base HTML layout
  lib/                  Content queries and JSON-LD builders
  pages/                Routes: EN at /, ES at /es/
  styles/global.css     Design tokens, themes, prose styles
public/                 Favicon and Open Graph images (public/og/)
data/
  recommendations/      LinkedIn recommendations (one .md per person)
agent-os/               Product docs (mission, roadmap, tech stack) and feature specs
```

## Editing content

Content never lives in components. Localized fields sit side by side as `en` / `es`, so both languages stay in sync.

| What                                   | Where                                                    |
| -------------------------------------- | -------------------------------------------------------- |
| Headline, hero intro, about, reinvention, education, languages | `src/content/profile.yaml` |
| Work experience                        | `src/content/experience.yaml`                            |
| Skills (`historical: true` fades one)  | `src/content/skills.yaml`                                |
| Projects                               | `src/content/projects/{en,es}/<slug>.mdx`                |
| Case studies                           | `src/content/case-studies/{en,es}/<slug>.mdx`            |
| Buttons, labels, section titles, meta  | `src/i18n/ui.ts`                                         |

**Adding a project or case study:** create the MDX file in **both** `en/` and `es/` with the same slug. The detail pages, cards, sitemap entries and hreflang links are generated automatically. See an existing file for the frontmatter fields.

**Adding a LinkedIn recommendation:** add a Markdown file to `data/recommendations/`. The section and its nav link appear as soon as the first file exists.

```markdown
---
name: Jane Doe
role: Engineering Manager at Example Corp
relationship: Managed Pedro directly   # optional
date: March 2024                       # optional
lang: en                               # language the text is written in (en | es)
url: https://www.linkedin.com/in/...   # optional
order: 1                               # optional, lower shows first
---

The recommendation text, exactly as written on LinkedIn.
```

Recommendations are shown in their original language. They are never translated.

## i18n and SEO

- English is served at `/` and Spanish at `/es/`. Spanish copy is culturally adapted, not a literal translation.
- Every page has a canonical link, `hreflang` alternates (en, es, x-default), Open Graph and Twitter tags.
- JSON-LD: `ProfilePage`/`Person` on the home page, `CreativeWork` on projects, `Article` on case studies, and `BreadcrumbList` on detail pages.
- `sitemap-index.xml` and `robots.txt` are generated at build time.

## Deploy to Cloudflare

The site deploys as static assets on Cloudflare Workers ([wrangler.jsonc](wrangler.jsonc)).

```bash
npx wrangler login     # one time, opens the browser
npm run build
npx wrangler deploy
```

**Custom domain:** add the domain to your Cloudflare account, then add this to `wrangler.jsonc` and deploy again. Cloudflare creates the DNS record and the certificate.

```jsonc
"routes": [{ "pattern": "yourdomain.com", "custom_domain": true }]
```

**Auto-deploy (optional):** in the Cloudflare dashboard, go to Workers → `resume` → Settings → Builds and connect this repository. Use `npm run build` as the build command, and every push to `main` will deploy.

## Before launch

- [ ] Set `SITE_URL` and `github` in `src/config/site.ts`. Canonical links, the sitemap and OG tags depend on the URL.
- [ ] Review the Spanish copy and the hero jokes.
- [ ] Confirm the design tool named on the wildlife gimbal project page.

## Workflow

Product documentation and feature specs live in `agent-os/`:

- `agent-os/product/`: mission, roadmap, tech stack
- `agent-os/specs/`: shaped specs for each piece of work

The `/agent-os:*` Claude Code commands in `.claude/commands/` drive this workflow.

## License

© Pedro Bengoa. All rights reserved. The content (text, case studies, images) is not licensed for reuse.
