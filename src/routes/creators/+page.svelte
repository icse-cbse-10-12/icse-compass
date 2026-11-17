<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';
  import { formatResourceTitle, formatResourceType, type Creator, type Resource } from '#lib/catalogue.ts';

  let creators: Creator[] = [];
  let resources: Resource[] = [];
  let loading = true;
  let failed = false;

  async function loadCreators() {
    loading = true;
    failed = false;
    try {
      const [creatorResponse, resourceResponse] = await Promise.all([fetch(siteBase + '/data/creators.json'), fetch(siteBase + '/data/resources.json')]);
      if (!creatorResponse.ok || !resourceResponse.ok) throw new Error('Educator data unavailable');
      const [creatorData, resourceData] = await Promise.all([creatorResponse.json(), resourceResponse.json()]);
      if (!Array.isArray(creatorData) || !Array.isArray(resourceData)) throw new Error('Invalid educator data');
      creators = creatorData.filter((creator: Creator) => creator.status === 'published');
      resources = resourceData.filter((resource: Resource) => resource.status === 'published');
    } catch {
      failed = true;
    } finally {
      loading = false;
    }
  }

  onMount(() => { void loadCreators(); });
</script>

<svelte:head>
  <title>Educators | ICSE Compass</title>
  <meta name="description" content="Explore ICSE learning materials by educator. Preview real published resources and open each item at its original source." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/creators/" />
  <meta property="og:title" content="Educators | ICSE Compass" />
  <meta property="og:description" content="Explore ICSE learning materials by educator, with direct previews of published resources." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/creators/" />
</svelte:head>

<main class="page-content">
  <header class="page-heading">
    <div>
      <p class="eyebrow"><span class="eyebrow-rule"></span> THE PEOPLE BEHIND THE SOURCES / 02</p>
      <h1>Learn from your educators</h1>
      <p class="page-intro">Choose an educator to see the actual notes, papers, videos and other materials listed in the library. Start with a resource preview or explore the complete collection.</p>
    </div>
    <aside class="heading-aside"><strong>FOLLOW THE SOURCE</strong>Every listing shows its educator attribution and takes you to the resource details or original publisher.</aside>
  </header>

  {#if loading}
    <div class="creator-state" role="status"><span class="state-kicker">PLEASE WAIT</span><strong>Opening the educator directory</strong><p>Fetching published profiles and their resources.</p></div>
  {:else if failed}
    <div class="creator-state" role="alert"><span class="state-kicker">CONNECTION ISSUE</span><strong>The directory is unavailable.</strong><p>Check your connection and try again.</p><button class="retry-button" onclick={loadCreators}>Try again</button></div>
  {:else if creators.length === 0}
    <div class="creator-state"><span class="state-kicker">DIRECTORY IN PROGRESS</span><strong>No educator profiles have been published yet.</strong><p>Published profiles will appear here when their source details are ready.</p><a href="{siteBase}/materials/">Browse the materials library →</a></div>
  {:else}
    <div class="creator-grid">
      {#each creators as creator (creator.id)}
        {@const creatorResources = resources.filter((resource) => resource.creatorId === creator.id)}
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
                  <span class="creator-resource-arrow" aria-hidden="true">↗</span>
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

  <a class="text-link" href="{siteBase}/">← Return to overview</a>
</main>

<style>
  .creator-card-discovery { display: flex; flex-direction: column; min-width: 0; }
  .creator-card-discovery > p:not(.platform) { min-height: 2.8em; }
  .creator-resource-preview { margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--line, #ddd6c9); }
  .creator-preview-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 9px; color: var(--muted, #6d7168); font-size: 9px; font-weight: 800; letter-spacing: .08em; }
  .creator-resource-link { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; min-height: 42px; padding: 7px 0; border-bottom: 1px solid var(--line, #e4ded2); color: inherit; text-decoration: none; }
  .creator-resource-link:last-child { border-bottom: 0; }
  .creator-resource-link:hover .creator-resource-title { text-decoration: underline; text-underline-offset: 3px; }
  .creator-resource-format { padding: 4px 5px; background: var(--surface-muted, #edf1e8); color: var(--ink, #173d32); font-size: 8px; font-weight: 850; letter-spacing: .04em; }
  .creator-resource-title { overflow: hidden; color: var(--ink, #252923); font-size: 11px; font-weight: 650; line-height: 1.45; text-overflow: ellipsis; }
  .creator-resource-arrow { color: var(--accent, #356b58); font-size: 13px; }
  .creator-no-resources { margin: 0; color: var(--muted, #6d7168); font-size: 11px; line-height: 1.6; }
  .creator-actions-discovery { margin-top: auto; padding-top: 13px; }
  .creator-actions-discovery a:first-child { color: var(--accent, #356b58); font-weight: 850; }
  .creator-resource-link:focus-visible, .creator-actions-discovery a:focus-visible { outline: 3px solid var(--accent, #356b58); outline-offset: 3px; }
  @media (max-width: 600px) { .creator-card-discovery > p:not(.platform) { min-height: 0; } }
</style>
