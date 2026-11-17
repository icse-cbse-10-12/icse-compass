import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyPaperType, extractYear, isPrelimPaper, normalizePrelimRows, parseCSV, safeHttpsUrl } from './build-prelims.mjs';

const base = {
  Subject: 'Biology',
  Category: 'Sample Papers',
  Scope: 'Pre-board Examination',
  'Publisher/Company': 'Riverdale School',
  'Book Name': 'Biology Pre-board Paper 2026.pdf',
  Format: 'PDF',
  'Google Drive Link': 'https://drive.google.com/file/d/1AbcdefghijkLMN_12345/view',
  'Source URL': '',
  Edition: '2026',
  'Copyright Status': 'Third-party school material; reuse rights not verified',
  'Share ID': 'riverdale-biology-2026'
};

test('CSV parser preserves quoted commas, escaped quotes and embedded newlines', () => {
  const rows = parseCSV('Name,Description\n"School, North","A ""quoted"" note"\n"Second","Line one\nLine two"');
  assert.equal(rows[0].Name, 'School, North');
  assert.equal(rows[0].Description, 'A "quoted" note');
  assert.equal(rows[1].Description, 'Line one\nLine two');
});

test('prelim classification includes prelim categories and paper scopes, not question-bank mentions', () => {
  assert.equal(isPrelimPaper(base), true);
  assert.equal(isPrelimPaper({ ...base, Category: 'Question Banks', Scope: 'Chapter-wise', 'Book Name': 'Questions from prelim papers' }), false);
  assert.equal(isPrelimPaper({ ...base, Category: 'Prelim / Exam Papers', Scope: 'Specimen / Sample Paper', 'Book Name': 'Practice set' }), true);
});

test('year extraction normalises academic years without inventing missing years', () => {
  assert.equal(extractYear(base), '2026');
  assert.equal(extractYear({ ...base, Edition: '2022-23', 'Book Name': 'Biology paper' }), '2022–23');
  assert.equal(extractYear({ ...base, Edition: '', 'Book Name': 'Biology paper' }), '');
});

test('only PDF prelim records with safe HTTPS source links are published', () => {
  const papers = normalizePrelimRows([
    base,
    { ...base, 'Share ID': 'duplicate-id', 'Book Name': 'Another prelim.pdf' },
    { ...base, 'Share ID': 'not-pdf', Format: 'DOCX' },
    { ...base, 'Share ID': 'unsafe', 'Google Drive Link': 'http://example.com/paper.pdf' },
    { ...base, 'Share ID': 'not-paper', Category: 'Question Banks', Scope: 'Chapter-wise', 'Book Name': 'Chapter questions.pdf' }
  ]);
  assert.equal(papers.length, 2);
  assert.ok(papers.some((paper) => paper.id === 'riverdale-biology-2026'));
  assert.ok(papers.some((paper) => paper.id === 'duplicate-id'));
  assert.equal(papers.find((paper) => paper.id === 'riverdale-biology-2026')?.school, 'Riverdale School');
  assert.equal(papers.find((paper) => paper.id === 'riverdale-biology-2026')?.rightsStatus, base['Copyright Status']);
  assert.equal(safeHttpsUrl('javascript:alert(1)'), '');
  assert.equal(safeHttpsUrl('https://example.com/paper.pdf'), 'https://example.com/paper.pdf');
});


test('paper type classification separates specimen, school exams, mocks and uncategorised question papers', () => {
  assert.equal(classifyPaperType({ ...base, Scope: 'Specimen / Sample Paper' }), 'Specimen & Sample');
  assert.equal(classifyPaperType({ ...base, Category: 'Question Papers', Scope: 'School Prelim Examination', 'Book Name': 'School prelim paper.pdf' }), 'School Prelims & Term');
  assert.equal(classifyPaperType({ ...base, Category: 'Question Papers', Scope: 'Pre-Board Examination' }), 'Pre-board & Mock');
  assert.equal(classifyPaperType({ ...base, Category: 'Question Papers', Scope: 'Board practice' }), 'Other Question Papers');
});

test('generic contributor labels do not masquerade as named schools', () => {
  const papers = normalizePrelimRows([{ ...base, 'Publisher/Company': 'School / teacher contribution' }]);
  assert.equal(papers[0].school, 'School not stated');
});
