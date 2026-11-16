<script lang="ts">
  import { goto } from '$app/navigation';
  import { siteBase } from '#lib/site.ts';

  let searchQuery = $state('');

  const indexCards = [
    { num: '01', label: 'RESOURCE INDEX', title: 'Materials library', desc: 'Browse notes, worksheets and learning resources by subject and chapter.', cta: 'EXPLORE MATERIALS', href: `${siteBase}/materials/` },
    { num: '02', label: 'SOURCE PROFILES', title: 'Educator sources', desc: 'Discover educator profiles and trace learning back to its original source.', cta: 'MEET EDUCATORS', href: `${siteBase}/creators/` },
    { num: '03', label: 'PRACTICE INDEX', title: 'School papers', desc: 'Find school-level practice and exam papers when published in the index.', cta: 'VIEW PRACTICE', href: `${siteBase}/school-papers/` }
  ];

  function handleSearch(event: SubmitEvent) {
    event.preventDefault();
    const query = searchQuery.trim();
    void goto(query ? `${siteBase}/materials/?q=${encodeURIComponent(query)}` : `${siteBase}/materials/`);
  }
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
      <p class="hero-description">Find learning material by subject and chapter, discover the educators behind original sources, and prepare with clearer source attribution and permission context.</p>

      <div class="hero-actions">
        <a class="button button-primary home-primary" href={`${siteBase}/materials/`}>Browse materials <span aria-hidden="true">↗</span></a>
        <a class="text-action" href={`${siteBase}/creators/`}>Explore educators <span aria-hidden="true">→</span></a>
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

      <form class="hero-search-form" onsubmit={handleSearch}>
        <label class="hero-search-label" for="homepage-search">Find a topic, chapter or source</label>
        <div class="hero-search-field">
          <input id="homepage-search" type="search" bind:value={searchQuery} placeholder="Search chapter, subject, or source…" aria-label="Search by subject, chapter or source" />
          <button type="submit">Search <span aria-hidden="true">↗</span></button>
        </div>
      </form>

      <nav class="subject-shortcuts" aria-label="Quick subject searches">
        <a class="subject-physics" href={`${siteBase}/materials/?q=Physics`}>Physics</a>
        <a class="subject-chemistry" href={`${siteBase}/materials/?q=Chemistry`}>Chemistry</a>
        <a class="subject-mathematics" href={`${siteBase}/materials/?q=Mathematics`}>Mathematics</a>
        <a class="subject-biology" href={`${siteBase}/materials/?q=Biology`}>Biology</a>
        <a class="subject-history" href={`${siteBase}/materials/?q=History%20%26%20Civics`}>History &amp; Civics</a>
        <a class="subject-computer" href={`${siteBase}/materials/?q=Computer`}>Computer</a>
      </nav>

      <nav class="hero-card-deck" aria-label="Explore the ICSE Compass index">
        {#each indexCards as card}
          <a class="hero-deck-card" href={card.href}>
            <span class="deck-card-top"><span><b>{card.num}</b> / {card.label}</span><span aria-hidden="true">↗</span></span>
            <span class="deck-card-content">
              <span class="deck-card-title">{card.title}</span>
              <span class="deck-card-description">{card.desc}</span>
            </span>
            <span class="deck-card-bottom"><span>{card.cta}</span><span class="deck-card-arrow" aria-hidden="true">↗</span></span>
          </a>
        {/each}
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
      <a href={`${siteBase}/materials/`}>Explore the index <span aria-hidden="true">↗</span></a>
    </div>
  </section>
</main>

<style>
  .home-page { position: relative; overflow: clip; }
  .home-page::before { content: ""; position: absolute; z-index: 0; inset: 0 0 auto; height: 760px; pointer-events: none; opacity: .42; background-image: radial-gradient(circle, rgba(22, 38, 62, .16) 1px, transparent 1px); background-size: 18px 18px; mask-image: linear-gradient(to bottom, #000 0%, transparent 92%); }
  .home-hero, .home-method, .home-principle { position: relative; z-index: 1; }
  .home-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(430px, .92fr);
    align-items: center;
    gap: clamp(38px, 6vw, 82px);
    min-height: 0;
    padding-block: 54px 62px;
  }
  .hero-copy { max-width: 610px; }
  .hero-copy h1 { max-width: 740px; margin: 27px 0 22px; font-size: clamp(42px, 4.1vw, 58px); line-height: 1.08; letter-spacing: -2.3px; }
  .hero-copy h1 em { color: var(--terracotta); font-weight: 400; }
  .hero-description { max-width: 510px; font-size: 13px; line-height: 1.85; }
  .hero-actions { gap: 22px; margin-top: 30px; }
  .hero-footnote { margin-top: 28px; }
  .hero-product-panel {
    position: relative;
    isolation: isolate;
    min-width: 0;
    padding: 27px 28px 18px;
    overflow: hidden;
    color: #ffffff;
    background: var(--navy);
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 24px;
    box-shadow: 0 18px 42px rgba(22, 38, 62, .18);
  }
  .hero-product-panel::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -115px;
    right: -95px;
    width: 290px;
    height: 290px;
    border: 1px solid rgba(255, 255, 255, .09);
    border-radius: 50%;
    box-shadow: 0 0 0 28px rgba(255, 255, 255, .025), 0 0 0 58px rgba(255, 255, 255, .02);
    pointer-events: none;
  }
  @media (hover: hover) and (pointer: fine) {
    .hero-product-panel { will-change: transform; transition: transform 220ms cubic-bezier(.2, .75, .25, 1), box-shadow 220ms ease; }
    .hero-product-panel:hover { transform: translateY(-2px); box-shadow: 0 22px 48px rgba(22, 38, 62, .22); }
  }
  .product-panel-heading, .product-panel-footer { position: relative; z-index: 1; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .panel-kicker, .panel-edition { color: #d9e2ef; font-size: 10px; font-weight: 800; letter-spacing: 1.25px; }
  .product-panel-footer { color: #b9c6d7; font-size: 8px; font-weight: 750; letter-spacing: 1px; }
  .product-panel-heading h2 { margin: 11px 0 0; color: #ffffff; font: 500 clamp(25px, 2.6vw, 34px)/1.12 var(--serif); letter-spacing: -.7px; }
  .panel-edition { white-space: nowrap; color: #f4c4b7; }
  .panel-edition i { color: #91a2b9; font-style: normal; }
  .hero-search-form { position: relative; z-index: 1; margin-top: 22px; }
  .hero-search-label { display: block; margin-bottom: 8px; color: #c5d0df; font-size: 9px; font-weight: 700; letter-spacing: .5px; }
  .hero-search-field { display: flex; align-items: center; gap: 7px; padding: 5px; background: #ffffff; border: 1px solid rgba(255, 255, 255, .35); border-radius: 13px; }
  .hero-search-field input { width: 100%; min-width: 0; min-height: 43px; padding: 0 10px; color: #16263e; background: transparent; border: 0; outline: 0; font-size: 11px; }
  .hero-search-field input::placeholder { color: #748094; opacity: 1; }
  .hero-search-field input:focus-visible { outline: 2px solid var(--terracotta); outline-offset: -2px; border-radius: 8px; }
  .hero-search-field button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; flex: 0 0 auto; min-height: 40px; padding: 0 14px; color: #ffffff; background: var(--terracotta); border: 0; border-radius: 9px; font-size: 10px; font-weight: 800; cursor: pointer; transition: background .18s ease, transform .18s ease; }
  .hero-search-field button:hover { background: #ad3d27; transform: translateY(-1px); }
  .hero-search-field button:focus-visible { outline: 3px solid #f6c6b9; outline-offset: 2px; }
  .subject-shortcuts { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 7px; margin-top: 15px; }
  .subject-shortcuts a { display: inline-flex; align-items: center; min-height: 29px; padding: 5px 10px; color: #244c91; background: #eaf0fb; border: 1px solid #cbd8ef; border-radius: 999px; font-size: 9px; font-weight: 750; line-height: 1.2; transition: transform .18s ease, filter .18s ease; }
  .subject-shortcuts .subject-chemistry { color: #246447; background: #e9f4ed; border-color: #c9e2d2; }
  .subject-shortcuts .subject-mathematics { color: #9b3929; background: #fbede9; border-color: #efd0c7; }
  .subject-shortcuts .subject-biology { color: #17666b; background: #e7f3f2; border-color: #c5e1df; }
  .subject-shortcuts .subject-history { color: #805a19; background: #f8f1df; border-color: #e9dbb7; }
  .subject-shortcuts .subject-computer { color: #51427e; background: #f0edf8; border-color: #d9d1eb; }
  .subject-shortcuts a:hover { filter: saturate(1.18); transform: translateY(-1px); }
  .subject-shortcuts a:focus-visible { outline: 2px solid #f6c6b9; outline-offset: 3px; }
  @keyframes deckCardEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .hero-card-deck { position: relative; z-index: 1; display: grid; gap: 9px; margin-top: 17px; padding: 2px 2px 5px 0; }
  .hero-deck-card:nth-child(1) { animation-delay: 50ms; }
  .hero-deck-card:nth-child(2) { animation-delay: 100ms; }
  .hero-deck-card:nth-child(3) { animation-delay: 150ms; }
  .hero-deck-card { display: flex; min-height: 105px; flex-direction: column; padding: 12px 14px 10px; color: #ffffff; background: #1e314e; border: 1px solid rgba(255, 255, 255, .15); border-radius: 16px; box-shadow: 0 4px 12px rgba(4, 14, 29, .12); animation: deckCardEnter 360ms cubic-bezier(.2, .75, .25, 1) both; transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease; }
  .hero-deck-card:hover, .hero-deck-card:focus-visible { color: #ffffff; background: #243b5e; border-color: rgba(244, 196, 183, .65); transform: translateY(-2px); box-shadow: 0 8px 18px rgba(4, 14, 29, .18); }
  .hero-deck-card:focus-visible { outline: 3px solid #f6c6b9; outline-offset: 3px; }
  .deck-card-top, .deck-card-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #c4cfdd; font: 750 8px/1.3 var(--sans); letter-spacing: .8px; }
  .deck-card-top b { color: #f4c4b7; font-weight: 850; }
  .deck-card-top > span:last-child { color: #f4c4b7; font-size: 14px; }
  .deck-card-content { display: block; margin: 6px 0 5px; }
  .deck-card-title { display: block; color: #ffffff; font: 600 18px/1.15 var(--serif); }
  .deck-card-description { display: block; margin-top: 3px; color: #c7d1df; font: 450 9px/1.45 var(--sans); }
  .deck-card-bottom { margin-top: auto; padding-top: 7px; color: #e7c1b7; font-size: 8px; }
  .deck-card-arrow { color: #f4c4b7; font-size: 14px; transition: transform .18s ease; }
  .hero-deck-card:hover .deck-card-arrow { transform: translate(2px, -2px); }
  .product-panel-footer { margin-top: 17px; font-size: 7px; letter-spacing: 1.1px; }
  .product-panel-footer b { margin-left: 5px; color: #f4c4b7; font-size: 12px; font-weight: 400; }
  .panel-watermark { position: absolute; z-index: 0; right: -8px; bottom: -77px; color: rgba(255, 255, 255, .035); font: 500 260px/.8 var(--serif); pointer-events: none; }
  .home-primary { color: #ffffff; background: var(--terracotta); border-radius: 12px; box-shadow: 0 8px 18px rgba(200, 75, 49, .2); }
  .home-primary:hover { background: #ad3d27; transform: translateY(-2px); }
  .text-action { border-radius: 10px; padding-inline: 8px; }
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
    .hero-product-panel, .hero-card-deck, .hero-deck-card { animation: none !important; transition: none !important; transform: none !important; will-change: auto !important; }
  }
  @media (max-width: 1050px) {
    .home-hero { grid-template-columns: minmax(0, 1fr) minmax(360px, .95fr); gap: 34px; min-height: 0; padding-block: 48px 56px; }
    .hero-product-panel { padding-inline: 22px; }
    .hero-copy h1 { font-size: clamp(42px, 4.2vw, 56px); }
    .home-method { gap: 42px; }
    .method-step { padding-inline: 14px; }
  }
  @media (max-width: 760px) {
    .home-hero { grid-template-columns: 1fr; gap: 38px; min-height: 0; padding-block: 58px 62px; }
    .hero-copy h1 { max-width: 620px; font-size: clamp(48px, 9vw, 68px); }
    .hero-product-panel { max-width: 620px; }
    .hero-deck-card { min-height: 106px; }
    .deck-educators { margin-left: 9px; }
    .deck-practice { margin-left: 18px; }
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
    .subject-shortcuts { gap: 6px; margin-top: 9px; }
    .subject-shortcuts a { min-height: 28px; padding-inline: 8px; font-size: 9px; }
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
    .method-step { grid-template-columns: 88px minmax(0, 1fr); }
  }

  /* Homepage-only Pistachio, Cream & Espresso palette */
  .home-page {
    --navy: #1B3B2B;
    --terracotta: #B85D3B;
    --green: #4A7039;
    --green-dark: #1B3B2B;
    color: #3B281E;
  }
  .home-page::before {
    opacity: .48;
    background-image: radial-gradient(circle, rgba(59, 40, 30, .12) 1px, transparent 1px);
    background-size: 22px 22px;
  }
  .home-hero { padding-block: 58px 66px; }
  .hero-copy h1 { color: #3B281E; }
  .hero-copy h1 em { color: #4A7039; }
  .hero-description { color: #57453A; }
  .home-primary {
    color: #FAF6EE;
    background: #3B281E;
    border-radius: 12px;
    box-shadow: 4px 4px 0 #8FB378;
  }
  .home-primary:hover { color: #FAF6EE; background: #2A1C15; }
  .hero-product-panel {
    color: #FAF6EE;
    background: #1B3B2B;
    border: 2px solid #3B281E;
    border-radius: 24px;
    box-shadow: 8px 8px 0 #C5D6B5;
  }
  .panel-kicker { color: #B5D69C; }
  .panel-edition { color: #D9E8CD; }
  .product-panel-heading h2 { color: #FAF6EE; }
  .hero-search-label { color: #D4E3C8; }
  .hero-search-field {
    background: #FAF6EE;
    border-color: rgba(250, 246, 238, .4);
    border-radius: 13px;
  }
  .hero-search-field input { color: #3B281E; }
  .hero-search-field input::placeholder { color: #7A685D; }
  .hero-search-field button { color: #fff; background: #5C8347; }
  .hero-search-field button:hover { background: #4A6D38; }
  .hero-search-field input:focus-visible { outline-color: #9EC484; }
  .hero-search-field button:focus-visible,
  .subject-shortcuts a:focus-visible,
  .hero-deck-card:focus-visible { outline-color: #B5D69C; }
  .subject-shortcuts a {
    min-height: 32px;
    padding: 6px 11px;
    color: #3B281E;
    background: #EFE8D8;
    border: 1px solid rgba(59, 40, 30, .2);
    border-radius: 10px;
    font-size: 10px;
  }
  .subject-shortcuts .subject-physics { color: #2E6F73; background: #E6EFEB; border-color: #C7DCD6; }
  .subject-shortcuts .subject-chemistry { color: #3B5948; background: #E8F0E4; border-color: #CFDEC7; }
  .subject-shortcuts .subject-mathematics { color: #8F432C; background: #F5E8DE; border-color: #E8CFC0; }
  .subject-shortcuts .subject-biology { color: #4A7039; background: #EDF2E5; border-color: #D5E2C8; }
  .subject-shortcuts .subject-history { color: #805A35; background: #F2EBDD; border-color: #E3D5BC; }
  .subject-shortcuts .subject-computer { color: #3B5948; background: #E8EEE8; border-color: #D0DCD0; }
  .hero-deck-card {
    min-height: 105px;
    color: #FAF6EE;
    background: #234936;
    border-color: rgba(181, 214, 156, .25);
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(9, 25, 17, .18);
  }
  .hero-deck-card:hover, .hero-deck-card:focus-visible {
    color: #FAF6EE;
    background: #2B5741;
    border-color: #B5D69C;
    box-shadow: 0 8px 18px rgba(9, 25, 17, .22);
  }
  .deck-card-top, .deck-card-bottom { color: #D4E3C8; }
  .deck-card-top b, .deck-card-top > span:last-child,
  .deck-card-arrow, .product-panel-footer b { color: #B5D69C; }
  .deck-card-title { color: #FAF6EE; }
  .deck-card-description { color: #C7D6BE; }
  .deck-card-bottom { color: #D9E8CD; }
  .product-panel-footer { color: #D4E3C8; }
  .panel-watermark { color: rgba(250, 246, 238, .035); }
  .hero-footnote { color: #6E5A4F; }
  .home-method { border-top-color: rgba(59, 40, 30, .16); }
  .method-intro h2 { color: #3B281E; }
  .method-intro h2 em, .step-number { color: #4A7039; }
  .method-intro > p:last-child, .method-step p { color: #6E5A4F; }
  .method-step { border-left-color: #D8D0C2; }
  .home-principle { background: #EFE8D8; border-block-color: #DDD2BF; }
  .home-principle .principle-inner > a { color: #1B3B2B; }
  .home-principle .principle-inner > a:hover { color: #4A7039; }
  @media (max-width: 600px) {
    .home-hero { padding-block: 48px 52px; }
    .hero-product-panel { box-shadow: 5px 5px 0 #C5D6B5; }
  }

</style>
