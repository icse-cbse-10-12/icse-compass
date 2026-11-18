<script lang="ts">
  import '../styles.css';
  import IndependenceNotice from '#lib/IndependenceNotice.svelte';
  import { publicRoutes, privacyPath, siteOrigin, siteBase } from '#lib/site.ts';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { BOOKMARK_STORAGE_KEY } from '#lib/bookmarks.ts';

  let menuOpen = $state(false);
  let searchOpen = $state(false);
  let savedCount = $state(0);
  let splashVisible = $state(false);
  let splashLeaving = $state(false);
  let searchQuery = $state('');
  let searchInput: HTMLInputElement;

  function refreshSavedCount() {
    try {
      const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (!raw) { savedCount = 0; return; }
      const parsed: unknown = JSON.parse(raw);
      savedCount = parsed && typeof parsed === 'object' && (parsed as { version?: unknown }).version === 2 && Array.isArray((parsed as { items?: unknown }).items)
        ? (parsed as { items: unknown[] }).items.length : 0;
    } catch { savedCount = 0; }
  }

  function closePanels() { menuOpen = false; searchOpen = false; }
  function openSearch() {
    menuOpen = false;
    searchOpen = true;
    requestAnimationFrame(() => searchInput?.focus());
  }
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') { closePanels(); return; }
    const target = event.target;
    const isTyping = target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    if (isTyping) return;
    if (event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      openSearch();
    }
  }

  onMount(() => {
    refreshSavedCount();
    const splashTimers: number[] = [];
    try {
      const hasSeenSplash = window.sessionStorage.getItem('compassSplashShown') === 'true';
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!hasSeenSplash && !prefersReducedMotion) {
        window.sessionStorage.setItem('compassSplashShown', 'true');
        splashVisible = true;
        splashTimers.push(window.setTimeout(() => { splashLeaving = true; }, 930));
        splashTimers.push(window.setTimeout(() => { splashVisible = false; }, 1180));
      }
    } catch {
      // If session storage is unavailable, skip the splash rather than replay it on every visit.
    }
    const handleStorage = (event: StorageEvent) => { if (!event.key || event.key === BOOKMARK_STORAGE_KEY) refreshSavedCount(); };
    const handleBookmarkChange = () => refreshSavedCount();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('icse-compass:bookmarks-changed', handleBookmarkChange);
    window.addEventListener('keydown', handleKeydown);
    return () => { splashTimers.forEach((timer) => window.clearTimeout(timer)); window.removeEventListener('storage', handleStorage); window.removeEventListener('icse-compass:bookmarks-changed', handleBookmarkChange); window.removeEventListener('keydown', handleKeydown); };
  });

  const homeUrl = siteOrigin + siteBase + '/';

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'ICSE Compass',
        url: homeUrl,
        description: 'An independent academic workspace for discovering ICSE learning resources and educator sources.',
        inLanguage: 'en-IN'
      },
      {
        '@type': 'WebApplication',
        name: 'ICSE Compass',
        url: homeUrl,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any',
        description: 'An independent resource-discovery workspace for learners following the ICSE curriculum.'
      }
    ]
  };
</script>

<svelte:head>
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ICSE Compass" />
  <meta property="og:locale" content="en_IN" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="og:image" content="https://icse-cbse-10-12.github.io/icse-compass/og-compass.png" />
  <meta name="twitter:image" content="https://icse-cbse-10-12.github.io/icse-compass/og-compass.png" />
  <link rel="manifest" href="{siteBase}/manifest.webmanifest" />
  <link rel="icon" href="{siteBase}/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" sizes="180x180" href="{siteBase}/apple-touch-icon.png" />
  <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
</svelte:head>

{#if splashVisible}
  <div class="compass-splash" class:is-leaving={splashLeaving} aria-hidden="true">
    <div class="splash-content">
      <svg class="splash-logo" viewBox="0 0 64 64" width="64" height="64" fill="none" aria-hidden="true">
        <circle class="draw-circle" cx="32" cy="32" r="28" stroke="#10b981" stroke-width="2.5" />
        <polygon class="draw-needle" points="32,14 38,32 32,50 26,32" stroke="#f8fafc" stroke-width="2" />
        <circle class="draw-dot" cx="32" cy="32" r="2.5" fill="#10b981" />
      </svg>
      <div class="splash-title">ICSE <span>Compass</span></div>
      <div class="splash-sub">OPEN ACCESS STUDY LIBRARY</div>
    </div>
  </div>
{/if}

<div class="app-shell">
  <header class="topbar">
    <a href="{siteBase}/" class="brand" aria-label="ICSE Compass home" onclick={closePanels}>
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="17.5" stroke="currentColor"/><circle cx="20" cy="20" r="2.2" fill="currentColor"/><path d="M24.5 12.5 21.2 21.2 12.5 24.5l3.3-8.7 8.7-3.3Z" stroke="currentColor" stroke-linejoin="round"/><path d="M20 2v4M38 20h-4M20 38v-4M2 20h4" stroke="currentColor" stroke-linecap="round"/></svg>
      </span>
      <span class="brand-copy"><span class="brand-name">ICSE <strong>Compass</strong></span><span class="brand-caption">AN INDEPENDENT ACADEMIC GUIDE</span></span>
    </a>

    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="{siteBase}/" class="nav-link" aria-current={page.url.pathname === siteBase + "/" ? "page" : undefined}>Overview</a>
      <details class="nav-dropdown" open={['/materials/','/creators/','/school-papers/'].some((path) => page.url.pathname === siteBase + path)}>
        <summary aria-haspopup="true">Library <span aria-hidden="true">⌄</span></summary>
        <div class="nav-dropdown-menu">
          {#each publicRoutes.filter((route) => ['/materials/','/creators/','/school-papers/'].includes(route.path)) as route}
            <a href="{siteBase}{route.path}" aria-current={page.url.pathname === siteBase + route.path ? "page" : undefined}><span class="nav-dropdown-item-title">{route.label}</span><span class="nav-dropdown-item-description">{route.path === '/materials/' ? 'Notes, lessons & resources' : route.path === '/creators/' ? 'Educator collections' : 'Prelims & board practice'}</span></a>
          {/each}
        </div>
      </details>
      {#each publicRoutes.filter((route) => ['/saved/','/syllabus/','/chapter-player/'].includes(route.path)) as route}
        <a href="{siteBase}{route.path}" class="nav-link" aria-current={page.url.pathname === siteBase + route.path ? "page" : undefined}>{route.label}</a>
      {/each}
    </nav>
    <span class="public-label" title="Browse without creating a student account">OPEN ACCESS</span>
    <div class="mobile-header-actions">
      <button class="mobile-header-button" type="button" aria-label="Search the library" onclick={openSearch}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      <button class="mobile-header-button" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu-panel" onclick={() => { searchOpen = false; menuOpen = !menuOpen; }}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{#if menuOpen}<path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>{:else}<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>{/if}</svg></button>
    </div>
  </header>

  {#if menuOpen}
    <button class="mobile-panel-scrim" type="button" aria-label="Close navigation menu" onclick={() => menuOpen = false}></button>
  {/if}
  <aside id="mobile-menu-panel" class:open={menuOpen} class="mobile-menu-panel" aria-label="More navigation" aria-hidden={!menuOpen}>
    <div class="mobile-menu-head"><span>YOUR COMPASS</span><span class="mobile-open-access"><i></i> OPEN ACCESS</span></div>
    <section class="mobile-menu-section" aria-labelledby="menu-explore-title">
      <h2 id="menu-explore-title">Explore resources</h2>
      <a href="{siteBase}/chapter-player/" onclick={closePanels}><span>Chapter Player</span><small class="menu-feature-pill">FOCUS MODE</small></a>
      <a href="{siteBase}/school-papers/" onclick={closePanels}>School &amp; Board Papers</a>
      <a href="{siteBase}/creators/" onclick={closePanels}>Credited Educators</a>
    </section>
    <section class="mobile-menu-section" aria-labelledby="menu-space-title">
      <h2 id="menu-space-title">Your study space</h2>
      <a href="{siteBase}/syllabus/#backup-controls" onclick={closePanels}>Backup / Restore Progress</a>
      <a href="{siteBase}/#independence-notice" onclick={closePanels}>About &amp; CISCE Disclaimer</a>
    </section>
    <p class="mobile-menu-footnote">Browse freely. Follow original sources. Your syllabus progress stays on this device.</p>
  </aside>

  {#if searchOpen}
    <div class="mobile-search-overlay" role="dialog" aria-modal="true" aria-labelledby="mobile-search-title">
      <div class="mobile-search-top"><strong id="mobile-search-title">Search ICSE Compass</strong><button type="button" class="mobile-search-close" aria-label="Close search" onclick={() => searchOpen = false}>×</button></div>
      <form class="mobile-search-form" action={siteBase + '/materials/'} method="get" role="search">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <input bind:this={searchInput} name="q" type="search" bind:value={searchQuery} placeholder="Search notes, subjects, papers…" aria-label="Search notes, subjects and papers" />
        <button type="submit" disabled={!searchQuery.trim()}>Search</button>
      </form>
      <p>Try “Physics”, “Julius Caesar” or “specimen papers”. Press / or Ctrl+K to search.</p>
    </div>
  {/if}

  <slot />

  <IndependenceNotice />
  <footer class="footer">
    <a href="{siteBase}/" class="footer-brand">ICSE <strong>Compass</strong></a>
    <span>Independent educational workspace · Not affiliated with CISCE</span>
    <a class="footer-link" href="{siteBase}{privacyPath}">Privacy <span aria-hidden="true">↗</span></a>
  </footer>
</div>

<nav class="mobile-nav" aria-label="Primary navigation">
  <a href="{siteBase}/" aria-label="Home" aria-current={page.url.pathname === siteBase + "/" ? "page" : undefined}>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3.5 10 8.5-7 8.5 7v10.5h-6v-6h-5v6h-6V10Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg><span>Home</span>
  </a>
  <a href="{siteBase}/materials/" aria-label="Library" aria-current={page.url.pathname.startsWith(siteBase + "/materials") ? "page" : undefined}>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3.5h10l4 4v13H5v-17Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14.5 3.5v4h4M8 12h8M8 15.5h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span>Library</span>
  </a>
  <a href="{siteBase}/syllabus/" aria-label="Syllabus" aria-current={page.url.pathname.startsWith(siteBase + "/syllabus") ? "page" : undefined}>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4.5h14v15H5zM8.5 9l1.8 1.8L14.5 7M8.5 15h7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Syllabus</span>
  </a>
  <a href="{siteBase}/saved/" aria-label={savedCount ? 'Saved, ' + savedCount + ' items' : 'Saved'} aria-current={page.url.pathname.startsWith(siteBase + "/saved") ? "page" : undefined}>
    <span class="mobile-saved-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3.5h12v17l-6-4-6 4v-17Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>{#if savedCount > 0}<span class="saved-count-badge">{savedCount > 99 ? '99+' : savedCount}</span>{/if}</span><span>Saved</span>
  </a>
</nav>
