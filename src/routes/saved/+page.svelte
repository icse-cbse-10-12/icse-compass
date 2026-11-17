<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';
  import { BOOKMARK_STORAGE_KEY, readSavedItems, migrateLegacyPaperBookmarks, shareLink, type SavedCategory, type SavedItem } from '#lib/bookmarks.ts';
  import type { Resource } from '#lib/catalogue.ts';

  let items: SavedItem[] = [];
  let filter: 'all' | SavedCategory = 'all';
  let loading = true;
  let loadError = false;
  let storageError = false;
  let shareMessage = '';
  let currentIds = new Set<string>();
  let catalogueChecked = false;
  let visibleItems: SavedItem[] = [];

  $: visibleItems = items.filter((item) => filter === 'all' || item.categories.includes(filter));

  function removeItem(id: string) {
    const next = items.filter((item) => item.id !== id);
    try {
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify({ version: 2, items: next }));
      items = next;
      storageError = false;
    } catch { storageError = true; }
  }

  async function shareItem(item: SavedItem) {
    shareMessage = await shareLink(item.title, item.description, item.sourceUrl);
  }

  async function loadSaved() {
    loading = true; loadError = false;
    try {
      const [resourceResponse, paperResponse] = await Promise.all([
        fetch(siteBase + '/data/resources.json'), fetch(siteBase + '/data/prelims.json')
      ]);
      if (!resourceResponse.ok || !paperResponse.ok) throw new Error('Saved item catalogue unavailable');
      const [resources, paperPayload] = await Promise.all([resourceResponse.json(), paperResponse.json()]);
      if (!Array.isArray(resources) || !Array.isArray(paperPayload.papers)) throw new Error('Saved item catalogue format invalid');
      const loaded = migrateLegacyPaperBookmarks(paperPayload.papers);
      items = loaded.items;
      storageError = loaded.error;
      const active = new Set<string>([
        ...paperPayload.papers.map((paper: { id: string }) => 'paper:' + paper.id),
        ...resources.filter((resource: Resource) => resource.status === 'published').map((resource: Resource) => 'resource:' + resource.id)
      ]);
      currentIds = active;
      catalogueChecked = true;
    } catch {
      const loaded = readSavedItems();
      items = loaded.items; storageError = loaded.error; loadError = true;
    } finally { loading = false; }
  }

  onMount(() => { void loadSaved(); });
</script>

<svelte:head>
  <title>Saved Resources | ICSE Compass</title>
  <meta name="description" content="Your device-local collection of saved ICSE papers, notes, videos and educator resources." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/saved/" />
</svelte:head>

<main class="page-content saved-page">
  <header class="page-heading">
    <div><p class="eyebrow"><span class="eyebrow-rule"></span> YOUR PERSONAL COLLECTION</p><h1>Saved</h1><p class="page-intro">Your bookmarked papers and learning resources, kept on this device. Nothing is uploaded to an account.</p></div>
    <aside class="heading-aside"><strong>{items.length.toLocaleString('en-IN')} SAVED ITEMS</strong>Stored locally in this browser</aside>
  </header>
  {#if storageError}<p class="saved-alert" role="status">Some saved items could not be read or stored. Check browser storage settings; this collection stays on this device.</p>{/if}
  <div class="saved-filters" aria-label="Filter saved items">
    {#each [{value:'all',label:'All'},{value:'papers',label:'Papers'},{value:'notes',label:'Notes & PDFs'},{value:'videos',label:'Videos'},{value:'educators',label:'Educators'},{value:'other',label:'Other'}] as option}
      <button type="button" class:active={filter === option.value} aria-pressed={filter === option.value} onclick={() => filter = option.value as typeof filter}>{option.label}</button>
    {/each}
  </div>
  <p class="saved-share-status" role="status" aria-live="polite">{shareMessage}</p>
  {#if loading}
    <div class="saved-state" role="status"><strong>Loading your saved collection…</strong><p>Reading bookmarks from this device.</p></div>
  {:else if loadError && items.length === 0}
    <div class="saved-state" role="alert"><strong>The saved catalogue could not be loaded.</strong><p>Your device-local bookmarks may still be available. Reconnect and try again.</p><button type="button" onclick={loadSaved}>Try again</button></div>
  {:else if items.length === 0}
    <div class="saved-state"><span class="state-kicker">YOUR STUDY SHELF</span><strong>Nothing saved yet.</strong><p>Bookmark any school paper, material, educator resource or chapter resource to keep it here.</p><a href={siteBase + '/materials/'}>Explore Materials Library ↗</a></div>
  {:else if visibleItems.length === 0}
    <div class="saved-state"><strong>No saved items in this category.</strong><p>Choose another filter to see the rest of your collection.</p><button type="button" onclick={() => filter = 'all'}>Show all saved items</button></div>
  {:else}
    {#if loadError}<p class="saved-alert" role="status">Catalogue status could not be checked. Your saved source links are still available below.</p>{/if}
    <section class="saved-list" aria-label="Saved resources">
      {#each visibleItems as item (item.id)}
        <article class="saved-card">
          <div class="saved-card-main"><span class="saved-card-type">{item.categories.map((category) => category === 'papers' ? 'PAPER' : category === 'notes' ? 'NOTES / PDF' : category === 'videos' ? 'VIDEO' : category === 'educators' ? 'EDUCATOR' : 'RESOURCE').join(' · ')}</span><h2>{item.title}</h2>{#if item.description}<p>{item.description}</p>{/if}<small>{item.sourceLabel}{#if catalogueChecked && !currentIds.has(item.id)} · No longer listed in the current catalogue{/if}</small></div>
          <div class="saved-card-actions"><a href={siteBase + item.pageUrl}>View in Compass ↗</a><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Open original source ↗</a><button type="button" onclick={() => void shareItem(item)}>Share</button><button type="button" class="remove-saved" onclick={() => removeItem(item.id)} aria-label={'Remove ' + item.title + ' from Saved'}>Remove</button></div>
        </article>
      {/each}
    </section>
  {/if}
  <p class="saved-note">Bookmarks are stored only in this browser. Clearing site data or switching devices can remove this list. Source links remain owned and controlled by their original publishers.</p>
</main>

<style>
  .saved-page{padding-bottom:90px}.saved-page .page-heading h1{color:#f1f5f9}.saved-page .page-intro{color:#a6b3c6}.saved-filters{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 8px;padding:12px;background:#101a2b;border:1px solid #263750}.saved-filters button,.saved-card-actions button{min-height:40px;padding:0 13px;color:#cbd5e1;background:#16243a;border:1px solid #354966;font-size:11px;font-weight:750;cursor:pointer}.saved-filters button.active{color:#06281e;background:#10b981;border-color:#10b981}.saved-share-status{min-height:18px;color:#9eafc5;font-size:10px}.saved-alert{padding:11px 13px;color:#f5d8a8;background:#33291a;border:1px solid #6b512b;font-size:11px}.saved-state{display:flex;min-height:220px;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:28px;background:#101a2b;border:1px dashed #354966;text-align:center}.saved-state strong{color:#f1f5f9;font:500 24px/1.2 var(--serif)}.saved-state p{max-width:520px;margin:0;color:#a6b3c6;font-size:11px;line-height:1.8}.saved-state a,.saved-state button{margin-top:5px;padding:10px 14px;color:#c7f5e4;background:#15372f;border:1px solid #286451;font-size:11px;font-weight:800}.saved-list{display:grid;gap:10px}.saved-card{display:flex;justify-content:space-between;gap:18px;padding:17px;background:#142137;border:1px solid #2a3b56;border-bottom:2px solid #334766}.saved-card-main{min-width:0}.saved-card-type{color:#73d6b0;font-size:9px;font-weight:850;letter-spacing:1px}.saved-card h2{margin:7px 0;color:#f1f5f9;font:500 20px/1.3 var(--serif);overflow-wrap:anywhere}.saved-card p{margin:0 0 7px;color:#a6b3c6;font-size:11px;line-height:1.7}.saved-card small{color:#8799b2;font-size:9px}.saved-card-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:6px;flex-shrink:0}.saved-card-actions a{display:inline-flex;min-height:40px;align-items:center;padding:0 12px;color:#c7f5e4;background:#15372f;border:1px solid #286451;font-size:10px;font-weight:800}.saved-card-actions .remove-saved{color:#f0c4b9;background:#35211f;border-color:#68413b}.saved-note{margin-top:20px;color:#91a2bb;font-size:10px;line-height:1.8}@media(max-width:640px){.saved-card{flex-direction:column}.saved-card-actions{justify-content:flex-start}.saved-card-actions a{flex:1;justify-content:center}}
</style>
