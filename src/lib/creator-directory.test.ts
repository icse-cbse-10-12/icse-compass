import { describe, expect, it } from 'vitest';
import { filterCreatorResources, filterCreatorsBySubject } from './creator-directory';

describe('creator directory subject filters', () => {
  const creators = [{ id: 'english-educator' }, { id: 'science-educator' }, { id: 'no-subjects' }];
  const resources = [
    { creatorId: 'english-educator', subjectId: 'english-paper-1' },
    { creatorId: 'english-educator', subjectId: 'english-paper-2' },
    { creatorId: 'science-educator', subjectId: 'physics' },
    { creatorId: 'science-educator', subjectId: 'chemistry' },
    { creatorId: 'no-subjects', subjectId: null }
  ];

  it('shows every published profile in the All Educators view', () => {
    expect(filterCreatorsBySubject(creators, resources, 'All Educators')).toEqual(creators);
  });

  it('groups both English papers under the English filter', () => {
    expect(filterCreatorsBySubject(creators, resources, 'English')).toEqual([creators[0]]);
    expect(filterCreatorResources(resources, 'english-educator', 'English')).toHaveLength(2);
  });

  it('does not invent matches for resources without a subject', () => {
    expect(filterCreatorsBySubject(creators, resources, 'Biology')).toEqual([]);
    expect(filterCreatorResources(resources, 'no-subjects', 'Biology')).toEqual([]);
  });
});
