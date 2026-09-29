# MVP: Pedro Bengoa personal site

## Context
The product docs (`agent-os/product/`) define a bilingual (EN/ES) personal site. It is a personal brand, a CV and a technical portfolio in one, written for CTOs, architects and senior engineers. The tone is "knows his stuff, doesn't take himself too seriously," and the site is SEO-first and hosted statically on Cloudflare. The repo is greenfield: it has only `data/`, `agent-os/` and `.github/`, and no standards are defined yet (`agent-os/standards/index.yml` is empty). This plan builds the Phase 1 MVP from the roadmap.

**Shaping decisions (confirmed with Pedro):**
- **Framework:** Astro + React islands + TypeScript. Output is static HTML, and React is used only where interactivity is needed.
- **Layout:** a scrolling one-page home, plus detail pages for projects and case studies.
- **Design:** Claude proposes it. No visuals were provided.
- **Spanish:** Claude drafts culturally adapted rioplatense Spanish, and Pedro reviews it before launch.
- **Recommendations:** the section is built now and stays hidden until content exists in `data/recommendations.md`.
- **Domain / GitHub URL:** placeholders in one config file, filled in before launch.
- **Content rule:** no invented experience. Content comes only from `data/`. The public site excludes the private material in `Personal_experience.md`: compensation, interview practice, the culture checklist, the networking notes, and the Log4j story, which is marked "keep out of CV."

Spec folder: `agent-os/specs/2026-09-29-1505-mvp-personal-site/`

---

## Task 1: Save spec documentation
Create `agent-os/specs/2026-09-29-1505-mvp-personal-site/` with:
- **plan.md**: this plan
- **shape.md**: scope, the decisions above, context (visuals: none; references: none, greenfield; product alignment: mission/roadmap/tech-stack)
- **standards.md**: "No standards defined yet". Also note that running `/agent-os:discover-standards` after the MVP is a good way to capture conventions.
- **references.md**: no code references. Point to `data/Pedro_Bengoa_Resume_EN.md` and `data/Personal_experience.md` as content sources.

## Task 2: Scaffold the project
- Astro (latest) with TypeScript in strict mode. Integrations: `@astrojs/react`, `@astrojs/sitemap`, and Tailwind CSS v4 via `@tailwindcss/vite`. Fonts are self-hosted with `@fontsource`.
- `astro.config.mjs`: `output: 'static'`, `site` taken from config, and `i18n: { locales: ['en','es'], defaultLocale: 'en', routing: { prefixDefaultLocale: false } }`. English is served at `/` and Spanish at `/es/`.
- `src/config/site.ts`: site URL, name, email, LinkedIn, and GitHub placeholder. This is the single source for placeholders.
- `wrangler.jsonc` for Cloudflare Workers static assets (`assets.directory: ./dist`), plus `.gitignore`.
- Scripts: `dev`, `build`, `preview`, `check` (`astro check`).

## Task 3: Content model and content
Astro content collections, with Zod schemas in `src/content.config.ts`. Localized fields are `{ en, es }` objects, so both languages sit side by side:
- `profile`: headline, location, availability, languages, education, the "Who I am" paragraphs (first-person text from `mission.md`), and the reinvention section (intro, transformations list, closing).
- `experience`: one YAML file per company (ITX, Despegar, Flux IT, Globant). Each has period, location, a summary, `roles[]` with dates, and highlights. The facts come from the resume only.
- `skills`: groups (AI-enabled engineering, Architecture & backend, Delivery & platforms, Quality & observability, Languages, Currently learning). Each item carries `status: current | historical` and an optional level, so the section shows the whole career and not only today's stack.
- `projects`: MDX per locale (`projects/en/lex-midas.mdx`, …). Frontmatter has name, summary, problem, status, tech[], repo?, demo?, docs?, and order. The body has optional sections (context, decisions, trade-offs, architecture, results, lessons). A section is filled only with provided facts and omitted otherwise. Projects: Lex Midas (lexmidas.com.ar), Dairy Herd Health Platform, and Wildlife Camera Gimbal.
- `caseStudies`: MDX per locale, built from the STAR stories. The body follows Problem → Role → Decision → Stakeholders → Result → Lesson. Stories: AI/SDD adoption across 3 teams, Core-Satellite testing environments, OpenShift 3→4 (~25 services), Java 8→11 / javax→jakarta, and documenting the undocumented CI/CD pipeline. These are the evidence the reinvention section links to.
- `recommendations`: parsed from `data/recommendations.md` if the file exists. The fields are name, role/relationship, date, and text, which stays in the original language (not translated). An empty collection means the section and its nav link are not rendered.
- UI strings live in `src/i18n/ui.ts` (`en`, `es`), with helpers `getLangFromUrl`, `useTranslations` and `localizedPath`.

## Task 4: Layout, design system, SEO head
- **Design direction:** clean and technical, with personality. Body text uses Inter; eyebrows, tags and small "terminal/diagram" accents use JetBrains Mono. There is one accent color. Colors are defined as CSS tokens with dark and light themes (the system preference is the default, and a toggle overrides it). The design is mobile-first, has generous whitespace, and keeps motion subtle, respecting `prefers-reduced-motion`.
- `BaseLayout.astro`: skip link, header nav (section anchors plus an EN/ES switch that links to the equivalent page), and a footer that carries the music reference.
- `SEOHead.astro`: title and description per page, canonical, `hreflang` alternates for en, es and x-default, Open Graph and Twitter tags, and a default OG image per locale.
- React islands (`client:idle`) only for the theme toggle and the mobile menu. Everything else is zero-JS Astro.

## Task 5: Home page sections (`/` and `/es/`)
Both routes render one shared `Home.astro` with the locale:
1. **Hero**: name, headline, and the core line "Technology is a tool…". A comedic intro about self-promotion: in ES it plays on "Cómo te ven, te tratan y te contratan" and "Nada es gratis en la vida" (El Cuarteto de Nos); in EN it uses an adapted equivalent that nods to "Ain't Nothing in This World for Free" (Cage the Elephant). Song titles and short references only, no quoted lyrics. Claude drafts the copy and Pedro reviews it.
2. **About**: the "Who I am" paragraphs.
3. **Reinvention / Leading through change**: the transformations list, with links to the case studies.
4. **Experience**: a timeline that shows the role progression inside each company.
5. **Skills**: grouped, visually separating current from historical.
6. **Projects**: cards linking to the detail pages.
7. **Case studies**: cards linking to the detail pages.
8. **Recommendations**: rendered only when content exists.
9. **Education & languages**.
10. **Contact**: email and LinkedIn (plus GitHub once it is set).

## Task 6: Detail pages
- `src/pages/[...lang]/projects/[slug].astro` and `.../case-studies/[slug].astro`, via `getStaticPaths` per locale. Pages have breadcrumbs, the facts sidebar (tech, status, links), a prev/next link, and a link to the other language version.
- `404.astro` in both languages, with a light joke.

## Task 7: SEO extras
- `@astrojs/sitemap` with the i18n config, so the sitemap includes hreflang.
- `src/pages/robots.txt.ts`, which points to the sitemap.
- JSON-LD: `Person` on the home page (name, jobTitle, address locality, sameAs LinkedIn, alumniOf UNLP, knowsAbout); `SoftwareSourceCode`/`CreativeWork` on project pages; `Article` on case studies; `BreadcrumbList` on detail pages.
- Semantic landmarks, one `h1` per page, alt text, and visible focus states.

## Task 8: Update product docs
- `agent-os/product/tech-stack.md`: record Astro + React islands, Tailwind v4, content collections, and Cloudflare Workers static assets.

## Verification
- `npm run check` and `npm run build` pass with no errors or warnings.
- `npm run preview`, then open `/`, `/es/`, one project and one case study in each language, and the 404. Check that the EN/ES switch lands on the equivalent page, that the theme toggle works, that the layout holds at 375px width with no horizontal scroll, and that the recommendations section is hidden while there is no content.
- Inspect the built HTML (`dist/`): canonical, hreflang trio, OG tags and valid JSON-LD are present; `dist/sitemap-index.xml` and `robots.txt` exist.
- Lighthouse on the preview reaches 95 or more for Performance, Accessibility, Best Practices and SEO.
- Deploying to Cloudflare (`npx wrangler deploy`) is left for Pedro to trigger once the domain is set. It is not done automatically.
