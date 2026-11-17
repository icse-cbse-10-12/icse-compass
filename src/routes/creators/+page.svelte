<script lang="ts">
  import { siteBase } from '#lib/site.ts';
  import { formatResourceTitle, formatResourceType, type Creator, type Resource } from '#lib/catalogue.ts';
  import creatorFeed from '../../../static/data/creators.json';
  import resourceFeed from '../../../static/data/resources.json';

  const creators = (creatorFeed as Creator[]).filter((creator) => creator.status === 'published');
  const resources = (resourceFeed as Resource[]).filter((resource) => resource.status === 'published');
  const subjectFilters = [
    { label: 'Mathematics', ids: ['mathematics'] }, { label: 'Physics', ids: ['physics'] },
    { label: 'Chemistry', ids: ['chemistry'] }, { label: 'Biology', ids: ['biology'] },
    { label: 'Computer Applications', ids: ['computer-applications'] },
    { label: 'English', ids: ['english-paper-1', 'english-paper-2'] },
    { label: 'History & Civics', ids: ['history-civics'] }
  ];
  let selectedSubject = 'all';
  $: activeFilter = subjectFilters.find((filter) => filter.label === selectedSubject);
  $: visibleCreators = creators.filter((creator) => selectedSubject === 'all' || resources.some((resource) => resource.creatorId === creator.id && activeFilter?.ids.includes(resource.subjectId ?? '')));
</script>

<svelte:head>
  <title>Educators | ICSE Compass</title>
  <meta name="description" content="Explore verified ICSE educator attributions and original source links alongside published learning materials." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/creators/" />
  <meta property="og:title" content="Educators | ICSE Compass" />
  <meta property="og:description" content="Explore educator attributions and original publisher links for published learning resources." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/creators/" />
</svelte:head>

<main class="page-content creators-page">
  <header class="page-heading">
    <div>
      <p class="eyebrow"><span class="eyebrow-rule"></span> THE PEOPLE BEHIND THE SOURCES / 02</p>
      <h1>Learn from your educators</h1>
      <p class="page-intro">Choose an educator to see the actual notes, papers, videos and other materials listed in the library. Start with a resource preview or explore the complete collection.</p>
      <div class="creator-source-note">
        <strong>FOLLOW THE SOURCE</strong>
        <p>Every listing shows its educator attribution and takes you to the resource details or original publisher.</p>
      </div>
    </div>
  </header>

  {#if creators.length === 0}
    <section class="creator-state creator-pending" aria-labelledby="creator-pending-title">
      <span class="state-kicker">PHASE 2 · CATALOGUE PENDING</span>
      <h2 id="creator-pending-title">Educator Directory — Phase 2 Catalogue Pending</h2>
      <p>Verified educator profiles and their original source links will appear here after the catalogue has been reviewed and published. No unverified profiles are displayed.</p>
      <div class="creator-pending-actions">
        <a href={siteBase + '/materials/'}>Explore Materials Library <span aria-hidden="true">→</span></a>
        <a href={siteBase + '/'}>Return to Overview <span aria-hidden="true">→</span></a>
      </div>
    </section>
  {:else}
    <nav class="creator-subject-filter" aria-label="Filter educators by subject">
      <div class="compass-track">
        <button class:active={selectedSubject === 'all'} aria-pressed={selectedSubject === 'all'} onclick={() => selectedSubject = 'all'}>All Educators</button>
        {#each subjectFilters as filter (filter.label)}
          <button class:active={selectedSubject === filter.label} aria-pressed={selectedSubject === filter.label} onclick={() => selectedSubject = filter.label}>{filter.label}</button>
        {/each}
      </div>
    </nav>
    {#if visibleCreators.length === 0}
      <div class="creator-state" role="status"><strong>No published educators are linked to this subject yet.</strong><p>Choose another subject or view all educators.</p></div>
    {:else}
      <div class="creator-grid">
        {#each visibleCreators as creator (creator.id)}
          {@const creatorResources = resources.filter((resource) => resource.creatorId === creator.id)}
          {@const previewResources = creatorResources.filter((resource) => selectedSubject === 'all' || activeFilter?.ids.includes(resource.subjectId ?? '')).slice(0, 2)}
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
              <a href={siteBase + '/creators/' + encodeURIComponent(creator.id) + '/'}>Explore {creatorResources.length} {creatorResources.length === 1 ? 'material' : 'materials'} <span aria-hidden="true">→</span></a>
              <a href={creator.profileUrl} target="_blank" rel="noopener noreferrer">Official source ↗</a>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  {/if}
  <a class="text-link" href={siteBase + '/'}>← Return to overview</a>
</main>

<style>
  .creator-source-note { display: grid; gap: 5px; margin-top: 20px; }
  .creator-source-note strong { color: var(--accent-primary); font-size: .75rem; letter-spacing: .08em; }
  .creator-source-note p { max-width: 610px; margin: 0; color: var(--ink-muted); font-size: 12px; line-height: 1.75; }
  .creator-subject-filter { margin: 24px 0 8px; overflow: hidden; }
  .compass-track { display: flex; gap: 9px; overflow-x: auto; padding: 3px 2px 12px; scroll-snap-type: x mandatory; scrollbar-width: thin; scrollbar-color: var(--border-hairline) transparent; }
  .compass-track button { flex: 0 0 auto; min-height: 48px; padding: 0 16px; border: 1px solid var(--border-hairline); border-radius: 3px; background: var(--bg-subtle); color: var(--ink-muted); font-size: 11px; font-weight: 750; cursor: pointer; scroll-snap-align: start; }
  .compass-track button.active { border-color: var(--accent-primary); background: var(--accent-primary); color: #06281E; }
  .compass-track button:focus-visible, .creator-pending-actions a:focus-visible { outline: 3px solid var(--accent-primary); outline-offset: 3px; }
  .creator-card-discovery { display: flex; flex-direction: column; min-width: 0; }
  .creator-card-discovery > p:not(.platform) { min-height: 2.8em; }
  .creator-resource-preview { margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--border-hairline); }
  .creator-preview-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 9px; color: var(--ink-muted); font-size: 9px; font-weight: 800; letter-spacing: .08em; }
  .creator-resource-link { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; min-height: 42px; padding: 7px 0; border-bottom: 1px solid var(--border-hairline); color: inherit; text-decoration: none; }
  .creator-resource-link:last-child { border-bottom: 0; }
  .creator-resource-link:hover .creator-resource-title { text-decoration: underline; text-underline-offset: 3px; }
  .creator-resource-format { padding: 4px 5px; background: var(--bg-subtle); color: var(--accent-primary); font-size: 8px; font-weight: 850; letter-spacing: .04em; }
  .creator-resource-title { overflow: hidden; color: var(--ink-primary); font-size: 11px; font-weight: 650; line-height: 1.45; text-overflow: ellipsis; }
  .creator-resource-arrow { color: var(--accent-primary); font-size: 13px; }
  .creator-no-resources { margin: 0; color: var(--ink-muted); font-size: 11px; line-height: 1.6; }
  .creator-actions-discovery { margin-top: auto; padding-top: 13px; }
  .creator-actions-discovery a:first-child { color: var(--accent-primary); font-weight: 850; }
  .creator-state { background: var(--bg-card); border: 1px solid var(--border-hairline); border-bottom: 2px solid #334466; }
  .creator-pending { min-height: 280px; align-items: flex-start; text-align: left; padding: clamp(24px, 5vw, 48px); }
  .creator-pending h2 { max-width: 760px; margin: 12px 0 0; color: var(--ink-primary); font: 500 clamp(27px, 4vw, 38px)/1.15 var(--serif); }
  .creator-pending p { max-width: 650px; margin: 12px 0 0; color: var(--ink-muted); }
  .creator-pending-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
  .creator-pending-actions a { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: 12px; padding: 0 16px; background: var(--accent-primary); color: #06281E; font-size: 11px; font-weight: 850; }
  .creator-pending-actions a + a { border: 1px solid var(--border-hairline); background: var(--bg-subtle); color: var(--ink-primary); }
  @media (max-width: 600px) { .creator-card-discovery > p:not(.platform) { min-height: 0; } .creator-pending-actions { width: 100%; flex-direction: column; } .creator-pending-actions a { width: 100%; } }
</style>
