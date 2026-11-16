import { describe, expect, it } from 'vitest';
import { filterResources, formatResourceTitle, formatResourceType, getResourcePreviewUrl, getResourceActionLabel } from './catalogue';
import { validateCatalogue } from '../../scripts/catalogue-validation.mjs';
import type { CatalogueData, Resource } from './catalogue';
const creator = { id: 'c1', name: 'Verified Educator', description: '', platform: 'YouTube', profileUrl: 'https://example.com/channel', status: 'published' as const };
const subject = { id: 'math', name: 'Mathematics', sortOrder: 1, status: 'published' as const };
const chapter = { id: 'algebra', subjectId: 'math', name: 'Algebra', sortOrder: 1, status: 'published' as const };
const resource: Resource = { id: 'r1', title: 'Algebra notes', description: 'Revision notes', subjectId: 'math', chapterId: 'algebra', creatorId: 'c1', resourceType: 'notes', sourceUrl: 'https://example.com/notes', accessMethod: 'external', hostingPermission: 'not-applicable', embedAllowed: false, keywords: ['equations'], status: 'published', updatedAt: '2026-11-01' };
const catalogue: CatalogueData = { resources: [resource], creators: [creator], subjects: [subject], chapters: [chapter] };
describe('catalogue filtering', () => {
  it('searches titles, keywords and resolved subject/chapter/creator names', () => { expect(filterResources([resource], 'equations', {}, [creator])).toHaveLength(1); expect(filterResources([resource], 'mathematics', {}, [creator], [subject], [chapter])).toHaveLength(1); expect(filterResources([resource], 'algebra', {}, [creator], [subject], [chapter])).toHaveLength(1); expect(filterResources([resource], 'verified educator', {}, [creator])).toHaveLength(1); });
  it('combines subject, chapter, creator and type filters', () => { expect(filterResources([resource], '', { subjectId: 'math', chapterId: 'algebra', creatorId: 'c1', resourceType: 'notes' }, [creator])).toHaveLength(1); });
  it('excludes non-matching results', () => { expect(filterResources([resource], 'biology')).toHaveLength(0); });
  it('sorts alphabetically and recent-first', () => { const second = { ...resource, id: 'r2', title: 'Biology', updatedAt: '2026-11-10' }; expect(filterResources([resource, second], '', { sort: 'alphabetical' })[0].title).toBe('Algebra notes'); expect(filterResources([resource, second], '', { sort: 'recent' })[0].id).toBe('r2'); });
});
describe('public catalogue validation', () => {
  it('accepts a valid published catalogue', () => expect(validateCatalogue(catalogue)).toEqual([]));
  it('rejects duplicate IDs and missing references', () => { const errors = validateCatalogue({ ...catalogue, resources: [resource, resource], chapters: [{ ...chapter, subjectId: 'missing' }] }); expect(errors.some((error) => error.includes('Duplicate resource id'))).toBe(true); expect(errors.some((error) => error.includes('missing subject'))).toBe(true); });
  it('blocks unauthorised hosting and non-HTTPS links', () => { const bad = { ...resource, sourceUrl: 'http://example.com/file', accessMethod: 'hosted' as const, hostingPermission: 'not-authorized' as const }; const errors = validateCatalogue({ ...catalogue, resources: [bad] }); expect(errors.some((error) => error.includes('HTTPS'))).toBe(true); expect(errors.some((error) => error.includes('permission'))).toBe(true); });
  it('requires explicit permission for embeds', () => { const bad = { ...resource, accessMethod: 'embed' as const, embedAllowed: false }; expect(validateCatalogue({ ...catalogue, resources: [bad] }).some((error) => error.includes('embed permission'))).toBe(true); });
});


describe('resource card title formatting', () => {
  it('cleans filename prefixes, underscores and PDF extensions', () => {
    expect(formatResourceTitle('##_High_Priority_Topics.pdf')).toEqual({ title: 'High Priority Topics', extension: 'PDF' });
  });
  it('moves PNG extensions into a badge and preserves ordinary titles', () => {
    expect(formatResourceTitle('##_Cell_Diagram.PNG')).toEqual({ title: 'Cell Diagram', extension: 'PNG' });
    expect(formatResourceTitle('Algebra notes')).toEqual({ title: 'Algebra notes', extension: null });
  });
  it('uses a readable badge when no filename extension exists', () => {
    expect(formatResourceType('notes')).toBe('NOTES');
  });
});


describe('resource preview and action helpers', () => {
  it('builds a thumbnail URL only for valid HTTPS Google Drive file links', () => {
    expect(getResourcePreviewUrl({ sourceUrl: 'https://drive.google.com/file/d/1AbcdefghijkLMN_12345/view?usp=sharing' }))
      .toBe('https://drive.google.com/thumbnail?id=1AbcdefghijkLMN_12345&sz=w640');
    expect(getResourcePreviewUrl({ sourceUrl: 'https://example.com/resource.pdf' })).toBeNull();
    expect(getResourcePreviewUrl({ sourceUrl: 'http://drive.google.com/file/d/1AbcdefghijkLMN_12345/view' })).toBeNull();
  });

  it('prefers a valid HTTPS thumbnail supplied in catalogue metadata', () => {
    expect(getResourcePreviewUrl({ sourceUrl: 'https://example.com/file', thumbnailUrl: 'https://cdn.example.com/thumb.webp' }))
      .toBe('https://cdn.example.com/thumb.webp');
    expect(getResourcePreviewUrl({ sourceUrl: 'https://example.com/file', thumbnailUrl: 'http://cdn.example.com/thumb.webp' })).toBeNull();
  });

  it('cleans and labels common document, image, audio and video extensions', () => {
    expect(formatResourceTitle('##_Chapter_Notes.docx')).toEqual({ title: 'Chapter Notes', extension: 'DOCX' });
    expect(formatResourceTitle('Revision_Audio.mp3')).toEqual({ title: 'Revision Audio', extension: 'MP3' });
    expect(getResourceActionLabel(resource, 'PDF')).toBe('Open PDF');
    expect(getResourceActionLabel(resource, 'MP4')).toBe('Watch video');
    expect(getResourceActionLabel(resource, null)).toBe('Open resource');
  });
});
