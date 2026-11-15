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

  it('uses a high-contrast index card and legible micro-labels', () => {
    expect(homepage).toContain('background: #ffffff');
    expect(homepage).toContain('border: 1px solid #e2dfd7');
    expect(homepage).toContain('box-shadow: 4px 4px 0 #16263e14');
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
  it('adds a restrained CSS-only 3D hover treatment to the homepage index card', () => {
    expect(homepage).toContain('transform: perspective(1000px) rotateX(1.2deg) rotateY(-1.2deg)');
    expect(homepage).toContain('@media (hover: hover) and (pointer: fine)');
    expect(homepage).toContain('will-change: transform');
  });

  it('stagger-animates index rows using only opacity and transform', () => {
    expect(homepage).toContain('@keyframes deckCardEnter');
    expect(homepage).toContain('animation-delay: 60ms');
    expect(homepage).toContain('animation-delay: 120ms');
    expect(homepage).toContain('animation-delay: 180ms');
  });

  it('moves directional arrows with transform rather than layout properties', () => {
    expect(homepage).toContain('.hero-deck-card:hover, .hero-deck-card:focus-visible');
    expect(homepage).toContain('transform: translateY(-4px)');
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
    expect(homepage).toContain('href={`${siteBase}/school-papers/`}');
    expect(homepage).not.toMatch(/CISCE Official Specimen Paper|Mole Concept Notes|Chapter Formula Sheet/);
  });

  it('uses the geometric sans stack for interface controls while retaining serif display typography', () => {
    expect(styles).toContain('--sans: "Manrope", Inter');
    expect(homepage).toContain('font-family: var(--sans)');
  });

  it('keeps high-contrast anchors and card offsets within the restrained paper aesthetic', () => {
    expect(homepage).toContain('box-shadow: 4px 4px 0 #16263e14');
    expect(homepage).toContain('background: #ffffff');
    expect(homepage).toContain('border: 1px solid #e2dfd7');
  });

  it('preserves reduced-motion support for the redesigned card deck', () => {
    expect(homepage).toContain('.hero-card-deck, .hero-deck-card');
    expect(homepage).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
