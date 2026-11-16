import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homepage = readFileSync(new URL('../routes/+page.svelte', import.meta.url), 'utf8');
const materials = readFileSync(new URL('../routes/materials/+page.svelte', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('student-first ICSE Compass homepage', () => {
  it('starts with a reassuring, achievable first action instead of an overwhelming overview', () => {
    expect(homepage).toContain("You don't have to study it all today.");
    expect(homepage).toContain('Start with one topic.');
    expect(homepage).toContain('One subject. One resource. One next step.');
    expect(homepage).toContain('Find a study resource');
    expect(homepage).toContain('What are you studying today?');
  });

  it('keeps the main search functional and sends the query to the Materials Library', () => {
    expect(homepage).toContain('onsubmit={handleSearch}');
    expect(homepage).toContain('bind:value={searchQuery}');
    expect(homepage).toContain('event.preventDefault()');
    expect(homepage).toContain('void goto(query ?');
    expect(homepage).toContain('encodeURIComponent(query)');
    expect(materials).toContain("new URLSearchParams(window.location.search)");
    expect(materials).toContain("query = params.get('q') ?? ''");
  });

  it('offers only the deliberate homepage subject shortcuts', () => {
    for (const subject of ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English Paper 2']) {
      expect(homepage).toContain(subject);
    }
    expect(homepage).toContain('subject-english');
    expect(homepage).not.toContain('History &amp; Civics');
    expect(homepage).not.toContain('Computer');
    expect(homepage).toContain('aria-label="Quick subject searches"');
  });

  it('reduces competing destinations while retaining direct paths to Materials and Syllabus', () => {
    expect(homepage).toContain('href={`${siteBase}/materials/`}');
    expect(homepage).toContain('href={`${siteBase}/syllabus/`}');
    expect(homepage).toContain('Browse all materials');
    expect(homepage).toContain('Make a simple chapter list');
    expect(homepage).not.toContain('hero-card-deck');
    expect(homepage).not.toContain('indexCards');
  });

  it('explains a simple choose-find-continue flow without inventing progress or results', () => {
    expect(homepage).toContain('Pick one subject.');
    expect(homepage).toContain('Find one useful resource.');
    expect(homepage).toContain('Decide what comes next.');
    expect(homepage).not.toMatch(/\b\d{2,}[+]?\s+(resources|downloads|students|educators)\b/i);
    expect(homepage).not.toMatch(/★★★★★|student testimonial|verified review/i);
  });

  it('uses the warm paper, pistachio, sage and espresso palette with readable controls', () => {
    expect(styles).toContain('--paper:#F7F3E8');
    expect(styles).toContain('--ink:#2B211A');
    expect(styles).toContain('--green:#527B5C');
    expect(styles).toContain('--sage:#E4EBDD');
    expect(homepage).toContain('background: #E9F0E4');
    expect(homepage).toContain('min-height: 44px');
    expect(homepage).toContain('focus-visible');
  });

  it('respects reduced-motion preferences and does not add animation dependencies', () => {
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
    expect(homepage).not.toContain('requestAnimationFrame');
    expect(homepage).not.toContain('onmousemove');
    expect(homepage).not.toContain('three');
  });
});
