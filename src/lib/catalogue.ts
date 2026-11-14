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

export function filterResources(resources: Resource[], query: string, filters: ResourceFilters = {}, creators: Creator[] = []): Resource[] {
  const normalized = query.trim().toLocaleLowerCase('en-IN');
  const creatorNames = new Map(creators.map((creator) => [creator.id, creator.name.toLocaleLowerCase('en-IN')]));
  const scored = resources.flatMap((resource) => {
    if (filters.subjectId && resource.subjectId !== filters.subjectId) return [];
    if (filters.chapterId && resource.chapterId !== filters.chapterId) return [];
    if (filters.creatorId && resource.creatorId !== filters.creatorId) return [];
    if (filters.resourceType && resource.resourceType !== filters.resourceType) return [];
    if (!normalized) return [{ resource, score: 0 }];
    const fields = [resource.title, resource.description, resource.subjectId ?? '', resource.chapterId ?? '', resource.resourceType, creatorNames.get(resource.creatorId ?? '') ?? '', ...resource.keywords].map((value) => value.toLocaleLowerCase('en-IN'));
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
