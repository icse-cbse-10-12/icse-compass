export type ResourceType = 'pdf' | 'video' | 'website' | 'notes' | 'practice-paper' | 'other';
export type AccessMethod = 'hosted' | 'external' | 'embed';
export type PublicationStatus = 'published' | 'draft' | 'withdrawn';
export interface Creator { id: string; name: string; description: string; platform: string; profileUrl: string; status: PublicationStatus }
export interface Subject { id: string; name: string; sortOrder: number; status: PublicationStatus }
export interface Chapter { id: string; subjectId: string; name: string; sortOrder: number; status: PublicationStatus }
export interface Resource {
  id: string; title: string; description: string; subjectId: string | null; chapterId: string | null;
  creatorId: string | null; resourceType: ResourceType; sourceUrl: string; accessMethod: AccessMethod;
  hostingPermission: 'owned' | 'authorized' | 'not-applicable' | 'not-authorized';
  embedAllowed: boolean; fileSizeBytes?: number; pageCount?: number; thumbnailUrl?: string;
  keywords: string[]; status: PublicationStatus; updatedAt?: string;
}
export interface CatalogueData { resources: Resource[]; creators: Creator[]; subjects: Subject[]; chapters: Chapter[] }
export interface ResourceFilters { subjectId?: string; chapterId?: string; creatorId?: string; resourceType?: string; sort?: 'relevance' | 'alphabetical' | 'recent' }

export function filterResources(resources: Resource[], query: string, filters: ResourceFilters = {}, creators: Creator[] = [], subjects: Subject[] = [], chapters: Chapter[] = []): Resource[] {
  const normalized = query.trim().toLocaleLowerCase('en-IN');
  const creatorNames = new Map(creators.map((creator) => [creator.id, creator.name.toLocaleLowerCase('en-IN')]));
  const subjectNames = new Map(subjects.map((subject) => [subject.id, subject.name.toLocaleLowerCase('en-IN')]));
  const chapterNames = new Map(chapters.map((chapter) => [chapter.id, chapter.name.toLocaleLowerCase('en-IN')]));
  const scored = resources.flatMap((resource) => {
    if (filters.subjectId && resource.subjectId !== filters.subjectId) return [];
    if (filters.chapterId && resource.chapterId !== filters.chapterId) return [];
    if (filters.creatorId && resource.creatorId !== filters.creatorId) return [];
    if (filters.resourceType && resource.resourceType !== filters.resourceType) return [];
    if (!normalized) return [{ resource, score: 0 }];
    const fields = [resource.title, resource.description, subjectNames.get(resource.subjectId ?? '') ?? '', chapterNames.get(resource.chapterId ?? '') ?? '', resource.resourceType, creatorNames.get(resource.creatorId ?? '') ?? '', ...resource.keywords].map((value) => value.toLocaleLowerCase('en-IN'));
    const title = resource.title.toLocaleLowerCase('en-IN');
    const score = (title === normalized ? 100 : title.startsWith(normalized) ? 50 : title.includes(normalized) ? 25 : 0) + fields.filter((field) => field.includes(normalized)).length;
    return score > 0 ? [{ resource, score }] : [];
  });
  const sort = filters.sort ?? 'relevance';
  scored.sort((a, b) => {
    if (sort === 'alphabetical') return a.resource.title.localeCompare(b.resource.title, 'en-IN');
    if (sort === 'recent') return (b.resource.updatedAt ?? '').localeCompare(a.resource.updatedAt ?? '');
    return b.score - a.score || a.resource.title.localeCompare(b.resource.title, 'en-IN');
  });
  return scored.map(({ resource }) => resource);
}


export interface FormattedResourceTitle { title: string; extension: string | null }

/** Cleans common filenames while keeping a readable, separate format badge. */
export function formatResourceTitle(rawTitle: string): FormattedResourceTitle {
  const cleaned = rawTitle.trim().replace(/^#+_+/, '').replace(/^[\\W_]+/, '');
  const extensionMatch = cleaned.match(/\\.([a-z0-9]{2,5})$/i);
  const knownExtensions = new Set(['pdf', 'png', 'jpg', 'jpeg', 'webp', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'mp3', 'm4a', 'mp4']);
  const extension = extensionMatch && knownExtensions.has(extensionMatch[1].toLowerCase())
    ? extensionMatch[1].toUpperCase()
    : null;
  const title = (extension ? cleaned.replace(/\\.[a-z0-9]{2,5}$/i, '') : cleaned)
    .replace(/_+/g, ' ')
    .replace(/\\s+/g, ' ')
    .trim();
  return { title: title || rawTitle.trim(), extension };
}

export function formatResourceType(resourceType: ResourceType): string {
  const labels: Record<ResourceType, string> = {
    pdf: 'PDF',
    video: 'VIDEO',
    website: 'WEB',
    notes: 'NOTES',
    'practice-paper': 'PAPER',
    other: 'RESOURCE'
  };
  return labels[resourceType];
}

/** Returns an HTTPS thumbnail URL only when an admin supplied one or the source is Google Drive. */
export function getResourcePreviewUrl(resource: Pick<Resource, 'thumbnailUrl' | 'sourceUrl'>): string | null {
  if (resource.thumbnailUrl) {
    try {
      const thumbnail = new URL(resource.thumbnailUrl);
      if (thumbnail.protocol === 'https:') return thumbnail.toString();
    } catch {
      // Ignore malformed or insecure thumbnail URLs.
    }
  }

  try {
    const source = new URL(resource.sourceUrl);
    if (source.protocol !== 'https:' || source.hostname !== 'drive.google.com') return null;
    const fileId = source.pathname.match(/^\\/file\\/d\\/([^/]+)/)?.[1] ?? source.searchParams.get('id');
    if (!fileId || !/^[A-Za-z0-9_-]{10,}$/.test(fileId)) return null;
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w640`;
  } catch {
    return null;
  }
}

/** Uses plain-language actions that tell students what opens. */
export function getResourceActionLabel(resource: Pick<Resource, 'resourceType'>, extension: string | null): string {
  if (extension === 'PDF') return 'Open PDF';
  if (['PNG', 'JPG', 'JPEG', 'WEBP'].includes(extension ?? '')) return 'View image';
  if (extension === 'MP4' || resource.resourceType === 'video') return 'Watch video';
  if (['MP3', 'M4A'].includes(extension ?? '')) return 'Play audio';
  if (resource.resourceType === 'website') return 'Visit website';
  return 'Open resource';
}
