import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const appShell = readFileSync(new URL('../app.html', import.meta.url), 'utf8');
const homepage = readFileSync(new URL('../routes/+page.svelte', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../routes/+layout.svelte', import.meta.url), 'utf8');
const templates = [
  appShell,
  readFileSync(new URL('./IndependenceNotice.svelte', import.meta.url), 'utf8'),
  ...[
    '+layout.svelte',
    '+page.svelte',
    'chapter-player/+page.svelte',
    'creators/+page.svelte',
    'creators/[creatorId]/+page.svelte',
    'materials/+page.svelte',
    'privacy/+page.svelte',
    'saved/+page.svelte',
    'school-papers/+page.svelte',
    'syllabus/+page.svelte'
  ].map((path) => readFileSync(new URL('../routes/' + path, import.meta.url), 'utf8'))
];

describe('HTML, SEO and static security cleanup', () => {
  it('contains no empty div, p or span scaffolding in the static shell or Svelte templates', () => {
    for (const source of templates) {
      expect(source).not.toMatch(new RegExp('<(div|p|span)[^>]*>[ ]*</(div|p|span)>', 'i'));
      expect(source).not.toContain('<!--');
    }
  });

  it('keeps SvelteKit placeholders and applies a static-compatible security policy', () => {
    expect(appShell).toContain('%sveltekit.head%');
    expect(appShell).toContain('%sveltekit.body%');
    expect(appShell).toContain('name="referrer" content="strict-origin-when-cross-origin"');
    expect(appShell).toContain('http-equiv="Content-Security-Policy"');
    expect(appShell).toContain("script-src 'self' 'unsafe-inline'");
    expect(appShell).toContain("style-src 'self' 'unsafe-inline'");
    expect(appShell).not.toContain("'unsafe-eval'");
    expect(appShell).toContain('frame-src');
    expect(appShell).toContain('img-src');
  });

  it('provides a large social preview image and a concise description', () => {
    expect(existsSync(new URL('../../static/og-compass.png', import.meta.url))).toBe(true);
    expect(layout).toContain('property="og:image" content="https://icse-cbse-10-12.github.io/icse-compass/og-compass.png"');
    expect(layout).toContain('name="twitter:image" content="https://icse-cbse-10-12.github.io/icse-compass/og-compass.png"');
    expect(layout).toContain('name="twitter:card" content="summary_large_image"');
    const description = homepage.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';
    expect(description.length).toBeLessThan(155);
  });

  it('uses specific library actions and CSS pseudo-elements for decoration', () => {
    expect(homepage).toContain('Browse the ICSE Materials Library');
    expect(homepage).not.toContain('>Explore papers <');
  });
});
