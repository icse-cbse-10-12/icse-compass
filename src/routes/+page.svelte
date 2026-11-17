<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { siteBase } from '#lib/site.ts';
  import type { Resource, Subject } from '#lib/catalogue.ts';
  import { formatResourceTitle, formatResourceType } from '#lib/catalogue.ts';

  let searchQuery = $state('');
  let resources = $state<Resource[]>([]);
  let subjects = $state<Subject[]>([]);
  let loading = $state(true);
  let loadError = $state(false);

  let subjectCards = $derived(subjects.map((subject) => ({
    ...subject,
    count: resources.filter((resource) => resource.subjectId === subject.id).length
  })));
  let sampleResources = $derived(resources.slice(0, 3));

  function handleSearch(event: SubmitEvent) {
    event.preventDefault();
    const query = searchQuery.trim();
    void goto(query ? siteBase + '/materials/?q=' + encodeURIComponent(query) : siteBase + '/materials/');
  }

  async function loadHomeData() {
    loading = true;
    loadError = false;
    try {
      const [resourceResponse, subjectResponse] = await Promise.all([
        fetch(siteBase + '/data/resources.json'),
        fetch(siteBase + '/data/subjects.json')
      ]);
      if (!resourceResponse.ok || !subjectResponse.ok) throw new Error('Library data unavailable');
      const [resourceData, subjectData] = await Promise.all([resourceResponse.json(), subjectResponse.json()]);
      if (!Array.isArray(resourceData) || !Array.isArray(subjectData)) throw new Error('Library data is invalid');
      resources = resourceData.filter((item: Resource) => item.status === 'published');
      subjects = subjectData.filter((item: Subject) => item.status === 'published').sort((a: Subject, b: Subject) => a.sortOrder - b.sortOrder);
    } catch {
      loadError = true;
    } finally {
      loading = false;
    }
  }

  onMount(() => { void loadHomeData(); });
</script>

<svelte:head>
  <title>ICSE Compass | Your independent ICSE study library</title>
  <meta name="description" content="Discover ICSE notes, question papers, videos and learning resources by subject, chapter and educator with ICSE Compass." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/" />
  <meta property="og:title" content="ICSE Compass | Your independent ICSE study library" />
  <meta property="og:description" content="A visual, searchable library for ICSE learners. Find notes, papers, videos and original educator sources." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/" />
</svelte:head>

<main class="home-page home-v2">
  <section class="home-hero-v2 page-width" aria-labelledby="home-title">
    <div class="home-hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span> THE INDEPENDENT ICSE STUDY LIBRARY</p>
      <h1 id="home-title">Everything you need to study.<br /><em>One shelf at a time.</em></h1>
      <p class="home-lede">Find notes, board papers, practice resources and lessons from educators — organised by subject, chapter and original source.</p>
      <form class="home-search-v2" onsubmit={handleSearch}>
        <label for="homepage-search">What are you studying today?</label>
        <div class="home-search-field-v2">
          <span aria-hidden="true" class="search-glyph">⌕</span>
          <input id="homepage-search" type="search" bind:value={searchQuery} placeholder="Search Physics, The Merchant of Venice, PYQs…" />
          <button type="submit">Search library <span aria-hidden="true">↗</span></button>
        </div>
      </form>
      <div class="home-hero-links">
        <a href={siteBase + '/materials/'}>Browse all resources <span aria-hidden="true">→</span></a>
        <a href={siteBase + '/school-papers/'}>Explore school papers <span aria-hidden="true">→</span></a>
      </div>
    </div>

    <aside class="home-library-panel" aria-label="ICSE Compass library overview">
      <div class="library-panel-top"><span>THE COMPASS COLLECTION</span><span>2026 / 27</span></div>
      <div class="library-panel-title"><span class="panel-star" aria-hidden="true">✳</span><div><strong>Your study shelf</strong><small>One organised place to begin.</small></div></div>
      <div class="library-stats">
        <div><strong>{loading ? '—' : resources.length.toLocaleString('en-IN')}</strong><span>PUBLIC RESOURCES</span></div>
        <div><strong>{loading ? '—' : subjects.length}</strong><span>SUBJECT AREAS</span></div>
      </div>
      <div class="library-shelf" aria-label="A sample of resources in the library">
        {#if loading}
          <div class="shelf-loading"><span></span><span></span><span></span></div>
        {:else if loadError}
          <div class="shelf-error"><strong>Library preview unavailable</strong><button type="button" onclick={loadHomeData}>Try again</button></div>
        {:else if sampleResources.length > 0}
          {#each sampleResources as resource, index (resource.id)}
            {@const title = formatResourceTitle(resource.title)}
            <a class={'shelf-book shelf-book-' + (index + 1)} href={siteBase + '/materials/?q=' + encodeURIComponent(title.title)} aria-label={'Find ' + title.title + ' in the library'}>
              <span class="shelf-book-type">{title.extension ?? formatResourceType(resource.resourceType)}</span>
              <strong>{title.title}</strong>
              <small>{subjects.find((subject) => subject.id === resource.subjectId)?.name ?? 'ICSE RESOURCE'}</small>
            </a>
          {/each}
        {:else}
          <div class="shelf-error"><strong>Approved resources will appear here.</strong></div>
        {/if}
      </div>
      <a class="panel-browse-link" href={siteBase + '/materials/'}>Enter the library <span aria-hidden="true">↗</span></a>
    </aside>
  </section>

  <section class="home-subject-section" aria-labelledby="subjects-title">
    <div class="page-width">
      <div class="home-section-heading">
        <div><p class="eyebrow"><span class="eyebrow-rule"></span> FIND YOUR SUBJECT</p><h2 id="subjects-title">Browse the shelves.</h2></div>
        <a href={siteBase + '/materials/'}>View the complete library <span aria-hidden="true">↗</span></a>
      </div>
      {#if loading}
        <div class="subject-grid-v2" aria-label="Loading subjects"><div class="subject-skeleton"></div><div class="subject-skeleton"></div><div class="subject-skeleton"></div><div class="subject-skeleton"></div></div>
      {:else if loadError}
        <div class="home-data-state" role="alert"><strong>Subjects could not be loaded.</strong><p>Check your connection and try again.</p><button type="button" onclick={loadHomeData}>Reload library</button></div>
      {:else}
        <div class="subject-grid-v2">
          {#each subjectCards as subject, index (subject.id)}
            <a class={'subject-tile subject-tile-' + ((index % 6) + 1)} href={siteBase + '/materials/?q=' + encodeURIComponent(subject.name)}>
              <span class="subject-tile-index">{String(index + 1).padStart(2, '0')}</span>
              <span class="subject-tile-mark" aria-hidden="true">{subject.name.slice(0, 2).toUpperCase()}</span>
              <strong>{subject.name}</strong>
              <small>{subject.count} {subject.count === 1 ? 'resource' : 'resources'} <span aria-hidden="true">↗</span></small>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <section class="home-discovery-section page-width" aria-labelledby="discovery-title">
    <div class="home-section-heading">
      <div><p class="eyebrow"><span class="eyebrow-rule"></span> WHAT DO YOU NEED?</p><h2 id="discovery-title">Go straight to the good stuff.</h2></div>
      <p>Choose a starting point. Refine your search once you reach the library.</p>
    </div>
    <div class="discovery-grid-v2">
      <a class="discovery-tile discovery-papers" href={siteBase + '/materials/?q=PYQ'}>
        <span class="discovery-number">01 / EXAM PREP</span><span class="discovery-symbol" aria-hidden="true">▤</span>
        <strong>Board papers &amp; specimen sets</strong><p>Past papers, specimen papers and competency-focused practice from original sources.</p><span class="discovery-link">Explore papers ↗</span>
      </a>
      <a class="discovery-tile discovery-notes" href={siteBase + '/materials/?q=Notes'}>
        <span class="discovery-number">02 / UNDERSTAND</span><span class="discovery-symbol" aria-hidden="true">▧</span>
        <strong>Notes &amp; chapter resources</strong><p>Find topic-wise explanations, revision material and chapter support.</p><span class="discovery-link">Find notes ↗</span>
      </a>
      <a class="discovery-tile discovery-lessons" href={siteBase + '/materials/?q=Video'}>
        <span class="discovery-number">03 / LEARN</span><span class="discovery-symbol" aria-hidden="true">▷</span>
        <strong>Video lessons &amp; educators</strong><p>Discover lessons and resource collections from credited educators.</p><span class="discovery-link">Watch &amp; learn ↗</span>
      </a>
    </div>
  </section>

  <section class="home-sample-section" aria-labelledby="sample-title">
    <div class="page-width home-sample-inner">
      <div><p class="eyebrow"><span class="eyebrow-rule"></span> YOUR STUDY SPACE</p><h2 id="sample-title">Find it. Preview it.<br /><em>Study with confidence.</em></h2><p>Every listing points back to its original source. Where a source provides a preview image, you can inspect it before opening the full resource.</p><a class="sample-cta" href={siteBase + '/materials/'}>Explore the materials library <span aria-hidden="true">↗</span></a></div>
      <div class="sample-stack" aria-hidden="true"><div class="sample-sheet sample-sheet-back"><span>ICSE / STUDY INDEX</span><strong>Practice.<br />Revise.<br />Repeat.</strong></div><div class="sample-sheet sample-sheet-front"><span>YOUR NEXT RESOURCE</span><div class="sample-lines"></div><div class="sample-lines short"></div><div class="sample-stamp">SOURCE<br />LINKED</div></div></div>
    </div>
  </section>

  <section class="home-planner-band page-width">
    <div><p class="eyebrow"><span class="eyebrow-rule"></span> MAKE IT YOURS</p><h2>Turn a resource into a plan.</h2><p>Build your own subject and chapter list, then track your learning progress on this device.</p></div>
    <a href={siteBase + '/syllabus/'}>Open the syllabus tracker <span aria-hidden="true">↗</span></a>
  </section>
</main>