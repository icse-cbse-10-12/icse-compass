# Privacy-by-design rules for ICSE Compass

These are product and engineering requirements for a public learning platform used by Indian school students, including children under 18. They are intentionally stricter than a typical analytics-driven education product. This document is not a legal opinion or a claim of DPDP Act compliance.

## Default: do not collect student identity

- Public learning pages must work without an account, sign-in, email waitlist, phone number, date of birth, school name, profile photo, face scan, fingerprint, or other biometric input.
- Do not add advertising SDKs, analytics identifiers, session replay, cross-site pixels, behavioural profiles, targeted advertising, or tracking cookies.
- Do not collect student names, contact details, location, marks, attendance, or learning behaviour merely to personalise a page.
- Do not add a server-side student profile, remote study-history endpoint, or background telemetry by default.

## Device-only student workspace

When saved links and paper checklists are implemented:

- Store saved links, checklist state, and revision markers in IndexedDB on the learner's current browser/device.
- Use localStorage only for small non-sensitive preferences such as theme or dismissed interface hints.
- Do not upload, sync, back up, or transmit these records to an ICSE Compass server. No account-based cross-device sync is permitted under this design.
- Make local data deletion discoverable and explain that browser storage is device- and browser-specific. Do not imply that local data follows a learner to another device.
- Avoid storing sensitive personal details. Study state should use only the minimum resource identifiers and completion flags needed by the interface.
- Handle unavailable storage, quota errors, private-browsing restrictions, and corrupted records without losing the rest of the app or falsely reporting a save.

These features are not present in the current foundation release. Do not describe them as already available.

## PWA and offline cache boundary

- The service worker may precache public static assets and public, non-personal JSON catalogue feeds.
- Do not cache account pages, authentication responses, private APIs, student records, personal exports, or responses containing personal data.
- Do not use Background Sync or another mechanism to upload local study data.
- Keep cache size and lifetime bounded; provide a clear way to remove the app and its stored data.
- Treat a service-worker cache as a local copy of public content, not as a private-data database.

## External publishers and hosting

- Label external resource links clearly. Open the original publisher directly and do not imply that its privacy practices are controlled by ICSE Compass.
- Do not embed third-party scripts, ad pixels, analytics, remote fonts, or session replay. Prefer plain links over embeds; review any future embed as a separate privacy and performance decision.
- GitHub Pages hosting may process technical request metadata, including IP and browser/request details. The public privacy notice must disclose this provider-level processing rather than promising that no data of any kind is processed anywhere.
- If a learner voluntarily emails the support address, the message and sender address are processed to reply. Warn users not to send sensitive student records.

## Change gate for any future data processing

Before introducing a feature that processes personal data, stop implementation and complete a documented privacy review covering purpose, necessity, data categories, data flow, recipients/processors, retention/deletion, security, user rights, breach handling, and child-specific safeguards. Obtain qualified Indian legal review for the then-current DPDP Act, Rules, commencement notifications, and any applicable exemptions. Implement verifiable parental consent and notices where legally required before processing a child's personal data. Do not assume that local storage alone automatically removes every legal obligation.

## Performance and accessibility

- Use native system fonts and first-party assets; no remote font fetches.
- Keep the public experience static-first, low-JavaScript, and usable on low-memory Android devices.
- Keep all interactive targets at least 48 CSS pixels high or wide where applicable.
- Preserve keyboard access, visible focus, readable contrast, and reduced-motion support.
