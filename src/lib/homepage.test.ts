import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homepage = readFileSync(new URL('../routes/+page.svelte', import.meta.url), 'utf8');
const materials = readFileSync(new URL('../routes/materials/+page.svelte', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('ICSE Compass homepage product-led hero', () => {
  it('uses a labelled product index panel instead of the decorative compass illustration', () => {
    expect(homepage).toContain('class="hero-product-panel"');
    expect(homepage).toContain('aria-labelledby="hero-index-title"');
    expect(homepage).not.toContain('class="hero-art"');
  });

  it('offers direct, truthful paths into the existing public destinations', () => {
    expect(homepage).toContain('href={`${siteBase}/materials/`}');
    expect(homepage).toContain('href={`${siteBase}/creators/`}');
    expect(homepage).toContain('href: `${siteBase}/school-papers/`');
    expect(homepage).toContain('Search by subject, chapter or source');
  });

  it('offers working subject shortcuts through the Materials Library search query', () => {
    for (const subject of ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'History &amp; Civics', 'Computer']) {
      expect(homepage).toContain(subject);
    }
    expect(homepage).toContain('?q=');
    expect(materials).toContain("new URLSearchParams(window.location.search)");
    expect(materials).toContain("query = params.get('q') ?? ''");
  });

  it('uses a deep-navy command panel with readable light-on-dark content', () => {
    expect(homepage).toContain('background: var(--navy)');
    expect(homepage).toContain('border: 1px solid rgba(255, 255, 255, .15)');
    expect(homepage).toContain('box-shadow: 0 18px 42px rgba(22, 38, 62, .18)');
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


describe('lightweight paper-and-ink motion', () => {
  it('adds a restrained CSS-only lift treatment to the homepage index card', () => {
    expect(homepage).toContain('transform: translateY(-2px)');
    expect(homepage).toContain('@media (hover: hover) and (pointer: fine)');
    expect(homepage).toContain('will-change: transform');
  });

  it('stagger-animates index rows using only opacity and transform', () => {
    expect(homepage).toContain('@keyframes deckCardEnter');
    expect(homepage).toContain('animation-delay: 50ms');
    expect(homepage).toContain('animation-delay: 100ms');
    expect(homepage).toContain('animation-delay: 150ms');
  });

  it('moves directional arrows with transform rather than layout properties', () => {
    expect(homepage).toContain('.hero-deck-card:hover, .hero-deck-card:focus-visible');
    expect(homepage).toContain('transform: translateY(-2px)');
  });

  it('keeps the motion disabled for reduced-motion preferences', () => {
    expect(homepage).toContain('@media (prefers-reduced-motion: reduce)');
    expect(homepage).toContain('.hero-product-panel, .hero-card-deck, .hero-deck-card');
    expect(homepage).toContain('animation: none !important');
  });

  it('does not add a JavaScript animation dependency or a premature flashcard feature', () => {
    expect(homepage).not.toContain('onmousemove');
    expect(homepage).not.toContain('requestAnimationFrame');
    expect(homepage).not.toContain('three');
  });
});


describe('high-contrast Student OS homepage direction', () => {
  it('uses the navy, terracotta, warm-stone and white design tokens', () => {
    expect(styles).toContain('--navy: #16263e');
    expect(styles).toContain('--terracotta: #c84b31');
    expect(styles).toContain('--paper: #f6f5f0');
    expect(styles).toContain('--white: #ffffff');
  });

  it('adds a lightweight dot-grid texture behind the hero', () => {
    expect(homepage).toContain('radial-gradient(circle');
    expect(homepage).toContain('background-size: 18px 18px');
  });

  it('color-codes all six subject shortcuts with named accessible classes', () => {
    for (const subjectClass of ['subject-physics', 'subject-chemistry', 'subject-mathematics', 'subject-biology', 'subject-history', 'subject-computer']) {
      expect(homepage).toContain(subjectClass);
    }
    expect(homepage).toContain('aria-label="Quick subject searches"');
  });

  it('uses a stacked set of real destination cards, not invented catalogue entries', () => {
    expect(homepage).toContain('class="hero-card-deck"');
    expect(homepage).toContain('href={`${siteBase}/materials/`}');
    expect(homepage).toContain('href={`${siteBase}/creators/`}');
    expect(homepage).toContain('href: `${siteBase}/school-papers/`');
    expect(homepage).not.toMatch(/CISCE Official Specimen Paper|Mole Concept Notes|Chapter Formula Sheet/);
  });

  it('uses the geometric sans stack for interface controls while retaining serif display typography', () => {
    expect(styles).toContain('--sans: "Manrope", Inter');
    expect(homepage).toContain('font: 750 8px/1.3 var(--sans)');
  });

  it('keeps the dark command panel and its inner cards visually distinct', () => {
    expect(homepage).toContain('box-shadow: 0 18px 42px rgba(22, 38, 62, .18)');
    expect(homepage).toContain('background: var(--navy)');
    expect(homepage).toContain('border: 1px solid rgba(255, 255, 255, .15)');
  });

  it('preserves reduced-motion support for the redesigned card deck', () => {
    expect(homepage).toContain('.hero-card-deck, .hero-deck-card');
    expect(homepage).toContain('@media (prefers-reduced-motion: reduce)');
  });
});


describe('navy command card and homepage search', () => {
  it('creates a high-contrast navy panel with rounded destination cards', () => {
    expect(homepage).toContain('background: var(--navy)');
    expect(homepage).toContain('background: #1e314e');
    expect(homepage).toContain('border-radius: 24px');
    expect(homepage).toContain('border-radius: 16px');
    expect(homepage).toContain('color: #ffffff');
  });

  it('makes the main action terracotta and keeps the search form functional', () => {
    expect(homepage).toContain('background: var(--terracotta)');
    expect(homepage).toContain('onsubmit={handleSearch}');
    expect(homepage).toContain('bind:value={searchQuery}');
    expect(homepage).toContain('event.preventDefault()');
    expect(homepage).toContain('void goto(query ?');
    expect(homepage).toContain('encodeURIComponent(query)');
  });

  it('uses explicit Svelte route expressions instead of quoted interpolation strings', () => {
    expect(homepage).toContain('href={`${siteBase}/materials/`}');
    expect(homepage).toContain('href={`${siteBase}/creators/`}');
    expect(homepage).toContain('href: `${siteBase}/school-papers/`');
    expect(homepage).not.toContain('href="{siteBase}/');
  });
});
