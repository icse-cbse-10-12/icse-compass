<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';
  import type { Creator, Resource } from '#lib/catalogue.ts';

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
  <meta name="description" content="Discover verified educator profiles and their published ICSE learning resources." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/creators/" />
  <meta property="og:title" content="Educators | ICSE Compass" />
  <meta property="og:description" content="Discover verified educator profiles and their published ICSE learning resources." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/creators/" />
</svelte:head>

<main class="page-content">
  <header class="page-heading">
    <div>
      <p class="eyebrow"><span class="eyebrow-rule"></span> THE PEOPLE BEHIND THE SOURCES / 02</p>
      <h1>Meet the educators</h1>
      <p class="page-intro">Find the educators behind the learning material. Each profile connects you to an official source and the resources attributed to it.</p>
    </div>
    <aside class="heading-aside"><strong>ATTRIBUTION MATTERS</strong>Profiles are published only after their official channel or website and source details have been checked.</aside>
  </header>

  {#if loading}
    <div class="creator-state" role="status"><span class="state-kicker">PLEASE WAIT</span><strong>Opening the educator directory</strong><p>Fetching verified public profiles.</p></div>
  {:else if failed}
    <div class="creator-state" role="alert"><span class="state-kicker">CONNECTION ISSUE</span><strong>The directory is unavailable.</strong><p>Check your connection and try again.</p><button class="retry-button" onclick={loadCreators}>Try again</button></div>
  {:else if creators.length === 0}
    <div class="creator-state"><span class="state-kicker">DIRECTORY IN PROGRESS</span><strong>No verified educator profiles have been published yet.</strong><p>Profiles will appear after their official channel or website and source details have been checked. Suggested names are not presented as verified profiles.</p><a href="{siteBase}/materials/">Browse the materials library →</a></div>
  {:else}
    <div class="creator-grid">
      {#each creators as creator (creator.id)}
        <article class="creator-card">
          <p class="platform">{creator.platform}</p>
          <span class="creator-monogram" aria-hidden="true">{creator.name.trim().slice(0, 1).toUpperCase()}</span>
          <h2>{creator.name}</h2>
          {#if creator.description}<p>{creator.description}</p>{/if}
          <span class="resource-count">{resources.filter((resource) => resource.creatorId === creator.id).length} published resources</span>
          <div class="creator-actions">
            <a href={siteBase + '/creators/' + encodeURIComponent(creator.id) + '/'}>View profile →</a>
            <a href={creator.profileUrl} target="_blank" rel="noopener noreferrer">Official source ↗</a>
          </div>
        </article>
      {/each}
    </div>
  {/if}

  <a class="text-link" href="{siteBase}/">← Return to overview</a>
</main>
