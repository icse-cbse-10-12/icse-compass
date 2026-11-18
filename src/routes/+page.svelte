<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';
  import type { Resource, Subject } from '#lib/catalogue.ts';
  import { formatResourceTitle, formatResourceType } from '#lib/catalogue.ts';

  let resources = $state<Resource[]>([]);
  let subjects = $state<Subject[]>([]);
  // Last committed catalogue counts are shown immediately, then refreshed from the live data.
  let resourceCount = $state(155);
  let subjectCount = $state(12);
  let loading = $state(true);
  let loadError = $state(false);

  const subjectImages: Record<string, string> = {
    biology: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=900&q=78',
    chemistry: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=78',
    'english-paper-2': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=78',
    mathematics: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=78',
    physics: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=900&q=78',
    'computer-applications': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=78',
    'english-paper-1': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=78',
    geography: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=78',
    'history-civics': 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=900&q=78',
    economics: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=78',
    'commercial-studies': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=78',
    'robotics-artificial-intelligence': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=78'
  };

  const defaultSubjectLinks = [
    { id: 'biology', name: 'Biology' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'english-paper-2', name: 'English Paper 2' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'computer-applications', name: 'Computer Applications' },
    { id: 'english-paper-1', name: 'English Paper 1' },
    { id: 'geography', name: 'Geography' },
    { id: 'history-civics', name: 'History & Civics' },
    { id: 'economics', name: 'Economics' },
    { id: 'commercial-studies', name: 'Commercial Studies' },
    { id: 'robotics-artificial-intelligence', name: 'Robotics & Artificial Intelligence' }
  ];
  // Keep subject shortcuts available immediately, including while catalogue data is loading/offline.
  let subjectQuickLinks = $derived(subjects.length > 0 ? subjects : defaultSubjectLinks);
  let subjectCards = $derived(subjects.map((subject) => ({
    ...subject,
    count: resources.filter((resource) => resource.subjectId === subject.id).length
  })));
  let sampleResources = $derived(resources.slice(0, 3));

  function revealSubjectCards(node: HTMLElement) {
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(node.querySelectorAll<HTMLElement>('.subject-tile'));
    if (cards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target as HTMLElement;
        const index = cards.indexOf(card);
        card.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`);
        card.classList.add('is-visible');
        observer.unobserve(card);
      });
    }, { threshold: 0.12 });

    cards.forEach((card) => {
      card.classList.add('reveal-card');
      observer.observe(card);
    });

    return { destroy: () => observer.disconnect() };
  }

  async function loadHomeData() {
    loading = true;
    loadError = false;
    try {
      const [resourceResponse, subjectResponse] = await Promise.all([
        fetch(siteBase + '/data/resources.json'),
        fetch(siteBase + '/data/subjects.json')
      ]);
      if (!resourceResponse.ok || !subjectResponse.ok) throw new Error('Library data unavailable');
      const [resourceData, subjectData] = await Promise.all([resourceResponse.json(), subjectResponse.json()]);
      if (!Array.isArray(resourceData) || !Array.isArray(subjectData)) throw new Error('Library data is invalid');
      resources = resourceData.filter((item: Resource) => item.status === 'published');
      subjects = subjectData.filter((item: Subject) => item.status === 'published').sort((a: Subject, b: Subject) => a.sortOrder - b.sortOrder);
      resourceCount = resources.length;
      subjectCount = subjects.length;
    } catch {
      loadError = true;
    } finally {
      loading = false;
    }
  }

  onMount(() => { void loadHomeData(); });
</script>

<svelte:head>
  <title>ICSE Compass | Your independent ICSE study library</title>
  <meta name="description" content="Discover ICSE notes, question papers, videos and learning resources by subject, chapter and educator with ICSE Compass." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/" />
  <meta property="og:title" content="ICSE Compass | Your independent ICSE study library" />
  <meta property="og:description" content="A visual, searchable library for ICSE learners. Find notes, papers, videos and original educator sources." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/" />
</svelte:head>

<main class="home-page home-v2">
  <section class="home-rule-hero page-width" aria-labelledby="home-title">
    <div class="home-rule-copy">
      <p class="eyebrow"><span class="eyebrow-rule"></span> THE ICSE COMPASS RULE</p>
      <h1 id="home-title">A study library should help you find the material — <em>not sell you a seat.</em></h1>
      <p class="home-rule-lede">ICSE Compass is an independent library for discovering notes, question papers, lessons and other learning resources. Find what you need, then open it at its original source.</p>
      <a class="home-enter-button" href={siteBase + '/materials/'}>Enter the library <span aria-hidden="true">→</span></a>
      <form class="home-hero-search" action={siteBase + '/materials/'} method="get" role="search" aria-label="Search the materials library">
        <label for="home-library-search">Or search the library directly</label>
        <div class="home-hero-search-row">
          <input id="home-library-search" name="q" type="search" placeholder="Try Physics, Julius Caesar, specimen papers…" autocomplete="off" />
          <button type="submit">Search <span aria-hidden="true">→</span></button>
        </div>
      </form>
      <p class="home-rule-footnote">No student account. No admission gate. Just a clear route to study resources.</p>
    </div>

    <aside class="home-rule-preview" aria-label="A preview of the study library">
      <div class="home-rule-preview-top"><span>INSIDE THE LIBRARY</span><span>OPEN ACCESS</span></div>
      <div class="home-rule-preview-title"><span class="home-rule-symbol" aria-hidden="true">✳</span><div><strong>Find your next resource.</strong><small>Browse by subject, paper or educator.</small></div></div>
      <div class="home-rule-stats">
        <div><strong>{resourceCount.toLocaleString('en-IN')}{#if loading}<span class="stat-skeleton stat-skeleton-inline" aria-hidden="true"></span>{/if}</strong><span>PUBLISHED RESOURCES</span></div>
        <div><strong>{subjectCount}{#if loading}<span class="stat-skeleton stat-skeleton-inline short" aria-hidden="true"></span>{/if}</strong><span>SUBJECT AREAS</span></div>
      </div>
      <div class="home-rule-samples">
        {#if loading}
          <div class="home-preview-skeletons" role="status" aria-label="Loading library preview"><span></span><span></span><span></span></div>
        {:else if loadError}
          <div class="home-rule-error" role="alert"><strong>Preview unavailable.</strong><button type="button" onclick={loadHomeData}>Try again</button></div>
        {:else if sampleResources.length > 0}
          {#each sampleResources as resource (resource.id)}
            {@const title = formatResourceTitle(resource.title)}
            <a href={siteBase + '/materials/?q=' + encodeURIComponent(title.title)}>
              <span>{title.extension ?? formatResourceType(resource.resourceType)}</span>
              <strong>{title.title}</strong>
              <span aria-hidden="true">→</span>
            </a>
          {/each}
        {:else}
          <p class="home-rule-error">Published resources will appear here.</p>
        {/if}
      </div>
      <p class="home-rule-preview-foot">Preview a listing. Follow its source. Study at your pace.</p>
    </aside>
  </section>

  <section class="home-subject-section" aria-labelledby="subjects-title">
    <div class="page-width">
      <div class="home-section-heading">
        <div><p class="eyebrow"><span class="eyebrow-rule"></span> FIND YOUR SUBJECT</p><h2 id="subjects-title">Browse the shelves.</h2></div>
        <a href={siteBase + '/materials/'}>View the complete library <span aria-hidden="true">→</span></a>
      </div>
      <nav class="subject-quick-links" aria-label="Browse resources by subject">
        {#each subjectQuickLinks as subject (subject.id)}
          <a class="subject-quick-pill" href={siteBase + '/materials/?q=' + encodeURIComponent(subject.name)}>{subject.name}<span aria-hidden="true">→</span></a>
        {/each}
      </nav>
      {#if loading}
        <div class="subject-grid-v2" aria-label="Loading subjects"><div class="subject-skeleton"></div><div class="subject-skeleton"></div><div class="subject-skeleton"></div><div class="subject-skeleton"></div></div>
      {:else if loadError}
        <div class="home-data-state" role="alert"><strong>Subjects could not be loaded.</strong><p>Check your connection and try again.</p><button type="button" onclick={loadHomeData}>Reload library</button></div>
      {:else}
        <div class="subject-grid-v2" use:revealSubjectCards>
          {#each subjectCards as subject, index (subject.id)}
            <a class={'subject-tile subject-tile-' + ((index % 6) + 1)} href={siteBase + '/materials/?q=' + encodeURIComponent(subject.name)}>
              <img class="subject-tile-image" src={subjectImages[subject.id] ?? subjectImages.biology} alt="" loading="lazy" decoding="async" onerror={(event) => event.currentTarget.remove()} />
              <span class="subject-tile-index">{String(index + 1).padStart(2, '0')}</span>
              <span class="subject-tile-mark" aria-hidden="true">{subject.name === 'English Paper 1' ? 'E1' : subject.name === 'English Paper 2' ? 'E2' : subject.name.slice(0, 2).toUpperCase()}</span>
              <strong>{subject.name}</strong>
              <small>{subject.count} {subject.count === 1 ? 'resource' : 'resources'} <span aria-hidden="true">→</span></small>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <section class="home-discovery-section page-width" aria-labelledby="discovery-title">
    <div class="home-section-heading">
      <div><p class="eyebrow"><span class="eyebrow-rule"></span> WHAT DO YOU NEED?</p><h2 id="discovery-title">Go straight to the good stuff.</h2></div>
      <p>Choose a starting point. Refine your search once you reach the library.</p>
    </div>
    <div class="discovery-grid-v2">
      <a class="discovery-tile discovery-papers" href={siteBase + '/school-papers/'}>
        <span class="discovery-number">01 / EXAM PREP</span><span class="discovery-symbol" aria-hidden="true">▤</span>
        <strong>Board papers &amp; specimen sets</strong><p>Past papers, specimen papers and competency-focused practice from original sources.</p><span class="discovery-link">Explore papers <span aria-hidden="true">→</span></span>
      </a>
      <a class="discovery-tile discovery-notes" href={siteBase + '/materials/?q=Notes'}>
        <span class="discovery-number">02 / UNDERSTAND</span><span class="discovery-symbol" aria-hidden="true">▧</span>
        <strong>Notes &amp; chapter resources</strong><p>Find topic-wise explanations, revision material and chapter support.</p><span class="discovery-link">Find notes <span aria-hidden="true">→</span></span>
      </a>
      <a class="discovery-tile discovery-lessons" href={siteBase + '/materials/?q=Video'}>
        <span class="discovery-number">03 / LEARN</span><span class="discovery-symbol" aria-hidden="true">▷</span>
        <strong>Video lessons &amp; educators</strong><p>Discover lessons and resource collections from credited educators.</p><span class="discovery-link">Watch &amp; learn <span aria-hidden="true">→</span></span>
      </a>
    </div>
  </section>

  <section class="home-sample-section" aria-labelledby="sample-title">
    <div class="page-width home-sample-inner">
      <div><p class="eyebrow"><span class="eyebrow-rule"></span> YOUR STUDY SPACE</p><h2 id="sample-title">Find it. Preview it.<br /><em>Study with confidence.</em></h2><p>Every listing points back to its original source. Where a source provides a preview image, you can inspect it before opening the full resource.</p><a class="sample-cta" href={siteBase + '/materials/'}>Explore the materials library <span aria-hidden="true">→</span></a></div>
      <div class="sample-stack" aria-hidden="true"><div class="sample-sheet sample-sheet-back"><span>ICSE / STUDY INDEX</span><strong>Practice.<br />Revise.<br />Repeat.</strong></div><div class="sample-sheet sample-sheet-front"><span>YOUR NEXT RESOURCE</span><div class="sample-lines"></div><div class="sample-lines short"></div><div class="sample-stamp">SOURCE<br />LINKED</div></div></div>
    </div>
  </section>

  <section class="home-planner-band page-width">
    <div><p class="eyebrow"><span class="eyebrow-rule"></span> MAKE IT YOURS</p><h2>Turn a resource into a plan.</h2><p>Build your own subject and chapter list, then track your learning progress on this device.</p></div>
    <a href={siteBase + '/syllabus/'}>Open the syllabus tracker <span aria-hidden="true">→</span></a>
  </section>
</main>