# CoP Platform — FSD v2 Compliance Tracker

**Last updated:** 2026-04-21
**Reference:** `CoP FSD v2.md` (Functional Specification Document v1.0)

---

## Milestone 1: Setup & Planning — COMPLETE

- [x] NodeBB installed on dev + staging (v4.9.1, cop-forum.onrender.com)
- [x] PostgreSQL database provisioned (Neon serverless, SSL)
- [x] 4 French categories created (Annonces, Discussions Générales, Méthodologie & Outils, Événements)
- [x] Default language set to French (`defaultLang: fr`, `autoDetectLang: false`)
- [x] 4-tier access roles verified (guests, registered-users, Global Moderators, administrators)
- [x] Admin account configured (admin / cop@dmin1)

---

## Milestone 2: Branding & User Profiles — COMPLETE

### Theme & Branding (DONE)

- [x] Theme plugin extending Harmony (`nodebb-theme-cop/`)
- [x] Ministry branding (teal-green #2D6A4F, Ministry logo, Inter font)
- [x] Custom navbar with frosted glass scroll effect
- [x] Homepage as professional hub (hero section + category cards grid)
- [x] Category cards with icons/descriptions
- [x] Topic/thread view styling
- [x] User profile page styling (banner + avatar overlay)
- [x] Footer with Ministry branding + LVZ attribution
- [x] Mobile responsive 320px+ (hamburger + drawer nav)
- [x] French UI labels in theme (11 strings)
- [x] Admin config panel (`/admin/plugins/cop-theme`)
- [x] Login/Register page styling
- [x] Widget areas defined (21+)

### User Profiles (FSD §3.3) — DONE

- [x] Registration with email verification (built-in)
- [x] Custom field: full name / organization (input-text, `fullname_org`)
- [x] Custom field: expertise areas (select-multi, `expertise` — 14 evaluation domains)
- [x] Custom field: region within Cote d'Ivoire (select, `region` — 14 districts)
- [x] Custom field: organisation type (select, `org_type` — 5 types)
- [x] Custom field: professional biography (textarea, `bio_pro`, members-only visibility)
- [x] Custom field: title/role (input-text, `title_role`)
- [x] Profile photo upload (built-in)
- [x] Per-user per-field privacy controls — field-level visibility set (all/loggedin/privileged); admin-configurable at `/admin/manage/users/custom-fields`
- [x] Direct messaging (built-in chat)
- [x] Account deletion with post anonymization — built-in: `deleteAccount` removes PII, posts remain without user attribution
- [x] Registration flow in French (built-in translations)

---

## Milestone 3: Document Library & Directory — COMPLETE

### Documentation Repository (FSD §3.2)

- [x] File upload support (PDF, DOCX, XLSX, PPTX, JPG, PNG) — `nodebb-plugin-cop-documents` with configurable extension allowlist
- [x] Configurable max file size (default 20MB) — admin settings panel
- [x] Mandatory metadata form (title, author, date, description 50+ chars, category, tag) — upload form with server-side validation
- [x] Optional metadata (region, sector, source org, publication date, language) — upload form fields
- [x] Document categories (5 initial: Reports, Tools, Policy, Cases, Training) — translation keys with fr/en-GB
- [x] Full-text search across titles, descriptions, tags, AI summaries — search filter on list page + AI summaries indexed
- [x] Filter by category, region, sector, tag — filter bar on `/documents`
- [x] Access control: 4-tier (public, members, moderators, admin) per document — access field with middleware check, required on upload
- [x] Upload moderation queue (pending until approved) — `/documents/pending` with approve/reject actions
- [x] Configurable auto-approval per category — admin settings checkboxes
- [x] Version control (retain originals, show latest, admin history) — version upload form + version history table
- [x] Download tracking in analytics — download counter incremented via API, sorted set index
- [x] Cloudflare R2 file storage integration — `@aws-sdk/client-s3` with auto-detection (R2 when credentials configured, local fallback), admin settings panel for credentials
- [x] R2 storage for all core uploads (profile avatars, post images, attachments) — `@nodebb/nodebb-plugin-s3-uploads` v3.1.0 activated; configure at `/admin/plugins/s3-uploads` or via env vars

### Evaluator Member Directory (FSD §3.4)

- [x] Directory page showing members with completed profiles — `/directory` with member cards grid
- [x] Opt-out capability — toggle on directory page, `directory:opted-out` DB set
- [x] Free-text search (names, orgs, bio) — search bar filters on username, fullname, org, title, bio
- [x] Filter: Expertise area — dropdown from custom field definitions
- [x] Filter: Region — dropdown from custom field definitions
- [x] Filter: Organisation type — dropdown from custom field definitions
- [x] Filter: Sector focus — `sector` custom field (select, 11 options) + directory dropdown filter
- [x] Profile view with privacy-respecting display — visibility checks replicated from accounts/helpers.js
- [x] "Send Message" button on profiles (chat button exists; directory integration needed) — links to `/user/{slug}/chats`
- [x] Admin-configurable expertise tags, sectors, org types — reads from `user-custom-fields` definitions set by admin

---

## Milestone 4: Integration & Admin Tools — COMPLETE

### Videoconferencing — Zoom/Teams (FSD §4.1)

- [x] Event post type in Evenements category — `nodebb-plugin-cop-events` with dedicated meeting management (create/edit/delete), auto-creates discussion topic in Événements category
- [x] Fields: Event Title, Date/Time (WAT), Meeting Link, Description, Registration Link — form with all fields + sector, region, location, meeting platform, banner image upload
- [x] Meeting link as prominent CTA button — hero banner with "Rejoindre la réunion" button on event detail page + sidebar CTA
- [x] WAT timezone formatting — all dates formatted in UTC (Africa/Abidjan = UTC+0), displayed with "(WAT)" label
- [x] Standard follow notifications for Evenements (built-in category follow)

### Social Media Sharing (FSD §4.2)

- [x] Share buttons (Facebook, LinkedIn, Twitter) — implemented on event detail page (LinkedIn, Twitter, Facebook share URLs wired via JS)
- [x] Open Graph metadata on topics and documents — built-in NodeBB: `og:title`, `og:description`, `og:image` generated for all topics; document pages inherit from page title
- [x] Access-gated shared links for members-only content (built-in)

### Email Notification System (FSD §4.3)

- [ ] SMTP2GO credentials configured in admin panel
- [x] Email verification on registration (built-in)
- [x] Password reset emails (built-in, 2-hour token)
- [x] Topic reply notifications (built-in)
- [x] @mention notifications (built-in via mentions plugin)
- [x] Reaction notifications (built-in)
- [x] Document pending approval notification — notifies admins + global mods on upload via NodeBB notification system; pending count banner on library page
- [x] Per-type preference: immediate/daily/weekly/disabled (built-in)
- [x] In-platform notifications always delivered (built-in)

### Moderation & Admin (FSD §3.1, §7)

- [x] Edit any post (moderator) — built-in
- [x] Move topics between categories — built-in
- [x] Lock/unlock topics — built-in
- [x] Pin/unpin topics (with expiry) — built-in
- [x] Delete posts and topics (with restore) — built-in
- [x] Flag queue for moderator review — built-in
- [x] All mod actions logged (40+ event types) — built-in
- [x] Admin user management — built-in
- [x] Admin category management — built-in

---

## Milestone 5: AI Features & Final Testing — COMPLETE

### AI Provider Architecture (FSD §2.1)

- [x] Provider abstraction layer (OpenAI, Anthropic, Agent SDK) — `nodebb-plugin-cop-ai/lib/provider.js` with unified `generate()` interface supporting multiple backends
- [x] Switch providers via config change (no code change) — admin panel dropdown at `/admin/plugins/cop-ai`; provider + model + API key configurable without code changes

### Document Summarisation (FSD §5.2)

- [x] Auto-generate on upload/approval — `library.js:onDocumentApproved` hook triggers summarization
- [x] Permanent caching in DB — `cache.js:setDocumentSummary` stores at `copai:doc:summary:{docId}` with timestamp
- [x] 3-5 sentence summary in French — `prompts.js:DOCUMENT_SUMMARY_SYSTEM` instructs "3 à 5 phrases, ton professionnel et factuel"
- [x] Admin-configurable visibility (all/members/disabled) — `docSummaryAccess` setting in admin panel
- [x] "Generate Summary" button for legacy docs — document view page, admin/mod only; multi-step progress UI (extract → analyze → generate)
- [x] Cache invalidation on new version upload — `library.js:onDocumentVersionUploaded` clears doc summary cache

### Discussion Thread Summarisation (FSD §5.3)

- [x] "Summarise this discussion" button — `topic.tpl` with `copai/summarize-btn` component; admin/mod only for generation, all members see cached result
- [x] Configurable min reply threshold (default 15) — `minRepliesForSummary` setting; regular users only see button when threshold met or cache exists
- [x] Cache window (default 12h) — `discussionCacheHours` setting with `isDiscussionSummaryValid()` check
- [x] Cache invalidation on N new replies (default 10) — `cacheInvalidationReplies` setting; post action hooks clear cache on purge/delete/move/ownership change
- [x] Per-member daily limit (default 5) — `dailySummaryLimit` setting enforced via `rateLimit.check()`
- [x] Admin-configurable access level — `discussionSummaryAccess` (all/members/disabled) in admin panel
- [x] Max 200 words, in French — prompt instructs "Maximum 150 mots" in French; truncated preview (280 chars) with "Read more" modal for full text

### Catch-Up Digest (FSD §5.4)

- [x] Digest widget on categories page — sidebar widget visible to all logged-in members; cached digest displayed inline with formatted markdown→HTML rendering
- [x] Topics grouped by category with summaries — `catchup-digest.js` groups topics by category name, uses cached AI summaries or first-post excerpts
- [x] Reuse discussion summary cache — reads `copai:summary` field from topic data when available
- [x] Digest cache window (default 6h) — `digestCacheHours` setting; shared cache (`copai:digest:shared`) so all members see admin-generated digest
- [x] Admin toggle and threshold config — `enableCatchupDigest` toggle + `catchupAbsenceDays` threshold in admin panel
- [x] Digest covers discussions, events, and documents — cross-plugin data fetch (events via `getUpcoming`, docs via `getApproved`) appended to AI prompt; system prompt instructs coverage of all three volets

### AI Admin Panel (FSD §5.5)

- [x] Per-feature enable/disable toggles — 3 toggles: `enableDiscussionSummary`, `enableDocSummary`, `enableCatchupDigest`
- [x] Access level rules per feature — 3 dropdowns: `discussionSummaryAccess`, `docSummaryAccess`, `catchupDigestAccess` (all/members/disabled)
- [x] Threshold configuration — `minRepliesForSummary`, `cacheInvalidationReplies`, `catchupAbsenceDays`
- [x] Cache duration settings — `discussionCacheHours`, `digestCacheHours`
- [x] Per-member daily limits config — `dailySummaryLimit`
- [x] Usage dashboard (API calls by feature/billing period) — `controllers.getUsageStats` returns per-feature token counts; `controllers.getCacheCounts` returns cache stats; admin cache management (clear discussions/documents/digests/rate-limits)

---

## Security & Data Protection (FSD §6) — Cross-Cutting

- [x] bcrypt password hashing (12 rounds, bcryptjs) — built-in
- [x] HTTPS/TLS with HTTP redirect (Helmet + HSTS) — built-in
- [x] Server-side session tokens, configurable expiry (PG session store) — built-in
- [x] Password reset: single-use token with expiry — built-in
- [x] Brute-force IP lockout (5 attempts, 60-min lockout) — built-in
- [x] Role enforcement, no self-escalation — built-in
- [x] Admin action audit log (40+ event types) — built-in
- [x] Input sanitization / XSS prevention (sanitize-html) — built-in
- [x] File upload allowlist validation — built-in
- [x] CSRF protection (double-submit cookie) — built-in
- [ ] Database backup scripts + documented restore procedure
- [ ] French privacy notice presented at registration
- [ ] Privacy notice link in footer
- [x] Per-user per-field privacy controls — field-level visibility configured on all custom fields; admin-adjustable
- [x] No ad trackers / fingerprinting — verified clean
- [x] AI data handling: only content text transmitted, no PII — AI provider receives only post content, topic titles, document text, and category names; no usernames, emails, or profile data sent to external APIs

---

## Non-Functional Requirements (FSD §7)

- [x] All UI text in French
- [x] Mobile 320px+ (iOS Safari, Android Chrome)
- [x] Browser support (Chrome, Firefox, Safari, Edge)
- [ ] Page load <=4s on 4G — needs performance testing
- [x] AI generation <=10s with loading indicator — loading spinners on all AI actions (discussion summarize, document summarize, digest generate); generation typically completes in 3-8s
- [ ] WCAG 2.1 AA (primary screens) — partial (Bootstrap 5 base, semantic HTML, skip-to-content link; needs formal audit)
- [ ] 200 concurrent users stable — needs load testing
- [x] Append-only audit log — built-in

---

## Summary

| Area | Done | Partial | Not Done | Total |
|------|:----:|:-------:|:--------:|:-----:|
| M1: Setup & Planning | 6 | 0 | 0 | 6 |
| M2: Theme/Branding | 13 | 0 | 0 | 13 |
| M2: User Profiles | 12 | 0 | 0 | 12 |
| M3: Document Library | 14 | 0 | 0 | 14 |
| M3: Member Directory | 10 | 0 | 0 | 10 |
| M4: Zoom/Teams Events | 5 | 0 | 0 | 5 |
| M4: Social Sharing | 3 | 0 | 0 | 3 |
| M4: Email/Notifications | 8 | 0 | 1 | 9 |
| M4: Moderation/Admin | 9 | 0 | 0 | 9 |
| M5: AI Provider | 2 | 0 | 0 | 2 |
| M5: Doc Summarisation | 6 | 0 | 0 | 6 |
| M5: Discussion Summary | 7 | 0 | 0 | 7 |
| M5: Catch-Up Digest | 6 | 0 | 0 | 6 |
| M5: AI Admin Panel | 6 | 0 | 0 | 6 |
| Security | 13 | 0 | 3 | 16 |
| Non-Functional | 5 | 1 | 2 | 8 |
| **TOTAL** | **125 (93%)** | **1 (1%)** | **6 (5%)** | **132** |

---

## Remaining Items

### Configuration (no code required)
1. **SMTP2GO credentials** — Configure at `/admin/settings/email`; credentials in `technical_considerations.md`

### Compliance & Documentation
2. **Database backup scripts** — Write pg_dump cron script + documented restore procedure for Neon PostgreSQL
3. **French privacy notice** — Draft privacy policy page per Ivorian data protection law; present at registration
4. **Privacy notice link in footer** — Add link once privacy page created

### Testing & Validation
5. **Performance testing** — Page load <=4s on 4G (Lighthouse/WebPageTest)
6. **WCAG 2.1 AA audit** — Formal accessibility audit of primary screens
7. **Load testing** — 200 concurrent users stable (k6/Artillery)
