<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';
  import { filterResources, type Creator, type Resource, type Subject, type Chapter } from '#lib/catalogue';
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
  $: filtered = filterResources(resources, query, { subjectId, chapterId, creatorId, resourceType, sort }, creators);
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
  function clearFilters() { query = ''; subjectId = ''; chapterId = ''; creatorId = ''; resourceType = ''; sort = 'relevance'; }
  onMount(loadCatalogue);
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
  <p class="eyebrow">ICSE COMPASS · MATERIALS</p>
  <h1>Materials Library</h1>
  <p class="catalogue-intro">Find learning resources by subject, chapter, educator or format. Every listing identifies its original source.</p>
  <section class="catalogue-tools" aria-label="Search and filter resources">
    <label class="search-label" for="resource-search">Search the library</label>
    <input id="resource-search" class="catalogue-search" type="search" bind:value={query} placeholder="Search notes, chapters, topics or educators..." autocomplete="off" />
    <div class="filter-grid">
      <label>Subject
        <select bind:value={subjectId}><option value="">All subjects</option>{#each subjects as subject}<option value={subject.id}>{subject.name}</option>{/each}</select>
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
    <div class="results-toolbar"><span aria-live="polite">{#if loading}Loading catalogue…{:else if loadError}Catalogue unavailable{:else}{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}{/if}</span><button type="button" class="clear-button" onclick={clearFilters}>Clear filters</button></div>
  </section>
  {#if loading}
    <div class="catalogue-state" role="status"><span class="state-spinner" aria-hidden="true"></span><strong>Loading verified resources</strong><p>Fetching the latest public catalogue.</p></div>
  {:else if loadError}
    <div class="catalogue-state" role="alert"><strong>We couldn't load the catalogue.</strong><p>Check your connection and try again. Previously cached catalogue data may be available offline.</p><button type="button" class="retry-button" onclick={loadCatalogue}>Try again</button></div>
  {:else if filtered.length === 0}
    <div class="catalogue-state"><strong>{resources.length === 0 ? 'The library is being prepared.' : 'No matching resources found.'}</strong><p>{resources.length === 0 ? 'No verified resources have been published yet. New approved listings will appear here.' : 'Try another search or remove one or more filters.'}</p>{#if resources.length > 0}<button type="button" class="retry-button" onclick={clearFilters}>Clear search and filters</button>{/if}</div>
  {:else}
    <div class="resource-grid">
      {#each filtered as resource (resource.id)}
        <article class="resource-card">
          <div class="resource-meta"><span>{resource.resourceType.replace('-', ' ')}</span>{#if resource.subjectId}<span>{subjects.find((subject) => subject.id === resource.subjectId)?.name ?? 'Subject'}</span>{/if}</div>
          <h2>{resource.title}</h2>
          {#if resource.description}<p>{resource.description}</p>{/if}
          <div class="resource-byline">{#if resource.creatorId && creatorById.has(resource.creatorId)}By {creatorById.get(resource.creatorId)?.name}{:else}Original source{/if}{#if resource.chapterId}<span> · {chapters.find((chapter) => chapter.id === resource.chapterId)?.name ?? 'Chapter'}</span>{/if}</div>
          <details class="resource-details"><summary>Resource details</summary><dl><div><dt>Format</dt><dd>{resource.resourceType.replace('-', ' ')}</dd></div><div><dt>Access</dt><dd>{resource.accessMethod === 'hosted' ? 'Hosted with permission' : resource.accessMethod === 'embed' ? 'Permitted embed' : 'Original external source'}</dd></div>{#if resource.fileSizeBytes}<div><dt>File size</dt><dd>{(resource.fileSizeBytes / 1048576).toFixed(2)} MB</dd></div>{/if}{#if resource.pageCount}<div><dt>Pages</dt><dd>{resource.pageCount}</dd></div>{/if}{#if resource.updatedAt}<div><dt>Updated</dt><dd>{resource.updatedAt}</dd></div>{/if}</dl></details>
          <a class="resource-link" href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">{resource.accessMethod === 'hosted' ? 'Open authorised resource' : resource.accessMethod === 'embed' ? 'Open permitted resource' : 'Visit original source'} <span aria-hidden="true">↗</span></a>
        </article>
      {/each}
    </div>
  {/if}
  <a class="text-link catalogue-back" href="{siteBase}/">← Return to overview</a>
</main>
<style>
.catalogue-page{padding:76px 0 90px;min-height:65vh}.catalogue-page h1{margin:18px 0 10px;font:500 clamp(38px,5vw,58px)/1.1 Georgia,serif}.catalogue-intro{max-width:650px;color:#6e7269;font-size:14px;line-height:1.8}.catalogue-tools{margin:32px 0 25px;padding:22px;background:#fffdf8;border:1px solid #dcd5c7;border-radius:10px}.search-label,.filter-grid label{display:flex;flex-direction:column;gap:8px;color:#50574f;font-size:11px;font-weight:700}.catalogue-search,.filter-grid select{width:100%;min-height:46px;padding:0 12px;border:1px solid #d5d2c8;border-radius:5px;background:white;color:#252923;font:inherit;font-size:13px}.catalogue-search{margin:8px 0 17px}.filter-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.results-toolbar{display:flex;align-items:center;justify-content:space-between;margin-top:18px;color:#6f756b;font-size:11px}.clear-button,.retry-button{min-height:40px;padding:0 13px;border:1px solid #b9c8b9;border-radius:4px;background:#f3f5ef;color:#356b58;font-size:11px;font-weight:700;cursor:pointer}.catalogue-state{display:flex;min-height:190px;flex-direction:column;align-items:center;justify-content:center;padding:28px;text-align:center;border:1px dashed #cfc8b9;border-radius:10px;background:#faf8f2}.catalogue-state strong{font:500 21px Georgia,serif}.catalogue-state p{max-width:420px;color:#73776e;font-size:12px;line-height:1.7}.state-spinner{width:22px;height:22px;margin-bottom:13px;border:2px solid #d6ddd2;border-top-color:#356b58;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.resource-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.resource-card{display:flex;min-width:0;flex-direction:column;padding:20px;background:#fff;border:1px solid #dcd5c7;border-radius:9px}.resource-meta{display:flex;flex-wrap:wrap;gap:7px}.resource-meta span{padding:5px 8px;border-radius:3px;background:#eef1e9;color:#526b57;font-size:9px;text-transform:capitalize}.resource-card h2{margin:16px 0 7px;font:500 20px Georgia,serif}.resource-card>p{margin:0;color:#70756c;font-size:12px;line-height:1.7}.resource-byline{margin-top:12px;color:#73776e;font-size:10px}.resource-details{margin-top:16px;border-top:1px solid #e7e2d8;border-bottom:1px solid #e7e2d8}.resource-details summary{min-height:42px;padding:13px 0;color:#356b58;font-size:11px;font-weight:700;cursor:pointer}.resource-details dl{margin:0 0 12px}.resource-details dl div{display:flex;justify-content:space-between;gap:12px;padding:5px 0;font-size:10px}.resource-details dt{color:#777b72}.resource-details dd{margin:0;color:#343b34;text-align:right;text-transform:capitalize}.resource-link{display:flex;align-items:center;justify-content:space-between;min-height:44px;margin-top:auto;padding-top:12px;color:#356b58;font-size:11px;font-weight:800}.catalogue-back{margin-top:24px}@media(max-width:720px){.catalogue-page{padding-top:54px}.catalogue-tools{padding:15px}.filter-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.resource-grid{grid-template-columns:1fr}.resource-card{padding:17px}}@media(max-width:380px){.filter-grid{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.state-spinner{animation:none}}
</style>
