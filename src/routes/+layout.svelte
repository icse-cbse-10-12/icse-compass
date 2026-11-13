<script lang="ts">
  import '../styles.css';
  import { base } from '$app/paths';
  import IndependenceNotice from '$lib/IndependenceNotice.svelte';
  import { publicRoutes, siteOrigin, siteBase } from '$lib/site';
  const structuredData = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'EducationalOrganization', name: 'ICSE Compass', url: siteOrigin + siteBase + '/', description: 'An independent academic workspace for discovering ICSE learning resources, educators, and school papers.' },
    { '@type': 'WebSite', name: 'ICSE Compass', url: siteOrigin + siteBase + '/', inLanguage: 'en-IN' }
  ]};
</script>
<svelte:head>
  <meta name="robots" content="index,follow" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ICSE Compass" />
  <meta property="og:locale" content="en_IN" />
  <link rel="manifest" href="{base}/manifest.webmanifest" />
  <link rel="icon" href="{base}/favicon.svg" type="image/svg+xml" />
  <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
</svelte:head>
<div class="reading-progress" aria-hidden="true"></div>
<div class="app-shell">
  <header class="topbar">
    <a href="{base}/" class="brand" aria-label="ICSE Compass home"><span class="brand-mark" aria-hidden="true">◎</span><span>ICSE <strong>Compass</strong><small>YOUR ACADEMIC WORKSPACE</small></span></a>
    <nav class="desktop-nav" aria-label="Main navigation">{#each publicRoutes as route}<a href="{base}{route.path}">{route.label}</a>{/each}</nav>
    <span class="public-label"><span aria-hidden="true"></span> OPEN ACCESS</span>
  </header>
  <slot />
  <IndependenceNotice />
  <footer class="footer"><span>© {new Date().getFullYear()} ICSE Compass</span><span>Independent educational workspace · Not affiliated with CISCE</span></footer>
</div>
<nav class="mobile-nav" aria-label="Quick navigation">{#each publicRoutes as route}<a href="{base}{route.path}" aria-label={route.label}><span class="mobile-nav-mark" aria-hidden="true">{route.shortLabel === 'Overview' ? '⌂' : route.shortLabel === 'Materials' ? '▤' : route.shortLabel === 'Educators' ? '◎' : '▧'}</span><span>{route.shortLabel}</span></a>{/each}</nav>
