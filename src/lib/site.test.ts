import { describe, expect, it } from 'vitest';
import { independenceNotice, publicRoutes, siteBase, siteOrigin } from './site';
describe('ICSE Compass public foundation', () => {
  it('preserves the full CISCE independence notice', () => expect(independenceNotice).toBe('ICSE Compass is not affiliated with, endorsed by, or an official product of CISCE.'));
  it('defines exactly four public foundation routes', () => expect(publicRoutes.map((route) => route.path)).toEqual(['/', '/materials/', '/creators/', '/school-papers/']));
  it('uses the GitHub Pages project base', () => expect(siteOrigin + siteBase).toBe('https://icse-cbse-10-12.github.io/icse-compass'));
});
