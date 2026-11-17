export type SavedCategory = 'papers' | 'notes' | 'videos' | 'educators' | 'other';
export type SavedKind = 'paper' | 'resource';

export interface SavedItem {
  id: string;
  kind: SavedKind;
  title: string;
  sourceUrl: string;
  pageUrl: string;
  description: string;
  categories: SavedCategory[];
  sourceLabel: string;
  savedAt: string;
}

export interface BookmarkStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const BOOKMARK_STORAGE_KEY = 'icse-compass:saved-items:v2';
export const LEGACY_PAPER_STORAGE_KEY = 'icse-compass:saved-school-papers:v1';
const STORAGE_VERSION = 2;

function isSafeHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

function isSavedItem(value: unknown): value is SavedItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SavedItem>;
  return typeof item.id === 'string' && (item.kind === 'paper' || item.kind === 'resource') &&
    typeof item.title === 'string' && isSafeHttpsUrl(item.sourceUrl) &&
    typeof item.pageUrl === 'string' && item.pageUrl.startsWith('/') &&
    typeof item.description === 'string' && Array.isArray(item.categories) &&
    item.categories.every((category) => ['papers', 'notes', 'videos', 'educators', 'other'].includes(category)) &&
    typeof item.sourceLabel === 'string' && typeof item.savedAt === 'string';
}

export function readSavedItems(storage?: BookmarkStorage): { items: SavedItem[]; error: boolean } {
  try {
    const raw = (storage ?? localStorage).getItem(BOOKMARK_STORAGE_KEY);
    if (!raw) return { items: [], error: false };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || (parsed as { version?: unknown }).version !== STORAGE_VERSION || !Array.isArray((parsed as { items?: unknown }).items)) {
      return { items: [], error: true };
    }
    const items = (parsed as { items: unknown[] }).items.filter(isSavedItem);
    return { items: [...new Map(items.map((item) => [item.id, item])).values()], error: items.length !== (parsed as { items: unknown[] }).items.length };
  } catch { return { items: [], error: true }; }
}

export function writeSavedItems(items: SavedItem[], storage?: BookmarkStorage): boolean {
  if (!items.every(isSavedItem)) return false;
  try {
    (storage ?? localStorage).setItem(BOOKMARK_STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, items }));
    return true;
  } catch { return false; }
}

export function toggleSavedItem(item: SavedItem, current: SavedItem[], storage?: BookmarkStorage): { items: SavedItem[]; saved: boolean; error: boolean } {
  const exists = current.some((saved) => saved.id === item.id);
  const items = exists ? current.filter((saved) => saved.id !== item.id) : [...current, item];
  return { items, saved: !exists, error: !writeSavedItems(items, storage) };
}

export function createResourceSavedItem(resource: {
  id: string; title: string; sourceUrl: string; description?: string; resourceType: string; creatorId?: string | null;
}, pageUrl: string): SavedItem {
  const categories: SavedCategory[] = [];
  if (resource.resourceType === 'video') categories.push('videos');
  else if (resource.resourceType === 'pdf' || resource.resourceType === 'notes') categories.push('notes');
  else categories.push('other');
  if (resource.creatorId) categories.push('educators');
  return { id: 'resource:' + resource.id, kind: 'resource', title: resource.title, sourceUrl: resource.sourceUrl, pageUrl,
    description: resource.description ?? '', categories, sourceLabel: resource.creatorId ? 'Educator resource' : 'Materials Library', savedAt: new Date().toISOString() };
}

export function createPaperSavedItem(paper: {
  id: string; title: string; sourceUrl: string; subject?: string; school?: string; year?: string;
}, pageUrl: string): SavedItem {
  return { id: 'paper:' + paper.id, kind: 'paper', title: paper.title, sourceUrl: paper.sourceUrl, pageUrl,
    description: [paper.subject, paper.school, paper.year].filter(Boolean).join(' · '), categories: ['papers'],
    sourceLabel: 'School & Practice Papers', savedAt: new Date().toISOString() };
}

export function migrateLegacyPaperBookmarks<T extends { id: string; title: string; sourceUrl: string; subject?: string; school?: string; year?: string }>(papers: T[], storage?: BookmarkStorage): { items: SavedItem[]; error: boolean } {
  const current = readSavedItems(storage);
  try {
    const target = storage ?? localStorage;
    const legacyRaw = target.getItem(LEGACY_PAPER_STORAGE_KEY);
    if (!legacyRaw) return current;
    const legacyIds: unknown = JSON.parse(legacyRaw);
    if (!Array.isArray(legacyIds) || !legacyIds.every((id) => typeof id === 'string')) return { items: current.items, error: true };
    const byId = new Map(papers.map((paper) => [paper.id, paper]));
    const migrated = legacyIds.flatMap((id) => {
      const paper = byId.get(id);
      return paper ? [createPaperSavedItem(paper, '/school-papers/')] : [];
    });
    const merged = [...current.items.filter((item) => item.kind !== 'paper'), ...current.items.filter((item) => item.kind === 'paper')];
    for (const item of migrated) if (!merged.some((saved) => saved.id === item.id)) merged.push(item);
    if (!writeSavedItems(merged, storage)) return { items: current.items, error: true };
    target.removeItem(LEGACY_PAPER_STORAGE_KEY);
    return { items: merged, error: current.error };
  } catch { return { items: current.items, error: true }; }
}

export async function shareLink(title: string, text: string, url: string): Promise<string> {
  if (!isSafeHttpsUrl(url)) return 'This link is not available to share.';
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ title, text, url });
      return 'Share sheet opened for ' + title + '.';
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return 'Link copied for ' + title + '.';
    }
    return 'Sharing is unavailable in this browser. Open the source link to share it manually.';
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return '';
    return 'Could not share this link. Open the source and share it manually.';
  }
}
