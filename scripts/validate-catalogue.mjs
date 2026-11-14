import { readFileSync } from 'node:fs';
import { validateCatalogue } from './catalogue-validation.mjs';
const root = new URL('../static/data/', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(name, root), 'utf8'));
const data = { resources: read('resources.json'), creators: read('creators.json'), subjects: read('subjects.json'), chapters: read('chapters.json') };
const meta = read('catalogue-meta.json');
if (meta.schemaVersion !== 1) throw new Error('Unsupported catalogue schemaVersion.');
for (const [key, count] of Object.entries({ resourceCount: data.resources.length, creatorCount: data.creators.length, subjectCount: data.subjects.length, chapterCount: data.chapters.length })) {
  if (meta[key] !== count) throw new Error('Catalogue metadata mismatch for ' + key + ': expected ' + count + ', received ' + meta[key]);
}
const errors = validateCatalogue(data);
if (errors.length) {
  console.error('Catalogue validation failed:');
  for (const error of errors) console.error(' - ' + error);
  process.exit(1);
}
console.log('Catalogue validation passed: ' + data.resources.length + ' resources, ' + data.creators.length + ' creators, ' + data.subjects.length + ' subjects, ' + data.chapters.length + ' chapters.');
