const httpsUrl = (value) => typeof value === 'string' && /^https:\/\//i.test(value);
const uniqueIds = (items, label, errors) => {
  const seen = new Set();
  for (const item of items) {
    if (!item || typeof item.id !== 'string' || !item.id.trim()) errors.push(label + ' record has a missing id');
    else if (seen.has(item.id)) errors.push('Duplicate ' + label + ' id: ' + item.id);
    else seen.add(item.id);
  }
  return seen;
};
export function validateCatalogue(data) {
  const errors = [];
  const resources = Array.isArray(data.resources) ? data.resources : [];
  const creators = Array.isArray(data.creators) ? data.creators : [];
  const subjects = Array.isArray(data.subjects) ? data.subjects : [];
  const chapters = Array.isArray(data.chapters) ? data.chapters : [];
  const creatorIds = uniqueIds(creators, 'creator', errors);
  const subjectIds = uniqueIds(subjects, 'subject', errors);
  const chapterIds = uniqueIds(chapters, 'chapter', errors);
  uniqueIds(resources, 'resource', errors);
  for (const creator of creators) {
    if (!creator.name?.trim()) errors.push('Creator ' + creator.id + ' has no name');
    if (!httpsUrl(creator.profileUrl)) errors.push('Creator ' + creator.id + ' must have an HTTPS profileUrl');
    if (creator.status !== 'published') errors.push('Public creator ' + creator.id + ' is not published');
  }
  for (const chapter of chapters) {
    if (!subjectIds.has(chapter.subjectId)) errors.push('Chapter ' + chapter.id + ' references missing subject ' + chapter.subjectId);
  }
  for (const resource of resources) {
    if (!resource.title?.trim()) errors.push('Resource ' + resource.id + ' has no title');
    if (!httpsUrl(resource.sourceUrl)) errors.push('Resource ' + resource.id + ' must have an HTTPS sourceUrl');
    if (!['pdf','video','website','notes','practice-paper','other'].includes(resource.resourceType)) errors.push('Resource ' + resource.id + ' has an invalid resourceType');
    if (!['hosted','external','embed'].includes(resource.accessMethod)) errors.push('Resource ' + resource.id + ' has an invalid accessMethod');
    if (resource.accessMethod === 'hosted' && !['owned','authorized'].includes(resource.hostingPermission)) errors.push('Hosted resource ' + resource.id + ' lacks ownership or hosting permission');
    if (resource.accessMethod === 'embed' && resource.embedAllowed !== true) errors.push('Embedded resource ' + resource.id + ' lacks embed permission');
    if (resource.hostingPermission === 'not-authorized' && resource.accessMethod === 'hosted') errors.push('Unauthorised resource ' + resource.id + ' cannot be hosted');
    if (resource.creatorId && !creatorIds.has(resource.creatorId)) errors.push('Resource ' + resource.id + ' references missing creator ' + resource.creatorId);
    if (resource.subjectId && !subjectIds.has(resource.subjectId)) errors.push('Resource ' + resource.id + ' references missing subject ' + resource.subjectId);
    if (resource.chapterId && !chapterIds.has(resource.chapterId)) errors.push('Resource ' + resource.id + ' references missing chapter ' + resource.chapterId);
    if (resource.status !== 'published') errors.push('Public resource ' + resource.id + ' is not published');
    if (resource.fileSizeBytes !== undefined && (!Number.isFinite(resource.fileSizeBytes) || resource.fileSizeBytes <= 0)) errors.push('Resource ' + resource.id + ' has invalid fileSizeBytes');
    if (resource.pageCount !== undefined && (!Number.isInteger(resource.pageCount) || resource.pageCount <= 0)) errors.push('Resource ' + resource.id + ' has invalid pageCount');
    if (resource.thumbnailUrl && !httpsUrl(resource.thumbnailUrl)) errors.push('Resource ' + resource.id + ' thumbnailUrl must use HTTPS');
  }
  return errors;
}
