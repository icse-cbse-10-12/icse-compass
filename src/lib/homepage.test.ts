import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const appShell = readFileSync(new URL('../app.html', import.meta.url), 'utf8');
const homepage = readFileSync(new URL('../routes/+page.svelte', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../routes/+layout.svelte', import.meta.url), 'utf8');
const materials = readFileSync(new URL('../routes/materials/+page.svelte', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const viteConfig = readFileSync(new URL('../../vite.config.ts', import.meta.url), 'utf8');
const subjects = JSON.parse(readFileSync(new URL('../../static/data/subjects.json', import.meta.url), 'utf8')) as Array<{ id: string; name: string; status: string }>;
const resources = JSON.parse(readFileSync(new URL('../../static/data/resources.json', import.meta.url), 'utf8')) as Array<{ status: string }>;

describe('ICSE Compass visual resource-library homepage', () => {
  it('sets a safe referrer policy, complete social metadata and an Apple touch icon', () => {
    expect(layout).toContain('rel="apple-touch-icon" sizes="180x180"');
    expect(viteConfig).toContain("'apple-touch-icon.png'");
    expect(appShell).toContain('name="referrer" content="strict-origin-when-cross-origin"');
    expect(homepage).toContain('property="og:title"');
    expect(homepage).toContain('property="og:description"');
    expect(homepage).not.toContain('name="twitter:title"');
    expect(homepage).not.toContain('name="twitter:description"');
    expect(homepage).not.toContain('property="og:url"');
    expect((homepage.split('<meta ').length - 1) + (layout.split('<meta ').length - 1)).toBeLessThanOrEqual(9);
    expect(homepage).toContain('Discover ICSE notes, past papers, and video lessons');
  });

  it('uses semantic sections and CSS-drawn decoration instead of empty decorative markup', () => {
    expect(homepage).toContain('<section class="home-rule-samples"');
    expect(homepage).toContain('<figure class="sample-stack"');
    expect(homepage).not.toContain('class="sample-lines');
    expect(homepage).not.toContain('class="eyebrow-rule"');
    expect(styles).toContain('.eyebrow-ruled::before');
    expect(styles).toContain('.sample-sheet-front::before');
    expect(styles).toContain('.sample-sheet-front::after');
    expect(styles).toContain('.public-label::before');
  });


  it('adds substantive study guidance, source transparency and useful FAQs', () => {
    expect(homepage).toContain('A practical guide to using ICSE Compass.');
    const guide = homepage.split('<section class="home-guide-section')[1]?.split('</section>')[0] ?? '';
    expect((guide.match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g) ?? []).length).toBeGreaterThan(500);
    expect(homepage).toContain('Search by subject, topic or resource type');
    expect(homepage).toContain('Follow the original source');
    expect(homepage).toContain('Frequently asked questions');
    expect(homepage).toContain('not affiliated with, authorised by or endorsed by CISCE');
    expect(styles).toContain('.home-guide-grid');
    expect(styles).toContain('@media (max-width: 760px)');
  });

  it('positions Compass as an independent, rule-first ICSE study library', () => {
    expect(homepage).toContain('Your independent ICSE study library');
    expect(homepage).toContain('THE ICSE COMPASS RULE');
    expect(homepage).toContain('A study library should help you find the material');
    expect(homepage).toContain('not sell you a seat.');
    expect(homepage).toContain('Find your next resource.');
    expect(homepage).toContain('Browse the shelves.');
  });

  it('loads live catalogue counts while showing verified fallback totals immediately', () => {
    expect(homepage).toContain("fetch(siteBase + '/data/resources.json')");
    expect(homepage).toContain("fetch(siteBase + '/data/subjects.json')");
    expect(homepage).toContain("item.status === 'published'");
    expect(homepage).toContain('resourceCount = $state(155)');
    expect(homepage).toContain('subjectCount = $state(12)');
    expect(homepage).toContain('resourceCount = resources.length');
    expect(homepage).toContain('subjectCount = subjects.length');
    expect(homepage).toContain('class="stat-value" class:loading={loading}');
    expect(homepage).toContain('subjectCards');
    expect(homepage).toContain('subject.count');
    expect(resources.filter((resource) => resource.status === 'published').length).toBe(155);
    expect(subjects.filter((subject) => subject.status === 'published').length).toBe(12);
  });

  it('provides one clear library entry action while Materials retains query search', () => {
    expect(homepage).toContain('home-enter-button');
    expect(homepage).toContain("siteBase + '/materials/'");
    expect(homepage).not.toContain('home-search-v2');
    expect(materials).toContain("new URLSearchParams(window.location.search)");
    expect(materials).toContain("query = params.get('q') ?? ''");
  });

  it('provides direct routes to materials, school papers and syllabus planning', () => {
    expect(homepage).toContain("siteBase + '/materials/'");
    expect(homepage).toContain("siteBase + '/school-papers/'");
    expect(homepage).toContain("siteBase + '/syllabus/'");
    expect(homepage).toContain('Board papers &amp; specimen sets');
    expect(homepage).toContain('Notes &amp; chapter resources');
    expect(homepage).toContain('Video lessons &amp; educators');
  });

  it('shows all subject shortcuts immediately and links each pill to its filtered library shelf', () => {
    expect(homepage).toContain('defaultSubjectLinks');
    expect(homepage).toContain('subjectQuickLinks as subject');
    expect(homepage).toContain('subject-quick-links');
    expect(homepage).toContain('subject-quick-pill');
    expect(homepage).toContain("'/materials/?q=' + encodeURIComponent(subject.name)");
    expect(subjects.filter((subject) => subject.status === 'published')).toHaveLength(12);
    for (const subject of subjects.filter((item) => item.status === 'published')) {
      expect(homepage).toContain(`name: '${subject.name}'`);
    }
  });

  it('uses the published subject catalogue to build subject shelves', () => {
    expect(homepage).toContain('subjectCards as subject');
    expect(homepage).toContain('subject.name');
    expect(homepage).toContain("'/materials/?q=' + encodeURIComponent(subject.name)");
    expect(homepage).not.toContain('★★★★★');
    expect(homepage).not.toMatch(/student testimonial|verified review/i);
  });

  it('keeps library preview counts data-backed and explains original-source access', () => {
    expect(homepage).toContain('sampleResources');
    expect(homepage).toContain('original source');
    expect(homepage).toContain('Follow its source.');
    expect(homepage).not.toMatch(/\b\d{2,}[+]?\s+(resources|downloads|students|educators)\b/i);
    expect(homepage).not.toContain('↗');
  });

  it('uses document thumbnails when available and an honest fallback otherwise', () => {
    expect(materials).toContain('getResourcePreviewUrl(resource)');
    expect(materials).toContain('resource-cover-image');
    expect(materials).toContain('COVER-STYLE FALLBACK');
    expect(materials).toContain('SOURCE PREVIEW UNAVAILABLE');
    expect(materials).toContain('resource-preview-dialog');
    expect(materials).toContain('previewDialog.showModal()');
    expect(materials).toContain('Preview image supplied by the original source');
    expect(materials).toContain('Full documents remain with their original publishers');
  });

  it('preserves original-source links and permission-aware access information', () => {
    expect(materials).toContain('href={resource.sourceUrl}');
    expect(materials).toContain('target="_blank"');
    expect(materials).toContain('Hosted with permission');
    expect(materials).toContain('Permitted external embed');
    expect(materials).toContain('Opens at the original source');
  });

  it('uses the richer paper, ink, forest and subject colour system', () => {
    expect(styles).toContain('--paper: #f4efe5');
    expect(styles).toContain('--ink: #202a25');
    expect(styles).toContain('--green: #2e624a');
    expect(styles).toContain('--terracotta: #b75c3e');
    expect(styles).toContain('.subject-chemistry .resource-cover-art');
    expect(styles).toContain('.subject-biology .resource-cover-art');
    expect(styles).toContain('.nav-dropdown-item-description { display: block !important;');
    expect(styles).toContain('.subject-quick-pill');
  });

  it('supports responsive layouts and reduced-motion preferences', () => {
    expect(styles).toContain('@media (max-width: 600px)');
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
    expect(styles).toContain('.resource-grid.list-view');
    expect(styles).toContain('.resource-preview-dialog::backdrop');
  });

  it('shows the compass line-drawing splash once per session and skips reduced-motion users', () => {
    expect(layout).toContain("sessionStorage.getItem('compassSplashShown')");
    expect(layout).toContain("sessionStorage.setItem('compassSplashShown', 'true')");
    expect(layout).toContain("window.matchMedia('(prefers-reduced-motion: reduce)')");
    expect(layout).toContain('splashVisible = false');
    expect(layout).toContain('aria-hidden="true"');
    expect(styles).toContain('.compass-splash.is-leaving');
    expect(styles).toContain('.draw-circle');
    expect(styles).toContain('.draw-needle');
  });

  it('uses unified action/highlight greens and readable navigation contrast', () => {
    expect(styles).toContain('--action-green: #15803D');
    expect(styles).toContain('--dark-highlight: #34D399');
    expect(styles).toContain('--surface-soft: #FCFBF7');
    expect(styles).toContain('--surface-border: #E2DDD0');
    expect(styles).toContain('--nav-inactive: #94A3B8');
    expect(styles).toContain('rgba(11, 17, 30, 0.90)');
    expect(styles).toContain('.mobile-nav > a[aria-current="page"]::before');
    expect(styles).toContain('background: var(--dark-highlight) !important');
    expect(styles).toContain('.mobile-search-form {');
    expect(styles).toContain('background: var(--surface-soft);');
    expect(styles).toContain('color: #16263E !important;');
  });

  it('keeps subject-card text readable and distinguishes the English shelves', () => {
    expect(styles).toContain('linear-gradient(to top, rgba(10, 15, 25, .88) 0%, rgba(10, 15, 25, .35) 55%, rgba(10, 15, 25, .1) 100%)');
    expect(styles).toContain('.subject-tile small { font-size: 12px !important; }');
    expect(homepage).toContain("subject.name === 'English Paper 1' ? 'E1'");
    expect(homepage).toContain("subject.name === 'English Paper 2' ? 'E2'");
  });

  it('reveals subject cards on scroll with a visible-by-default fallback', () => {
    expect(homepage).toContain('function revealSubjectCards(node: HTMLElement)');
    expect(homepage).toContain("window.matchMedia('(prefers-reduced-motion: reduce)').matches");
    expect(homepage).toContain("card.classList.add('reveal-card')");
    expect(homepage).toContain("card.classList.add('is-visible')");
    expect(homepage).toContain('use:revealSubjectCards');
    expect(styles).toContain('.subject-tile.reveal-card.is-visible');
    expect(styles).toContain('transition-delay: var(--reveal-delay, 0ms)');
    expect(styles).toContain('.subject-tile:active,');
    expect(styles).toContain('.mobile-nav > a[aria-current="page"] > svg');
    expect(styles).toContain('@keyframes preview-sheet-enter');
    expect(styles).toContain('.resource-preview-dialog[open]');
  });

  it('adds accessible card lift, arrow nudges and a lightweight featured-card sheen', () => {
    expect(styles).toContain('.subject-tile:focus-visible,');
    expect(styles).toContain('.discovery-tile:focus-visible');
    expect(styles).toContain('border-color: rgba(16, 185, 129, .58)');
    expect(styles).toContain('transform: translateX(4px)');
    expect(styles).toContain('.home-rule-preview::before');
    expect(styles).toContain('transition: left .65s ease');
    expect(homepage).toContain('<span class="discovery-link">Browse papers <span aria-hidden="true">→</span></span>');
  });

  it('animates bookmark feedback only on a newly saved resource', () => {
    expect(materials).toContain('bookmarkPopId = result.saved ? resource.id :');
    expect(materials).toContain('class:bookmark-pop={bookmarkPopId === resource.id}');
    expect(styles).toContain('@keyframes bookmark-pop');
  });

});
