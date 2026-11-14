# ICSE Compass

**A focused academic workspace for discovering ICSE learning resources, educators, and school papers.**

ICSE Compass is an independent educational project being developed for learners who want a clear place to discover study materials and academic resources.

> **Independence notice:** ICSE Compass is not affiliated with, endorsed by, or an official product of the Council for the Indian School Certificate Examinations (CISCE).

- **Repository:** https://github.com/icse-cbse-10-12/icse-compass
- **Current hosting workflow:** GitHub Pages
- **Application stack:** Svelte 5, SvelteKit 2, TypeScript, Vite, Tailwind CSS v4
- **Project status:** Phase 1 — static application foundation

---

## Contents

- [Project goals](#project-goals)
- [Current release status](#current-release-status)
- [What is implemented today](#what-is-implemented-today)
- [What is not implemented yet](#what-is-not-implemented-yet)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Run locally](#run-locally)
- [Available commands](#available-commands)
- [Application routes](#application-routes)
- [Design and accessibility](#design-and-accessibility)
- [Build and deployment](#build-and-deployment)
- [Environment configuration](#environment-configuration)
- [Data, copyright, and content policy](#data-copyright-and-content-policy)
- [Security and privacy principles](#security-and-privacy-principles)
- [Testing and continuous integration](#testing-and-continuous-integration)
- [Development roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Project goals

ICSE Compass is intended to make academic resource discovery more organised and dependable.

The public-facing product is planned around:

1. **Materials Library** — discover notes, worksheets, reference material, and other learning resources.
2. **Educator directory** — browse dedicated pages for educators and learning channels.
3. **School Papers** — find school-level practice and examination papers.
4. **Personal study workspace (later release)** — syllabus progress, planning, revision, and related student tools.
5. **Academic assistance (later release)** — a future EduBot integration, subject to a separate implementation and safety review.

The first public release is being built in phases. The current repository is the application foundation, not the completed resource platform.

## Current release status

### Phase 1 — foundation

The current codebase establishes the application shell, navigation, design foundation, routing, tests, and GitHub Actions workflows.

The Materials, Educators, and School Papers routes are **clearly marked foundation placeholders**. They do not yet contain a connected catalogue or real resource listings.

No sample resources, invented download links, fabricated file sizes, or unverified resource metadata are presented as real catalogue content.

### Release status at a glance

| Area | Current status |
|---|---|
| SvelteKit application shell | Implemented |
| TypeScript strict configuration | Implemented |
| Responsive Paper & Ink interface | Implemented |
| Public navigation and client-side routes | Implemented |
| Materials catalogue integration | Not implemented |
| Educator profile data | Not implemented |
| School Papers catalogue | Not implemented |
| Admin publishing and approval | Not implemented |
| Student accounts and cloud progress | Not implemented |
| Offline progress synchronisation | Not implemented |
| EduBot integration | Not implemented |
| Vercel project connection | Not configured |

This table describes the current codebase. Planned capabilities must not be treated as available product features.

## What is implemented today

- SvelteKit application layout and application shell.
- Responsive navigation for Overview, Materials, Educators, and School Papers.
- Client-side routing with a not-found route.
- A responsive Paper & Ink visual foundation.
- Keyboard-visible focus styling and reduced-motion support in the stylesheet.
- Accessible names for primary navigation elements.
- Vitest foundation test suite.
- GitHub Actions CI for dependency installation, TypeScript/build validation, and tests.
- A GitHub Pages build and deployment workflow.
- A GitHub Pages fallback page for client-side routes.

## What is not implemented yet

The following are future work and must not be assumed to exist:

- A live Google Sheets or other catalogue connection.
- Resource search, filters, subject/chapter taxonomy, or resource detail records.
- Creator profile records or verified educator links.
- School-paper submissions, review, moderation, or publishing.
- Admin authentication, roles, and audit logs.
- Student registration, personal progress, or cloud data storage.
- Firebase services, database rules, or server-side functions.
- IndexedDB/Dexie offline storage or sync conflict handling.
- EduBot or any AI-powered student feature.
- Analytics, advertising, or tracking integrations.

Features should be added only with the required data model, permission checks, failure states, and tests.

## Technology stack

| Technology | Purpose |
|---|---|
| Svelte 5 and SvelteKit 2 | User interface and application framework |
| TypeScript | Static typing and safer application code |
| Vite | Development server and production build |
| Tailwind CSS v4 | Utility-first styling |
| Lucide icons (where used) | Interface icons |
| @sveltejs/adapter-static | Prerendered static publishing |
| Vitest | Unit and component test runner |
| @vite-pwa/sveltekit and Workbox | Progressive Web App and public-asset caching |
| svelte-check | Svelte and TypeScript validation |
| GitHub Actions | Continuous integration and GitHub Pages deployment |

Versions and dependency ranges are defined in [package.json](./package.json).

## Repository structure

```text
icse-compass/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Pull request and branch quality checks
│       └── pages.yml           # Build and deploy to GitHub Pages
├── public/
│   └── static/                 # Public static assets and Pages fallback support
├── src/
│   ├── lib/                    # Shared application modules and tests
│   ├── routes/                 # SvelteKit pages and layouts
│   └── styles.css              # Global styles and design foundation
├── .env.example                # Public-client configuration guidance
├── .gitignore
├── index.html                  # HTML entry point
├── package.json                # Scripts and dependencies
├── tsconfig.json               # TypeScript project references
├── tsconfig.app.json           # Application TypeScript settings
├── tsconfig.node.json          # Tooling TypeScript settings
├── svelte.config.js            # SvelteKit and static adapter config
├── vite.config.ts              # Vite, SvelteKit, Tailwind, PWA, and Vitest config
└── static/                     # Public assets, robots, sitemap, and offline assets
```

As the project grows, features should be organised into focused modules rather than putting catalogue access, business rules, and UI state into a single component.

## Run locally

### Prerequisites

- Node.js 22 or a compatible newer LTS release.
- npm (bundled with Node.js).
- Git.

Check your installed versions:

```bash
node --version
npm --version
```

### 1. Clone the repository

```bash
git clone https://github.com/icse-cbse-10-12/icse-compass.git
cd icse-compass
```

### 2. Install dependencies

```bash
npm install
```

The repository currently does not commit a package lockfile. Dependency reproducibility and the npm audit findings must be resolved before this migration is merged.

### 3. Start the development server

```bash
npm run dev
```

Vite prints the local development URL in the terminal (normally http://localhost:5173).

### 4. Open the application

Open the URL printed by Vite. Changes to application files are reflected by the development server.

## Available commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Vite development server |
| `npm run build` | Prerender the static site and create the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run the TypeScript build/type check |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

Run the full local quality sequence before opening a pull request:

```bash
npm run typecheck
npm test
npm run build
```

## Application routes

The current SvelteKit route structure exposes these paths:

| Path | Current view | Data status |
|---|---|---|
| `/` | Overview | Foundation content |
| `/materials/` | Materials Library | Placeholder; no catalogue connected |
| `/creators/` | Educators | Placeholder; no creator records connected |
| `/school-papers/` | School Papers | Placeholder; no papers connected |
| `/privacy/` | Privacy | Public privacy notice |
| Unknown path | Page not found | Static fallback view |

The route names are part of the current application foundation. Their full product functionality will be developed in later phases.

## Design and accessibility

The current visual direction is **Paper & Ink**: a calm academic interface intended to work well on mobile and desktop.

Core palette:

| Token | Value | Intended use |
|---|---|---|
| Paper | `#F5F1E8` | Warm page background |
| Ink | `#252923` | Primary text |
| Botanical green | `#356B58` | Accent and action colour |

Accessibility considerations already present in the foundation include:

- Semantic page structure and navigation landmarks.
- Accessible labels for primary navigation.
- Visible keyboard focus treatment.
- Reduced-motion support.

Accessibility is an ongoing acceptance criterion, not a one-time implementation claim. New features should be checked for keyboard operation, focus order, accessible names, contrast, responsive layout, touch target size, and loading, empty, error, and success states.

## Build and deployment

### GitHub Pages (current deployment workflow)

The repository includes a GitHub Actions workflow at [`.github/workflows/pages.yml`](./.github/workflows/pages.yml).

It is configured to:

1. Run when changes are pushed to `main` or when manually dispatched.
2. Install dependencies.
3. Build the application.
4. Upload the `dist` directory as a Pages artifact.
5. Deploy the artifact to GitHub Pages.

The Vite base path is currently configured for this GitHub Pages project site:

```ts
base: "/icse-compass/"
```

The expected project-site URL is:

https://icse-cbse-10-12.github.io/icse-compass/

For GitHub Pages deployment, ensure the repository's **Settings → Pages → Build and deployment → Source** is set to **GitHub Actions**. A successful workflow run is the deployment signal; a successful local build alone does not mean the site is published.

### Vercel (not configured yet)

A Vercel project is not currently connected to this repository. The existing Vite base path is GitHub Pages-specific, so the application should not be switched to Vercel production hosting until the base path is made deployment-target-aware and both preview and production builds are verified.

The intended future arrangement is:

- GitHub remains the source-code repository.
- GitHub Actions runs tests and build checks.
- Vercel can provide preview deployments for pull requests and production hosting from `main`, after project configuration and deployment verification.

Do not add Vercel tokens or other deployment secrets to client-side files. Hosting changes should be documented and tested before the GitHub Pages workflow is retired.

## Environment configuration

The current foundation does not require application environment variables to run locally.

The [`.env.example`](./.env.example) file is guidance for future public-client configuration only. It currently contains no configured service credentials.

When external services are introduced:

- Keep private API keys, service-account credentials, and admin secrets on trusted server-side infrastructure.
- Treat all variables bundled into a browser application as public.
- Document each required variable, its purpose, and whether it is safe for client-side exposure.
- Never commit a real `.env` file or credential.

## Data, copyright, and content policy

ICSE Compass is a resource-discovery project. A resource being publicly accessible online, appearing in a catalogue, or being submitted by a user does **not** prove that ICSE Compass has permission to copy, host, redistribute, or endorse it.

The project follows these principles:

1. Host a file only when the project owns it or has documented permission to host and distribute it.
2. Otherwise, link to the original source or use an embed only where the source permits it.
3. Preserve source attribution and relevant creator/source links.
4. Do not imply that a catalogue entry is a copyright clearance or endorsement.
5. Do not invent file sizes, page counts, authorship, dates, or other metadata.
6. Provide a process for reviewing rights concerns and removing or disabling disputed links when appropriate.
7. Keep official CISCE material clearly distinguishable from independent resources. ICSE Compass is not an official CISCE platform.

Future catalogue records should distinguish at least resource discovery/review status from hosting-permission status. Approval for listing must not automatically grant permission to rehost a file.

## Security and privacy principles

The current public application does not require student accounts or collect student profile details. The public privacy notice is available at [`/privacy/`](https://icse-cbse-10-12.github.io/icse-compass/privacy/). The current architecture keeps future bookmarks and paper-checklist data on the device; it does not synchronise that data to a server. Public static assets and public catalogue JSON may be cached for offline access; private student data and authenticated responses must never be placed in the service-worker cache. GitHub Pages may process technical request metadata as part of hosting. External publishers have their own privacy practices. These statements describe the current implementation and are not a legal-compliance certification. See [privacy-by-design requirements](./docs/privacy-by-design.md).

The current Phase 1 application is a public static frontend. It does not implement student accounts, private student records, or privileged admin operations.

Future development must preserve the following boundaries:

- Never put private credentials or privileged operations in the browser bundle.
- Enforce admin permissions on a trusted server, not only by hiding frontend controls.
- Scope private student data to the authenticated owner.
- Use least-privilege database and storage rules.
- Collect only the information needed for a clearly stated feature.
- Avoid exposing student progress, submissions, or personal details publicly.
- Validate uploads and submitted URLs before publishing.
- Add rate limits and audit records to privileged publishing workflows.
- Design account, data-retention, consent, and deletion flows before collecting student information.

Any future account or student-data feature requires a separate security, privacy, and age-appropriate design review before release.

## Testing and continuous integration

The current CI workflow is [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

It runs on pull requests targeting `main` and pushes to `main` or `feat/**`. The current job:

1. Checks out the repository.
2. Sets up Node.js 22.
3. Installs dependencies.
4. Runs the TypeScript/build command.
5. Runs the Vitest test suite.
6. Verifies prerendered routes, sitemap/llms output, PWA assets, and selected privacy guardrails.

The current test suite is a small foundation suite. It verifies that the overview renders and that the independent relationship with CISCE is stated. It is not yet comprehensive coverage of a finished product.

As features are added, tests should cover normal behaviour and failure conditions, including empty data, loading, errors, offline/slow connections, invalid inputs, missing resources, permission denial, expired sessions, and failed uploads where relevant.

## Development roadmap

The product is intended to grow in controlled phases. This roadmap is directional; an item is not implemented merely because it appears here.

| Phase | Focus | Status |
|---|---|---|
| 1 | Repository, app shell, navigation, design foundation, routing, CI, initial Pages workflow | Foundation implemented |
| 2 | Materials catalogue, search, filters, resource details, creator associations | Planned |
| 3 | Educator pages, School Papers, admin publishing, review and audit workflow | Planned |
| 4 | Student accounts, syllabus progress, study planner, revision tools | Planned |
| 5 | Offline-first local storage, sync states, and conflict recovery | Planned |
| 6 | EduBot and academic assistance | Planned |
| 7 | Search visibility, metadata, structured data, performance, and launch hardening | Planned |

Each phase should have its own acceptance criteria, tests, security review, and deployable increment. Avoid adding placeholder data that could be mistaken for verified student resources.

## Contributing

Contributions should keep the project accurate, accessible, secure, and maintainable.

Suggested workflow:

1. Open an issue or describe the problem and expected behaviour.
2. Keep changes focused and avoid unrelated refactoring.
3. Add or update tests for changed behaviour.
4. Run `npm run typecheck`, `npm test`, and `npm run build`.
5. Open a pull request against `main`, describing the change, evidence, and any limitations.
6. Do not merge while required checks are failing or important review issues remain.

For UI changes, include mobile and desktop considerations and verify keyboard focus and reduced-motion behaviour. For catalogue or content changes, include source and permission evidence.

## License

No open-source license has been declared in this repository yet. Until a license is added, do not assume that the source code is licensed for unrestricted reuse, redistribution, or modification. If a license is selected, it should be added as a dedicated `LICENSE` file and reflected here.

---

**ICSE Compass** — an independent academic workspace, developed in phases.
