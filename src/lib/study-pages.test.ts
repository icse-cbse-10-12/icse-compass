import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const syllabus = readFileSync(new URL('../routes/syllabus/+page.svelte', import.meta.url), 'utf8');
const player = readFileSync(new URL('../routes/chapter-player/+page.svelte', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../routes/+layout.svelte', import.meta.url), 'utf8');
const site = readFileSync(new URL('./site.ts', import.meta.url), 'utf8');
const vite = readFileSync(new URL('../../vite.config.ts', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../../static/sitemap.xml', import.meta.url), 'utf8');
const privacy = readFileSync(new URL('../routes/privacy/+page.svelte', import.meta.url), 'utf8');

describe('ICSE Compass study pages', () => {
  it('prerenders and indexes both pages', () => {
    expect(vite).toContain("'/syllabus/'");
    expect(vite).toContain("'/chapter-player/'");
    expect(sitemap).toContain('/syllabus/');
    expect(sitemap).toContain('/chapter-player/');
  });

  it('adds both destinations to shared navigation', () => {
    expect(site).toContain("path: '/syllabus/'");
    expect(site).toContain("path: '/chapter-player/'");
    expect(layout).toContain("route.shortLabel === 'Syllabus'");
    expect(layout).toContain("route.shortLabel === 'Player'");
  });

  it('does not seed demo chapters, resource links or fake completion', () => {
    expect(syllabus).toContain('Add the names from your school');
    expect(syllabus).toContain('Nothing is pre-marked as completed.');
    expect(player).toContain('Only published catalogue resources and explicitly permitted embeds appear here.');
    expect(player).toContain('Opening a video or note does not automatically mark a chapter complete.');
    expect(player).not.toContain('kKKM8M8Y-u7ds');
  });

  it('keeps progress local and discloses the storage model', () => {
    expect(syllabus).toContain('localStorage.setItem(STUDY_STORAGE_KEY');
    expect(player).toContain('localStorage.setItem(STUDY_STORAGE_KEY');
    expect(privacy).toContain('stores the subject names, chapter names and progress states');
    expect(privacy).toContain('not sent to an ICSE Compass account');
  });
});
