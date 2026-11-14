# ICSE Compass

**An independent academic workspace for discovering ICSE learning resources, educators, and school papers.**

> **Independence notice:** ICSE Compass is not affiliated with, endorsed by, or an official product of CISCE (the Council for the Indian School Certificate Examinations).

- Repository: https://github.com/icse-cbse-10-12/icse-compass
- GitHub Pages: https://icse-cbse-10-12.github.io/icse-compass/
- Current phase: Static application foundation

## Current public routes

| Route | Purpose | Current content |
|---|---|---|
| / | Overview | Project introduction and route links |
| /materials/ | Materials Library | Foundation view; no catalogue connected |
| /creators/ | Educators | Foundation view; no profiles published |
| /school-papers/ | School Papers | Foundation view; no papers published |
| /privacy/ | Privacy | Public privacy notice and device-only data design |

No sample resources, invented download links, fabricated file sizes, or unverified metadata are presented as real catalogue content.

## Technology

- Svelte 5 and SvelteKit 2
- TypeScript with svelte-check
- Vite 5 and Tailwind CSS v4
- @sveltejs/adapter-static for prerendered GitHub Pages output
- @vite-pwa/sveltekit with Workbox
- Vitest for unit tests
- GitHub Actions for CI and Pages deployment

## Local development

Requirements: Node.js 22+ and npm.

    git clone https://github.com/icse-cbse-10-12/icse-compass.git
    cd icse-compass
    npm install
    npm run dev

Useful commands:

| Command | Purpose |
|---|---|
| npm run dev | Start Vite development server |
| npm run check | Run Svelte and TypeScript diagnostics |
| npm run typecheck | Alias for the Svelte/TypeScript check |
| npm test | Run Vitest |
| npm run build | Prerender the site and generate the PWA |
| npm run preview | Preview the production output |

Run npm run check, npm test, and npm run build before opening a pull request.

## Static publishing and PWA

SvelteKit uses @sveltejs/adapter-static. The GitHub Pages project base is /icse-compass. The build prerenders the public routes, including /privacy/, and emits the Pages fallback as 404.html.

The manifest uses the ICSE Compass name and Paper & Ink theme. Workbox precaches generated JavaScript, CSS, HTML, SVG, and PNG assets. Future same-origin JSON feeds under /icse-compass/data/*.json use StaleWhileRevalidate with a bounded seven-day cache. Service-worker registration is handled by the SvelteKit PWA integration without delaying the initial route render.

Static discovery files are published from static/: robots.txt, sitemap.xml, llms.txt, and favicon.svg. Structured data includes EducationalOrganization and WebSite entities. Public pages include descriptive titles, descriptions, canonical URLs, and Open Graph metadata.

## Performance and accessibility

Paper & Ink palette: paper #F5F1E8, ink #252923, botanical #356B58, border #DCD5C7.

Typography uses the device's native system font stack; no external font CDN is required. The app source and CI guard against external font providers, analytics, session replay, and ad-tracker endpoints. Navigation controls provide at least 48px touch targets. Mobile navigation is fixed in the thumb zone and accounts for the device safe area. The stylesheet avoids backdrop filters, blend-mode effects, and heavy layered shadows. Reduced-motion preferences disable the reading-progress animation and skeleton pulse.

## Privacy by design for learners under 18

The current release is a static public frontend with no student accounts, email waitlists, profile photos, biometric collection, analytics, advertising, behavioural monitoring, or tracking cookies. The app does not request student profile details. See the [Privacy page](https://icse-cbse-10-12.github.io/icse-compass/privacy/) for the hosting-provider and external-publisher distinction.

Future saved study links and paper checklists must remain on-device: IndexedDB for saved records and localStorage only for small preferences. No account-based sync, background upload, or server-side student profile is permitted by the product design. The service worker may cache public app assets and public JSON feeds only; it must never cache student personal data or authenticated responses. See [docs/privacy-by-design.md](docs/privacy-by-design.md) before adding student-facing data features.

This is a privacy-by-design product policy, not a legal certification. Before introducing any processing of personal data, obtain a current Indian legal review and implement any applicable notice, consent, parental-consent, security, retention, and rights requirements.

## Data, copyright, and security

Public availability of a resource does not prove permission to reproduce or host it. Host only files owned by the project or covered by explicit hosting permission. Otherwise link to the original source or use an authorised embed. Listing review must not be treated as copyright clearance.

Private credentials must never be placed in browser-delivered environment variables or frontend source. The public frontend must not expose service-account keys, privileged API tokens, or admin secrets.

## GitHub Pages workflow

The Pages workflow runs on pushes to main and manual dispatch. It runs Svelte/TypeScript checks, Vitest, and the static PWA build before deploying the build/ artifact.

Set repository Settings → Pages → Build and deployment → Source to GitHub Actions.

## Roadmap

1. Static app foundation, routes, CI, and Pages deployment.
2. Verified materials catalogue, search, filters, and resource details.
3. Educator pages, School Papers, and reviewed admin publishing.
4. Student workspace and planning tools.
5. Offline-first storage and safe sync/conflict handling.
6. EduBot integration after separate privacy and safety review.
7. SEO, accessibility, and performance hardening.

The roadmap is not a claim that planned features are already available.
