# CoP Platform — Communauté de Pratique

Community of Practice platform for public policy evaluation professionals in Côte d'Ivoire, following Law No. 666 of December 14, 2022 on strengthening evaluation culture. Developed by LVZ Analytics Corp for the Ministry. All user-facing content in French.

## Project Documents

Read these before starting any work:

- `cop-project-details.docx.md` — Full technical proposal: scope, deliverables, features, timeline
- `notes.md` — How NodeBB maps to the project: what's built-in vs what needs custom development
- `plan.md` — 8-10 week development plan across 5 milestones
- `technical_considerations.md` — Hosting and infrastructure pricing
- `docs/requirements.md` — Consolidated requirements by milestone
- `docs/design-brief.md` — UI/UX design prompt for theme development
- `docs/fsd-compliance-tracker.md` — **FSD v2 compliance checklist** — update this file as items are completed (check off boxes, adjust summary table counts)
- `docs/generate-m3-report.js` — Milestone report generator (docx). After a milestone's checklist items are all marked complete in `fsd-compliance-tracker.md`, prompt the user: *"This milestone is complete — would you like to generate the client-facing report?"* Then duplicate this script for the new milestone, update content/screenshots, and run: `NODE_PATH=$(npm root -g) node docs/generate-mN-report.js`

## Dev Setup

- **Node**: 22 (pinned via `mise.toml`; global is 25)
- **Package manager**: pnpm (`shamefully-hoist=true` in `.npmrc` — NodeBB assumes flat node_modules)
- **Database**: Neon PostgreSQL (remote, SSL required, shared between local and staging)
- **Config**: `config.json` (gitignored) — DB credentials, URL, settings
- **Start**: `./nodebb start` | **Stop**: `./nodebb stop` | **Build**: `./nodebb build` | **Dev**: `./nodebb dev`
- **Local URL**: http://localhost:4567
- **Staging URL**: https://cop-forum.onrender.com

## Architecture

- Server: `src/` | Client: `public/src/` | Templates: `src/views/` (Benchpress)
- Plugins: `nodebb-plugin-*`, hook-based system (`src/plugins/hooks.js`)
- Themes: extend `nodebb-theme-harmony` — SCSS + Bootstrap 5
- DB abstraction: `src/database/` (Postgres driver in our case)
- Config: `nconf` hierarchy — CLI args > env vars > config.json > `install/data/defaults.json`
- Build: Webpack for JS, SCSS compilation, Benchpress template compilation

## Custom Files

- `scripts/setup-cop.js` — One-time setup script (categories, branding, language config)
- `docs/` — Internal docs with credentials (gitignored)

## Installed Plugins (non-default)

- **`@nodebb/nodebb-plugin-s3-uploads`** (v3.1.0, activated) — Routes all core uploads (profile avatars, post images, file attachments) to S3-compatible storage. Configure R2 credentials at `/admin/plugins/s3-uploads` or via env vars (`S3_UPLOADS_BUCKET`, `S3_UPLOADS_ENDPOINT`, `S3_UPLOADS_HOST`, `S3_UPLOADS_ACCESS_KEY_ID`, `S3_UPLOADS_SECRET_ACCESS_KEY`). Hooks: `filter:uploadImage`, `filter:uploadFile`.
- **`nodebb-plugin-openai`** (v1.4.0, downloaded — NOT activated) — Topic summarization + ChatGPT chatbot. Downloaded as reference for Milestone 5 AI features. Has configurable `baseURL` (could point to OpenAI-compatible proxy). Will need evaluation: use as-is, fork for Claude/Anthropic support, or build custom `nodebb-plugin-cop-ai` with provider abstraction.
- `nodebb-plugin-cop-documents` — Custom document library with its own R2 integration
- `nodebb-plugin-cop-directory` — Custom evaluator member directory
- `nodebb-theme-cop` — Custom theme extending Harmony

## Infrastructure

- **Staging**: Render (free/hobby tier)
- **Database**: Neon PostgreSQL (serverless, free tier)
- **File storage**: Cloudflare R2 via `@nodebb/nodebb-plugin-s3-uploads` (all core uploads: avatars, post images, attachments) + custom R2 integration in `nodebb-plugin-cop-documents` (document library)
- **Email**: SMTP2GO (planned)
- **Production**: TBD (Hetzner/DigitalOcean/Lightsail — see `technical_considerations.md`)

## Milestone Progress

1. ~~Setup & Planning~~ **(DONE)** — NodeBB installed, deployed to Render, 4 French categories created (Annonces, Discussions Générales, Méthodologie & Outils, Événements), default language set to French, user roles verified
2. Branding & User Profiles — Custom theme plugin (`nodebb-theme-cop`), Ministry branding, profile fields (expertise, sector, region, organization)
3. Document Library & Directory — Structured doc repository with metadata/tagging, searchable member directory with filters
4. Integration & Admin Tools — Event posting with Zoom/Teams links, email notifications (SMTP2GO), moderation workflows, privacy/data protection
5. AI Features & Final Testing — Discussion/document summarization (`nodebb-plugin-openai` downloaded as reference/base — not yet activated), performance optimization, security review, handoff docs

## Key Conventions

- All user-facing text in French
- Database changes (config, categories) propagate across environments via shared Neon DB
- Custom theme will extend Harmony (not fork)
- Nine deliverables total (see `cop-project-details.docx.md` section 6)
- Ministry staff must be able to manage the platform independently after handover
