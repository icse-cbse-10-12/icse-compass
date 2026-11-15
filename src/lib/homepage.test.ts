import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homepage = readFileSync(new URL('../routes/+page.svelte', import.meta.url), 'utf8');

describe('ICSE Compass homepage product-led hero', () => {
  it('uses a labelled product index panel instead of the decorative compass illustration', () => {
    expect(homepage).toContain('class="hero-product-panel"');
    expect(homepage).toContain('aria-labelledby="hero-index-title"');
    expect(homepage).not.toContain('class="hero-art"');
  });

  it('offers direct, truthful paths into the existing public destinations', () => {
    expect(homepage).toContain('href="{siteBase}/materials/"');
    expect(homepage).toContain('href="{siteBase}/creators/"');
    expect(homepage).toContain('href="{siteBase}/school-papers/"');
    expect(homepage).toContain('Search by subject, chapter or source');
  });

  it('does not introduce invented catalogue counts, sample resources or testimonials', () => {
    expect(homepage).not.toMatch(/\b\d{2,}[+]?\s+(resources|downloads|students|educators)\b/i);
    expect(homepage).not.toMatch(/★★★★★|\bverified review\b|\bstudent testimonial\b/i);
  });
});
