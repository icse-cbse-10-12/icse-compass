<script lang="ts">
  import { siteBase } from '#lib/site.ts';

  const submissionLink = 'mailto:icsemasterclass@gmail.com?subject=ICSE%20School%20Question%20Paper%20Submission&body=School%20name%3A%0AClass%20and%20exam%20year%3A%0ASubject%3A%0AExam%20type%20(pre-board%2Fprelim%2Fterm%2Funit%20test%2Fmock)%3A%0AOfficial%20school%20source%20URL%3A%0APermission%20to%20share%20publicly%20(yes%2Fno)%3A%0A%0AI%20confirm%20that%20I%20am%20authorised%20to%20share%20this%20paper%20publicly.%20I%20have%20removed%20student%20names%2C%20roll%20numbers%20and%20other%20personal%20details.';
</script>

<svelte:head>
  <title>ICSE School Question Papers | ICSE Compass</title>
  <meta name="description" content="Discover verified ICSE school pre-board, prelim, term, unit-test and mock question papers. Only school-issued or permission-cleared sources are listed." />
  <meta name="robots" content="noindex,follow" />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/school-papers/" />
  <meta property="og:title" content="ICSE School Question Papers | ICSE Compass" />
  <meta property="og:description" content="A permission-checked directory of ICSE school-level practice papers." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/school-papers/" />
</svelte:head>

<main class="page-content school-papers-page">
  <header class="school-papers-heading">
    <p class="eyebrow">ICSE COMPASS · SCHOOL-LEVEL PRACTICE</p>
    <h1>School Question Papers</h1>
    <p>Pre-board papers, prelims, term exams, unit tests and school mock examinations — organised by school, subject and year.</p>
  </header>

  <section class="school-papers-status" aria-labelledby="school-papers-status-title">
    <span class="school-papers-kicker">VERIFIED DIRECTORY</span>
    <h2 id="school-papers-status-title">The school-paper collection is being verified.</h2>
    <p>There are no school-authorised papers ready to publish yet. We will list a paper only when it comes from the issuing school or the person sharing it has permission to make it public.</p>
    <a class="school-papers-submit" href={submissionLink}>Submit an authorised school paper <span aria-hidden="true">↗</span></a>
  </section>

  <section class="school-papers-guidance" aria-labelledby="school-papers-guidance-title">
    <h2 id="school-papers-guidance-title">What to include with a submission</h2>
    <ul>
      <li>School name, subject, class and examination year.</li>
      <li>Paper type: pre-board, prelim, term exam, unit test or mock.</li>
      <li>The school's original public link, or written permission to share the file.</li>
      <li>A clean copy with student names, roll numbers, signatures and other personal details removed.</li>
    </ul>
    <p>ICSE Compass links to the original source wherever possible. We do not mirror school papers or publish anonymous bundles without permission.</p>
  </section>

  <a class="school-papers-back" href="{siteBase}/materials/">Browse the Materials Library <span aria-hidden="true">↗</span></a>
</main>

<style>
  .school-papers-page { max-width: 980px; padding-block: 54px 90px; }
  .school-papers-heading { max-width: 760px; margin-bottom: 28px; }
  .school-papers-heading h1 { margin: 16px 0 12px; color: #2b211a; font: 500 clamp(36px, 5vw, 54px)/1.08 var(--serif); letter-spacing: -1.4px; }
  .school-papers-heading > p:last-child { max-width: 650px; color: #5f6259; font-size: 14px; line-height: 1.8; }
  .school-papers-status { padding: clamp(22px, 4vw, 36px); background: #e9f0e4; border: 1px solid #cfddc9; border-bottom: 3px solid #b9cbb2; border-radius: 10px; }
  .school-papers-kicker { color: #527b5c; font-size: 9px; font-weight: 850; letter-spacing: 1.3px; }
  .school-papers-status h2 { margin: 12px 0 9px; color: #2b211a; font: 500 clamp(23px, 3vw, 30px)/1.2 var(--serif); }
  .school-papers-status p, .school-papers-guidance p { max-width: 690px; color: #5b6258; font-size: 12px; line-height: 1.8; }
  .school-papers-submit { display: inline-flex; min-height: 46px; align-items: center; gap: 16px; margin-top: 12px; padding: 0 17px; color: #fff; background: #355f43; border: 1px solid #294d35; border-radius: 5px; font-size: 11px; font-weight: 800; }
  .school-papers-submit:hover { background: #294d35; }
  .school-papers-guidance { margin-top: 28px; padding: 24px 0; border-top: 1px solid #ddd6c9; border-bottom: 1px solid #ddd6c9; }
  .school-papers-guidance h2 { margin: 0 0 12px; color: #2b211a; font: 500 23px/1.25 var(--serif); }
  .school-papers-guidance ul { display: grid; gap: 9px; margin: 0; padding-left: 19px; color: #4f584d; font-size: 12px; line-height: 1.65; }
  .school-papers-back { display: inline-flex; min-height: 44px; align-items: center; gap: 12px; margin-top: 18px; color: #355f43; font-size: 11px; font-weight: 800; }
  .school-papers-page a:focus-visible { outline: 3px solid #527b5c; outline-offset: 3px; }
</style>