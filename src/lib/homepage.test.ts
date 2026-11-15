import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homepage = readFileSync(new URL('../routes/+page.svelte', import.meta.url), 'utf8');
const materials = readFileSync(new URL('../routes/materials/+page.svelte', import.meta.url), 'utf8');

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

  it('offers working subject shortcuts through the Materials Library search query', () => {
    for (const subject of ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'History & Civics', 'Computer']) {
      expect(homepage).toContain(subject);
    }
    expect(homepage).toContain('?q=');
    expect(materials).toContain("new URLSearchParams(window.location.search)");
    expect(materials).toContain("query = params.get('q') ?? ''");
  });

  it('uses a high-contrast index card and legible micro-labels', () => {
    expect(homepage).toContain('background: #fcfbf7');
    expect(homepage).toContain('border: 1px solid #dcd5c7');
    expect(homepage).toContain('box-shadow: 0 2px 8px');
    expect(homepage).toContain('font-size: 12px');
    expect(homepage).toContain('line-height: 1.08');
  });

  it('keeps index-row labels factual rather than implying unverified endorsements', () => {
    expect(homepage).toContain('RESOURCE INDEX');
    expect(homepage).toContain('SOURCE PROFILES');
    expect(homepage).toContain('PRACTICE');
    expect(homepage).not.toMatch(/CISCE Aligned|Verified Sources/i);
  });

  it('does not introduce invented catalogue counts, sample resources or testimonials', () => {
    expect(homepage).not.toMatch(/\b\d{2,}[+]?\s+(resources|downloads|students|educators)\b/i);
    expect(homepage).not.toMatch(/★★★★★|\bverified review\b|\bstudent testimonial\b/i);
  });
});
