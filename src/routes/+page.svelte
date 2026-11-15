<script lang="ts">
  import { siteBase } from '#lib/site.ts';
</script>

<svelte:head>
  <title>ICSE Compass | A clearer way to find your study resources</title>
  <meta name="description" content="Discover verified ICSE learning resources and educator sources in one independent academic workspace." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/" />
  <meta property="og:title" content="ICSE Compass | A clearer way to find your study resources" />
  <meta property="og:description" content="A focused, independent academic workspace for ICSE learners." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/" />
</svelte:head>

<main>
  <section class="home-hero page-width">
    <div class="hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span> AN INDEPENDENT STUDY COMPANION <span class="eyebrow-year">EST. FOR ICSE LEARNERS</span></p>
      <h1>Find the right<br /><em>way forward.</em></h1>
      <p class="hero-description">A considered place to discover learning resources, explore educator sources and bring your ICSE study material into focus.</p>
      <div class="hero-actions">
        <a class="button button-primary" href="{siteBase}/materials/">Explore the library <span aria-hidden="true">↗</span></a>
        <a class="text-action" href="{siteBase}/creators/">Meet the educators <span aria-hidden="true">→</span></a>
      </div>
      <div class="hero-footnote"><span class="footnote-mark">✳</span> Independent discovery. Original sources. Clear direction.</div>
    </div>

    <div class="hero-art" aria-label="An abstract editorial illustration of a compass and study index" role="img">
      <div class="art-topline"><span>THE STUDY INDEX</span><span>01 / 04</span></div>
      <div class="art-grid"></div>
      <div class="art-compass">
        <div class="compass-ring compass-ring-outer"></div>
        <div class="compass-ring compass-ring-inner"></div>
        <div class="compass-axis"></div>
        <div class="compass-needle"></div>
        <span class="compass-north">N</span><span class="compass-east">E</span><span class="compass-south">S</span><span class="compass-west">W</span>
        <span class="compass-centre"></span>
      </div>
      <div class="art-index"><span class="index-number">A.</span><span>Find a source</span><span class="index-arrow">↗</span></div>
      <div class="art-note"><span class="note-kicker">A BETTER START</span><strong>Less searching.<br />More studying.</strong><span class="note-line"></span><span class="note-small">A workspace built around clarity.</span></div>
      <div class="art-bottomline"><span>ICSE COMPASS</span><span>INDEPENDENT / 2026</span></div>
    </div>
  </section>

  <section class="discovery-section page-width" aria-labelledby="discovery-title">
    <div class="section-intro">
      <div><p class="eyebrow"><span class="eyebrow-rule"></span> START WITH WHAT YOU NEED</p><h2 id="discovery-title">Your study, <em>better organised.</em></h2></div>
      <p>Three clear ways into the learning material and sources you are looking for.</p>
    </div>

    <div class="destination-grid">
      <a class="destination-card destination-featured" href="{siteBase}/materials/">
        <span class="destination-index">01 / LIBRARY</span>
        <span class="destination-symbol symbol-library" aria-hidden="true"><svg viewBox="0 0 72 72" fill="none"><path d="M14 17.5h29a8 8 0 0 1 8 8v30H22a8 8 0 0 1-8-8v-30Z" stroke="currentColor" stroke-width="1.5"/><path d="M22 55.5V25a7.5 7.5 0 0 1 7.5-7.5H58v30a8 8 0 0 1-8 8H22Z" stroke="currentColor" stroke-width="1.5"/><path d="M30 29h19M30 36h19M30 43h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        <span class="destination-title">Materials Library</span>
        <span class="destination-description">Search approved notes, worksheets and learning resources by subject, chapter and format.</span>
        <span class="destination-bottom"><span>SEARCH THE CATALOGUE</span><span class="destination-arrow">↗</span></span>
      </a>

      <a class="destination-card" href="{siteBase}/creators/">
        <span class="destination-index">02 / PEOPLE</span>
        <span class="destination-symbol symbol-people" aria-hidden="true"><svg viewBox="0 0 72 72" fill="none"><circle cx="36" cy="25" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M16 58c1.8-10.4 8.5-15.5 20-15.5S54.2 47.6 56 58" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 15h9M55 15h9M36 5v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        <span class="destination-title">Educators</span>
        <span class="destination-description">Explore educator profiles and find resources attributed to their original sources.</span>
        <span class="destination-bottom"><span>EXPLORE PROFILES</span><span class="destination-arrow">↗</span></span>
      </a>

      <a class="destination-card" href="{siteBase}/school-papers/">
        <span class="destination-index">03 / PRACTICE</span>
        <span class="destination-symbol symbol-papers" aria-hidden="true"><svg viewBox="0 0 72 72" fill="none"><path d="M19 11.5h24l11 11v38H19v-49Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M43 11.5v12h11M28 34h18M28 42h18M28 50h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        <span class="destination-title">School Papers</span>
        <span class="destination-description">A dedicated directory for verified school-level practice and examination papers.</span>
        <span class="destination-bottom"><span>VIEW PAPER DIRECTORY</span><span class="destination-arrow">↗</span></span>
      </a>
    </div>
  </section>

  <section class="principle-band">
    <div class="page-width principle-inner"><span class="principle-mark">“</span><p>Good study starts with <em>good sources.</em></p><span class="principle-caption">A SIMPLE PRINCIPLE. A CLEARER WORKSPACE.</span></div>
  </section>
</main>
