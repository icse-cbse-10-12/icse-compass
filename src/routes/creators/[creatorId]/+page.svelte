<script lang="ts">
  import { siteBase } from '#lib/site.ts';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>
<svelte:head>
  <title>{data.creator.name} | Educators | ICSE Compass</title>
  <meta name="description" content={data.creator.description || 'Verified educator profile and attributed ICSE learning resources.'} />
  <meta property="og:title" content={data.creator.name + ' | ICSE Compass'} />
  <meta property="og:description" content={data.creator.description || 'Verified educator profile and attributed learning resources.'} />
</svelte:head>
<main class="page-content educator-detail">
  <a class="back-link" href="{siteBase}/creators/">← All educators</a>
  <p class="eyebrow">ICSE COMPASS · VERIFIED EDUCATOR</p>
  <p class="platform">{data.creator.platform}</p>
  <h1>{data.creator.name}</h1>
  {#if data.creator.description}<p class="intro">{data.creator.description}</p>{/if}
  <a class="official-link" href={data.creator.profileUrl} target="_blank" rel="noopener noreferrer">Visit official profile ↗</a>
  <section class="attributed-resources" aria-labelledby="resources-heading">
    <div class="section-head"><div><p class="eyebrow">ORIGINAL-SOURCE ATTRIBUTION</p><h2 id="resources-heading">Published resources</h2></div><span>{data.resources.length} total</span></div>
    {#if data.resources.length === 0}
      <div class="empty-state"><strong>No resources attributed yet.</strong><p>New approved resources associated with this educator will appear here.</p></div>
    {:else}
      <div class="resource-list">
        {#each data.resources as resource (resource.id)}
          <article class="resource-item"><div><span class="resource-type">{resource.resourceType.replace('-', ' ')}</span><h3>{resource.title}</h3>{#if resource.description}<p>{resource.description}</p>{/if}</div><a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">{resource.accessMethod === 'hosted' ? 'Open resource' : 'Original source'} ↗</a></article>
        {/each}
      </div>
    {/if}
  </section>
</main>
<style>
.educator-detail{min-height:65vh;padding:52px 0 90px}.back-link{display:inline-flex;min-height:42px;align-items:center;color:#356b58;font-size:11px;font-weight:750}.educator-detail>.eyebrow{margin-top:28px}.platform{margin:20px 0 8px;color:#356b58;font-size:10px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase}.educator-detail h1{margin:0;font:500 clamp(40px,6vw,62px)/1.1 Georgia,serif}.intro{max-width:650px;color:#6e7269;font-size:14px;line-height:1.8}.official-link{display:inline-flex;min-height:44px;align-items:center;margin-top:10px;color:#356b58;font-size:12px;font-weight:800}.attributed-resources{margin-top:54px}.section-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:18px}.section-head .eyebrow{margin:0 0 8px}.section-head h2{margin:0;font:500 27px Georgia,serif}.section-head>span{color:#7a7e75;font-size:10px}.empty-state{padding:28px;text-align:center;border:1px dashed #cfc8b9;border-radius:9px;background:#faf8f2}.empty-state strong{font:500 19px Georgia,serif}.empty-state p{color:#73776e;font-size:12px}.resource-list{display:grid;gap:10px}.resource-item{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px;background:#fff;border:1px solid #dcd5c7;border-radius:8px}.resource-type{color:#356b58;font-size:9px;font-weight:800;text-transform:uppercase}.resource-item h3{margin:7px 0;font:500 18px Georgia,serif}.resource-item p{margin:0;color:#73776e;font-size:11px;line-height:1.6}.resource-item a{flex:0 0 auto;color:#356b58;font-size:11px;font-weight:800}@media(max-width:560px){.resource-item{align-items:flex-start;flex-direction:column;gap:12px}}
</style>
