<script lang="ts">
  import { siteBase } from '#lib/site.ts';
</script>

<svelte:head>
  <title>ICSE Compass | Find your next study source</title>
  <meta name="description" content="An independent academic index for discovering ICSE learning resources, educator sources and school-level practice." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/" />
  <meta property="og:title" content="ICSE Compass | Find your next study source" />
  <meta property="og:description" content="Discover ICSE learning resources, original educator sources and school-level practice in one independent academic index." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/" />
</svelte:head>

<main class="home-page">
  <section class="home-hero page-width" aria-labelledby="home-title">
    <div class="hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span> AN INDEPENDENT ACADEMIC INDEX <span class="eyebrow-year">FOR ICSE LEARNERS</span></p>
      <h1 id="home-title">Your ICSE study sources,<br /><em>in one clear index.</em></h1>
      <p class="hero-description">Find learning material by subject and chapter, discover the educators behind original sources, and move towards useful practice — without losing track of where it came from.</p>
      <div class="hero-actions">
        <a class="button button-primary" href="{siteBase}/materials/">Browse materials <span aria-hidden="true">↗</span></a>
        <a class="text-action" href="{siteBase}/creators/">Explore educators <span aria-hidden="true">→</span></a>
      </div>
      <div class="hero-footnote"><span class="footnote-mark" aria-hidden="true">✳</span> Independent discovery. Original sources. Clear attribution.</div>
    </div>

    <aside class="hero-product-panel" aria-labelledby="hero-index-title">
      <div class="product-panel-heading">
        <div>
          <span class="panel-kicker">THE ICSE COMPASS INDEX</span>
          <h2 id="hero-index-title">A better place to begin.</h2>
        </div>
        <span class="panel-edition">01 <i>/</i> 03</span>
      </div>

      <a class="hero-search-link" href="{siteBase}/materials/" aria-label="Open Materials Library to search by subject, chapter or source">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.5"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span>Search by subject, chapter or source</span>
        <span class="search-action" aria-hidden="true">↗</span>
      </a>

      <nav class="subject-shortcuts" aria-label="Quick subject searches">
        <a href="{siteBase}/materials/?q=Physics">Physics</a>
        <a href="{siteBase}/materials/?q=Chemistry">Chemistry</a>
        <a href="{siteBase}/materials/?q=Mathematics">Mathematics</a>
        <a href="{siteBase}/materials/?q=Biology">Biology</a>
        <a href="{siteBase}/materials/?q=History%20%26%20Civics">History &amp; Civics</a>
        <a href="{siteBase}/materials/?q=Computer">Computer</a>
      </nav>

      <nav class="hero-index-list" aria-label="Explore the ICSE Compass index">
        <a class="hero-index-row" href="{siteBase}/materials/">
          <span class="index-ordinal">01</span>
          <span class="index-row-copy"><strong>Materials library</strong><small>Notes, worksheets and learning resources</small></span>
          <span class="index-row-meta">RESOURCE INDEX</span>
          <span class="index-row-arrow" aria-hidden="true">↗</span>
        </a>
        <a class="hero-index-row" href="{siteBase}/creators/">
          <span class="index-ordinal">02</span>
          <span class="index-row-copy"><strong>Educator sources</strong><small>Explore profiles and original teaching sources</small></span>
          <span class="index-row-meta">SOURCE PROFILES</span>
          <span class="index-row-arrow" aria-hidden="true">↗</span>
        </a>
        <a class="hero-index-row" href="{siteBase}/school-papers/">
          <span class="index-ordinal">03</span>
          <span class="index-row-copy"><strong>School papers</strong><small>Find school-level practice and exam papers</small></span>
          <span class="index-row-meta">PRACTICE</span>
          <span class="index-row-arrow" aria-hidden="true">↗</span>
        </a>
      </nav>

      <div class="product-panel-footer"><span>INDEPENDENT BY DESIGN</span><span>FOLLOW THE SOURCE <b>↗</b></span></div>
      <span class="panel-watermark" aria-hidden="true">C</span>
    </aside>
  </section>

  <section class="home-method page-width" aria-labelledby="method-title">
    <div class="method-intro">
      <p class="eyebrow"><span class="eyebrow-rule"></span> A MORE CONSIDERED WAY TO STUDY</p>
      <h2 id="method-title">Find it. Trace it.<br /><em>Make it useful.</em></h2>
      <p>Good study material is easier to use when its subject, context and original source are clear. Compass brings those details closer together.</p>
    </div>

    <div class="method-steps">
      <div class="method-step">
        <span class="step-number">01 <i>—</i> DISCOVER</span>
        <h3>Start with the subject.</h3>
        <p>Browse the materials index by the topic, chapter or format you need.</p>
      </div>
      <div class="method-step">
        <span class="step-number">02 <i>—</i> TRACE</span>
        <h3>Know where it came from.</h3>
        <p>Explore educator profiles and follow resources back to their original sources.</p>
      </div>
      <div class="method-step">
        <span class="step-number">03 <i>—</i> CONTINUE</span>
        <h3>Choose your next step.</h3>
        <p>Move from discovery to school-level practice when verified papers are available.</p>
      </div>
    </div>
  </section>

  <section class="home-principle" aria-label="ICSE Compass principle">
    <div class="page-width principle-inner">
      <span class="principle-mark" aria-hidden="true">“</span>
      <p>Good study starts with <em>good sources.</em></p>
      <a href="{siteBase}/materials/">Explore the index <span aria-hidden="true">↗</span></a>
    </div>
  </section>
</main>

<style>
  .home-page { overflow: clip; }
  .home-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(430px, .92fr);
    align-items: center;
    gap: clamp(38px, 6vw, 82px);
    min-height: 650px;
    padding-block: 78px 88px;
  }
  .hero-copy { max-width: 610px; }
  .hero-copy h1 { max-width: 740px; margin: 27px 0 22px; font-size: clamp(42px, 4.1vw, 58px); line-height: 1.08; letter-spacing: -2.3px; }
  .hero-copy h1 em { color: var(--green); font-weight: 400; }
  .hero-description { max-width: 510px; font-size: 13px; line-height: 1.95; }
  .hero-actions { gap: 22px; margin-top: 30px; }
  .hero-footnote { margin-top: 39px; }
  .hero-product-panel {
    position: relative;
    isolation: isolate;
    min-width: 0;
    padding: 27px 28px 18px;
    overflow: hidden;
    background: #fcfbf7;
    border: 1px solid #dcd5c7;
    box-shadow: 0 2px 8px rgba(37, 41, 35, .08);
    transform: perspective(1000px) translateY(0) rotateX(0) rotateY(0);
    transform-style: preserve-3d;
    transition: transform 220ms cubic-bezier(.2, .75, .25, 1), box-shadow 220ms ease;
  }
  @media (hover: hover) and (pointer: fine) {
    .hero-product-panel { will-change: transform; }
    .hero-product-panel:hover { transform: perspective(1000px) rotateX(1.2deg) rotateY(-1.2deg) translateY(-2px); box-shadow: 0 12px 28px rgba(37, 41, 35, .09); }
  }
  .product-panel-heading, .product-panel-footer { position: relative; z-index: 1; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .panel-kicker, .panel-edition { color: #4a5046; font-size: 12px; font-weight: 700; letter-spacing: 1.1px; }
  .product-panel-footer { color: #4a5046; font-size: 9px; font-weight: 750; letter-spacing: 1px; }
  .product-panel-heading h2 { margin: 13px 0 0; color: var(--ink); font: 500 clamp(25px, 2.6vw, 34px)/1.12 var(--serif); letter-spacing: -.7px; }
  .panel-edition { white-space: nowrap; }
  .panel-edition i { color: #9aa397; font-style: normal; }
  .subject-shortcuts { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 7px; margin-top: 11px; }
  .subject-shortcuts a { display: inline-flex; align-items: center; min-height: 29px; padding: 5px 10px; color: #356b58; background: #f3f5ef; border: 1px solid #d8dfd3; font-size: 10px; font-weight: 650; line-height: 1.2; transition: background .18s ease, border-color .18s ease, color .18s ease; }
  .subject-shortcuts a:hover, .subject-shortcuts a:focus-visible { color: #244d3e; background: #eaf0e8; border-color: #9eb5a4; }
  .subject-shortcuts a:focus-visible { outline: 2px solid #356b58; outline-offset: 2px; }
  .hero-search-link {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 13px;
    min-height: 56px; margin-top: 29px; padding: 0 15px;
    color: #667064; background: rgba(255, 254, 250, .88);
    border: 1px solid #d3d9cf; font-size: 10px; font-weight: 650;
    transition: border-color .18s ease, background .18s ease, transform .18s ease;
  }
  .hero-search-link:hover { border-color: #8da493; background: #fffefa; transform: translateY(-1px); }
  .hero-search-link svg { width: 19px; height: 19px; flex: 0 0 auto; color: var(--green); }
  .search-action { margin-left: auto; color: var(--green); font-size: 15px; }
  .hero-index-list { position: relative; z-index: 1; margin-top: 17px; border-top: 1px solid #cfd7cc; }
  @keyframes indexRowEnter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hero-index-row { display: flex; align-items: center; gap: 15px; min-height: 79px; padding: 12px 4px; border-bottom: 1px solid #cfd7cc; transition: padding .18s ease, color .18s ease; animation: indexRowEnter 360ms cubic-bezier(.2, .75, .25, 1) both; }
  .hero-index-row:nth-child(1) { animation-delay: 60ms; }
  .hero-index-row:nth-child(2) { animation-delay: 120ms; }
  .hero-index-row:nth-child(3) { animation-delay: 180ms; }
  .hero-index-row:hover { padding-inline: 9px; color: var(--green); }
  .index-ordinal { align-self: flex-start; padding-top: 3px; color: #68816f; font: 500 17px var(--serif); }
  .index-row-copy { display: flex; min-width: 0; flex-direction: column; gap: 5px; }
  .index-row-copy strong { color: var(--ink); font: 500 19px/1.1 var(--serif); }
  .index-row-copy small { color: #737b70; font-size: 9px; line-height: 1.5; }
  .index-row-meta { margin-left: auto; padding: 5px 7px; color: #356b58; background: #eef2eb; border: 1px solid #d8e0d5; font-size: 8px; font-weight: 750; letter-spacing: .55px; white-space: nowrap; }
  .index-row-arrow { color: var(--green); font-size: 16px; transition: transform 180ms ease; }
  .hero-index-row:hover .index-row-arrow, .hero-index-row:focus-visible .index-row-arrow { transform: translate(2px, -2px); }
  .product-panel-footer { margin-top: 18px; font-size: 7px; letter-spacing: 1.1px; }
  .product-panel-footer b { margin-left: 5px; font-size: 12px; font-weight: 400; }
  .panel-watermark { position: absolute; z-index: 0; right: -8px; bottom: -77px; color: rgba(53, 107, 88, .045); font: 500 260px/.8 var(--serif); pointer-events: none; }
  .home-method { display: grid; grid-template-columns: minmax(230px, .8fr) minmax(0, 1.4fr); gap: clamp(38px, 8vw, 112px); padding-block: 78px 92px; border-top: 1px solid var(--line); }
  .method-intro h2 { margin: 19px 0 17px; color: var(--ink); font: 500 clamp(36px, 4vw, 49px)/1.08 var(--serif); letter-spacing: -1.4px; }
  .method-intro h2 em { color: var(--green); font-weight: 400; }
  .method-intro > p:last-child { max-width: 360px; margin: 0; color: #70766d; font-size: 11px; line-height: 1.9; }
  .method-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-content: center; }
  .method-step { min-width: 0; padding: 8px 19px 8px 21px; border-left: 1px solid #d4d8ce; }
  .step-number { color: var(--green); font-size: 8px; font-weight: 850; letter-spacing: 1.2px; }
  .step-number i { color: #9ba398; font-style: normal; }
  .method-step h3 { margin: 20px 0 10px; color: var(--ink); font: 500 21px/1.16 var(--serif); }
  .method-step p { margin: 0; color: #73796f; font-size: 10px; line-height: 1.8; }
  .home-principle { background: #e7e9df; border-block: 1px solid #d8ddd1; }
  .home-principle .principle-inner { min-height: 145px; }
  .home-principle .principle-inner > a { display: inline-flex; align-items: center; gap: 10px; margin-left: auto; color: var(--green); font-size: 9px; font-weight: 850; letter-spacing: .7px; white-space: nowrap; }
  .home-principle .principle-inner > a:hover { color: var(--green-dark); }
  @media (prefers-reduced-motion: reduce) {
    .hero-product-panel, .hero-index-row, .index-row-arrow { animation: none !important; transition: none !important; transform: none !important; will-change: auto !important; }
  }
  @media (max-width: 1050px) {
    .home-hero { grid-template-columns: minmax(0, 1fr) minmax(360px, .95fr); gap: 34px; min-height: 590px; padding-block: 64px 72px; }
    .hero-product-panel { padding-inline: 22px; }
    .hero-copy h1 { font-size: clamp(42px, 4.2vw, 56px); }
    .home-method { gap: 42px; }
    .method-step { padding-inline: 14px; }
  }
  @media (max-width: 760px) {
    .home-hero { grid-template-columns: 1fr; gap: 38px; min-height: 0; padding-block: 58px 62px; }
    .hero-copy h1 { max-width: 620px; font-size: clamp(48px, 9vw, 68px); }
    .hero-product-panel { max-width: 620px; }
    .home-method { grid-template-columns: 1fr; gap: 33px; padding-block: 57px 66px; }
    .method-intro h2 { font-size: 42px; }
    .method-steps { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .home-principle .principle-inner { flex-wrap: wrap; gap: 10px 15px; padding-block: 24px; }
    .home-principle .principle-inner > a { margin-left: 0; }
  }
  @media (max-width: 600px) {
    .home-hero { gap: 31px; padding-block: 48px 48px; }
    .hero-copy h1 { margin-top: 22px; font-size: clamp(42px, 9.5vw, 54px); letter-spacing: -2px; }
    .hero-description { font-size: 12px; line-height: 1.85; }
    .hero-actions { gap: 9px 16px; margin-top: 22px; }
    .hero-footnote { margin-top: 26px; font-size: 8px; }
    .hero-product-panel { padding: 21px 17px 15px; }
    .product-panel-heading h2 { font-size: 27px; }
    .hero-search-link { min-height: 52px; gap: 9px; margin-top: 22px; padding-inline: 11px; font-size: 10px; }
    .subject-shortcuts { gap: 6px; margin-top: 9px; }
    .subject-shortcuts a { min-height: 28px; padding-inline: 8px; font-size: 9px; }
    .index-row-meta { padding: 4px 5px; font-size: 7px; }
    .hero-index-row { min-height: 73px; gap: 11px; }
    .index-row-copy strong { font-size: 18px; }
    .index-row-copy small { font-size: 8px; }
    .product-panel-footer { font-size: 6px; letter-spacing: .8px; }
    .home-method { gap: 28px; padding-block: 48px 53px; }
    .method-intro h2 { margin-block: 15px 12px; font-size: 37px; }
    .method-steps { grid-template-columns: 1fr; }
    .method-step { display: grid; grid-template-columns: 105px minmax(0, 1fr); gap: 8px 12px; padding: 17px 0; border-left: 0; border-top: 1px solid #d4d8ce; }
    .step-number { grid-row: span 2; padding-top: 4px; }
    .method-step h3 { margin: 0; font-size: 20px; }
    .method-step p { grid-column: 2; }
    .home-principle .principle-inner { min-height: 112px; gap: 8px 12px; }
    .home-principle .principle-mark { font-size: 45px; }
    .home-principle .principle-inner p { font-size: 23px; }
  }
  @media (max-width: 370px) {
    .hero-copy h1 { font-size: 42px; }
    .hero-product-panel { padding-inline: 13px; }
    .hero-index-row { gap: 8px; }
    .index-row-copy strong { font-size: 17px; }
    .index-row-copy small { font-size: 7px; }
    .method-step { grid-template-columns: 88px minmax(0, 1fr); }
  }
</style>
