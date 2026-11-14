/**
 * ICSE Compass catalogue publisher.
 * Attach this script to the dedicated ICSE Compass Google Sheet.
 * Store GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO and GITHUB_BRANCH in Script Properties.
 */
const SHEET_NAMES = { resources: 'Resources', creators: 'Creators', curriculum: 'Subjects & Chapters' };
const PUBLICATION_TABS = Object.values(SHEET_NAMES);
const RESOURCE_TYPES = ['pdf', 'video', 'website', 'notes', 'practice-paper', 'other'];
const ACCESS_METHODS = ['hosted', 'external', 'embed'];
function onOpen() {
  SpreadsheetApp.getUi().createMenu('ICSE Compass')
    .addItem('Publish catalogue now', 'publishCatalogue')
    .addItem('Install automatic publishing', 'installCatalogueTrigger')
    .addToUi();
}
function installCatalogueTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'handleCatalogueEdit').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('handleCatalogueEdit').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();
  SpreadsheetApp.getUi().alert('Automatic publishing is installed. Edits to Resources, Creators, or Subjects & Chapters will publish the approved catalogue.');
}
function handleCatalogueEdit(event) {
  if (!event || !event.range) return;
  if (!PUBLICATION_TABS.includes(event.range.getSheet().getName())) return;
  publishCatalogue();
}
function publishCatalogue() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const catalogue = buildCatalogue_();
    const errors = validateCatalogue_(catalogue);
    if (errors.length) throw new Error('Catalogue was not published:\n' + errors.join('\n'));
    const generatedAt = new Date().toISOString();
    const outputs = {
      'static/data/resources.json': catalogue.resources,
      'static/data/creators.json': catalogue.creators,
      'static/data/subjects.json': catalogue.subjects,
      'static/data/chapters.json': catalogue.chapters,
      'static/data/catalogue-meta.json': {
        schemaVersion: 1, generatedAt,
        resourceCount: catalogue.resources.length, creatorCount: catalogue.creators.length,
        subjectCount: catalogue.subjects.length, chapterCount: catalogue.chapters.length
      }
    };
    commitFiles_(outputs);
    SpreadsheetApp.getActive().toast('Published ' + catalogue.resources.length + ' resources to ICSE Compass.', 'ICSE Compass', 8);
  } finally {
    lock.releaseLock();
  }
}
function buildCatalogue_() {
  const creators = readRows_(SHEET_NAMES.creators).filter(r => published_(r.status)).map(r => ({
    id: required_(r.creator_id, 'creator_id'), name: required_(r.name, 'creator name'),
    description: String(r.description || ''), platform: required_(r.platform, 'creator platform'),
    profileUrl: required_(r.profile_url, 'creator profile_url'), status: 'published'
  }));
  const subjectsById = new Map();
  const chapters = [];
  readRows_(SHEET_NAMES.curriculum).filter(r => published_(r.status)).forEach(r => {
    const subjectId = required_(r.subject_id, 'subject_id');
    const subjectName = required_(r.subject_name, 'subject_name');
    const subject = { id: subjectId, name: subjectName, sortOrder: numberOr_(r.subject_sort_order, 0), status: 'published' };
    if (subjectsById.has(subjectId) && subjectsById.get(subjectId).name !== subjectName) throw new Error('Conflicting names for subject ' + subjectId);
    subjectsById.set(subjectId, subject);
    if (String(r.chapter_id || '').trim()) chapters.push({
      id: String(r.chapter_id).trim(), subjectId, name: required_(r.chapter_name, 'chapter_name'),
      sortOrder: numberOr_(r.chapter_sort_order, 0), status: 'published'
    });
  });
  const resources = readRows_(SHEET_NAMES.resources).filter(r => published_(r.status)).map(r => {
    const item = {
      id: required_(r.resource_id, 'resource_id'), title: required_(r.title, 'resource title'),
      description: String(r.description || ''), subjectId: optional_(r.subject_id), chapterId: optional_(r.chapter_id),
      creatorId: optional_(r.creator_id), resourceType: required_(r.resource_type, 'resource_type').toLowerCase(),
      sourceUrl: required_(r.source_url, 'source_url'), accessMethod: required_(r.access_method, 'access_method').toLowerCase(),
      hostingPermission: required_(r.hosting_permission, 'hosting_permission').toLowerCase(),
      embedAllowed: boolean_(r.embed_allowed), keywords: String(r.keywords || '').split(/[,;\n]/).map(s => s.trim()).filter(Boolean),
      status: 'published'
    };
    const size = numberOr_(r.file_size_bytes, 0);
    const pages = numberOr_(r.page_count, 0);
    if (size > 0) item.fileSizeBytes = size;
    if (pages > 0) item.pageCount = pages;
    if (optional_(r.thumbnail_url)) item.thumbnailUrl = String(r.thumbnail_url).trim();
    if (optional_(r.updated_at)) item.updatedAt = isoDate_(r.updated_at);
    return item;
  });
  return {
    resources: resources.sort((a,b) => a.title.localeCompare(b.title)),
    creators: creators.sort((a,b) => a.name.localeCompare(b.name)),
    subjects: [...subjectsById.values()].sort((a,b) => a.sortOrder-b.sortOrder || a.name.localeCompare(b.name)),
    chapters: chapters.sort((a,b) => a.sortOrder-b.sortOrder || a.name.localeCompare(b.name))
  };
}
function readRows_(sheetName) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet) throw new Error('Missing required sheet tab: ' + sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(h => String(h).trim().toLowerCase());
  if (!headers.some(Boolean)) throw new Error('Missing header row in ' + sheetName);
  return values.slice(1).filter(row => row.some(cell => String(cell).trim() !== '')).map(row => {
    const record = {};
    headers.forEach((header, index) => { if (header) record[header] = row[index]; });
    return record;
  });
}
function validateCatalogue_(data) {
  const errors = [];
  const unique = (items, label) => {
    const ids = new Set();
    items.forEach(item => { if (ids.has(item.id)) errors.push('Duplicate ' + label + ' id: ' + item.id); ids.add(item.id); });
    return ids;
  };
  const creatorIds = unique(data.creators, 'creator');
  const subjectIds = unique(data.subjects, 'subject');
  const chapterIds = unique(data.chapters, 'chapter');
  unique(data.resources, 'resource');
  data.creators.forEach(c => { if (!/^https:\/\//i.test(c.profileUrl)) errors.push('Creator ' + c.id + ' profile_url must be HTTPS.'); });
  data.chapters.forEach(c => { if (!subjectIds.has(c.subjectId)) errors.push('Chapter ' + c.id + ' references missing subject ' + c.subjectId); });
  data.resources.forEach(r => {
    if (!/^https:\/\//i.test(r.sourceUrl)) errors.push('Resource ' + r.id + ' source_url must be HTTPS.');
    if (!RESOURCE_TYPES.includes(r.resourceType)) errors.push('Resource ' + r.id + ' has invalid resource_type.');
    if (!ACCESS_METHODS.includes(r.accessMethod)) errors.push('Resource ' + r.id + ' has invalid access_method.');
    if (r.accessMethod === 'hosted' && !['owned','authorized'].includes(r.hostingPermission)) errors.push('Hosted resource ' + r.id + ' needs owned or authorized hosting permission.');
    if (r.accessMethod === 'embed' && !r.embedAllowed) errors.push('Resource ' + r.id + ' requires explicit embed permission.');
    if (r.creatorId && !creatorIds.has(r.creatorId)) errors.push('Resource ' + r.id + ' references missing creator ' + r.creatorId);
    if (r.subjectId && !subjectIds.has(r.subjectId)) errors.push('Resource ' + r.id + ' references missing subject ' + r.subjectId);
    if (r.chapterId && !chapterIds.has(r.chapterId)) errors.push('Resource ' + r.id + ' references missing chapter ' + r.chapterId);
  });
  return errors;
}
function commitFiles_(files) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('GITHUB_TOKEN');
  const owner = props.getProperty('GITHUB_OWNER') || 'icse-cbse-10-12';
  const repo = props.getProperty('GITHUB_REPO') || 'icse-compass';
  const branch = props.getProperty('GITHUB_BRANCH') || 'main';
  if (!token) throw new Error('Set GITHUB_TOKEN in Apps Script Project Settings → Script Properties.');
  const headers = { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const api = 'https://api.github.com/repos/' + owner + '/' + repo;
  const ref = githubRequest_('get', api + '/git/ref/heads/' + branch, headers);
  const parentSha = ref.object.sha;
  const parent = githubRequest_('get', api + '/git/commits/' + parentSha, headers);
  const tree = [];
  Object.keys(files).forEach(path => {
    const blob = githubRequest_('post', api + '/git/blobs', headers, { content: JSON.stringify(files[path], null, 2) + '\n', encoding: 'utf-8' });
    tree.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
  });
  const newTree = githubRequest_('post', api + '/git/trees', headers, { base_tree: parent.tree.sha, tree });
  const commit = githubRequest_('post', api + '/git/commits', headers, {
    message: 'chore(catalogue): publish approved Google Sheets data',
    tree: newTree.sha, parents: [parentSha]
  });
  githubRequest_('patch', api + '/git/refs/heads/' + branch, headers, { sha: commit.sha, force: false });
}
function githubRequest_(method, url, headers, body) {
  const response = UrlFetchApp.fetch(url, {
    method, headers, contentType: 'application/json', payload: body ? JSON.stringify(body) : undefined,
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  const text = response.getContentText();
  if (status < 200 || status >= 300) throw new Error('GitHub API request failed (' + status + '): ' + text.slice(0, 500));
  return text ? JSON.parse(text) : {};
}
function published_(value) { return String(value || '').trim().toLowerCase() === 'published'; }
function required_(value, label) { const result = String(value || '').trim(); if (!result) throw new Error('Missing required field: ' + label); return result; }
function optional_(value) { return value !== null && value !== undefined && String(value).trim() !== ''; }
function numberOr_(value, fallback) { if (!optional_(value)) return fallback; const n = Number(value); if (!Number.isFinite(n)) throw new Error('Expected a number, received: ' + value); return n; }
function boolean_(value) { return value === true || ['true','yes','1'].includes(String(value || '').trim().toLowerCase()); }

function isoDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString();
  const text = String(value).trim();
  const parsed = new Date(text);
  return isNaN(parsed.getTime()) ? text : parsed.toISOString();
}
