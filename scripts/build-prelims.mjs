import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const DEFAULT_CSV_URL = 'https://docs.google.com/spreadsheets/d/181-RJFE5716RaM_e0faHIQyUlNIO1Z6XvbDgtXJm4-Y/export?format=csv&gid=1962278617';

const clean = (value) => String(value ?? '').trim();

export function parseCSV(input) {
  const source = String(input ?? '').replace(/^\uFEFF/, '');
  if (!source.trim()) return [];
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === '"') {
      if (quoted && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      row.push(field.trim());
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field.trim());
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error('The Google Sheets CSV contains an unclosed quoted field.');
  row.push(field.trim());
  if (row.some((value) => value !== '')) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows.shift().map(clean);
  if (headers.some((header) => !header)) throw new Error('The Google Sheets CSV contains an empty column heading.');
  return rows.map((values) => Object.fromEntries(
    headers.map((header, index) => [header, clean(values[index])])
  )).filter((item) => Object.values(item).some(Boolean));
}

export function safeHttpsUrl(value) {
  const raw = clean(value);
  if (!raw || /^(?:#|n\/?a|none|null|undefined|not available)$/i.test(raw)) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password) return '';
    return url.href;
  } catch {
    return '';
  }
}

export function isPrelimPaper(row) {
  const category = clean(row.Category).toLowerCase();
  const details = `${clean(row.Scope)} ${clean(row['Book Name'])}`.toLowerCase();
  const categoryIsPrelim = /prelim/.test(category);
  const paperCategory = /question papers?|sample papers?|model papers?/.test(category);
  const paperIsPrelim = /prelim|pre[- ]?board|mock test/.test(details);
  return categoryIsPrelim || (paperCategory && paperIsPrelim);
}

export function extractYear(row) {
  const text = [row.Edition, row['Book Name'], row.Scope].map(clean).join(' ');
  const match = text.match(/\b(20\d{2})(?:\s*[-–/]\s*(\d{2}|20\d{2}))?\b/);
  if (!match) return '';
  if (!match[2]) return match[1];
  const end = match[2].length === 2 ? match[2] : match[2].slice(-2);
  return `${match[1]}–${end}`;
}

export function normalizePrelimRows(rows) {
  const papers = [];
  const seen = new Set();

  for (const row of rows) {
    if (!isPrelimPaper(row)) continue;
    if (!/pdf/i.test(clean(row.Format))) continue;

    const title = clean(row['Book Name']);
    const subject = clean(row.Subject) || 'Subject not stated';
    const sourceUrl = safeHttpsUrl(row['Google Drive Link']) || safeHttpsUrl(row['Source URL']);
    if (!title || !sourceUrl) continue;

    const shareId = clean(row['Share ID']);
    const id = shareId || createHash('sha256')
      .update([subject, title, sourceUrl].join('|'))
      .digest('hex')
      .slice(0, 20);
    if (seen.has(id)) continue;
    seen.add(id);

    const publisher = clean(row['Publisher/Company']);
    const school = !publisher || /^(not stated|not specified|other \/ unspecified)$/i.test(publisher)
      ? 'School not stated'
      : publisher;

    papers.push({
      id,
      title,
      subject,
      category: clean(row.Category),
      scope: clean(row.Scope),
      school,
      year: extractYear(row),
      format: clean(row.Format) || 'PDF',
      sourceUrl,
      sourceCredit: clean(row['Source Credit']),
      rightsStatus: clean(row['Copyright Status']) || 'Not stated in sheet'
    });
  }

  return papers.sort((left, right) => {
    const leftYear = Number(left.year.match(/^20\d{2}/)?.[0] ?? 0);
    const rightYear = Number(right.year.match(/^20\d{2}/)?.[0] ?? 0);
    return rightYear - leftYear
      || left.subject.localeCompare(right.subject, 'en-IN')
      || left.title.localeCompare(right.title, 'en-IN');
  });
}

export async function buildPrelims({ root = resolve(fileURLToPath(new URL('..', import.meta.url))), csvText, now = new Date() } = {}) {
  if (typeof csvText !== 'string') throw new TypeError('buildPrelims requires csvText.');
  const rows = parseCSV(csvText);
  if (!rows.length) throw new Error('The Prelims Papers sheet returned no records; refusing to overwrite the existing catalogue.');

  const required = ['Subject', 'Category', 'Scope', 'Book Name', 'Format', 'Google Drive Link'];
  if (!required.every((header) => Object.hasOwn(rows[0], header))) {
    throw new Error('The Prelims Papers sheet is missing one or more required columns.');
  }

  const papers = normalizePrelimRows(rows);
  if (!papers.length) throw new Error('No valid prelim PDF records with HTTPS source links were found; refusing to publish an empty catalogue.');

  const payload = {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    count: papers.length,
    papers
  };
  const outputPath = resolve(root, 'static/data/prelims.json');
  await writeFile(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  return { count: papers.length, outputPath, generatedAt: payload.generatedAt };
}

async function main() {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const csvFile = process.env.PRELIMS_CSV_FILE;
  let csvText;

  if (csvFile) {
    csvText = await readFile(resolve(csvFile), 'utf8');
  } else {
    const response = await fetch(process.env.PRELIMS_CSV_URL || DEFAULT_CSV_URL, {
      signal: AbortSignal.timeout(30_000),
      headers: { 'user-agent': 'ICSE-Compass-Prelims-Build/1.0' }
    });
    if (!response.ok) throw new Error(`Google Sheets CSV request failed (${response.status}).`);
    csvText = await response.text();
  }

  const result = await buildPrelims({ root, csvText });
  console.log(`Built ${result.count.toLocaleString('en-IN')} prelim papers from the master sheet.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error('Prelims catalogue build failed:', error);
    process.exitCode = 1;
  });
}
