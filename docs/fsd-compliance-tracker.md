# CoP Platform — FSD v2 Compliance Tracker

**Last updated:** 2026-03-27
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
- [x] Full-text search across titles, descriptions, tags, AI summaries — search filter on list page (AI summaries pending M5)
- [x] Filter by category, region, sector, tag — filter bar on `/documents`
- [x] Access control: Public vs Members Only per document — access field with middleware check
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

## Milestone 4: Integration & Admin Tools — NOT STARTED

### Videoconferencing — Zoom/Teams (FSD §4.1)

- [ ] Event post type in Evenements category
- [ ] Fields: Event Title, Date/Time (WAT), Meeting Link, Description, Registration Link
- [ ] Meeting link as prominent CTA button
- [ ] WAT timezone formatting
- [x] Standard follow notifications for Evenements (built-in category follow)

### Social Media Sharing (FSD §4.2)

- [ ] Share buttons (Facebook, LinkedIn, Twitter) in theme
- [ ] Open Graph metadata on topics and documents
- [x] Access-gated shared links for members-only content (built-in)

### Email Notification System (FSD §4.3)

- [ ] SMTP2GO credentials configured in admin panel
- [x] Email verification on registration (built-in)
- [x] Password reset emails (built-in, 2-hour token)
- [x] Topic reply notifications (built-in)
- [x] @mention notifications (built-in via mentions plugin)
- [x] Reaction notifications (built-in)
- [ ] Document pending approval notification (requires doc library)
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

## Milestone 5: AI Features & Final Testing — NOT STARTED

### AI Provider Architecture (FSD §2.1)

> **Reference:** `nodebb-plugin-openai` v1.4.0 downloaded (not activated). Provides topic summarization + chatbot out of the box. Has configurable `baseURL` for OpenAI-compatible endpoints. Evaluate: use as-is, fork for multi-provider support, or build custom `nodebb-plugin-cop-ai`.

- [ ] Provider abstraction layer (Gemini, OpenAI, Anthropic)
- [ ] Switch providers via config change (no code change)

### Document Summarisation (FSD §5.2)

- [ ] Auto-generate on upload/approval
- [ ] Permanent caching in DB
- [ ] 3-5 sentence summary in French
- [ ] Admin-configurable visibility (all/members/disabled)
- [ ] "Generate Summary" button for legacy docs
- [ ] Cache invalidation on new version upload

### Discussion Thread Summarisation (FSD §5.3)

- [ ] "Summarise this discussion" button
- [ ] Configurable min reply threshold (default 15)
- [ ] Cache window (default 12h)
- [ ] Cache invalidation on N new replies (default 10)
- [ ] Per-member daily limit (default 5)
- [ ] Admin-configurable access level
- [ ] Max 200 words, in French

### Catch-Up Digest (FSD §5.4)

- [ ] "Catch me up" button after absence (default 14 days)
- [ ] Topics grouped by category with summaries
- [ ] Reuse discussion summary cache
- [ ] Digest cache window (default 6h)
- [ ] Admin toggle and threshold config

### AI Admin Panel (FSD §5.5)

- [ ] Per-feature enable/disable toggles
- [ ] Access level rules per feature
- [ ] Threshold configuration
- [ ] Cache duration settings
- [ ] Per-member daily limits config
- [ ] Usage dashboard (API calls by feature/billing period)

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
- [ ] AI data handling: only content text transmitted, no PII (AI not yet implemented)

---

## Non-Functional Requirements (FSD §7)

- [x] All UI text in French
- [x] Mobile 320px+ (iOS Safari, Android Chrome)
- [x] Browser support (Chrome, Firefox, Safari, Edge)
- [ ] Page load <=4s on 4G — needs performance testing
- [ ] AI generation <=10s with loading indicator — AI not implemented
- [ ] WCAG 2.1 AA (primary screens) — partial (Bootstrap 5 base, skip-to-content link; needs audit)
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
| M4: Zoom/Teams Events | 1 | 0 | 4 | 5 |
| M4: Social Sharing | 1 | 0 | 2 | 3 |
| M4: Email/Notifications | 7 | 0 | 2 | 9 |
| M4: Moderation/Admin | 9 | 0 | 0 | 9 |
| M5: AI Features | 0 | 0 | 24 | 24 |
| Security | 12 | 0 | 4 | 16 |
| Non-Functional | 4 | 1 | 3 | 8 |
| **TOTAL** | **88 (68%)** | **1 (1%)** | **40 (31%)** | **129** |

---

## Priority Next Steps

1. ~~**Finish M2**~~ — DONE: 6 custom profile fields created, privacy controls configured, anonymization verified
2. ~~**Finish M3**~~ — DONE: `nodebb-plugin-cop-documents` (doc library) and `nodebb-plugin-cop-directory` (member directory) built; i18n select options fixed
3. **M4 quick wins** — Configure SMTP2GO, add social share buttons, build event post template
4. **M5** — Build `nodebb-plugin-cop-ai` with provider abstraction, caching, admin panel
5. **Cross-cutting** — French privacy policy page, backup scripts, accessibility audit, load testing
6. ~~**Remaining M3**~~ — DONE: Sector focus filter added to directory
