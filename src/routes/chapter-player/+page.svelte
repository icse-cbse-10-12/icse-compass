<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';
  import type { Chapter, Resource, Subject } from '#lib/catalogue.ts';
  import { STUDY_STORAGE_KEY, emptyStudySnapshot, getChapterStatus, mergeStudyStructure, parseStudySnapshot, type StudySnapshot, type StudyStatus } from '#lib/study-progress.ts';

  const statusOptions: { value: StudyStatus; label: string }[] = [
    { value: 'not-started', label: 'Not started' }, { value: 'learning', label: 'Learning' }, { value: 'practised', label: 'Practised' },
    { value: 'completed', label: 'Completed' }, { value: 'needs-revision', label: 'Needs revision' }
  ];
  let catalogueSubjects = $state<Subject[]>([]);
  let catalogueChapters = $state<Chapter[]>([]);
  let resources = $state<Resource[]>([]);
  let snapshot = $state<StudySnapshot>(emptyStudySnapshot());
  let selectedSubjectId = $state('');
  let selectedChapterId = $state('');
  let loading = $state(true);
  let loadError = $state(false);
  let storageError = $state(false);
  let ready = $state(false);

  let subjects = $derived(mergeStudyStructure(catalogueSubjects, snapshot.customSubjects));
  let chapters = $derived(mergeStudyStructure(catalogueChapters, snapshot.customChapters));
  let subjectChapters = $derived(chapters.filter((chapter) => chapter.subjectId === selectedSubjectId));
  let selectedChapter = $derived(chapters.find((chapter) => chapter.id === selectedChapterId && chapter.subjectId === selectedSubjectId));
  let chapterResources = $derived(resources.filter((resource) => resource.status === 'published' && resource.subjectId === selectedSubjectId && resource.chapterId === selectedChapterId));
  let videos = $derived(chapterResources.filter((resource) => resource.resourceType === 'video'));
  let notes = $derived(chapterResources.filter((resource) => resource.resourceType === 'pdf' || resource.resourceType === 'notes'));
  let otherResources = $derived(chapterResources.filter((resource) => resource.resourceType !== 'video' && resource.resourceType !== 'pdf' && resource.resourceType !== 'notes'));
  let featuredVideo = $derived(videos.find((resource) => resource.accessMethod === 'embed' && resource.embedAllowed));
  let currentStatus = $derived(selectedChapter ? getChapterStatus(snapshot.progress, selectedSubjectId, selectedChapter.id) : 'not-started');

  function persist() {
    if (!ready) return;
    try { localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(snapshot)); storageError = false; }
    catch { storageError = true; }
  }

  async function loadPlayerData() {
    loading = true; loadError = false;
    try {
      const [subjectResponse, chapterResponse, resourceResponse] = await Promise.all([fetch(siteBase + '/data/subjects.json'), fetch(siteBase + '/data/chapters.json'), fetch(siteBase + '/data/resources.json')]);
      if (!subjectResponse.ok || !chapterResponse.ok || !resourceResponse.ok) throw new Error('Chapter catalogue unavailable');
      const [subjectData, chapterData, resourceData] = await Promise.all([subjectResponse.json(), chapterResponse.json(), resourceResponse.json()]);
      if (![subjectData, chapterData, resourceData].every(Array.isArray)) throw new Error('Invalid chapter catalogue');
      catalogueSubjects = subjectData.filter((item: Subject) => item.status === 'published');
      catalogueChapters = chapterData.filter((item: Chapter) => item.status === 'published');
      resources = resourceData.filter((item: Resource) => item.status === 'published');
    } catch { loadError = true; }
    finally { loading = false; }
  }

  function updateStatus(status: StudyStatus) {
    if (!selectedChapter) return;
    snapshot.progress = { ...snapshot.progress, [selectedSubjectId + '::' + selectedChapter.id]: status }; persist();
  }

  function selectSubject(value: string) {
    selectedSubjectId = value;
    selectedChapterId = chapters.find((chapter) => chapter.subjectId === value)?.id ?? '';
  }

  onMount(() => {
    try { snapshot = parseStudySnapshot(localStorage.getItem(STUDY_STORAGE_KEY)); }
    catch { snapshot = emptyStudySnapshot(); storageError = true; }
    ready = true;
    const params = new URLSearchParams(window.location.search);
    selectedSubjectId = params.get('subject') ?? '';
    selectedChapterId = params.get('chapter') ?? '';
    void loadPlayerData();
  });
</script>

<svelte:head>
  <title>Chapter Player | ICSE Compass</title>
  <meta name="description" content="Study an ICSE chapter with its approved video, notes and source links in one focused view." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/chapter-player/" />
  <meta property="og:title" content="Chapter Player | ICSE Compass" />
  <meta property="og:description" content="A focused chapter workspace with source-linked resources and local learning states." />
</svelte:head>

<main class="page-content study-page player-page">
  <header class="page-heading">
    <div><p class="eyebrow"><span class="eyebrow-rule"></span> FOCUSED LEARNING / 05</p><h1>Chapter Player</h1><p class="page-intro">Bring a chapter's approved videos, notes and original sources into one calm study view. Your learning state is yours to update.</p></div>
    <aside class="heading-aside"><strong>FOLLOW THE SOURCE</strong>Only published catalogue resources and explicitly permitted embeds appear here.</aside>
  </header>

  {#if storageError}<p class="study-alert" role="alert">This browser could not save your learning state. Check its storage settings before relying on this record.</p>{/if}
  <section class="player-selectors" aria-label="Choose a subject and chapter">
    <label>Subject<select value={selectedSubjectId} onchange={(event) => selectSubject((event.currentTarget as HTMLSelectElement).value)}><option value="">Choose a subject</option>{#each subjects as subject}<option value={subject.id}>{subject.name}</option>{/each}</select></label>
    <label>Chapter<select bind:value={selectedChapterId}><option value="">Choose a chapter</option>{#each subjectChapters as chapter}<option value={chapter.id}>{chapter.name}</option>{/each}</select></label>
    <a href={siteBase + '/syllabus/'}>Manage syllabus ↗</a>
  </section>

  {#if loading}
    <div class="player-state" role="status"><span class="state-spinner" aria-hidden="true"></span><strong>Preparing your chapter workspace…</strong><p>Checking published resources and your local chapter list.</p></div>
  {:else if loadError}
    <div class="player-state" role="alert"><strong>The chapter catalogue could not be loaded.</strong><p>Check your connection and try again. Your local learning state is not changed by a catalogue refresh.</p><button class="study-button secondary" type="button" onclick={loadPlayerData}>Try again</button></div>
  {:else if !selectedChapter}
    <div class="player-state"><strong>{chapters.length === 0 ? 'Add your syllabus first.' : 'Choose a chapter to begin.'}</strong><p>{chapters.length === 0 ? 'The public syllabus index has no published chapter records yet. Add your subject and chapter titles in the Syllabus Tracker; they will appear here on this device.' : 'Select a subject and chapter above, or open a chapter directly from your Syllabus Tracker.'}</p><a class="study-button" href={siteBase + '/syllabus/'}>Open Syllabus Tracker</a></div>
  {:else}
    <div class="chapter-context"><span>{subjects.find((subject) => subject.id === selectedSubjectId)?.name ?? 'Subject'}</span><span aria-hidden="true">/</span><strong>{selectedChapter.name}</strong></div>
    <section class="player-workspace" aria-labelledby="chapter-title">
      <div class="player-main">
        <div class="video-stage">
          {#if featuredVideo}
            <iframe src={featuredVideo.sourceUrl} title={featuredVideo.title} loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          {:else}
            <div class="video-empty"><span class="play-mark" aria-hidden="true">▶</span><strong>No permitted video embed is listed.</strong><p>When an approved video is published for this chapter, it will appear here. External video links are listed alongside the other chapter resources.</p></div>
          {/if}
        </div>
        <div class="chapter-title-row"><div><span class="study-kicker">CURRENT CHAPTER</span><h2 id="chapter-title">{selectedChapter.name}</h2></div><span class="chapter-subject">{subjects.find((subject) => subject.id === selectedSubjectId)?.name}</span></div>
        <div class="learning-status" aria-label="Learning status"><span class="study-kicker">YOUR LEARNING STATE</span><div class="status-options">{#each statusOptions as option}<button type="button" class:chosen={currentStatus === option.value} aria-pressed={currentStatus === option.value} onclick={() => updateStatus(option.value)}>{option.label}</button>{/each}</div><p>Choose the state that best reflects your work. Opening a video or note does not automatically mark a chapter complete.</p></div>
      </div>
      <aside class="player-sidebar">
        <section class="resource-section"><div class="resource-section-heading"><h3>Videos</h3><span>{videos.length}</span></div>
          {#if videos.length === 0}<p class="resource-empty">No published video resources for this chapter yet.</p>{:else}
            {#each videos as resource (resource.id)}<a class="chapter-resource" href={resource.sourceUrl} target="_blank" rel="noopener noreferrer"><span class="resource-icon">▶</span><span><strong>{resource.title}</strong><small>{resource.accessMethod === 'embed' && resource.embedAllowed ? 'Permitted embed · Original source' : 'External video · Original source'}</small></span><span aria-hidden="true">↗</span></a>{/each}
          {/if}
        </section>
        <section class="resource-section"><div class="resource-section-heading"><h3>Notes &amp; PDFs</h3><span>{notes.length}</span></div>
          {#if notes.length === 0}<p class="resource-empty">No published notes or PDFs for this chapter yet.</p>{:else}
            {#each notes as resource (resource.id)}<a class="chapter-resource" href={resource.sourceUrl} target="_blank" rel="noopener noreferrer"><span class="resource-icon">▤</span><span><strong>{resource.title}</strong><small>{resource.resourceType === 'pdf' ? 'PDF · Original source' : 'Notes · Original source'}</small></span><span aria-hidden="true">↗</span></a>{/each}
          {/if}
        </section>
        {#if otherResources.length > 0}<section class="resource-section"><div class="resource-section-heading"><h3>More resources</h3><span>{otherResources.length}</span></div>{#each otherResources as resource (resource.id)}<a class="chapter-resource" href={resource.sourceUrl} target="_blank" rel="noopener noreferrer"><span class="resource-icon">↗</span><span><strong>{resource.title}</strong><small>{resource.resourceType.replace('-', ' ')} · Original source</small></span><span aria-hidden="true">↗</span></a>{/each}</section>{/if}
      </aside>
    </section>
    <p class="study-footnote">Resources appear only after catalogue review. A public link is not proof that a file may be hosted or embedded; permissions are checked before publication.</p>
  {/if}
</main>

<style>
  .study-page{--study-card:#fffdf7;--study-ink:#2b211a;--study-muted:#65584d;--study-green:#527b5c;--study-pista:#dce8d7;--study-line:#ddd5c5;padding-bottom:72px}.study-page .page-heading h1{color:var(--study-ink)}.study-page .page-intro{color:var(--study-muted)}.study-kicker{color:var(--study-green);font-size:9px;font-weight:850;letter-spacing:1.2px}
  .study-alert{margin:15px 0 0;padding:12px 14px;color:#803f2d;background:#f9e9e2;border:1px solid #e8c5b6;font-size:11px;line-height:1.6}
  .player-selectors{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;align-items:end;gap:12px;margin:22px 0 18px;padding:18px;background:#efe9d8;border:1px solid #ddd5c5}.player-selectors label{display:grid;gap:7px;color:#65584d;font-size:10px;font-weight:750}.player-selectors select{width:100%;min-height:44px;padding:0 10px;color:#2b211a;background:#fffdf7;border:1px solid #d5cdbd;font-size:11px}.player-selectors>a{display:inline-flex;min-height:44px;align-items:center;padding:0 12px;color:#527b5c;font-size:10px;font-weight:800;white-space:nowrap}
  .player-state{display:flex;min-height:230px;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:28px;background:#fffdf7;border:1px dashed #cfc6b4;text-align:center}.player-state strong{color:#2b211a;font:500 24px/1.2 var(--serif)}.player-state p{max-width:500px;margin:0;color:#65584d;font-size:11px;line-height:1.8}.player-state .study-button{margin-top:7px;text-decoration:none}
  .chapter-context{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin:18px 0 12px;color:#7a6d60;font-size:10px}.chapter-context strong{color:#2b211a}.player-workspace{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(280px,.85fr);gap:18px;align-items:start}.player-main,.player-sidebar{min-width:0}
  .video-stage{position:relative;display:grid;width:100%;aspect-ratio:16/9;place-items:center;overflow:hidden;background:#252923;border:1px solid #ddd5c5}.video-stage iframe{width:100%;height:100%;border:0}.video-empty{display:flex;max-width:400px;flex-direction:column;align-items:center;gap:10px;padding:22px;color:#fffdf7;text-align:center}.play-mark{display:grid;width:48px;height:48px;place-items:center;color:#fff;background:#527b5c;border-radius:50%;font-size:17px}.video-empty strong{font:500 20px/1.2 var(--serif)}.video-empty p{margin:0;color:#d7d2c6;font-size:10px;line-height:1.7}
  .chapter-title-row{display:flex;align-items:end;justify-content:space-between;gap:15px;padding:20px 0 16px;border-bottom:1px solid #ddd5c5}.chapter-title-row h2{margin:6px 0 0;color:#2b211a;font:500 30px/1.15 var(--serif)}.chapter-subject{color:#65584d;font-size:9px}
  .learning-status{display:grid;gap:11px;padding:17px 0}.status-options{display:flex;flex-wrap:wrap;gap:7px}.status-options button{min-height:40px;padding:0 12px;color:#65584d;background:#fffdf7;border:1px solid #d5cdbd;font-size:9px;font-weight:750;cursor:pointer}.status-options button.chosen{color:#2f583a;background:#dce8d7;border-color:#a8c0a5}.learning-status p{margin:0;color:#82766a;font-size:9px;line-height:1.7}
  .player-sidebar{display:grid;gap:12px}.resource-section{padding:15px;background:#fffdf7;border:1px solid #ddd5c5}.resource-section-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:11px;border-bottom:1px solid #e7e0d2}.resource-section-heading h3{margin:0;color:#2b211a;font:500 19px/1.2 var(--serif)}.resource-section-heading>span{color:#65584d;font-size:9px}.resource-empty{margin:12px 0 0;color:#82766a;font-size:10px;line-height:1.7}
  .chapter-resource{display:grid;grid-template-columns:27px minmax(0,1fr) auto;align-items:center;gap:9px;min-height:60px;padding:9px 0;border-bottom:1px solid #eee8dd}.chapter-resource:last-child{border-bottom:0}.resource-icon{display:grid;width:27px;height:27px;place-items:center;color:#527b5c;background:#e7efe2;font-size:12px}.chapter-resource>span:nth-child(2){display:grid;gap:4px;min-width:0}.chapter-resource strong{overflow-wrap:anywhere;color:#2b211a;font-size:10px;line-height:1.4}.chapter-resource small{color:#82766a;font-size:8px;line-height:1.4}.chapter-resource>span:last-child{color:#527b5c;font-size:12px}
  .study-footnote{margin:15px 0 0;color:#817568;font-size:9px;line-height:1.7}
  @media(max-width:760px){.player-workspace{grid-template-columns:1fr}.player-sidebar{grid-template-columns:repeat(2,minmax(0,1fr))}.player-sidebar .resource-section:last-child:nth-child(odd){grid-column:1/-1}}
  @media(max-width:600px){.study-page .page-heading{padding-top:43px}.player-selectors{grid-template-columns:1fr;gap:10px;padding:14px}.player-selectors>a{justify-content:center;border:1px solid #c6d4c0}.chapter-title-row{align-items:flex-start;flex-direction:column}.chapter-title-row h2{font-size:26px}.player-sidebar{grid-template-columns:1fr}.player-sidebar .resource-section:last-child:nth-child(odd){grid-column:auto}.video-empty{padding:12px}.video-empty strong{font-size:16px}.video-empty p{font-size:9px}}
</style>