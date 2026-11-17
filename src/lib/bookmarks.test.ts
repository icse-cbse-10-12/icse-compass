import { describe, expect, it } from 'vitest';
import {
  BOOKMARK_STORAGE_KEY, LEGACY_PAPER_STORAGE_KEY, createPaperSavedItem, createResourceSavedItem,
  migrateLegacyPaperBookmarks, readSavedItems, toggleSavedItem, writeSavedItems, type BookmarkStorage
} from './bookmarks';

class MemoryStorage implements BookmarkStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const resource = { id: 'r1', title: 'Algebra notes', sourceUrl: 'https://example.com/notes', description: 'Revision', resourceType: 'notes', creatorId: 'c1' };
const paper = { id: 'p1', title: 'Maths prelim', sourceUrl: 'https://example.com/paper', subject: 'Mathematics', school: 'School A', year: '2026' };

describe('unified bookmarks', () => {
  it('stores resources with category tags for type and educator', () => {
    const item = createResourceSavedItem(resource, '/materials/?q=Algebra');
    expect(item.id).toBe('resource:r1');
    expect(item.categories).toEqual(['notes', 'educators']);
    expect(item.pageUrl).toBe('/materials/?q=Algebra');
  });

  it('adds, removes and deduplicates by canonical item ID', () => {
    const storage = new MemoryStorage();
    const item = createPaperSavedItem(paper, '/school-papers/');
    const added = toggleSavedItem(item, [], storage);
    expect(added.saved).toBe(true);
    expect(readSavedItems(storage).items).toHaveLength(1);
    const removed = toggleSavedItem(item, added.items, storage);
    expect(removed.saved).toBe(false);
    expect(removed.items).toHaveLength(0);
  });

  it('rejects malformed versions and unsafe source URLs', () => {
    const storage = new MemoryStorage();
    storage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify({ version: 1, items: [] }));
    expect(readSavedItems(storage).error).toBe(true);
    const unsafe = { ...createPaperSavedItem(paper, '/school-papers/'), sourceUrl: 'javascript:alert(1)' };
    expect(writeSavedItems([unsafe], storage)).toBe(false);
  });

  it('migrates existing paper IDs into the shared collection without duplicates', () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_PAPER_STORAGE_KEY, JSON.stringify(['p1', 'missing', 'p1']));
    const migrated = migrateLegacyPaperBookmarks([paper], storage);
    expect(migrated.items.map((item) => item.id)).toEqual(['paper:p1']);
    expect(storage.getItem(LEGACY_PAPER_STORAGE_KEY)).toBeNull();
    expect(readSavedItems(storage).items).toHaveLength(1);
  });

  it('deduplicates duplicate records and reports unavailable storage', () => {
    const storage = new MemoryStorage();
    const item = createPaperSavedItem(paper, '/school-papers/');
    storage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify({ version: 2, items: [item, item] }));
    expect(readSavedItems(storage).items).toHaveLength(1);
    const unavailable: BookmarkStorage = { getItem: () => null, setItem: () => { throw new Error('blocked'); }, removeItem: () => {} };
    expect(toggleSavedItem(item, [], unavailable).error).toBe(true);
  });

  it('preserves saved snapshots when a catalogue item disappears', () => {
    const storage = new MemoryStorage();
    const item = createResourceSavedItem(resource, '/materials/');
    writeSavedItems([item], storage);
    expect(readSavedItems(storage).items[0].title).toBe('Algebra notes');
  });
});
