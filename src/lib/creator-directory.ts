import type { Creator, Resource } from '#lib/catalogue.ts';

export const creatorSubjectFilters = [
  'All Educators',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Applications',
  'English',
  'History & Civics'
] as const;

export type CreatorSubjectFilter = (typeof creatorSubjectFilters)[number];
type CreatorRef = Pick<Creator, 'id'>;
type ResourceRef = Pick<Resource, 'creatorId' | 'subjectId'>;

const subjectIds: Partial<Record<CreatorSubjectFilter, readonly string[]>> = {
  Mathematics: ['mathematics'],
  Physics: ['physics'],
  Chemistry: ['chemistry'],
  Biology: ['biology'],
  'Computer Applications': ['computer-applications'],
  English: ['english-paper-1', 'english-paper-2'],
  'History & Civics': ['history-civics']
};

function matchesSubject(resource: ResourceRef, subject: CreatorSubjectFilter): boolean {
  if (subject === 'All Educators') return true;
  return resource.subjectId !== null && (subjectIds[subject] ?? []).includes(resource.subjectId);
}

export function filterCreatorsBySubject<T extends CreatorRef>(
  creators: readonly T[],
  resources: readonly ResourceRef[],
  subject: CreatorSubjectFilter
): T[] {
  if (subject === 'All Educators') return [...creators];
  return creators.filter((creator) => resources.some((resource) => resource.creatorId === creator.id && matchesSubject(resource, subject)));
}

export function filterCreatorResources<T extends ResourceRef>(
  resources: readonly T[],
  creatorId: string,
  subject: CreatorSubjectFilter
): T[] {
  return resources.filter((resource) => resource.creatorId === creatorId && matchesSubject(resource, subject));
}
