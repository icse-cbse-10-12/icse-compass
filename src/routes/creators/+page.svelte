<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';
  import type { Creator, Resource } from '#lib/catalogue';
  let creators: Creator[] = [];
  let resources: Resource[] = [];
  let loading = true;
  let failed = false;
  async function loadCreators() {
    loading = true; failed = false;
    try {
      const [creatorResponse, resourceResponse] = await Promise.all([fetch(siteBase + '/data/creators.json'), fetch(siteBase + '/data/resources.json')]);
      if (!creatorResponse.ok || !resourceResponse.ok) throw new Error('Educator data unavailable');
      const [creatorData, resourceData] = await Promise.all([creatorResponse.json(), resourceResponse.json()]);
      if (!Array.isArray(creatorData) || !Array.isArray(resourceData)) throw new Error('Invalid educator data');
      creators = creatorData.filter((creator: Creator) => creator.status === 'published');
      resources = resourceData.filter((resource: Resource) => resource.status === 'published');
    } catch { failed = true; }
    finally { loading = false; }
  }
  onMount(loadCreators);
</script>
<svelte:head><title>Educators | ICSE Compass</title><meta name="description" content="Discover verified educator profiles and their published ICSE learning resources." /><link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/creators/" /><meta property="og:title" content="Educators | ICSE Compass" /><meta property="og:description" content="Discover verified educator profiles and their published ICSE learning resources." /><meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/creators/" /></svelte:head>
<main class="page-content creators-page"><p class="eyebrow">ICSE COMPASS · EDUCATORS</p><h1>Learn from educators</h1><p class="intro">Browse verified educator profiles and discover the resources attributed to each original source.</p>
{#if loading}<div class="state" role="status"><strong>Loading educator directory…</strong><p>Fetching verified public profiles.</p></div>
{:else if failed}<div class="state" role="alert"><strong>Educator directory unavailable.</strong><p>Check your connection and try again.</p><button onclick={loadCreators}>Try again</button></div>
{:else if creators.length === 0}<div class="state"><strong>No verified educator profiles have been published yet.</strong><p>Profiles will appear after their official channel or website and source details have been checked. Suggested names are not presented as verified profiles.</p><a href="{siteBase}/materials/">Browse the materials library →</a></div>
{:else}<div class="creator-grid">{#each creators as creator (creator.id)}<article class="creator-card"><p class="platform">{creator.platform}</p><h2>{creator.name}</h2>{#if creator.description}<p>{creator.description}</p>{/if}<span class="resource-count">{resources.filter((resource) => resource.creatorId === creator.id).length} published resources</span><a href={creator.profileUrl} target="_blank" rel="noopener noreferrer">Visit official profile ↗</a></article>{/each}</div>{/if}
<a class="text-link" href="{siteBase}/">← Return to overview</a></main>
<style>
.creators-page{padding:76px 0 90px;min-height:65vh}.creators-page h1{margin:18px 0 10px;font:500 clamp(38px,5vw,58px)/1.1 Georgia,serif}.intro{max-width:620px;color:#6e7269;font-size:14px;line-height:1.8}.state{display:flex;min-height:190px;flex-direction:column;align-items:center;justify-content:center;margin:32px 0;padding:28px;text-align:center;border:1px dashed #cfc8b9;border-radius:10px;background:#faf8f2}.state strong{font:500 20px Georgia,serif}.state p{max-width:450px;color:#73776e;font-size:12px;line-height:1.7}.state button{min-height:42px;padding:0 14px;border:1px solid #b9c8b9;border-radius:4px;background:#f3f5ef;color:#356b58;font-weight:700}.state a{color:#356b58;font-size:12px;font-weight:700}.creator-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:32px 0}.creator-card{display:flex;min-width:0;flex-direction:column;padding:20px;border:1px solid #dcd5c7;border-radius:9px;background:#fff}.creator-card .platform{margin:0;color:#356b58;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px}.creator-card h2{margin:14px 0 8px;font:500 21px Georgia,serif}.creator-card>p:not(.platform){color:#73776e;font-size:12px;line-height:1.7}.resource-count{margin-top:auto;padding:12px 0;color:#777b72;font-size:10px}.creator-card a{color:#356b58;font-size:11px;font-weight:800}@media(max-width:760px){.creator-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.creator-grid{grid-template-columns:1fr}}
</style>
