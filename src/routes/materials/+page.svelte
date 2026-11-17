<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';
  import { filterResources, formatResourceTitle, formatResourceType, getResourcePreviewUrl, getResourceActionLabel, type Creator, type Resource, type Subject, type Chapter } from '#lib/catalogue.ts';

  let resources: Resource[] = [];
  let creators: Creator[] = [];
  let subjects: Subject[] = [];
  let chapters: Chapter[] = [];
  let query = '';
  let subjectId = '';
  let chapterId = '';
  let creatorId = '';
  let resourceType = '';
  let sort: 'relevance' | 'alphabetical' | 'recent' = 'relevance';
  let viewMode: 'grid' | 'list' = 'grid';
  let loading = true;
  let loadError = false;
  let filtered: Resource[] = [];
  let failedPreviewIds: string[] = [];
  let activePreview: Resource | null = null;
  let previewDialog: HTMLDialogElement;

  function markPreviewFailed(resourceId: string) {
    failedPreviewIds = failedPreviewIds.includes(resourceId) ? failedPreviewIds : [...failedPreviewIds, resourceId];
  }

  function openPreview(resource: Resource) {
    activePreview = resource;
    if (previewDialog && !previewDialog.open) previewDialog.showModal();
  }

  function closePreview() {
    if (previewDialog?.open) previewDialog.close();
    activePreview = null;
  }

  $: filtered = filterResources(resources, query, { subjectId, chapterId, creatorId, resourceType, sort }, creators, subjects, chapters);
  $: availableChapters = chapters.filter((chapter) => !subjectId || chapter.subjectId === subjectId);
  $: creatorById = new Map(creators.map((creator) => [creator.id, creator]));

  async function loadCatalogue() {
    loading = true;
    loadError = false;
    try {
      const [resourceResponse, creatorResponse, subjectResponse, chapterResponse] = await Promise.all([
        fetch(siteBase + '/data/resources.json'), fetch(siteBase + '/data/creators.json'),
        fetch(siteBase + '/data/subjects.json'), fetch(siteBase + '/data/chapters.json')
      ]);
      if (![resourceResponse, creatorResponse, subjectResponse, chapterResponse].every((response) => response.ok)) throw new Error('Catalogue data unavailable');
      const [resourceData, creatorData, subjectData, chapterData] = await Promise.all([resourceResponse.json(), creatorResponse.json(), subjectResponse.json(), chapterResponse.json()]);
      if (![resourceData, creatorData, subjectData, chapterData].every(Array.isArray)) throw new Error('Catalogue data format invalid');
      resources = resourceData.filter((item: Resource) => item.status === 'published');
      creators = creatorData.filter((item: Creator) => item.status === 'published');
      subjects = subjectData.filter((item: Subject) => item.status === 'published');
      chapters = chapterData.filter((item: Chapter) => item.status === 'published');
    } catch {
      loadError = true;
    } finally {
      loading = false;
    }
  }

  function applyQuickFilter(searchTerm: string) {
    creatorId = 'cisce';
    subjectId = '';
    chapterId = '';
    resourceType = '';
    query = searchTerm;
    sort = 'relevance';
  }

  function clearFilters() {
    query = ''; subjectId = ''; chapterId = ''; creatorId = ''; resourceType = ''; sort = 'relevance';
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    query = params.get('q') ?? '';
    void loadCatalogue();
  });
</script>

<svelte:head>
  <title>Materials Library | ICSE Compass</title>
  <meta name="description" content="Browse ICSE notes, question papers, chapter resources and video lessons with visual previews and original-source links." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/materials/" />
  <meta property="og:title" content="Materials Library | ICSE Compass" />
  <meta property="og:description" content="A visual ICSE resource library with source-linked previews, subject filters and educator collections." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/materials/" />
</svelte:head>

<main class="page-content catalogue-page catalogue-v2">
  <header class="page-heading catalogue-heading-v2">
    <div>
      <p class="eyebrow"><span class="eyebrow-rule"></span> THE ICSE RESOURCE LIBRARY / 01</p>
      <h1>Materials Library</h1>
      <p class="page-intro">A visual shelf of notes, papers, videos and learning resources. Browse by subject, inspect available previews and follow every resource to its original source.</p>
    </div>
    <aside class="catalogue-count-panel">
      <span>THE COLLECTION</span>
      <strong>{loading ? '—' : resources.length.toLocaleString('en-IN')}</strong>
      <small>published resources</small>
    </aside>
  </header>

  <section class="catalogue-tools catalogue-tools-v2" aria-label="Search and filter resources">
    <label class="search-row search-row-v2" for="resource-search">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      <input id="resource-search" type="search" bind:value={query} placeholder="Search notes, chapters, topics or educators…" autocomplete="off" />
      <span class="search-hint">SEARCH THE LIBRARY</span>
    </label>
    <div class="catalogue-quick-filters" aria-label="Quick access to official CISCE resources">
      <span class="quick-filter-label">QUICK ACCESS</span>
      <button type="button" aria-pressed={creatorId === 'cisce' && query === ''} onclick={() => applyQuickFilter('')}>All CISCE resources</button>
      <button type="button" aria-pressed={creatorId === 'cisce' && query === 'PYQ'} onclick={() => applyQuickFilter('PYQ')}>Board papers</button>
      <button type="button" aria-pressed={creatorId === 'cisce' && query === 'Specimen'} onclick={() => applyQuickFilter('Specimen')}>Specimen papers</button>
      <button type="button" aria-pressed={creatorId === 'cisce' && query === 'CFQ'} onclick={() => applyQuickFilter('CFQ')}>CFQs</button>
      <button type="button" aria-pressed={creatorId === 'cisce' && query === 'Syllabus'} onclick={() => applyQuickFilter('Syllabus')}>Syllabus</button>
    </div>
    <div class="filter-heading"><span>REFINE YOUR SEARCH</span><span>SUBJECT / CHAPTER / SOURCE / FORMAT</span></div>
    <div class="filter-grid">
      <label>Subject
        <select value={subjectId} onchange={(event) => { subjectId = (event.currentTarget as HTMLSelectElement).value; chapterId = ''; }}><option value="">All subjects</option>{#each subjects as subject}<option value={subject.id}>{subject.name}</option>{/each}</select>
      </label>
      <label>Chapter
        <select bind:value={chapterId}><option value="">All chapters</option>{#each availableChapters as chapter}<option value={chapter.id}>{chapter.name}</option>{/each}</select>
      </label>
      <label>Educator / source
        <select bind:value={creatorId}><option value="">All educators</option>{#each creators as creator}<option value={creator.id}>{creator.name}</option>{/each}</select>
      </label>
      <label>Resource type
        <select bind:value={resourceType}><option value="">All types</option><option value="pdf">PDF</option><option value="video">Video</option><option value="website">Website</option><option value="notes">Notes</option><option value="practice-paper">Practice paper</option><option value="other">Other</option></select>
      </label>
      <label>Sort by
        <select bind:value={sort}><option value="relevance">Relevance</option><option value="alphabetical">A–Z</option><option value="recent">Recently updated</option></select>
      </label>
    </div>
    <div class="results-toolbar results-toolbar-v2">
      <span aria-live="polite">{#if loading}Loading catalogue…{:else if loadError}Catalogue unavailable{:else}<strong>{filtered.length}</strong> {filtered.length === 1 ? 'resource' : 'resources'} found{/if}</span>
      <div class="results-actions">
        <div class="view-switch" aria-label="Choose resource layout">
          <button type="button" aria-pressed={viewMode === 'grid'} onclick={() => viewMode = 'grid'}>Grid</button>
          <button type="button" aria-pressed={viewMode === 'list'} onclick={() => viewMode = 'list'}>List</button>
        </div>
        <button type="button" class="clear-button" onclick={clearFilters}>Clear filters ↺</button>
      </div>
    </div>
  </section>

  {#if loading}
    <div class="catalogue-state" role="status"><span class="state-spinner" aria-hidden="true"></span><span class="state-kicker">PLEASE WAIT</span><strong>Opening the resource shelves</strong><p>Fetching the latest approved public catalogue.</p></div>
  {:else if loadError}
    <div class="catalogue-state" role="alert"><span class="state-kicker">CONNECTION ISSUE</span><strong>The catalogue couldn't be loaded.</strong><p>Check your connection and try again. Your saved syllabus progress is not affected by a catalogue refresh.</p><button type="button" class="retry-button" onclick={loadCatalogue}>Try again</button></div>
  {:else if filtered.length === 0}
    <div class="catalogue-state">
      <span class="state-kicker">{resources.length === 0 ? 'A LIBRARY IN THE MAKING' : 'NO MATCHES THIS TIME'}</span>
      <strong>{resources.length === 0 ? 'The library is being prepared.' : 'No matching resources found.'}</strong>
      <p>{resources.length === 0 ? 'No verified resources have been published yet. Approved listings will appear here as they become available.' : 'Try a different search term or remove one or more filters to broaden your results.'}</p>
      {#if resources.length > 0}<button type="button" class="retry-button" onclick={clearFilters}>Clear search and filters</button>{/if}
    </div>
  {:else}
    <div class="resource-shelf-heading"><div><span>THE COLLECTION</span><strong>{query ? 'Search results' : subjectId ? (subjects.find((subject) => subject.id === subjectId)?.name ?? 'Subject resources') : 'Explore all resources'}</strong></div><small>Preview images load from the original source when available.</small></div>
    <div class="resource-grid" class:list-view={viewMode === 'list'}>
      {#each filtered as resource (resource.id)}
        {@const displayTitle = formatResourceTitle(resource.title)}
        {@const subjectName = subjects.find((subject) => subject.id === resource.subjectId)?.name ?? 'General'}
        {@const originalSource = resource.creatorId ? creatorById.get(resource.creatorId)?.name : undefined}
        {@const previewUrl = getResourcePreviewUrl(resource)}
        {@const previewFailed = failedPreviewIds.includes(resource.id)}
        {@const actionLabel = getResourceActionLabel(resource, displayTitle.extension)}
        <article class={'resource-card resource-card-v2 subject-' + (resource.subjectId ?? 'general')}>
          <div class="resource-cover" aria-label="Resource cover preview">
            {#if previewUrl && !previewFailed}
              <img class="resource-cover-image" src={previewUrl} alt={'Preview image for ' + displayTitle.title} loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror={() => markPreviewFailed(resource.id)} />
              <span class="cover-source-label">SOURCE PREVIEW</span>
            {:else}
              <div class="resource-cover-art" aria-hidden="true">
                <span class="cover-brand">ICSE COMPASS / RESOURCE INDEX</span>
                <span class="cover-format">{displayTitle.extension ?? formatResourceType(resource.resourceType)}</span>
                <strong>{displayTitle.title}</strong>
                <span class="cover-subject">{subjectName}</span>
                <span class="cover-lines"></span>
              </div>
              <span class="cover-source-label">{previewFailed ? 'SOURCE PREVIEW UNAVAILABLE' : 'COVER-STYLE FALLBACK'}</span>
            {/if}
            <button type="button" class="cover-preview-button" onclick={() => openPreview(resource)} aria-label={'Preview ' + displayTitle.title}>Preview <span aria-hidden="true">↗</span></button>
          </div>
          <div class="resource-card-content">
            <div class="resource-card-top">
              <span class="resource-subject">{subjectName}</span>
              <span class="resource-format">{displayTitle.extension ?? formatResourceType(resource.resourceType)}</span>
            </div>
            <h2>{displayTitle.title}</h2>
            {#if resource.description}<p class="resource-description">{resource.description}</p>{/if}
            <div class="resource-byline">
              <span>By <strong>{originalSource ?? 'Original publisher'}</strong></span>
              {#if resource.chapterId}<span class="metadata-separator" aria-hidden="true">•</span><span>{chapters.find((chapter) => chapter.id === resource.chapterId)?.name ?? 'Chapter'}</span>{/if}
            </div>
            <details class="resource-details">
              <summary><span>Resource details</span><span class="details-hint">Format &amp; source</span></summary>
              <dl>
                <div><dt>Subject</dt><dd>{subjectName}</dd></div>
                <div><dt>Resource type</dt><dd>{formatResourceType(resource.resourceType)}</dd></div>
                <div><dt>File format</dt><dd>{displayTitle.extension ?? 'Not specified'}</dd></div>
                <div><dt>Original source</dt><dd>{originalSource ?? 'Not listed'}</dd></div>
                <div><dt>Access</dt><dd>{resource.accessMethod === 'hosted' ? 'Hosted with permission' : resource.accessMethod === 'embed' ? 'Permitted external embed' : 'Opens at the original source'}</dd></div>
                {#if resource.fileSizeBytes}<div><dt>File size</dt><dd>{(resource.fileSizeBytes / 1048576).toFixed(2)} MB</dd></div>{/if}
                {#if resource.pageCount}<div><dt>Pages</dt><dd>{resource.pageCount}</dd></div>{/if}
                {#if resource.updatedAt}<div><dt>Updated</dt><dd>{resource.updatedAt}</dd></div>{/if}
              </dl>
            </details>
            <div class="resource-card-actions">
              <button type="button" class="resource-preview-action" onclick={() => openPreview(resource)}>Preview details</button>
              <a class="resource-link" href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">{actionLabel} <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}

  <p class="catalogue-note"><strong>Source first.</strong> ICSE Compass is an independent discovery index. Third-party materials remain with their original publishers unless hosting permission has been granted. A preview image is not a substitute for the original document.</p>
  <a class="text-link" href={siteBase + '/'}>← Return to overview</a>

  <dialog class="resource-preview-dialog" bind:this={previewDialog} onclose={() => { activePreview = null; }} onclick={(event) => { if (event.target === previewDialog) closePreview(); }}>
    {#if activePreview}
      {@const previewTitle = formatResourceTitle(activePreview.title)}
      {@const previewImage = getResourcePreviewUrl(activePreview)}
      {@const previewResourceId = activePreview.id}
      <div class="preview-dialog-shell">
        <div class="preview-dialog-header"><div><span>ICSE COMPASS / RESOURCE PREVIEW</span><h2>{previewTitle.title}</h2></div><button type="button" class="preview-dialog-close" onclick={closePreview} aria-label="Close preview">×</button></div>
        <div class="preview-dialog-body">
          <div class="preview-dialog-image">
            {#if previewImage && !failedPreviewIds.includes(activePreview.id)}
              <img src={previewImage} alt={'Source preview for ' + previewTitle.title} onerror={() => markPreviewFailed(previewResourceId)} />
              <span>Preview image supplied by the original source</span>
            {:else}
              <div class="resource-cover-art dialog-cover-art"><span class="cover-brand">ICSE COMPASS / RESOURCE INDEX</span><span class="cover-format">{previewTitle.extension ?? formatResourceType(activePreview.resourceType)}</span><strong>{previewTitle.title}</strong><span class="cover-subject">{subjects.find((subject) => subject.id === activePreview!.subjectId)?.name ?? 'General'}</span></div>
              <p>No source thumbnail is available for this resource. The full item opens at its original publisher.</p>
            {/if}
          </div>
          <aside class="preview-dialog-info">
            <span class="preview-info-kicker">RESOURCE INFORMATION</span>
            <dl>
              <div><dt>Subject</dt><dd>{subjects.find((subject) => subject.id === activePreview!.subjectId)?.name ?? 'General'}</dd></div>
              <div><dt>Format</dt><dd>{previewTitle.extension ?? formatResourceType(activePreview.resourceType)}</dd></div>
              <div><dt>Original source</dt><dd>{activePreview.creatorId ? creatorById.get(activePreview.creatorId)?.name ?? 'Original publisher' : 'Original publisher'}</dd></div>
              {#if activePreview.pageCount}<div><dt>Pages</dt><dd>{activePreview.pageCount}</dd></div>{/if}
              {#if activePreview.fileSizeBytes}<div><dt>File size</dt><dd>{(activePreview.fileSizeBytes / 1048576).toFixed(2)} MB</dd></div>{/if}
            </dl>
            {#if activePreview.description}<p>{activePreview.description}</p>{/if}
            <a class="preview-open-source" href={activePreview.sourceUrl} target="_blank" rel="noopener noreferrer">{getResourceActionLabel(activePreview, previewTitle.extension)} at original source <span aria-hidden="true">↗</span></a>
            <small>Compass displays source thumbnails where available. Full documents remain with their original publishers unless hosting permission has been granted.</small>
          </aside>
        </div>
      </div>
    {/if}
  </dialog>
</main>