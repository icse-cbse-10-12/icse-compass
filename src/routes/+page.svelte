<script lang="ts">
  import { goto } from '$app/navigation';
  import { siteBase } from '#lib/site.ts';

  let searchQuery = $state('');

  function handleSearch(event: SubmitEvent) {
    event.preventDefault();
    const query = searchQuery.trim();
    void goto(query ? `${siteBase}/materials/?q=${encodeURIComponent(query)}` : `${siteBase}/materials/`);
  }
</script>

<svelte:head>
  <title>ICSE Compass | One clear next step for ICSE study</title>
  <meta name="description" content="When the ICSE syllabus feels big, start with one subject or topic. Find learning resources and plan your next small study step with ICSE Compass." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/" />
  <meta property="og:title" content="ICSE Compass | One clear next step for ICSE study" />
  <meta property="og:description" content="Start with one subject or topic. Find learning resources and choose your next small study step." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/" />
</svelte:head>

<main class="home-page">
  <section class="home-hero page-width" aria-labelledby="home-title">
    <div class="hero-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span> A CALMER PLACE TO BEGIN <span class="eyebrow-year">FOR ICSE LEARNERS</span></p>
      <h1 id="home-title">You don't have to study it all today.<br /><em>Start with one topic.</em></h1>
      <p class="hero-description">When the syllabus feels big, don't begin with the whole thing. Pick one subject or search one topic. Find a useful resource, then decide what comes next.</p>

      <div class="hero-actions">
        <a class="button button-primary home-primary" href={`${siteBase}/materials/`}>Find a study resource <span aria-hidden="true">↗</span></a>
        <a class="text-action" href={`${siteBase}/syllabus/`}>Set up my syllabus <span aria-hidden="true">→</span></a>
      </div>

      <div class="hero-footnote"><span class="footnote-mark" aria-hidden="true">✳</span> One subject. One resource. One next step.</div>
    </div>

    <aside class="hero-product-panel" aria-labelledby="hero-index-title">
      <div class="product-panel-heading">
        <div>
          <span class="panel-kicker">YOUR NEXT SMALL STEP</span>
          <h2 id="hero-index-title">What are you studying today?</h2>
        </div>
        <span class="panel-edition">TAKE IT AT YOUR PACE</span>
      </div>

      <form class="hero-search-form" onsubmit={handleSearch}>
        <label class="hero-search-label" for="homepage-search">Search a subject, chapter or resource</label>
        <div class="hero-search-field">
          <input id="homepage-search" type="search" bind:value={searchQuery} placeholder="Try Physics, Biology, or a topic…" aria-label="Search by subject, chapter or source" />
          <button type="submit">Search <span aria-hidden="true">↗</span></button>
        </div>
      </form>

      <nav class="subject-shortcuts" aria-label="Quick subject searches">
        <a class="subject-physics" href={`${siteBase}/materials/?q=Physics`}>Physics</a>
        <a class="subject-chemistry" href={`${siteBase}/materials/?q=Chemistry`}>Chemistry</a>
        <a class="subject-mathematics" href={`${siteBase}/materials/?q=Mathematics`}>Mathematics</a>
        <a class="subject-biology" href={`${siteBase}/materials/?q=Biology`}>Biology</a>
        <a class="subject-english" href={`${siteBase}/materials/?q=English%20Paper%202`}>English Paper 2</a>
      </nav>

      <div class="hero-quick-links" aria-label="Other ways to get started">
        <a href={`${siteBase}/materials/`}>Browse all materials <span aria-hidden="true">↗</span></a>
        <a href={`${siteBase}/syllabus/`}>Make a simple chapter list <span aria-hidden="true">↗</span></a>
      </div>
    </aside>
  </section>

  <section class="home-method page-width" aria-labelledby="method-title">
    <div class="method-intro">
      <p class="eyebrow"><span class="eyebrow-rule"></span> NO PERFECT PLAN REQUIRED</p>
      <h2 id="method-title">Make the next step<br /><em>small and clear.</em></h2>
      <p>If the whole syllabus feels too big, use Compass for one small decision: what subject, what resource, and what to do next.</p>
    </div>

    <div class="method-steps">
      <div class="method-step">
        <span class="step-number">01 <i>—</i> CHOOSE</span>
        <h3>Pick one subject.</h3>
        <p>Start with the subject you have in front of you today.</p>
      </div>
      <div class="method-step">
        <span class="step-number">02 <i>—</i> FIND</span>
        <h3>Find one useful resource.</h3>
        <p>Search by subject, topic, chapter or resource type.</p>
      </div>
      <div class="method-step">
        <span class="step-number">03 <i>—</i> CONTINUE</span>
        <h3>Decide what comes next.</h3>
        <p>Use the syllabus tracker to record your own chapters and learning state on this device.</p>
      </div>
    </div>
  </section>

  <section class="home-principle" aria-label="ICSE Compass principle">
    <div class="page-width principle-inner">
      <span class="principle-mark" aria-hidden="true">“</span>
      <p>You don't need the perfect plan. Just choose <em>a clear next step.</em></p>
      <a href={`${siteBase}/materials/`}>Explore the index <span aria-hidden="true">↗</span></a>
    </div>
  </section>
</main>

<style>
  .home-page { position: relative; overflow: clip; color: #2B211A; }
  .home-hero, .home-method, .home-principle { position: relative; z-index: 1; }
  .home-hero {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(390px, .98fr);
    align-items: center;
    gap: clamp(34px, 5vw, 70px);
    padding-block: 68px 70px;
  }
  .hero-copy { max-width: 620px; }
  .hero-copy h1 {
    max-width: 620px; margin: 25px 0 19px; color: #2B211A;
    font-size: clamp(42px, 4.3vw, 60px); line-height: 1.1; letter-spacing: -1.9px;
  }
  .hero-copy h1 em { color: #527B5C; font-weight: 500; }
  .hero-description { max-width: 500px; color: #57493E; font-size: 14px; line-height: 1.85; }
  .hero-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px 22px; margin-top: 27px; }
  .home-primary { min-height: 50px; color: #fff; background: #527B5C; border-radius: 10px; box-shadow: none; }
  .home-primary:hover { color: #fff; background: #3F6549; transform: translateY(-1px); }
  .text-action { color: #38583F; }
  .hero-footnote { margin-top: 27px; color: #6A5B4F; font-size: 10px; }
  .footnote-mark { color: #6B8E69; }
  .hero-product-panel {
    min-width: 0; padding: 27px; color: #2B211A; background: #E9F0E4;
    border: 1px solid #CFDCC8; border-radius: 18px;
    box-shadow: 0 10px 28px rgba(43, 33, 26, .045);
  }
  .product-panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
  .panel-kicker { color: #527B5C; font-size: 9px; font-weight: 850; letter-spacing: 1.15px; }
  .panel-edition { max-width: 110px; color: #6B8E69; font-size: 8px; font-weight: 800; letter-spacing: .7px; line-height: 1.5; text-align: right; }
  .product-panel-heading h2 { margin: 10px 0 0; color: #2B211A; font: 500 clamp(24px, 2.5vw, 31px)/1.15 var(--serif); letter-spacing: -.45px; }
  .hero-search-form { margin-top: 22px; }
  .hero-search-label { display: block; margin-bottom: 8px; color: #57493E; font-size: 11px; font-weight: 750; }
  .hero-search-field { display: flex; align-items: center; gap: 7px; padding: 5px; background: #FFFCF5; border: 1px solid #D8DCCF; border-radius: 11px; }
  .hero-search-field input { width: 100%; min-width: 0; min-height: 46px; padding: 0 10px; color: #2B211A; background: transparent; border: 0; outline: 0; font-size: 13px; }
  .hero-search-field input::placeholder { color: #766B60; opacity: 1; }
  .hero-search-field input:focus-visible { outline: 2px solid #527B5C; outline-offset: -2px; border-radius: 6px; }
  .hero-search-field button { display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; gap: 7px; min-height: 44px; padding: 0 14px; color: #fff; background: #527B5C; border: 0; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; }
  .hero-search-field button:hover { background: #3F6549; }
  .hero-search-field button:focus-visible { outline: 3px solid #38583F; outline-offset: 2px; }
  .subject-shortcuts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .subject-shortcuts a { display: inline-flex; align-items: center; min-height: 42px; padding: 8px 12px; border: 1px solid; border-radius: 9px; font-size: 11px; font-weight: 750; line-height: 1.2; }
  .subject-shortcuts a:hover { filter: brightness(.97); }
  .subject-physics { color: #315E61; background: #E5EFEC; border-color: #C8DCD6; }
  .subject-chemistry { color: #385B45; background: #E8F0E4; border-color: #CCDCC5; }
  .subject-mathematics { color: #874832; background: #F5E9E1; border-color: #E7D0C2; }
  .subject-biology { color: #456B39; background: #EDF2E5; border-color: #D4E1C9; }
  .subject-english { color: #6B5735; background: #F2EBDD; border-color: #E1D4BB; }
  .hero-quick-links { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #D5DFD0; }
  .hero-quick-links a { display: inline-flex; align-items: center; gap: 7px; min-height: 42px; color: #38583F; font-size: 11px; font-weight: 750; }
  .hero-quick-links a:hover { color: #2B211A; }
  .home-method { display: grid; grid-template-columns: minmax(230px, .8fr) minmax(0, 1.4fr); gap: clamp(38px, 8vw, 112px); padding-block: 72px 80px; border-top: 1px solid #E2DACA; }
  .method-intro h2 { margin: 19px 0 17px; color: #2B211A; font: 500 clamp(36px, 4vw, 49px)/1.08 var(--serif); letter-spacing: -1.4px; }
  .method-intro h2 em { color: #527B5C; font-weight: 400; }
  .method-intro > p:last-child { max-width: 360px; margin: 0; color: #65584D; font-size: 12px; line-height: 1.85; }
  .method-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-content: center; }
  .method-step { min-width: 0; padding: 8px 18px; border-left: 1px solid #D8DCCF; }
  .step-number { color: #527B5C; font-size: 8px; font-weight: 850; letter-spacing: 1.1px; }
  .step-number i { color: #9BA398; font-style: normal; }
  .method-step h3 { margin: 18px 0 9px; color: #2B211A; font: 500 20px/1.2 var(--serif); }
  .method-step p { margin: 0; color: #65584D; font-size: 11px; line-height: 1.8; }
  .home-principle { background: #EFE9D8; border-block: 1px solid #DED5C4; }
  .home-principle .principle-inner { min-height: 145px; }
  .home-principle .principle-inner > a { display: inline-flex; align-items: center; gap: 10px; margin-left: auto; color: #38583F; font-size: 10px; font-weight: 850; white-space: nowrap; }
  .home-principle .principle-inner > a:hover { color: #2B211A; }
  @media (max-width: 1050px) {
    .home-hero { grid-template-columns: minmax(0, 1fr) minmax(340px, .95fr); gap: 32px; }
    .hero-product-panel { padding-inline: 22px; }
    .home-method { gap: 42px; }
    .method-step { padding-inline: 13px; }
  }
  @media (max-width: 760px) {
    .home-hero { grid-template-columns: 1fr; gap: 34px; padding-block: 54px; }
    .hero-copy h1 { max-width: 620px; font-size: clamp(42px, 9vw, 54px); }
    .hero-product-panel { max-width: 640px; }
    .home-method { grid-template-columns: 1fr; gap: 30px; padding-block: 56px; }
    .method-steps { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
  @media (max-width: 600px) {
    .home-hero { gap: 27px; padding-block: 45px; }
    .hero-copy h1 { margin-top: 20px; font-size: clamp(38px, 10vw, 49px); letter-spacing: -1.5px; }
    .hero-description { font-size: 13px; }
    .hero-actions { align-items: center; gap: 10px 16px; }
    .hero-product-panel { padding: 22px 17px 18px; border-radius: 14px; }
    .product-panel-heading h2 { font-size: 25px; }
    .home-method { padding-block: 50px 55px; }
    .method-steps { grid-template-columns: 1fr; }
    .method-step { display: grid; grid-template-columns: 105px minmax(0, 1fr); gap: 7px 12px; padding: 16px 0; border-left: 0; border-top: 1px solid #D8DCCF; }
    .step-number { grid-row: span 2; padding-top: 3px; }
    .method-step h3 { margin: 0; }
    .method-step p { grid-column: 2; }
    .home-principle .principle-inner { flex-wrap: wrap; gap: 8px 12px; padding-block: 20px; }
    .home-principle .principle-inner > a { margin-left: 0; }
  }
  @media (max-width: 370px) {
    .hero-copy h1 { font-size: 37px; }
    .product-panel-heading { flex-direction: column; gap: 8px; }
    .panel-edition { max-width: none; text-align: left; }
    .method-step { grid-template-columns: 88px minmax(0, 1fr); }
  }
</style>
