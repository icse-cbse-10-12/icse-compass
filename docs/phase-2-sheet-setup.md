# ICSE Compass Phase 2 — Google Sheets publishing setup

The catalogue is served from static JSON on GitHub Pages. The Google Sheet is the editing source; the Apps Script publisher commits one validated update containing all five public JSON files. A push to `main` starts the existing GitHub Pages workflow, which validates the data, runs tests, builds the site and deploys it.

## Required tabs

Create a **new, separate Google Sheet** for ICSE Compass. Do not reuse or migrate the old ICSE MasterClass resource workbook.

Create these six tabs with the exact names below. Row 1 must contain the exact snake_case headers. Column order does not matter.

### Resources

`resource_id, title, description, subject_id, chapter_id, creator_id, resource_type, source_url, access_method, hosting_permission, embed_allowed, file_size_bytes, page_count, thumbnail_url, keywords, status, updated_at`

- `resource_id`: stable unique ID; do not change after publication.
- `resource_type`: `pdf`, `video`, `website`, `notes`, `practice-paper`, or `other`.
- `access_method`: `hosted`, `external`, or `embed`.
- `hosting_permission`: `owned`, `authorized`, `not-applicable`, or `not-authorized`.
- A hosted file is publishable only when permission is `owned` or `authorized`.
- An embed is publishable only when `embed_allowed` is TRUE and the publisher permits embedding.
- External resources link to their original source; no rehosting permission is implied.
- `file_size_bytes` and `page_count` are optional and must be verified. Leave blank if unknown.
- `keywords` accepts comma- or semicolon-separated terms.
- Only rows whose `status` is exactly `published` (case-insensitive) enter public JSON. Draft, pending, blank and withdrawn rows remain private.

### Creators

`creator_id, name, description, platform, profile_url, status`

Only published creators with a verified HTTPS profile URL are public. A resource's `creator_id` must match a published creator ID.

### Subjects & Chapters

`subject_id, subject_name, subject_sort_order, chapter_id, chapter_name, chapter_sort_order, status`

Use one row per chapter. Repeat the subject columns for each chapter. A subject with no chapters may have blank chapter fields. IDs must be stable and unique; all published chapters must reference a published subject.

### Submissions (private)

Suggested columns: `submission_id, submitted_title, submitted_url, suggested_creator, suggested_subject, submitted_by, submitted_at, review_status, reviewer_notes`.

This tab is never exported to public JSON.

### Review Log (private)

Suggested columns: `review_id, resource_id, action, reviewer, reason, reviewed_at`.

This tab is never exported to public JSON.

### Settings (private)

Use for internal notes and configuration. This tab is never exported to public JSON.

## Install automatic publishing

1. Open the new Google Sheet.
2. Select **Extensions → Apps Script**.
3. Replace the editor contents with the complete file at [integrations/google-apps-script/Code.gs](../integrations/google-apps-script/Code.gs).
4. Save the Apps Script project.
5. In Apps Script, open **Project Settings → Script Properties** and add:
   - `GITHUB_TOKEN`: a fine-grained GitHub token restricted to this repository, with **Contents: Read and write** permission. Do not paste it into a sheet cell or commit it to Git.
   - `GITHUB_OWNER`: `icse-cbse-10-12`
   - `GITHUB_REPO`: `icse-compass`
   - `GITHUB_BRANCH`: `main`
6. Run `installCatalogueTrigger` once from the Apps Script editor and approve Google's requested permissions. Alternatively, use the **ICSE Compass → Install automatic publishing** sheet menu after reloading.
7. Run `publishCatalogue` once manually to test the configuration.

The installable edit trigger publishes when a user edits the Resources, Creators, or Subjects & Chapters tabs. It ignores edits to private tabs. The menu also provides a manual publish action.

## What happens after a Sheet edit

1. Apps Script reads the three public-data tabs.
2. It exports only rows marked `published`.
3. It validates required fields, HTTPS URLs, unique IDs, references, hosted-file permission and embed permission.
4. It creates one Git commit updating `static/data/*.json`.
5. GitHub Pages workflow validates the generated JSON, runs the existing tests and production build, then deploys.
6. If validation/build fails, the deployment does not proceed. Inspect the commit's Actions run for the error.

This is automatic after the one-time setup; it is not instant. GitHub Actions must finish before the public site changes. A stale browser/service-worker cache may briefly show the previous catalogue.

## Security and rights

- Never place the GitHub token in a cell, source file, public JSON, or browser code. Keep it only in Apps Script Script Properties.
- Restrict the fine-grained token to this repository and Contents read/write. Rotate it if exposed.
- Give Sheet edit access only to trusted administrators; an editor can change published catalogue data.
- Keep Submissions, Review Log and Settings private. The publisher exports only Resources, Creators, and Subjects & Chapters.
- Do not publish paid publisher PDFs or other copyrighted files without documented hosting permission. Publicly accessible URLs are not permission to rehost.
- Use external links or permitted embeds for third-party resources. An embed requires explicit permission.
- Do not enter student personal information in public catalogue tabs.
- The publishing script commits to `main`, which triggers the existing Pages build/deploy workflow. Do not change branch protection or disable required repository checks to bypass a failed build.
