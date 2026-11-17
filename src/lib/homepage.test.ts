import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homepage = readFileSync(new URL('../routes/+page.svelte', import.meta.url), 'utf8');
const materials = readFileSync(new URL('../routes/materials/+page.svelte', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const subjects = JSON.parse(readFileSync(new URL('../../static/data/subjects.json', import.meta.url), 'utf8')) as Array<{ id: string; name: string; status: string }>;

describe('ICSE Compass visual resource-library homepage', () => {
  it('positions Compass as a searchable ICSE study library', () => {
    expect(homepage).toContain('Your independent ICSE study library');
    expect(homepage).toContain('Everything you need to study.');
    expect(homepage).toContain('One shelf at a time.');
    expect(homepage).toContain('What are you studying today?');
    expect(homepage).toContain('Browse the shelves.');
  });

  it('loads published resources and subjects instead of hard-coding catalogue statistics', () => {
    expect(homepage).toContain("fetch(siteBase + '/data/resources.json')");
    expect(homepage).toContain("fetch(siteBase + '/data/subjects.json')");
    expect(homepage).toContain("item.status === 'published'");
    expect(homepage).toContain('resources.length.toLocaleString');
    expect(homepage).toContain('subjects.length');
    expect(homepage).toContain('subjectCards');
    expect(homepage).toContain('subject.count');
    expect(subjects.filter((subject) => subject.status === 'published').length).toBeGreaterThan(0);
  });

  it('keeps search functional and sends the entered query to Materials Library', () => {
    expect(homepage).toContain('onsubmit={handleSearch}');
    expect(homepage).toContain('bind:value={searchQuery}');
    expect(homepage).toContain('event.preventDefault()');
    expect(homepage).toContain('void goto(query ?');
    expect(homepage).toContain('encodeURIComponent(query)');
    expect(materials).toContain("new URLSearchParams(window.location.search)");
    expect(materials).toContain("query = params.get('q') ?? ''");
  });

  it('provides direct routes to materials, school papers and syllabus planning', () => {
    expect(homepage).toContain("siteBase + '/materials/'");
    expect(homepage).toContain("siteBase + '/school-papers/'");
    expect(homepage).toContain("siteBase + '/syllabus/'");
    expect(homepage).toContain('Board papers &amp; specimen sets');
    expect(homepage).toContain('Notes &amp; chapter resources');
    expect(homepage).toContain('Video lessons &amp; educators');
  });

  it('uses the published subject catalogue to build subject shelves', () => {
    expect(homepage).toContain('subjectCards as subject');
    expect(homepage).toContain('subject.name');
    expect(homepage).toContain("'/materials/?q=' + encodeURIComponent(subject.name)");
    expect(homepage).not.toContain('★★★★★');
    expect(homepage).not.toMatch(/student testimonial|verified review/i);
  });

  it('keeps library preview counts data-backed and explains source attribution', () => {
    expect(homepage).toContain('sampleResources');
    expect(homepage).toContain('original source');
    expect(homepage).toContain('Where a source provides a preview image');
    expect(homepage).not.toMatch(/\b\d{2,}[+]?\s+(resources|downloads|students|educators)\b/i);
  });

  it('uses document thumbnails when available and an honest fallback otherwise', () => {
    expect(materials).toContain('getResourcePreviewUrl(resource)');
    expect(materials).toContain('resource-cover-image');
    expect(materials).toContain('COVER-STYLE FALLBACK');
    expect(materials).toContain('SOURCE PREVIEW UNAVAILABLE');
    expect(materials).toContain('resource-preview-dialog');
    expect(materials).toContain('previewDialog.showModal()');
    expect(materials).toContain('Preview image supplied by the original source');
    expect(materials).toContain('Full documents remain with their original publishers');
  });

  it('preserves original-source links and permission-aware access information', () => {
    expect(materials).toContain('href={resource.sourceUrl}');
    expect(materials).toContain('target="_blank"');
    expect(materials).toContain('Hosted with permission');
    expect(materials).toContain('Permitted external embed');
    expect(materials).toContain('Opens at the original source');
  });

  it('uses the richer paper, ink, forest and subject colour system', () => {
    expect(styles).toContain('--paper: #f4efe5');
    expect(styles).toContain('--ink: #202a25');
    expect(styles).toContain('--green: #2e624a');
    expect(styles).toContain('--terracotta: #b75c3e');
    expect(styles).toContain('.subject-chemistry .resource-cover-art');
    expect(styles).toContain('.subject-biology .resource-cover-art');
  });

  it('supports responsive layouts and reduced-motion preferences', () => {
    expect(styles).toContain('@media (max-width: 600px)');
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
    expect(styles).toContain('.resource-grid.list-view');
    expect(styles).toContain('.resource-preview-dialog::backdrop');
  });
});