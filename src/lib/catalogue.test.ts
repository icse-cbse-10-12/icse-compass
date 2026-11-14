import { describe, expect, it } from 'vitest';
import { filterResources } from './catalogue';
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
