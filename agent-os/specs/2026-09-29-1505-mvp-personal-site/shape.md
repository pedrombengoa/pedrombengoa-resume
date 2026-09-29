# MVP Personal Site — Shaping Notes

## Scope

Build the Phase 1 MVP from `agent-os/product/roadmap.md`: a bilingual (EN/ES), static, SEO-first personal site for Pedro Bengoa. A one-page home covers hero, about, reinvention, experience, skills, projects, case studies, recommendations, education and contact, plus detail pages for projects and case studies.

## Decisions

- **Framework:** Astro + React islands + TypeScript (strict). Static output. React only for the theme toggle and mobile menu.
- **Styling:** Tailwind CSS v4, CSS color tokens, dark/light themes (follows the system, with a toggle override). Fonts self-hosted via @fontsource (Inter + JetBrains Mono).
- **i18n:** Astro i18n routing. EN at `/`, ES at `/es/`. hreflang en/es/x-default on every page.
- **Content:** Astro content collections. Localized fields are `{ en, es }` objects; long-form projects and case studies are MDX per locale.
- **Spanish copy:** drafted by Claude in rioplatense Spanish, culturally adapted rather than translated literally. Pedro reviews it before launch.
- **Recommendations:** section built but hidden until `data/recommendations.md` has entries. Text stays in its original language.
- **Placeholders:** site URL and GitHub profile in `src/config/site.ts`, filled in before launch.
- **Hosting:** Cloudflare Workers static assets (`wrangler.jsonc`). Pedro triggers the deploy; it is not automated.
- **Content rule:** no invented experience. The public site excludes the private material in `Personal_experience.md` (compensation, interview practice, culture checklist, networking notes, the Log4j story).
- **Cultural references:** song titles and short nods only, no quoted lyrics.

## Context

- **Visuals:** None. Claude proposes the design.
- **References:** None, greenfield repo.
- **Product alignment:** follows mission.md (tone, audience, core concept, reinvention narrative), roadmap.md (Phase 1 sections) and tech-stack.md (React + TS, static, Cloudflare).

## Standards Applied

None yet. `agent-os/standards/index.yml` is empty.
