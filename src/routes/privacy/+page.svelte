<script lang="ts">import { siteBase } from '#lib/site.ts';</script>
<svelte:head>
  <title>Privacy | ICSE Compass</title>
  <meta name="description" content="How ICSE Compass protects student privacy with no accounts, no tracking cookies, and on-device study data." />
  <link rel="canonical" href="https://icse-cbse-10-12.github.io/icse-compass/privacy/" />
  <meta property="og:title" content="Privacy | ICSE Compass" />
  <meta property="og:description" content="A privacy-first study workspace: no student accounts, no tracking cookies, and device-only study data." />
  <meta property="og:url" content="https://icse-cbse-10-12.github.io/icse-compass/privacy/" />
</svelte:head>
<main class="page-content simple-page privacy-page">
  <p class="eyebrow">ICSE COMPASS · PRIVACY</p>
  <h1>Your study space should stay yours.</h1>
  <p class="privacy-intro">ICSE Compass is designed for school learners, including students under 18. The app does not ask students to create accounts or submit personal details to use its public learning pages.</p>
  <p class="privacy-updated">Last updated: 14 November 2026</p>

  <section class="privacy-section">
    <h2>What the app does not collect</h2>
    <p>The ICSE Compass app does not request or collect student profile information. There are no mandatory sign-ups, email waitlists, profile photos, biometric features, advertising profiles, behavioural monitoring, or session-replay tools. The app does not set tracking cookies or run third-party analytics or ad trackers.</p>
  </section>

  <section class="privacy-section">
    <h2>Study data stays on your device</h2>
    <p>When saved study links and paper checklists are introduced, they are intended to be stored in your browser on the device you use: IndexedDB for saved items and localStorage only for small preferences. They will not be sent to an ICSE Compass account or synchronised to a server. These student workspace features are not part of the current foundation release.</p>
    <p>The installable app may cache public site files and public catalogue feeds on your device for offline access. The service-worker cache is for public content, not student profiles or personal study records. Clearing this site's browser storage removes its local app data and offline cache.</p>
  </section>

  <section class="privacy-section">
    <h2>External educational publishers</h2>
    <p>Some resource links may take you to an external educational publisher, educator, or website. Those sites are operated independently. When you follow an external link, that publisher may receive technical information from your browser and apply its own cookies and privacy policy. Check the publisher's policy before sharing information there.</p>
  </section>

  <section class="privacy-section">
    <h2>Hosting and technical requests</h2>
    <p>ICSE Compass is hosted as a static website on GitHub Pages. Although the app itself does not collect student profile data or use tracking cookies, GitHub may process technical request information, such as an IP address and browser/request details, to deliver and protect its hosting service. That infrastructure processing is controlled by GitHub under its own policies. Read the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a>.</p>
  </section>

  <section class="privacy-section">
    <h2>If you contact the team</h2>
    <p>If you voluntarily email <a href="mailto:icsemasterclass@gmail.com">icsemasterclass@gmail.com</a>, the email address and message you send will be processed so the team can respond. Please do not email passwords, identity documents, sensitive personal details, or private student records.</p>
  </section>

  <section class="privacy-section">
    <h2>Our approach for learners under 18</h2>
    <p>We avoid collecting children's personal data and do not use tracking, behavioural monitoring, or targeted advertising. Any future feature that would process personal data will require a separate privacy and legal review, clear purpose and data-minimisation controls, and any consent or safeguards required by applicable Indian law before release.</p>
  </section>

  <p class="privacy-disclaimer">This page describes the current app design and planned device-only storage approach. It is not a legal certification or a guarantee about the separate services linked above.</p>
  <a class="text-link" href="{siteBase}/">← Return to overview</a>
</main>