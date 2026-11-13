# ICSE Compass

ICSE Compass is an independent academic workspace for ICSE learners. The first public release is focused on discovering learning materials, educators and school papers.

> ICSE Compass is an independent educational project and is not affiliated with or endorsed by CISCE.

## Phase 1 foundation

- React + TypeScript + Vite
- Tailwind CSS v4 and Lucide icons
- Responsive Paper & Ink design system
- Public navigation for Overview, Materials, Educators and School Papers
- GitHub Pages base path configured for `/icse-compass/`
- Strict TypeScript, Vitest and GitHub Actions CI
- Accessible navigation labels, visible keyboard focus and reduced-motion support

The Materials, Educators and School Papers routes are foundation placeholders. Catalogue integration and real content belong to Phase 2 and Phase 3; no sample resource records or invented metadata are presented as real content.

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm test
npm run build
```

## Architecture and data safety

- Public catalogue data may be exposed to visitors; private student records and admin operations must never be shipped in the static client bundle.
- Do not add service-account credentials, admin secrets or private API keys to frontend environment variables.
- Only host files when ownership or explicit hosting permission is documented. Otherwise link to the source.
- Catalogue inclusion is not proof of copyright permission or endorsement.
- Student accounts, cloud progress, offline sync and EduBot are outside this foundation phase.
