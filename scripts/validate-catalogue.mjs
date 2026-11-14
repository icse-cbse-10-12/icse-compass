import { readFileSync } from 'node:fs';
import { validateCatalogue } from './catalogue-validation.mjs';
const root = new URL('../static/data/', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(name, root), 'utf8'));
const data = { resources: read('resources.json'), creators: read('creators.json'), subjects: read('subjects.json'), chapters: read('chapters.json') };
const errors = validateCatalogue(data);
if (errors.length) {
  console.error('Catalogue validation failed:');
  for (const error of errors) console.error(' - ' + error);
  process.exit(1);
}
console.log('Catalogue validation passed: ' + data.resources.length + ' resources, ' + data.creators.length + ' creators, ' + data.subjects.length + ' subjects, ' + data.chapters.length + ' chapters.');
