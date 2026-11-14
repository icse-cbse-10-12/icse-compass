# ICSE Compass

**A focused academic workspace for discovering verified ICSE learning resources and educators.**

ICSE Compass is an independent educational project. It is not affiliated with, endorsed by, or an official product of CISCE.

- Repository: https://github.com/icse-cbse-10-12/icse-compass
- Website: https://icse-cbse-10-12.github.io/icse-compass/
- Hosting: GitHub Pages
- Stack: Svelte 5, SvelteKit 3, TypeScript 6, Vite 8, Tailwind CSS v4

## Phase 2 — Materials catalogue

The Materials Library now reads public JSON files from `static/data/` and supports text search, subject/chapter/educator/type filters, sorting, resource details and original-source links. The Educators route reads verified creator records and shows their published resource counts.

The repository starts with **empty catalogue data**. It intentionally contains no fabricated sample resources, educator profiles, file sizes, page counts or source links.

### Google Sheets source of truth

Use a separate ICSE Compass Google Sheet. Its public data tabs are Resources, Creators, and Subjects & Chapters. Submissions, Review Log, and Settings remain private.

The Google Apps Script publisher is in `integrations/google-apps-script/Code.gs`. After the one-time setup in [the publishing guide](docs/phase-2-sheet-setup.md), editing a public-data tab automatically validates approved rows and commits generated JSON to `main`. That commit triggers GitHub Actions to validate, test, build and deploy the updated catalogue to GitHub Pages.

**One-time setup is still required:** attach the Apps Script to the new Sheet, configure its GitHub token in Script Properties, and install its edit trigger. The repository cannot access a Google Sheet or publish automatically until those user-owned steps are completed.

### Resource rights

Host a PDF only when ICSE Compass owns it or has documented permission to host and distribute it. Otherwise link to the original publisher or use an embed only where permitted. Public availability does not grant redistribution rights. Unpublished, pending and withdrawn rows are not exported.

## Local development

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm run validate:catalogue
npm run check
npm test
npm run build
```

## Current scope

Implemented in this phase:
- Searchable Materials Library with combined filters and sorting.
- Resource details and clearly labelled original-source / authorised-hosted links.
- Educator directory backed by verified public creator data.
- Versioned static JSON catalogue.
- Data validation for IDs, HTTPS links, references, hosted-file permission and embed permission.
- Google Apps Script publishing integration and setup documentation.
- CI and Pages build gates for catalogue validation.

Not included: student accounts, syllabus tracking, study planner, cloud sync, admin dashboard, School Papers catalogue, EduBot, or automatic web scraping. These remain later phases.

## Data files

```
static/data/
  resources.json
  creators.json
  subjects.json
  chapters.json
  catalogue-meta.json
```

Only public, approved catalogue records belong in these files. Private submissions and review notes must never be committed.
