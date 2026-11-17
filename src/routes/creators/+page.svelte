<script lang="ts">
  import type { PageData } from './$types';
  import { siteBase } from '#lib/site.ts';
  import { formatResourceTitle, formatResourceType } from '#lib/catalogue.ts';
  import { creatorSubjectFilters, filterCreatorResources, filterCreatorsBySubject, type CreatorSubjectFilter } from '#lib/creator-directory';

  export let data: PageData;
  let selectedSubject: CreatorSubjectFilter = 'All Educators';

  $: directoryPending = data.foundationMode || data.creators.length === 0 || data.resources.length === 0;
  $: visibleCreators = filterCreatorsBySubject(data.creators, data.resources, selectedSubject);
</script>

<svelte:head>
  <title>Educators | ICSE Compass</title>
  <meta name="description" content="Explore verified educator listings and published ICSE learning materials, with links to original sources." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/creators/" />
  <meta property="og:title" content="Educators | ICSE Compass" />
  <meta property="og:description" content="Explore published educator listings and original learning-resource sources." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/creators/" />
</svelte:head>

<main class="page-content">
  <header class="page-heading">
    <div>
      <p class="eyebrow"><span class="eyebrow-rule"></span> THE PEOPLE BEHIND THE SOURCES / 02</p>
      <h1>Learn from your educators</h1>
      <p class="page-intro">Choose an educator to see the notes, papers, videos and other materials attributed to them in the library. Every listing links to its resource details or original source.</p>
    </div>
    <aside class="heading-aside"><strong>FOLLOW THE SOURCE</strong><span>Every listing shows its educator attribution and takes you to the resource details or original publisher.</span></aside>
  </header>

  {#if directoryPending}
    <section class="creator-state creator-pending" aria-labelledby="directory-pending-title">
      <span class="state-kicker">PHASE 2 CATALOGUE</span>
      <h2 id="directory-pending-title">Educator Directory — Phase 2 Catalogue Pending</h2>
      <p>Verified educators and original source links will appear here when the Phase 2 catalogue is ready.</p>
      <div class="creator-pending-actions">
        <a href="{siteBase}/materials/">Explore Materials Library →</a>
        <a href="{siteBase}/">Return to Overview →</a>
      </div>
    </section>
  {:else}
    <nav class="subject-filter-track" aria-label="Filter educators by subject">
      {#each creatorSubjectFilters as subject (subject)}
        <button type="button" class:active={selectedSubject === subject} aria-pressed={selectedSubject === subject} onclick={() => (selectedSubject = subject)}>{subject}</button>
      {/each}
    </nav>

    {#if visibleCreators.length > 0}
      <div class="creator-grid" aria-live="polite">
        {#each visibleCreators as creator (creator.id)}
          {@const creatorResources = filterCreatorResources(data.resources, creator.id, selectedSubject)}
          {@const previewResources = creatorResources.slice(0, 2)}
          <article class="creator-card creator-card-discovery">
            <p class="platform">{creator.platform}</p>
            <span class="creator-monogram" aria-hidden="true">{creator.name.trim().slice(0, 1).toUpperCase()}</span>
            <h2>{creator.name}</h2>
            {#if creator.description}<p>{creator.description}</p>{/if}
            <div class="creator-resource-preview">
              <div class="creator-preview-heading"><span>EXPLORE THESE MATERIALS</span><span>{creatorResources.length} TOTAL</span></div>
              {#if previewResources.length > 0}
                {#each previewResources as resource (resource.id)}
                  <a class="creator-resource-link" href={siteBase + '/creators/' + encodeURIComponent(creator.id) + '/#resource-' + encodeURIComponent(resource.id)}>
                    <span class="creator-resource-format">{formatResourceType(resource.resourceType)}</span>
                    <span class="creator-resource-title">{formatResourceTitle(resource.title).title}</span>
                    <span class="creator-resource-arrow" aria-hidden="true">→</span>
                  </a>
                {/each}
              {:else}
                <p class="creator-no-resources">No published materials are listed for this profile yet.</p>
              {/if}
            </div>
            <div class="creator-actions creator-actions-discovery">
              <a href={siteBase + '/creators/' + encodeURIComponent(creator.id) + '/'}>Explore {creatorResources.length} {creatorResources.length === 1 ? 'material' : 'materials'} →</a>
              <a href={creator.profileUrl} target="_blank" rel="noopener noreferrer">Official source ↗</a>
            </div>
          </article>
        {/each}
      </div>
    {:else}
      <div class="creator-state" role="status">
        <strong>No published educator resources for {selectedSubject} yet.</strong>
        <p>Choose All Educators to browse every published profile and its available materials.</p>
      </div>
    {/if}
  {/if}

  <a class="text-link" href="{siteBase}/">Return to overview →</a>
</main>

<style>
  .creator-card-discovery { display: flex; flex-direction: column; min-width: 0; }
  .creator-card-discovery > p:not(.platform) { min-height: 2.8em; }
  .creator-resource-preview { margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--line); }
  .creator-preview-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 9px; color: var(--muted); font-size: 9px; font-weight: 800; letter-spacing: .08em; }
  .creator-resource-link { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; min-height: 42px; padding: 7px 0; border-bottom: 1px solid var(--line); color: inherit; text-decoration: none; }
  .creator-resource-link:last-child { border-bottom: 0; }
  .creator-resource-link:hover .creator-resource-title { text-decoration: underline; text-underline-offset: 3px; }
  .creator-resource-format { padding: 4px 5px; background: #1C2942; color: #F1F5F9; font-size: 8px; font-weight: 850; letter-spacing: .04em; }
  .creator-resource-title { overflow: hidden; color: #F1F5F9; font-size: 11px; font-weight: 650; line-height: 1.45; text-overflow: ellipsis; }
  .creator-resource-arrow { color: #10B981; font-size: 13px; }
  .creator-no-resources { margin: 0; color: var(--muted); font-size: 11px; line-height: 1.6; }
  .creator-actions-discovery { margin-top: auto; padding-top: 13px; }
  .creator-actions-discovery a:first-child { color: #10B981; font-weight: 850; }
  .creator-resource-link:focus-visible, .creator-actions-discovery a:focus-visible { outline: 3px solid #10B981; outline-offset: 3px; }
  .subject-filter-track { display: flex; gap: 8px; overflow-x: auto; margin: 22px 0 0; padding: 3px 2px 10px; scroll-snap-type: x mandatory; scrollbar-width: thin; }
  .subject-filter-track button { flex: 0 0 auto; min-height: 48px; padding: 0 16px; border: 1px solid #26334D; background: #141E30; color: #CBD5E1; font-size: 11px; font-weight: 700; cursor: pointer; scroll-snap-align: start; }
  .subject-filter-track button.active, .subject-filter-track button[aria-pressed="true"] { border-color: #10B981; background: #1C2942; color: #F1F5F9; box-shadow: inset 0 -2px 0 #10B981; }
  .subject-filter-track button:focus-visible { outline: 3px solid #10B981; outline-offset: 2px; }
  .creator-pending { min-height: 280px; }
  .creator-pending h2 { max-width: 720px; margin: 0; color: #F1F5F9; font: 500 clamp(25px, 3vw, 34px)/1.2 var(--serif); }
  .creator-pending-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 22px; }
  .creator-pending-actions a { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 18px; border: 1px solid #10B981; background: #10B981; color: #06281E; font-size: 11px; font-weight: 850; }
  .creator-pending-actions a + a { border-color: #334466; background: #1C2942; color: #F1F5F9; }
  @media (max-width: 600px) {
    .creator-card-discovery > p:not(.platform) { min-height: 0; }
    .creator-pending-actions { width: 100%; flex-direction: column; }
    .creator-pending-actions a { width: 100%; }
  }
</style>
