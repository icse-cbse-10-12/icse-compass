<script lang="ts">
  import { siteBase, siteOrigin } from '#lib/site.ts';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const profileUrl = siteOrigin + siteBase + '/creators/' + encodeURIComponent(data.creator.id) + '/';
  const description = data.creator.description || 'Verified educator profile and attributed ICSE learning resources.';
</script>

<svelte:head>
  <title>{data.creator.name} | Educators | ICSE Compass</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={profileUrl} />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content={data.creator.name + ' | ICSE Compass'} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={profileUrl} />
  <meta name="twitter:title" content={data.creator.name + ' | ICSE Compass'} />
  <meta name="twitter:description" content={description} />
</svelte:head>

<main class="page-content educator-detail">
  <a class="back-link" href="{siteBase}/creators/">← All educators</a>
  <section class="educator-hero">
    <div class="educator-hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span> EDUCATOR PROFILE / ORIGINAL-SOURCE ATTRIBUTION</p>
      <p class="platform">{data.creator.platform}</p>
      <h1>{data.creator.name}</h1>
      {#if data.creator.description}<p class="intro">{data.creator.description}</p>{/if}
      <a class="official-link" href={data.creator.profileUrl} target="_blank" rel="noopener noreferrer">Visit official profile <span aria-hidden="true">↗</span></a>
    </div>
    <div class="educator-stamp" aria-label="Source checked profile">
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="1.2"/><path d="m10.5 16.5 3.5 3.5 7.5-8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>PROFILE<br />SOURCE CHECKED</span>
    </div>
  </section>

  <section class="attributed-resources" aria-labelledby="resources-heading">
    <div class="section-head">
      <div><p class="eyebrow"><span class="eyebrow-rule"></span> FROM THIS EDUCATOR</p><h2 id="resources-heading">Published resources</h2></div>
      <span>{data.resources.length} {data.resources.length === 1 ? 'RESOURCE' : 'RESOURCES'}</span>
    </div>
    {#if data.resources.length === 0}
      <div class="empty-state"><span class="state-kicker">NOTHING PUBLISHED YET</span><strong>No resources attributed yet.</strong><p>New approved resources associated with this educator will appear here.</p></div>
    {:else}
      <div class="resource-list">
        {#each data.resources as resource (resource.id)}
          <article id={'resource-' + resource.id} class="resource-item">
            <div><span class="resource-type">{resource.resourceType.replace('-', ' ')}</span><h3>{resource.title}</h3>{#if resource.description}<p>{resource.description}</p>{/if}</div>
            <a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">{resource.accessMethod === 'hosted' ? 'Open authorised resource' : 'Visit original source'} ↗</a>
          </article>
        {/each}
      </div>
    {/if}
  </section>
</main>

<style>
  .resource-item[id] { scroll-margin-top: 24px; }
</style>
