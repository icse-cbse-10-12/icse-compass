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
  <meta name="description" content="Discover ICSE notes, past papers, and video lessons by subject and chapter. Browse freely and follow each resource to its original source." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/" />
  <meta property="og:title" content="ICSE Compass | Your independent ICSE study library" />
  <meta property="og:description" content="A visual, searchable library for ICSE learners. Find notes, papers, videos and original educator sources." />
  <meta property="og:image" content="https://icse-cbse-10-12.github.io/icse-compass/og-compass.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://icse-cbse-10-12.github.io/icse-compass/og-compass.png" />
</svelte:head>

<main class="home-page home-v2">
  <section class="home-rule-hero page-width" aria-labelledby="home-title">
    <div class="home-rule-copy">
      <p class="eyebrow eyebrow-ruled">THE ICSE COMPASS RULE</p>
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
        <div><strong class="stat-value" class:loading={loading}>{resourceCount.toLocaleString('en-IN')}</strong><span>PUBLISHED RESOURCES</span></div>
        <div><strong class="stat-value stat-value-short" class:loading={loading}>{subjectCount}</strong><span>SUBJECT AREAS</span></div>
      </div>
      <section class="home-rule-samples" aria-label="Resource preview examples">
        {#if loading}
          <p class="home-preview-skeletons" role="status">Loading library preview</p>
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
      </section>
      <p class="home-rule-preview-foot">Preview a listing. Follow its source. Study at your pace.</p>
    </aside>
  </section>

  <section class="home-subject-section" aria-labelledby="subjects-title">
    <div class="page-width">
      <div class="home-section-heading">
        <div><p class="eyebrow eyebrow-ruled">FIND YOUR SUBJECT</p><h2 id="subjects-title">Browse the shelves.</h2></div>
        <a href={siteBase + '/materials/'}>View the complete library <span aria-hidden="true">→</span></a>
      </div>
      <nav class="subject-quick-links" aria-label="Browse resources by subject">
        {#each subjectQuickLinks as subject (subject.id)}
          <a class="subject-quick-pill" href={siteBase + '/materials/?q=' + encodeURIComponent(subject.name)}>{subject.name}<span aria-hidden="true">→</span></a>
        {/each}
      </nav>
      {#if loading}
        <p class="subject-grid-loading" role="status">Loading subjects…</p>
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
      <div><p class="eyebrow eyebrow-ruled">WHAT DO YOU NEED?</p><h2 id="discovery-title">Go straight to the good stuff.</h2></div>
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
      <div><p class="eyebrow eyebrow-ruled">YOUR STUDY SPACE</p><h2 id="sample-title">Find it. Preview it.<br /><em>Study with confidence.</em></h2><p>Every listing points back to its original source. Where a source provides a preview image, you can inspect it before opening the full resource.</p><a class="sample-cta" href={siteBase + '/materials/'}>Explore ICSE study materials <span aria-hidden="true">→</span></a></div>
      <figure class="sample-stack" aria-hidden="true"><div class="sample-sheet sample-sheet-back"><span>ICSE / STUDY INDEX</span><strong>Practice.<br />Revise.<br />Repeat.</strong></div><div class="sample-sheet sample-sheet-front"><span>YOUR NEXT RESOURCE</span><div class="sample-stamp">SOURCE<br />LINKED</div></div></figure>
    </div>
  </section>


  <section class="home-guide-section page-width" aria-labelledby="guide-title">
    <div class="home-guide-heading">
      <p class="eyebrow eyebrow-ruled">A CLEARER WAY TO STUDY</p>
      <h2 id="guide-title">A practical guide to using ICSE Compass.</h2>
      <p>Good preparation starts with finding the right resource, understanding where it comes from and using it with a plan. This guide explains how to make the library useful without adding another complicated study system.</p>
    </div>
    <div class="home-guide-grid">
      <article class="home-guide-card">
        <span class="home-guide-index">01 / FIND</span>
        <h3>Search by subject, topic or resource type</h3>
        <p>Start with the subject you are studying, then narrow the search with a chapter name, text title, paper type or educator. The subject shortcuts are a quick route into the relevant shelf; the main library search is better when you already know a specific topic. Try a short phrase first. If the results are too broad, add a chapter or resource type rather than searching for an entire question.</p>
        <p>ICSE Compass brings different kinds of learning material into one searchable place. Depending on what is available, you may find notes, revision material, question papers, specimen sets, video lessons and chapter support. Use filters to narrow the list and compare titles before opening a resource.</p>
      </article>
      <article class="home-guide-card">
        <span class="home-guide-index">02 / CHECK</span>
        <h3>Choose material that matches your current task</h3>
        <p>Not every resource serves the same purpose. Use concise notes when you need to revisit a definition or process, worked examples when you are learning a method, and practice questions when you need to test whether you can apply it independently. For literature, check the prescribed text and paper component before choosing a guide. For science and mathematics, confirm that the chapter and question style match the syllabus you are following.</p>
        <p>Before relying on a document, check its title, subject, class or examination context and publication details where those are provided. A familiar file name alone is not proof that a resource is current or complete. If a resource does not match your course or exam year, keep looking rather than forcing it into your plan.</p>
      </article>
      <article class="home-guide-card">
        <span class="home-guide-index">03 / TRACE</span>
        <h3>Follow the original source</h3>
        <p>Compass is a discovery layer, not the publisher of every item listed. Resource cards identify whether an item opens at its original source, uses a permitted external embed or is hosted with permission. Follow the source link to check the publisher's own context, access conditions and latest version. A preview is only a way to inspect available information; it is not a replacement for the original document.</p>
        <p>Educator collections help you discover lessons and material associated with named teachers or channels. They do not imply endorsement, sponsorship or a formal partnership. ICSE Compass is an independent educational project and is not affiliated with or endorsed by CISCE. Always use the official council and school communications for authoritative syllabus, timetable and examination notices.</p>
      </article>
      <article class="home-guide-card">
        <span class="home-guide-index">04 / PRACTISE</span>
        <h3>Turn reading into active revision</h3>
        <p>After reviewing a topic, close the notes and try to explain the main idea from memory. Then solve a small set of questions without looking at the worked answer. Mark the points you could not recall, revisit only those gaps and try a fresh question later. This short cycle of review, retrieval and practice is more useful than collecting many PDFs and repeatedly scrolling through them.</p>
        <p>For examination practice, attempt a paper under a realistic time limit when you are ready. Review the marking guidance or answer discussion from the source, identify the reason for each lost mark and record one specific action for your next attempt. Separate a concept gap from a careless error or a time-management issue; each needs a different response.</p>
      </article>
      <article class="home-guide-card">
        <span class="home-guide-index">05 / PLAN</span>
        <h3>Use the syllabus tracker to keep your next step visible</h3>
        <p>The syllabus area can help you organise subjects and chapters and record your own progress on the device you are using. Keep the plan small enough to act on: choose one topic to understand, one task to practise and one earlier topic to revisit. Update progress only after you have done the work. Your tracker is a personal planning aid, not an official school record or a measure of your ability.</p>
        <p>If you change devices or clear browser data, use the available backup and restore controls before relying on a locally stored progress record. Saved items and syllabus progress are designed to help organise your own study; they do not change the availability or ownership of linked resources.</p>
      </article>
      <article class="home-guide-card">
        <span class="home-guide-index">06 / USE WELL</span>
        <h3>Build a balanced resource routine</h3>
        <p>Choose one dependable explanation, one source of practice and one way to check your understanding for each topic. Avoid downloading several versions of the same notes just because they appear in search results. Prefer material that is readable, relevant to your course and clear about its source. When a link is unavailable, try the publisher or educator's own site rather than assuming the file has disappeared permanently.</p>
        <p>ICSE Compass is intended to make discovery simpler, not to replace your teacher, prescribed textbooks, school instructions or official examination updates. Use it to find a starting point, verify the source and return to your own learning goal.</p>
      </article>
    </div>
    <div class="home-guide-faq" aria-labelledby="guide-faq-title">
      <h3 id="guide-faq-title">Frequently asked questions</h3>
      <div class="home-guide-faq-grid">
        <article><h4>Is ICSE Compass an official CISCE website?</h4><p>No. ICSE Compass is an independent educational resource-discovery project. It is not affiliated with, authorised by or endorsed by CISCE.</p></article>
        <article><h4>Does Compass create or publish every listed resource?</h4><p>No. Listings may point to original publishers, educators and other source websites. Check each listing's access label and follow its source link for the publisher's current terms.</p></article>
        <article><h4>Can I use Compass to track my syllabus?</h4><p>Yes. The syllabus area helps you organise chapter progress on your device. Keep a backup if you need to move your progress to another browser or device.</p></article>
      </div>
    </div>
  </section>

  <section class="home-planner-band page-width">
    <div><p class="eyebrow eyebrow-ruled">MAKE IT YOURS</p><h2>Turn a resource into a plan.</h2><p>Build your own subject and chapter list, then track your learning progress on this device.</p></div>
    <a href={siteBase + '/syllabus/'}>Open the syllabus tracker <span aria-hidden="true">→</span></a>
  </section>
</main>