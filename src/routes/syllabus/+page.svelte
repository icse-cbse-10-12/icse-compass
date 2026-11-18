<script lang="ts">
  import { onMount } from 'svelte';
  import { siteBase } from '#lib/site.ts';
  import type { Chapter, Subject } from '#lib/catalogue.ts';
  import { STUDY_STORAGE_KEY, createLocalId, emptyStudySnapshot, getChapterStatus, getStudySummary, mergeStudyStructure, parseStudySnapshot, type StudySnapshot, type StudyStatus } from '#lib/study-progress.ts';

  let catalogueSubjects = $state<Subject[]>([]);
  let catalogueChapters = $state<Chapter[]>([]);
  let snapshot = $state<StudySnapshot>(emptyStudySnapshot());
  let loading = $state(true);
  let loadError = $state(false);
  let storageError = $state(false);
  let subjectName = $state('');
  let chapterName = $state('');
  let activeSubjectId = $state('');
  let ready = $state(false);
  let backupMessage = $state('');
  let backupError = $state(false);

  let subjects = $derived(mergeStudyStructure(catalogueSubjects, snapshot.customSubjects));
  let chapters = $derived(mergeStudyStructure(catalogueChapters, snapshot.customChapters));
  let visibleChapters = $derived(activeSubjectId ? chapters.filter((chapter) => chapter.subjectId === activeSubjectId) : []);
  let summary = $derived(getStudySummary(chapters, snapshot.progress));
  let revisionChapters = $derived(chapters.filter((chapter) => getChapterStatus(snapshot.progress, chapter.subjectId, chapter.id) === 'needs-revision'));

  function persist() {
    if (!ready) return;
    try { localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(snapshot)); storageError = false; }
    catch { storageError = true; }
  }

  async function loadStructure() {
    loading = true; loadError = false;
    try {
      const [subjectResponse, chapterResponse] = await Promise.all([fetch(siteBase + '/data/subjects.json'), fetch(siteBase + '/data/chapters.json')]);
      if (!subjectResponse.ok || !chapterResponse.ok) throw new Error('Syllabus structure unavailable');
      const [subjectData, chapterData] = await Promise.all([subjectResponse.json(), chapterResponse.json()]);
      if (!Array.isArray(subjectData) || !Array.isArray(chapterData)) throw new Error('Invalid syllabus structure');
      catalogueSubjects = subjectData.filter((item: Subject) => item.status === 'published');
      catalogueChapters = chapterData.filter((item: Chapter) => item.status === 'published');
    } catch { loadError = true; }
    finally { loading = false; }
  }

  function addSubject(event: SubmitEvent) {
    event.preventDefault();
    const name = subjectName.trim();
    if (!name) return;
    const id = createLocalId('local-subject', name, subjects.map((item) => item.id));
    snapshot.customSubjects = [...snapshot.customSubjects, { id, name, sortOrder: subjects.length + 1, status: 'published' }];
    subjectName = ''; activeSubjectId = id; persist();
  }

  function addChapter(event: SubmitEvent) {
    event.preventDefault();
    const name = chapterName.trim();
    if (!name || !activeSubjectId) return;
    const count = chapters.filter((chapter) => chapter.subjectId === activeSubjectId).length;
    const id = createLocalId('local-chapter', name, chapters.map((item) => item.id));
    snapshot.customChapters = [...snapshot.customChapters, { id, subjectId: activeSubjectId, name, sortOrder: count + 1, status: 'published' }];
    chapterName = ''; persist();
  }

  function updateStatus(subjectId: string, chapterId: string, status: StudyStatus) {
    snapshot.progress = { ...snapshot.progress, [subjectId + '::' + chapterId]: status }; persist();
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'icse-compass-syllabus-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    link.click();
    URL.revokeObjectURL(url);
    backupMessage = 'Backup file prepared. Keep it somewhere safe.';
    backupError = false;
  }

  async function importBackup(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const value: unknown = JSON.parse(await file.text());
      if (!value || typeof value !== 'object') throw new Error('Invalid backup');
      const candidate = value as Partial<StudySnapshot>;
      if (candidate.version !== 1 || !Array.isArray(candidate.customSubjects) || !Array.isArray(candidate.customChapters) || !candidate.progress || typeof candidate.progress !== 'object' || Array.isArray(candidate.progress)) throw new Error('Unsupported backup format');
      if (!window.confirm('Import this backup and replace the syllabus data currently saved in this browser?')) return;
      snapshot = parseStudySnapshot(JSON.stringify(candidate));
      persist();
      backupMessage = 'Backup imported. Your local syllabus data has been restored.';
      backupError = false;
    } catch {
      backupMessage = 'This file is not a valid ICSE Compass syllabus backup.';
      backupError = true;
    } finally {
      input.value = '';
    }
  }

  onMount(() => {
    try { snapshot = parseStudySnapshot(localStorage.getItem(STUDY_STORAGE_KEY)); }
    catch { snapshot = emptyStudySnapshot(); storageError = true; }
    ready = true; void loadStructure();
  });
</script>

<svelte:head>
  <title>Syllabus Tracker | ICSE Compass</title>
  <meta name="description" content="Organise your ICSE Class X chapters, record learning progress and keep a local revision queue." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/syllabus/" />
  <meta property="og:title" content="Syllabus Tracker | ICSE Compass" />
  <meta property="og:description" content="A private, browser-based syllabus tracker for ICSE learners." />
</svelte:head>

<main class="page-content study-page syllabus-page">
  <header class="page-heading">
    <div><p class="eyebrow"><span class="eyebrow-rule"></span> YOUR STUDY WORKSPACE / 04</p><h1>Syllabus Tracker</h1><p class="page-intro">Keep your chapter progress honest, see what needs another pass, and build a revision queue that reflects your actual work.</p></div>
    <aside class="heading-aside"><strong>PRIVATE BY DEFAULT</strong>Your syllabus structure and progress stay in this browser. No student account or cloud sync.</aside>
  </header>

  <section class="study-summary" aria-label="Syllabus progress summary">
    <div class="summary-main"><span class="study-kicker">YOUR TRACKED CHAPTERS</span><strong>{summary.percent}%</strong><span>{summary.completed} of {summary.total} completed</span><div class="progress-track" role="progressbar" aria-label="Completed chapter progress" aria-valuemin="0" aria-valuemax={summary.total} aria-valuenow={summary.completed}><span style="width: {summary.percent}%"></span></div></div>
    <div class="summary-stats"><div><strong>{summary.learning}</strong><span>Learning</span></div><div><strong>{summary.practised}</strong><span>Practised</span></div><div><strong>{summary.needsRevision}</strong><span>Needs revision</span></div><div><strong>{summary.notStarted}</strong><span>Not started</span></div></div>
  </section>

  {#if storageError}<p class="study-alert" role="alert">This browser could not save your changes. Check its storage settings before relying on this tracker.</p>{/if}

  <section class="structure-panel" aria-labelledby="structure-title">
    <div class="section-heading"><div><span class="study-kicker">BUILD YOUR CHAPTER LIST</span><h2 id="structure-title">Your syllabus, your sequence.</h2><span class="local-label">SAVED ON THIS DEVICE</span></div>
      <div class="backup-actions"><button class="study-button secondary" type="button" onclick={exportBackup}>Export backup</button><label class="study-button secondary backup-import">Import backup<input type="file" accept="application/json,.json" onchange={importBackup} /></label></div>
    </div>
    {#if backupMessage}<p class:backup-error={backupError} class="backup-message" role="status">{backupMessage}</p>{/if}
    <p class="structure-note">The public catalogue does not yet contain verified subject and chapter records. Add the names from your school's prescribed ICSE syllabus; these entries remain local to this browser.</p>
    {#if loading}<div class="study-state" role="status"><span class="state-spinner" aria-hidden="true"></span><strong>Checking the published syllabus index…</strong></div>
    {:else if loadError}<div class="study-state" role="alert"><strong>The published syllabus index could not be loaded.</strong><p>Your locally saved subjects and chapters remain available.</p><button class="study-button secondary" type="button" onclick={loadStructure}>Try again</button></div>{/if}

    <form class="add-row" onsubmit={addSubject}><label for="new-subject">Add a subject</label><div class="add-controls"><input id="new-subject" bind:value={subjectName} maxlength="70" placeholder="e.g. Mathematics" required /><button class="study-button" type="submit">Add subject</button></div></form>

    {#if subjects.length > 0}
      <div class="subject-layout">
        <aside class="subject-list" aria-label="Subjects">
          {#each subjects as subject (subject.id)}
            <button type="button" class:active={activeSubjectId === subject.id} aria-pressed={activeSubjectId === subject.id} onclick={() => activeSubjectId = subject.id}><span>{subject.name}</span><small>{chapters.filter((chapter) => chapter.subjectId === subject.id).length} chapters</small></button>
          {/each}
        </aside>
        <div class="chapter-workspace">
          {#if activeSubjectId && subjects.some((subject) => subject.id === activeSubjectId)}
            <div class="chapter-workspace-heading"><h3>{subjects.find((subject) => subject.id === activeSubjectId)?.name}</h3><span>{visibleChapters.length} chapters</span></div>
            <form class="add-row chapter-add" onsubmit={addChapter}><label for="new-chapter">Add a chapter</label><div class="add-controls"><input id="new-chapter" bind:value={chapterName} maxlength="100" placeholder="Enter the chapter title" required /><button class="study-button" type="submit">Add chapter</button></div></form>
            {#if visibleChapters.length === 0}<div class="study-state compact"><strong>No chapters added yet.</strong><p>Add the chapter titles in the order you study them.</p></div>
            {:else}
              <div class="chapter-list">
                {#each visibleChapters as chapter (chapter.id)}
                  <article class="chapter-row">
                    <div class="chapter-row-copy"><strong>{chapter.name}</strong><span>Chapter entry</span></div>
                    <label class="status-control"><span class="visually-hidden">Progress for {chapter.name}</span><select value={getChapterStatus(snapshot.progress, chapter.subjectId, chapter.id)} onchange={(event) => updateStatus(chapter.subjectId, chapter.id, (event.currentTarget as HTMLSelectElement).value as StudyStatus)}><option value="not-started">Not started</option><option value="learning">Learning</option><option value="practised">Practised</option><option value="completed">Completed</option><option value="needs-revision">Needs revision</option></select></label>
                    <a href={siteBase + '/chapter-player/?subject=' + encodeURIComponent(chapter.subjectId) + '&chapter=' + encodeURIComponent(chapter.id)} aria-label={'Open Chapter Player for ' + chapter.name}>Open chapter <span aria-hidden="true">↗</span></a>
                  </article>
                {/each}
              </div>
            {/if}
          {:else}<div class="study-state compact"><strong>Choose a subject to get started.</strong><p>Your chapter list and progress will appear here.</p></div>{/if}
        </div>
      </div>
    {:else if !loading}<div class="study-state"><strong>Your syllabus starts here.</strong><p>Add a subject, then add its chapters. Nothing is pre-marked as completed.</p></div>{/if}
  </section>

  <section class="revision-panel" aria-labelledby="revision-title">
    <div class="section-heading"><div><span class="study-kicker">A GENTLE SECOND LOOK</span><h2 id="revision-title">Revision queue</h2></div><span class="revision-count">{revisionChapters.length} marked</span></div>
    {#if revisionChapters.length === 0}<p class="revision-empty">No chapters are marked for revision. When a topic needs another pass, choose “Needs revision” in its progress control and it will appear here.</p>
    {:else}<div class="revision-list">{#each revisionChapters as chapter (chapter.id)}<a href={siteBase + '/chapter-player/?subject=' + encodeURIComponent(chapter.subjectId) + '&chapter=' + encodeURIComponent(chapter.id)}><span><strong>{chapter.name}</strong><small>{subjects.find((subject) => subject.id === chapter.subjectId)?.name ?? 'Subject'}</small></span><span>Review chapter ↗</span></a>{/each}</div>{/if}
  </section>
  <p class="study-footnote">Progress is a personal record, not an assessment result. Data stays in this browser and may be lost if its site data is cleared.</p>
</main>

<style>
  .study-page { --study-card:#fffdf7; --study-soft:#efe9d8; --study-ink:#2b211a; --study-muted:#65584d; --study-green:#527b5c; --study-pista:#dce8d7; --study-line:#ddd5c5; padding-bottom:72px; }
  .study-page .page-heading h1{color:var(--study-ink)} .study-page .page-intro{color:var(--study-muted)}
  .study-kicker{color:var(--study-green);font-size:9px;font-weight:850;letter-spacing:1.2px}
  .study-summary,.structure-panel,.revision-panel{margin-top:22px;padding:22px;background:var(--study-card);border:1px solid var(--study-line)}
  .study-summary{display:grid;grid-template-columns:minmax(220px,.8fr) 1.2fr;gap:24px;align-items:center;background:var(--study-soft)}
  .summary-main{display:grid;grid-template-columns:auto 1fr;align-items:baseline;column-gap:12px}.summary-main .study-kicker{grid-column:1/-1}.summary-main strong{color:var(--study-ink);font:500 42px/1.1 var(--serif)}.summary-main>span:last-of-type{color:var(--study-muted);font-size:11px}
  .progress-track{grid-column:1/-1;height:8px;margin-top:11px;overflow:hidden;background:#ded8ca;border-radius:10px}.progress-track span{display:block;height:100%;background:var(--study-green);border-radius:inherit;transition:width .2s ease}
  .summary-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.summary-stats div{display:flex;min-height:68px;flex-direction:column;justify-content:center;gap:5px;padding:10px 12px;background:rgba(255,255,255,.55);border:1px solid rgba(110,105,85,.14)}.summary-stats strong{color:var(--study-ink);font:500 24px/1 var(--serif)}.summary-stats span{color:var(--study-muted);font-size:9px}
  .study-alert{margin:15px 0 0;padding:12px 14px;color:#803f2d;background:#f9e9e2;border:1px solid #e8c5b6;font-size:11px;line-height:1.6}
  .section-heading,.chapter-workspace-heading{display:flex;align-items:center;justify-content:space-between;gap:14px}.section-heading h2{margin:7px 0 0;color:var(--study-ink);font:500 27px/1.15 var(--serif)}.local-label,.revision-count{color:var(--study-muted);font-size:8px;font-weight:800;letter-spacing:.9px}
  .structure-note{max-width:760px;margin:12px 0 20px;color:var(--study-muted);font-size:11px;line-height:1.75}
  .add-row{display:grid;gap:8px;margin-top:18px}.add-row>label{color:var(--study-muted);font-size:10px;font-weight:750}.add-controls{display:flex;gap:8px}.add-controls input{width:100%;min-width:0;min-height:44px;padding:0 12px;color:var(--study-ink);background:#fff;border:1px solid var(--study-line);font-size:11px}
  .study-button{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:0 15px;color:#fff;background:var(--study-green);border:1px solid var(--study-green);font-size:10px;font-weight:750;cursor:pointer;white-space:nowrap}.study-button:hover{background:#3e6448}.study-button.secondary{color:var(--study-green);background:transparent}
  .subject-layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:18px;margin-top:22px}.subject-list{display:grid;align-content:start;gap:6px}.subject-list button{display:flex;min-height:48px;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;color:var(--study-ink);background:#f8f5ed;border:1px solid transparent;text-align:left;cursor:pointer}.subject-list button.active{background:var(--study-pista);border-color:#b9cbb5}.subject-list button span{font-size:10px;font-weight:750}.subject-list button small{color:var(--study-muted);font-size:8px;white-space:nowrap}
  .chapter-workspace{min-width:0;padding:16px;background:#faf8f1;border:1px solid var(--study-line)}.chapter-workspace-heading h3{margin:0;color:var(--study-ink);font:500 21px/1.2 var(--serif)}.chapter-workspace-heading span{color:var(--study-muted);font-size:9px}.chapter-add{margin:15px 0}.chapter-list{display:grid}
  .chapter-row{display:grid;grid-template-columns:minmax(0,1fr) 150px auto;align-items:center;gap:12px;min-height:68px;padding:10px 0;border-top:1px solid var(--study-line)}.chapter-row-copy{display:grid;gap:5px}.chapter-row-copy strong{color:var(--study-ink);font-size:11px}.chapter-row-copy span{color:var(--study-muted);font-size:8px}.status-control select{width:100%;min-height:44px;padding:0 8px;color:var(--study-ink);background:#fff;border:1px solid var(--study-line);font-size:9px}.chapter-row>a{display:inline-flex;min-height:40px;align-items:center;gap:5px;color:var(--study-green);font-size:9px;font-weight:800;white-space:nowrap}
  .study-state{display:flex;min-height:120px;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:20px;color:var(--study-ink);background:#f8f5ed;border:1px dashed #cfc6b4;text-align:center}.study-state strong{font:500 19px/1.2 var(--serif)}.study-state p{max-width:450px;margin:0;color:var(--study-muted);font-size:10px;line-height:1.7}.study-state.compact{min-height:100px;margin-top:14px}
  .revision-panel{margin-top:18px}.revision-empty{margin:14px 0 0;color:var(--study-muted);font-size:11px;line-height:1.75}.revision-list{display:grid;margin-top:12px}.revision-list a{display:flex;min-height:58px;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--study-line)}.revision-list a>span:first-child{display:grid;gap:4px}.revision-list strong{color:var(--study-ink);font-size:11px}.revision-list small,.revision-list a>span:last-child{color:var(--study-muted);font-size:9px}.revision-list a>span:last-child{color:var(--study-green);font-weight:750;white-space:nowrap}
  .study-footnote{margin:15px 0 0;color:#817568;font-size:9px;line-height:1.7}.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
  @media(max-width:760px){.study-summary{grid-template-columns:1fr;gap:17px}.subject-layout{grid-template-columns:1fr}.subject-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:600px){.study-page .page-heading{padding-top:43px}.study-summary,.structure-panel,.revision-panel{padding:15px}.summary-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.section-heading{align-items:flex-start;flex-direction:column}.local-label{align-self:flex-start}.add-controls{flex-direction:column}.study-button{width:100%}.chapter-workspace{padding:12px}.chapter-row{grid-template-columns:minmax(0,1fr) 1fr;gap:7px 10px}.chapter-row>a{grid-column:1/-1;min-height:38px;border-top:1px solid var(--study-line)}.revision-list a{align-items:flex-start}}
  @media(prefers-reduced-motion:reduce){.progress-track span{transition:none}}
</style>