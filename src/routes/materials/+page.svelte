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
  let loading = true;
  let loadError = false;
  let filtered: Resource[] = [];
  let openedPreviewIds: string[] = [];
  let failedPreviewIds: string[] = [];

  function showPreview(resourceId: string) {
    openedPreviewIds = openedPreviewIds.includes(resourceId) ? openedPreviewIds : [...openedPreviewIds, resourceId];
  }

  function hidePreview(resourceId: string) {
    openedPreviewIds = openedPreviewIds.filter((id) => id !== resourceId);
  }

  function markPreviewFailed(resourceId: string) {
    failedPreviewIds = failedPreviewIds.includes(resourceId) ? failedPreviewIds : [...failedPreviewIds, resourceId];
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
  <meta name="description" content="Search verified ICSE learning resources by subject, chapter, educator and resource type." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/materials/" />
  <meta property="og:title" content="Materials Library | ICSE Compass" />
  <meta property="og:description" content="Search verified ICSE learning resources by subject, chapter, educator and resource type." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/materials/" />
</svelte:head>

<main class="page-content catalogue-page">
  <header class="page-heading">
    <div>
      <p class="eyebrow"><span class="eyebrow-rule"></span> THE RESOURCE INDEX / 01</p>
      <h1>Materials Library</h1>
      <p class="page-intro">A searchable collection of learning resources, organised to help you get to the right subject, chapter and source without the extra digging.</p>
    </div>
    <aside class="heading-aside"><strong>OUR APPROACH</strong>Every listing identifies its original source. Hosted files are published only where permission allows.</aside>
  </header>

  <section class="catalogue-tools" aria-label="Search and filter resources">
    <label class="search-row" for="resource-search">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      <input id="resource-search" type="search" bind:value={query} placeholder="Search notes, chapters, topics or educators…" autocomplete="off" />
    </label>
    <div class="filter-heading"><span>REFINE YOUR SEARCH</span><span>FILTERS / 05</span></div>
    <div class="filter-grid">
      <label>Subject
        <select value={subjectId} onchange={(event) => { subjectId = (event.currentTarget as HTMLSelectElement).value; chapterId = ''; }}><option value="">All subjects</option>{#each subjects as subject}<option value={subject.id}>{subject.name}</option>{/each}</select>
      </label>
      <label>Chapter
        <select bind:value={chapterId}><option value="">All chapters</option>{#each availableChapters as chapter}<option value={chapter.id}>{chapter.name}</option>{/each}</select>
      </label>
      <label>Educator
        <select bind:value={creatorId}><option value="">All educators</option>{#each creators as creator}<option value={creator.id}>{creator.name}</option>{/each}</select>
      </label>
      <label>Resource type
        <select bind:value={resourceType}><option value="">All types</option><option value="pdf">PDF</option><option value="video">Video</option><option value="website">Website</option><option value="notes">Notes</option><option value="practice-paper">Practice paper</option><option value="other">Other</option></select>
      </label>
      <label>Sort by
        <select bind:value={sort}><option value="relevance">Relevance</option><option value="alphabetical">A–Z</option><option value="recent">Recently updated</option></select>
      </label>
    </div>
    <div class="results-toolbar">
      <span aria-live="polite">{#if loading}Loading catalogue…{:else if loadError}Catalogue unavailable{:else}<strong>{filtered.length}</strong> {filtered.length === 1 ? 'resource' : 'resources'} found{/if}</span>
      <button type="button" class="clear-button" onclick={clearFilters}>Clear filters ↺</button>
    </div>
  </section>

  {#if loading}
    <div class="catalogue-state" role="status"><span class="state-spinner" aria-hidden="true"></span><span class="state-kicker">PLEASE WAIT</span><strong>Opening the resource index</strong><p>Fetching the latest approved public catalogue.</p></div>
  {:else if loadError}
    <div class="catalogue-state" role="alert"><span class="state-kicker">CONNECTION ISSUE</span><strong>The catalogue couldn't be loaded.</strong><p>Check your connection and try again. Public catalogue data may be available from a previous visit if it has been cached.</p><button type="button" class="retry-button" onclick={loadCatalogue}>Try again</button></div>
  {:else if filtered.length === 0}
    <div class="catalogue-state">
      <span class="state-kicker">{resources.length === 0 ? 'A LIBRARY IN THE MAKING' : 'NO MATCHES THIS TIME'}</span>
      <strong>{resources.length === 0 ? 'The library is being prepared.' : 'No matching resources found.'}</strong>
      <p>{resources.length === 0 ? 'No verified resources have been published yet. Approved listings will appear here as they become available.' : 'Try a different search term or remove one or more filters to broaden your results.'}</p>
      {#if resources.length > 0}<button type="button" class="retry-button" onclick={clearFilters}>Clear search and filters</button>{/if}
    </div>
  {:else}
    <p class="resource-grid-intro">Start with the subject and file type. Select <strong>Show preview</strong> to load a thumbnail from the original source, or open the full resource.</p>
    <div class="resource-grid">
      {#each filtered as resource (resource.id)}
        {@const displayTitle = formatResourceTitle(resource.title)}
        {@const subjectName = subjects.find((subject) => subject.id === resource.subjectId)?.name ?? 'General'}
        {@const originalSource = resource.creatorId ? creatorById.get(resource.creatorId)?.name : undefined}
        {@const previewUrl = getResourcePreviewUrl(resource)}
        {@const actionLabel = getResourceActionLabel(resource, displayTitle.extension)}
        <article class="resource-card">
          <div class="resource-card-top">
            <span class="resource-subject">{subjectName}</span>
            <span class="resource-format" aria-label={displayTitle.extension ? `${displayTitle.extension} file` : `Resource type: ${resource.resourceType}`}>{displayTitle.extension ?? formatResourceType(resource.resourceType)}</span>
          </div>

          <div class="resource-preview" aria-label="Resource preview area">
            {#if openedPreviewIds.includes(resource.id)}
              {#if failedPreviewIds.includes(resource.id)}
                <div class="resource-preview-fallback" role="status">
                  <span class="preview-file-icon">{displayTitle.extension ?? formatResourceType(resource.resourceType)}</span>
                  <span>Preview unavailable. Open the original file to view it.</span>
                </div>
              {:else if previewUrl}
                <img class="resource-preview-image" src={previewUrl} alt={`Thumbnail preview for ${displayTitle.title}`} loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror={() => markPreviewFailed(resource.id)} />
                <span class="preview-origin">Thumbnail from original source</span>
              {/if}
              <button type="button" class="preview-toggle preview-toggle-open" onclick={() => hidePreview(resource.id)}>Hide preview</button>
            {:else}
              <div class="resource-preview-placeholder">
                <span class="preview-file-icon" aria-hidden="true">{displayTitle.extension ?? formatResourceType(resource.resourceType)}</span>
                <span class="preview-copy"><strong>File preview</strong><small>{previewUrl ? 'Load a thumbnail from the original file' : 'No thumbnail is available for this resource yet'}</small></span>
              </div>
              {#if previewUrl}
                <button type="button" class="preview-toggle" onclick={() => showPreview(resource.id)}>Show preview</button>
              {:else}
                <span class="preview-unavailable">Preview not available</span>
              {/if}
            {/if}
          </div>

          <h2>{displayTitle.title}</h2>
          {#if resource.description}<p class="resource-description">{resource.description}</p>{/if}
          <div class="resource-byline">
            <span>From <strong>{originalSource ?? 'Original publisher'}</strong></span>
            {#if resource.chapterId}<span class="metadata-separator" aria-hidden="true">•</span><span>{chapters.find((chapter) => chapter.id === resource.chapterId)?.name ?? 'Chapter'}</span>{/if}
          </div>

          <details class="resource-details">
            <summary><span>More details</span><span class="details-hint">File information</span></summary>
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

          <a class="resource-link" href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">
            {actionLabel} <span aria-hidden="true">↗</span>
          </a>
        </article>
      {/each}
    </div>
  {/if}

  <p class="catalogue-note"><strong>Source first.</strong> ICSE Compass is an independent discovery index. Third-party materials remain with their original publishers unless hosting permission has been granted.</p>
  <a class="text-link" href="{siteBase}/">← Return to overview</a>
</main>
