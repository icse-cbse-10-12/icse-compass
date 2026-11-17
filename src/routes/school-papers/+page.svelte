<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';

  type PrelimPaper = {
    id: string;
    title: string;
    subject: string;
    category: string;
    paperType: string;
    scope: string;
    school: string;
    year: string;
    format: string;
    sourceUrl: string;
    sourceCredit: string;
    rightsStatus: string;
  };

  let papers: PrelimPaper[] = [];
  let query = '';
  let subject = '';
  let year = '';
  let school = '';
  let paperType = '';
  let loading = true;
  let loadError = false;
  let visibleCount = 24;
  let failedPreviewIds: string[] = [];
  let filteredPapers: PrelimPaper[] = [];
  let visiblePapers: PrelimPaper[] = [];
  let subjects: string[] = [];
  let years: string[] = [];
  let schools: string[] = [];
  let paperTypes: string[] = [];
  let paperTypeCounts: { label: string; count: number }[] = [];

  $: subjects = [...new Set(papers.map((paper) => paper.subject).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'en-IN'));
  $: years = [...new Set(papers.map((paper) => paper.year).filter(Boolean))].sort((a, b) => b.localeCompare(a, 'en-IN'));
  $: schools = [...new Set(papers.map((paper) => paper.school).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'en-IN'));
  $: paperTypes = ['School Prelims & Term', 'Pre-board & Mock', 'Specimen & Sample', 'Other Question Papers'];
  $: paperTypeCounts = paperTypes.map((label) => ({ label, count: papers.filter((paper) => paper.paperType === label).length }));
  $: filteredPapers = papers.filter((paper) => {
    if (paperType && paper.paperType !== paperType) return false;
    if (subject && paper.subject !== subject) return false;
    if (year && paper.year !== year) return false;
    if (school && paper.school !== school) return false;
    const searchText = [paper.title, paper.subject, paper.school, paper.scope, paper.year, paper.sourceCredit].join(' ').toLocaleLowerCase('en-IN');
    return !query.trim() || searchText.includes(query.trim().toLocaleLowerCase('en-IN'));
  });
  $: visiblePapers = filteredPapers.slice(0, visibleCount);

  function previewUrl(sourceUrl: string): string | null {
    try {
      const source = new URL(sourceUrl);
      if (source.protocol !== 'https:' || source.hostname !== 'drive.google.com') return null;
      const fileId = source.pathname.match(/^\/file\/d\/([^/]+)/)?.[1] ?? source.searchParams.get('id');
      if (!fileId || !/^[A-Za-z0-9_-]{10,}$/.test(fileId)) return null;
      return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(fileId) + '&sz=w640';
    } catch {
      return null;
    }
  }

  function markPreviewFailed(id: string) {
    if (!failedPreviewIds.includes(id)) failedPreviewIds = [...failedPreviewIds, id];
  }

  function actionLabel(paper: PrelimPaper): string {
    try {
      const source = new URL(paper.sourceUrl);
      return paper.format.toLowerCase().includes('pdf') && source.hostname === 'drive.google.com' ? 'Open PDF' : 'Open source';
    } catch {
      return 'Open source';
    }
  }

  async function loadPapers() {
    loading = true;
    loadError = false;
    try {
      const response = await fetch(siteBase + '/data/prelims.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Prelims catalogue unavailable');
      const payload = await response.json() as { papers?: unknown };
      if (!Array.isArray(payload.papers)) throw new Error('Prelims catalogue format invalid');
      papers = payload.papers as PrelimPaper[];
      failedPreviewIds = [];
    } catch {
      loadError = true;
    } finally {
      loading = false;
    }
  }

  function clearFilters() {
    query = '';
    subject = '';
    year = '';
    school = '';
    paperType = '';
    visibleCount = 24;
  }

  function updateSearch(value: string) {
    query = value;
    visibleCount = 24;
  }

  onMount(() => {
    void loadPapers();
  });
</script>

<svelte:head>
  <title>ICSE School Papers, Specimen &amp; Sample Papers | ICSE Compass</title>
  <meta name="description" content="Browse ICSE Class 10 school prelims, pre-board papers, specimen papers and sample papers with clear paper-type, subject, year and school filters." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/school-papers/" />
  <meta property="og:title" content="ICSE School Papers, Specimen &amp; Sample Papers | ICSE Compass" />
  <meta property="og:description" content="A searchable collection of school prelim and pre-board question papers." />
</svelte:head>

<main class="page-content school-papers-page">
  <header class="school-papers-heading">
    <p class="eyebrow">ICSE COMPASS · SCHOOL-LEVEL PRACTICE</p>
    <h1>ICSE School &amp; Practice Papers</h1>
    <p>Browse school prelims and term papers alongside specimen papers, sample papers and pre-board practice. Every listing is labelled by type and links to its recorded source.</p>
  </header>

  <section class="prelims-library" aria-labelledby="prelims-library-title">
    <div class="prelims-library-heading">
      <div>
        <span class="prelims-kicker">THE PAPER COLLECTION</span>
        <h2 id="prelims-library-title">School &amp; Practice Paper Catalogue</h2>
        <p>Listings are refreshed from the Prelims Papers tab in the ICSE MasterClass Student OS resource spreadsheet. School examinations and specimen/sample practice are separated below; files remain with their listed sources.</p>
      </div>
      <div class="prelims-count" aria-live="polite">
        <strong>{loading ? '—' : papers.length.toLocaleString('en-IN')}</strong>
        <span>all catalogue listings</span>
      </div>
    </div>

    <div class="paper-type-summary" aria-label="Catalogue counts by paper type">
      {#each paperTypeCounts as item}
        <button type="button" class:active={paperType === item.label} onclick={() => { paperType = paperType === item.label ? '' : item.label; visibleCount = 24; }} aria-pressed={paperType === item.label}>
          <strong>{item.count.toLocaleString('en-IN')}</strong><span>{item.label}</span>
        </button>
      {/each}
    </div>

    <div class="prelims-filters" aria-label="Search and filter school and practice papers">
      <label>Paper type
        <select bind:value={paperType} onchange={() => visibleCount = 24}>
          <option value="">All paper types</option>
          {#each paperTypes as item}<option value={item}>{item}</option>{/each}
        </select>
      </label>
      <label class="prelims-search" for="prelims-search">
        <span aria-hidden="true">⌕</span>
        <input id="prelims-search" type="search" value={query} oninput={(event) => updateSearch((event.currentTarget as HTMLInputElement).value)} placeholder="Search paper, school or subject…" autocomplete="off" />
      </label>
      <label>Subject
        <select bind:value={subject} onchange={() => visibleCount = 24}>
          <option value="">All subjects</option>
          {#each subjects as item}<option value={item}>{item}</option>{/each}
        </select>
      </label>
      <label>Year
        <select bind:value={year} onchange={() => visibleCount = 24}>
          <option value="">All years</option>
          {#each years as item}<option value={item}>{item}</option>{/each}
        </select>
      </label>
      <label>School / source
        <select bind:value={school} onchange={() => visibleCount = 24}>
          <option value="">All schools</option>
          {#each schools as item}<option value={item}>{item}</option>{/each}
        </select>
      </label>
      <button class="prelims-clear" type="button" onclick={clearFilters}>Clear filters</button>
    </div>

    <div class="prelims-results" aria-live="polite">
      {#if loading}
        <div class="prelims-state" role="status"><span class="prelims-spinner" aria-hidden="true"></span><strong>Loading school papers</strong><p>Fetching the latest published sheet catalogue.</p></div>
      {:else if loadError}
        <div class="prelims-state" role="alert"><strong>The paper catalogue couldn't be loaded.</strong><p>Check your connection and try again. No papers have been removed from the source spreadsheet.</p><button type="button" onclick={loadPapers}>Try again</button></div>
      {:else if papers.length === 0}
        <div class="prelims-state"><strong>No prelim listings are available yet.</strong><p>When the Prelims Papers tab contains valid PDF records with HTTPS source links, they will appear here after the next catalogue refresh.</p></div>
      {:else if filteredPapers.length === 0}
        <div class="prelims-state"><strong>No matching papers found.</strong><p>Try another search or clear one or more filters.</p><button type="button" onclick={clearFilters}>Clear search and filters</button></div>
      {:else}
        <div class="prelims-results-bar">
          <span><strong>{filteredPapers.length.toLocaleString('en-IN')}</strong> {filteredPapers.length === 1 ? 'paper' : 'papers'} found</span>
          <span>Showing {visiblePapers.length.toLocaleString('en-IN')}</span>
        </div>
        <div class="prelims-grid">
          {#each visiblePapers as paper (paper.id)}
            {@const preview = previewUrl(paper.sourceUrl)}
            {@const previewFailed = failedPreviewIds.includes(paper.id)}
            <article class="prelim-card">
              <div class="prelim-cover">
                {#if preview && !previewFailed}
                  <img src={preview} alt={'Preview of ' + paper.title} loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror={() => markPreviewFailed(paper.id)} />
                  <span class="prelim-cover-label">SOURCE PREVIEW</span>
                {:else}
                  <div class="prelim-cover-fallback" aria-hidden="true">
                    <span>ICSE COMPASS / PAPERS</span>
                    <strong>{paper.subject}</strong>
                    <small>{paper.year || paper.scope || 'SCHOOL PAPER'}</small>
                  </div>
                  <span class="prelim-cover-label">PAPER LISTING</span>
                {/if}
              </div>
              <div class="prelim-card-content">
                <div class="prelim-card-meta"><span>{paper.paperType}</span><span>{paper.year || 'Year not stated'}</span></div>
                <h3>{paper.title}</h3>
                <p class="prelim-school">{paper.school === 'School not stated' ? 'School not stated' : paper.school}</p>
                <p class="prelim-scope">{paper.paperType}{paper.scope ? ' · ' + paper.scope : ''}</p>
                {#if paper.sourceCredit}<p class="prelim-credit">Source credit: {paper.sourceCredit}</p>{/if}
                <p class="prelim-rights">Rights note: {paper.rightsStatus}</p>
                <div class="prelim-card-footer">
                  <span class="prelim-format">{paper.format}</span>
                  <a href={paper.sourceUrl} target="_blank" rel="noopener noreferrer">{actionLabel(paper)} <span aria-hidden="true">↗</span></a>
                </div>
              </div>
            </article>
          {/each}
        </div>
        {#if visibleCount < filteredPapers.length}
          <div class="prelims-load-more"><button type="button" onclick={() => visibleCount += 24}>Load 24 more papers</button></div>
        {/if}
      {/if}
    </div>
    <p class="prelims-rights-note">Some records do not identify a school or year; those gaps are shown rather than inferred. Third-party ownership and reuse rights are not implied by a listing. Open each source and follow the original provider's terms. ICSE Compass does not host these papers.</p>
  </section>

  <section class="school-papers-collection" aria-labelledby="school-papers-collection-title">
    <div>
      <span class="school-papers-kicker">SHARED GOOGLE DRIVE COLLECTION</span>
      <h2 id="school-papers-collection-title">Prelim Papers of Other Schools</h2>
      <p>The existing shared archive includes year-wise collections from 2017–18 onwards in the folders currently available. Availability and file organisation may vary by year.</p>
      <a href="https://drive.google.com/drive/folders/1UZWYrVwk9UfrVOJ-r_sQBGn3Tzmhk58e" target="_blank" rel="noopener noreferrer">Open the complete Google Drive folder <span aria-hidden="true">↗</span></a>
    </div>
    <span class="school-papers-collection-mark" aria-hidden="true">PAPER<br />ARCHIVE</span>
  </section>

  <section class="school-papers-guidance" aria-labelledby="school-papers-guidance-title">
    <h2 id="school-papers-guidance-title">Have more school papers?</h2>
    <p>Send additional papers only if they are school-issued for public distribution or you have permission to share them. Remove student names, roll numbers, signatures and other personal details before sharing.</p>
    <a class="school-papers-submit" href="mailto:icsemasterclass@gmail.com?subject=ICSE%20School%20Question%20Paper%20Submission&body=School%20name%3A%0AClass%20and%20exam%20year%3A%0ASubject%3A%0AExam%20type%20(pre-board%2Fprelim%2Fterm%2Funit%20test%2Fmock)%3A%0AOfficial%20school%20source%20URL%3A%0APermission%20to%20share%20publicly%20(yes%2Fno)%3A%0A%0AI%20confirm%20that%20I%20am%20authorised%20to%20share%20this%20paper%20publicly.%20I%20have%20removed%20student%20names%2C%20roll%20numbers%20and%20other%20personal%20details.">Submit an authorised school paper <span aria-hidden="true">↗</span></a>
    <p>ICSE Compass links to the recorded source wherever possible. It does not mirror school papers.</p>
  </section>

  <a class="school-papers-back" href={siteBase + '/materials/'}>Browse the Materials Library <span aria-hidden="true">↗</span></a>
</main>

<style>
  .school-papers-page { max-width: 1120px; padding-block: 48px 90px; }
  .school-papers-heading { max-width: 780px; margin-bottom: 30px; }
  .school-papers-heading h1 { margin: 15px 0 12px; color: #f1f5f9; font: 500 clamp(34px, 5vw, 52px)/1.08 var(--serif); letter-spacing: -1.2px; }
  .school-papers-heading > p:last-child { max-width: 690px; color: #a6b3c6; font-size: 14px; line-height: 1.8; }
  .prelims-library { padding: clamp(18px, 3vw, 30px); background: #101a2b; border: 1px solid #263750; border-bottom: 2px solid #334766; border-radius: 12px; }
  .prelims-library-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
  .prelims-kicker, .school-papers-kicker { color: #73d6b0; font-size: 9px; font-weight: 850; letter-spacing: 1.4px; }
  .prelims-library-heading h2, .school-papers-collection h2 { margin: 10px 0 8px; color: #f1f5f9; font: 500 clamp(24px, 3vw, 32px)/1.2 var(--serif); }
  .prelims-library-heading p, .school-papers-collection p, .school-papers-guidance p { max-width: 720px; color: #a6b3c6; font-size: 12px; line-height: 1.8; }
  .prelims-count { flex: 0 0 auto; min-width: 104px; padding: 12px 14px; background: #16243a; border: 1px solid #2b3d59; border-radius: 8px; text-align: right; }
  .prelims-count strong { display: block; color: #f1f5f9; font-size: 24px; font-variant-numeric: tabular-nums; }
  .prelims-count span { color: #91a2bb; font-size: 10px; }
  .paper-type-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-bottom: 12px; }
  .paper-type-summary button { display: grid; gap: 5px; min-height: 68px; padding: 11px 12px; color: #a6b3c6; background: #0b1423; border: 1px solid #263750; border-radius: 7px; text-align: left; cursor: pointer; }
  .paper-type-summary button strong { color: #f1f5f9; font-size: 19px; font-variant-numeric: tabular-nums; }
  .paper-type-summary button span { font-size: 10px; line-height: 1.35; }
  .paper-type-summary button.active { border-color: #10b981; background: #132b2c; }
  .prelims-filters { display: grid; grid-template-columns: minmax(220px, 1.5fr) repeat(4, minmax(130px, 1fr)) auto; align-items: end; gap: 10px; padding: 14px; background: #0b1423; border: 1px solid #263750; border-radius: 9px; }
  .prelims-filters label { display: grid; gap: 6px; color: #aab8cb; font-size: 10px; font-weight: 700; }
  .prelims-search { display: flex !important; min-height: 42px; align-items: center; gap: 8px !important; padding: 0 11px; background: #16243a; border: 1px solid #354966; border-radius: 6px; color: #8da0bb !important; }
  .prelims-search > span { font-size: 22px; line-height: 1; }
  .prelims-search input { width: 100%; min-width: 0; border: 0; outline: 0; color: #f1f5f9; background: transparent; font: inherit; font-size: 12px; }
  .prelims-search input::placeholder { color: #7f91aa; }
  .prelims-filters select { width: 100%; min-height: 42px; padding: 0 10px; color: #e6edf7; background: #16243a; border: 1px solid #354966; border-radius: 6px; font-size: 11px; }
  .prelims-clear, .prelims-state button, .prelims-load-more button { min-height: 42px; padding: 0 14px; color: #c7f5e4; background: #15372f; border: 1px solid #286451; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; }
  .prelims-results { margin-top: 18px; }
  .prelims-results-bar { display: flex; justify-content: space-between; gap: 12px; margin: 0 0 12px; color: #9eafc5; font-size: 11px; }
  .prelims-results-bar strong { color: #f1f5f9; }
  .prelims-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); gap: 14px; }
  .prelim-card { min-width: 0; overflow: hidden; background: #142137; border: 1px solid #2a3b56; border-bottom: 2px solid #354968; border-radius: 9px; }
  .prelim-cover { position: relative; display: grid; min-height: 172px; place-items: center; overflow: hidden; background: #0c1728; border-bottom: 1px solid #2a3b56; }
  .prelim-cover img { width: 100%; height: 190px; object-fit: cover; background: #0c1728; }
  .prelim-cover-label { position: absolute; right: 9px; bottom: 8px; padding: 4px 6px; color: #d8e4f3; background: #0b1423e8; border: 1px solid #40516a; border-radius: 3px; font-size: 8px; font-weight: 800; letter-spacing: .8px; }
  .prelim-cover-fallback { display: flex; width: 100%; min-height: 172px; flex-direction: column; justify-content: space-between; padding: 18px; background: linear-gradient(145deg, #1d3451, #101b2c 70%); }
  .prelim-cover-fallback span { color: #8da8c8; font-size: 8px; font-weight: 850; letter-spacing: 1.1px; }
  .prelim-cover-fallback strong { max-width: 90%; color: #f1f5f9; font: 500 23px/1.15 var(--serif); }
  .prelim-cover-fallback small { color: #83d7b7; font-size: 10px; font-weight: 750; }
  .prelim-card-content { display: flex; min-height: 220px; flex-direction: column; padding: 14px; }
  .prelim-card-meta { display: flex; justify-content: space-between; gap: 8px; color: #7fddb9; font-size: 9px; font-weight: 800; }
  .prelim-card-meta span:last-child { color: #9baec7; text-align: right; }
  .prelim-card h3 { margin: 10px 0 6px; color: #f1f5f9; font-size: 14px; font-weight: 750; line-height: 1.45; overflow-wrap: anywhere; }
  .prelim-school { margin: 0; color: #c2cee0; font-size: 11px; font-weight: 700; }
  .prelim-scope, .prelim-credit { margin: 6px 0 0; color: #91a3bd; font-size: 10px; line-height: 1.5; }
  .prelim-rights { margin: 7px 0 0; color: #8fa0b7; font-size: 9px; line-height: 1.5; }
  .prelim-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: auto; padding-top: 13px; }
  .prelim-format { color: #9fb0c7; font-size: 9px; font-weight: 800; letter-spacing: .6px; }
  .prelim-card-footer a { display: inline-flex; min-height: 36px; align-items: center; gap: 8px; padding: 0 11px; color: #06281e; background: #10b981; border: 1px solid #0da271; border-radius: 5px; font-size: 10px; font-weight: 850; }
  .prelim-card-footer a:hover { background: #34d399; }
  .prelims-state { display: grid; min-height: 190px; place-content: center; justify-items: center; padding: 24px; color: #e7edf6; text-align: center; }
  .prelims-state strong { font-size: 15px; }
  .prelims-state p { max-width: 520px; color: #9eafc5; font-size: 11px; line-height: 1.7; }
  .prelims-spinner { width: 22px; height: 22px; margin-bottom: 12px; border: 2px solid #324761; border-top-color: #10b981; border-radius: 50%; animation: prelim-spin .8s linear infinite; }
  @keyframes prelim-spin { to { transform: rotate(360deg); } }
  .prelims-load-more { display: flex; justify-content: center; padding-top: 20px; }
  .prelims-rights-note { margin: 16px 0 0; color: #8fa0b7; font-size: 10px; line-height: 1.7; }
  .school-papers-collection { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 20px; padding: clamp(22px, 4vw, 32px); background: #141e30; border: 1px solid #263750; border-radius: 10px; }
  .school-papers-collection > div { max-width: 740px; }
  .school-papers-collection h2 { margin-top: 10px; }
  .school-papers-collection a { display: inline-flex; min-height: 42px; align-items: center; gap: 10px; margin-top: 8px; color: #73d6b0; font-size: 11px; font-weight: 800; }
  .school-papers-collection-mark { flex: 0 0 auto; display: grid; width: 76px; height: 76px; place-content: center; border: 1px solid #2d4b5a; border-radius: 8px; color: #73d6b0; background: #132b2c; font-size: 10px; font-weight: 850; line-height: 1.5; text-align: center; letter-spacing: .7px; }
  .school-papers-guidance { margin-top: 28px; padding: 24px 0; border-top: 1px solid #263750; border-bottom: 1px solid #263750; }
  .school-papers-guidance h2 { margin: 0 0 12px; color: #f1f5f9; font: 500 23px/1.25 var(--serif); }
  .school-papers-page a:focus-visible, .school-papers-page button:focus-visible, .school-papers-page input:focus-visible, .school-papers-page select:focus-visible { outline: 3px solid #10b981; outline-offset: 3px; }
  .school-papers-back { display: inline-flex; min-height: 44px; align-items: center; gap: 8px; margin-top: 22px; color: #73d6b0; font-size: 11px; font-weight: 800; }
  @media (max-width: 820px) {
    .prelims-filters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .paper-type-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .prelims-search { grid-column: 1 / -1; }
  }
  @media (max-width: 560px) {
    .prelims-library-heading { flex-direction: column; }
    .paper-type-summary { grid-template-columns: 1fr 1fr; }
    .prelims-count { min-width: 0; text-align: left; }
    .prelims-filters { grid-template-columns: 1fr; }
    .prelims-search { grid-column: auto; }
    .school-papers-collection { align-items: flex-start; }
    .school-papers-collection-mark { width: 60px; height: 60px; font-size: 9px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .prelims-spinner { animation: none; }
  }
</style>
