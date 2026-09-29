# Tech Stack

## Site (this project)

- **Astro** — static site generation; every page is pre-rendered HTML
- **React** — used only as islands for interactive bits (theme toggle, mobile menu)
- **TypeScript** — strict mode throughout (TypeScript 6 until `astro check` supports 7)
- **Tailwind CSS v4** — styling through CSS color tokens, with dark and light themes
- **Content collections** — typed content (Zod schemas) in `src/content/`: YAML for profile, experience and skills; MDX per locale for projects and case studies; `data/recommendations/*.md` for LinkedIn recommendations
- **i18n** — Astro i18n routing: EN at `/`, ES at `/es/`, UI strings in `src/i18n/ui.ts`, culturally adapted content per locale
- **Hosting** — Cloudflare Workers static assets (`wrangler.jsonc` serves `./dist`), with DNS and the custom domain on Cloudflare
- **SEO tooling** — `@astrojs/sitemap` (with hreflang), robots.txt endpoint, JSON-LD (ProfilePage/Person, CreativeWork, Article, BreadcrumbList), Open Graph images per locale

## Pedro's Professional Background (referenced in portfolio and experience content)

**AI-enabled engineering:** GitHub Copilot, LLM workflows, Claude, Codex, Spec-driven Development, AgentOS, MCPs, agents, prompt engineering

**Architecture and backend:** Java (senior), Spring Boot, Spring Data, Spring Security, Hibernate/JPA, REST, SOAP, microservices, distributed systems, SOA, APIs, integrations

**Delivery and platforms:** Bitbucket, Jenkins, CI/CD, SAST/SCA with Checkmarx, JFrog Artifactory, XLD, XLR, OpenShift, Kubernetes, Docker, Terraform/IaaS concepts

**Quality and observability:** JUnit, TestNG, Selenium, Playwright, JMeter, SoapUI, New Relic, Splunk, Grafana, distributed tracing, quality gates

**Languages and secondary technologies:** Java (senior), SQL (senior), Python (junior), Node.js (junior), AngularJS (junior); Tomcat/JBoss, GWT, Struts; ServiceMix, Apache Camel, jBPM

**Personal project tech:** Next.js, React, Supabase, Vercel AI SDK, Tailwind CSS, Resend, Mercado Pago, Vite, React Native, Expo, WatermelonDB, ESP32/C, Arduino IDE, Android

**Current learning:** LangChain, LangGraph, LangSmith, AWS/cloud architecture
