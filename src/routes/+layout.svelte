<script lang="ts">
  import '../styles.css';
  import IndependenceNotice from '#lib/IndependenceNotice.svelte';
  import { publicRoutes, privacyPath, siteOrigin, siteBase } from '#lib/site.ts';
  import { page } from '$app/state';

  const homeUrl = siteOrigin + siteBase + '/';
  const mobileRoutes = publicRoutes.filter((route) => ['Overview', 'Materials', 'Papers', 'Saved', 'Syllabus'].includes(route.shortLabel));
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
  <meta name="robots" content="index,follow" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ICSE Compass" />
  <meta property="og:locale" content="en_IN" />
  <meta name="twitter:card" content="summary" />
  <link rel="manifest" href="{siteBase}/manifest.webmanifest" />
  <link rel="icon" href="{siteBase}/favicon.svg" type="image/svg+xml" />
  <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
</svelte:head>

<div class="app-shell">
  <header class="topbar">
    <a href="{siteBase}/" class="brand" aria-label="ICSE Compass home">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="17.5" stroke="currentColor"/><circle cx="20" cy="20" r="2.2" fill="currentColor"/><path d="M24.5 12.5 21.2 21.2 12.5 24.5l3.3-8.7 8.7-3.3Z" stroke="currentColor" stroke-linejoin="round"/><path d="M20 2v4M38 20h-4M20 38v-4M2 20h4" stroke="currentColor" stroke-linecap="round"/></svg>
      </span>
      <span class="brand-copy"><span class="brand-name">ICSE <strong>Compass</strong></span><span class="brand-caption">AN INDEPENDENT ACADEMIC GUIDE</span></span>
    </a>

    <nav class="desktop-nav" aria-label="Main navigation">
      {#each publicRoutes as route}
        <a href="{siteBase}{route.path}" class="nav-link" aria-current={page.url.pathname === siteBase + route.path ? "page" : undefined}>{route.label}</a>
      {/each}
    </nav>
    <span class="public-label"><span aria-hidden="true"></span> OPEN ACCESS</span>
  </header>

  <slot />

  <IndependenceNotice />
  <footer class="footer">
    <a href="{siteBase}/" class="footer-brand">ICSE <strong>Compass</strong></a>
    <span>Independent educational workspace · Not affiliated with CISCE</span>
    <a class="footer-link" href="{siteBase}{privacyPath}">Privacy <span aria-hidden="true">↗</span></a>
  </footer>
</div>

<nav class="mobile-nav" aria-label="Quick navigation">
  {#each mobileRoutes as route}
    <a href="{siteBase}{route.path}" aria-label={route.label} aria-current={page.url.pathname === siteBase + route.path ? "page" : undefined}>
      <span class="mobile-nav-icon" aria-hidden="true">
        {#if route.shortLabel === 'Overview'}
          <svg viewBox="0 0 24 24" fill="none"><path d="m3.5 10 8.5-7 8.5 7v10.5h-6v-6h-5v6h-6V10Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        {:else if route.shortLabel === 'Materials'}
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 3.5h10l4 4v13H5v-17Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14.5 3.5v4h4M8 12h8M8 15.5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        {:else if route.shortLabel === 'Educators'}
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 20c.7-3.7 3.2-5.5 7.5-5.5s6.8 1.8 7.5 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        {:else if route.shortLabel === 'Papers'}
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {:else if route.shortLabel === 'Saved'}
          <svg viewBox="0 0 24 24" fill="none"><path d="M6 3.5h12v17l-6-4-6 4v-17Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        {:else if route.shortLabel === 'Syllabus'}
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 4.5h14v15H5zM8.5 9l1.8 1.8L14.5 7M8.5 15h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {:else if route.shortLabel === 'Player'}
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v14H4zM10 8l6 4-6 4V8Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {/if}
      </span>
      <span>{route.shortLabel}</span>
    </a>
  {/each}
</nav>
