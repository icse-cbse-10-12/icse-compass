<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase, siteOrigin } from '#lib/site.ts';
  import { readSavedItems, toggleSavedItem, createResourceSavedItem, shareLink, type SavedItem } from '#lib/bookmarks.ts';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let profileUrl = $derived(siteOrigin + siteBase + '/creators/' + encodeURIComponent(data.creator.id) + '/');
  let description = $derived(data.creator.description || 'Verified educator profile and attributed ICSE learning resources.');
  let savedItems = $state<SavedItem[]>([]);
  let bookmarkStorageError = $state(false);
  let shareMessage = $state('');
  function isSaved(resourceId: string) { return savedItems.some((item) => item.id === 'resource:' + resourceId); }
  function toggleResourceBookmark(resource: PageData['resources'][number]) { const result = toggleSavedItem(createResourceSavedItem(resource, siteBase + '/creators/' + encodeURIComponent(data.creator.id) + '/#resource-' + encodeURIComponent(resource.id)), savedItems); savedItems = result.items; bookmarkStorageError = result.error; }
  async function shareResource(resource: PageData['resources'][number]) { shareMessage = await shareLink(resource.title, resource.description ?? '', resource.sourceUrl); }
  onMount(() => { const stored = readSavedItems(); savedItems = stored.items; bookmarkStorageError = stored.error; });
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
            <div class="educator-resource-actions"><button type="button" aria-pressed={isSaved(resource.id)} onclick={() => toggleResourceBookmark(resource)}>{isSaved(resource.id) ? '★ Saved' : '☆ Bookmark'}</button><button type="button" onclick={() => void shareResource(resource)}>Share</button><a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">{resource.accessMethod === 'hosted' ? 'Open authorised resource' : 'Visit original source'} ↗</a></div>
          </article>
        {/each}
      </div>
    {/if}
  </section>
  {#if bookmarkStorageError}<p role="status">Bookmarks could not be saved in this browser.</p>{/if}
  <p role="status" aria-live="polite">{shareMessage}</p>
</main>

<style>
  .resource-item[id] { scroll-margin-top: 24px; }
  .educator-resource-actions{display:flex;flex-wrap:wrap;align-items:center;gap:7px}.educator-resource-actions button{min-height:40px;padding:0 11px;color:#c7f5e4;background:#15372f;border:1px solid #286451;font-size:10px;font-weight:800;cursor:pointer}.educator-resource-actions a{display:inline-flex;min-height:40px;align-items:center}
</style>
