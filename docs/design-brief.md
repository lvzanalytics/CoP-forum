# CoP Theme — Design Brief

**Theme name:** CoP Modern (`nodebb-theme-cop`)
**Base theme:** nodebb-theme-harmony
**Design language:** Apple-inspired minimal — clean, content-first, generous whitespace
**Status:** Implemented for core forum pages. Document library, member directory, and event pages not yet built.

---

## Platform Context

The platform serves public policy evaluation professionals in Cote d'Ivoire — government officials, researchers, consultants, and development practitioners. The entire interface is in French. Users access on both desktop and mobile.

---

## Design System

### Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `$surface-page` | #FAFAF8 | Page background (warm near-white) |
| `$surface-primary` | #FFFFFF | Cards, navbar, content areas |
| `$surface-secondary` | #F5F5F3 | Hover states, alt rows, inputs |
| `$surface-tertiary` | #EBEBEA | Pressed/active states |
| `$text-primary` | #1D1D1F | Headings, body (Apple near-black) |
| `$text-secondary` | #6E6E73 | Descriptions, metadata |
| `$text-tertiary` | #AEAEB2 | Timestamps, placeholders |
| `$accent-primary` | #2D6A4F | CTAs, links, active states (teal-green) |
| `$accent-hover` | #1B4332 | Hover on accent elements |
| `$accent-light` | rgba(45,106,79,0.08) | Subtle green backgrounds |
| `$gold` | #D4A843 | Distinction badges |
| `$orange` | #E8722A | Notification badges |
| `$red` | #D32F2F | Errors, urgent |
| `$blue` | #1976D2 | Informational |

### Typography

- **Primary font:** Inter (loaded via @fontsource, weights 100-900, `font-display: swap`)
- **Monospace:** JetBrains Mono / Fira Code / Cascadia Code
- **Scale:** Hero 40px, H1 28px, H2 22px, H3 18px, Body 16px, Body-sm 14px, Caption 13px, Overline 11px
- **Headings:** Negative letter-spacing (-0.02em) for tightness

### Spacing & Layout

- **Content max-width:** 1120px, centered with auto margins
- **Page padding:** 24px horizontal (16px tablet, 12px mobile)
- **Border radii:** sm 4px, md 8px, lg 12px, xl 16px, full 9999px (pills)
- **Shadows:** sm (1px/2px), md (4px/16px), lg (8px/24px) — all subtle opacity

### Transitions

- Fast: 150ms, Normal: 250ms, Slow: 350ms — all cubic-bezier(0.4, 0, 0.2, 1)

---

## Implemented Pages

### Navbar (64px fixed)

- **Structure:** Logo + title (left) | Nav links (center) | Actions (right)
- **Nav links:** Accueil, Espaces (dropdown), Recents, Membres, Plus (dropdown) — pill-shaped hover states
- **Espaces dropdown:** 340-420px wide, shows all categories with 40x40 icons in accent-light circles, name + description
- **Actions:** Search, notifications (badge), chats (badge), user menu (avatar + status indicator)
- **Scroll effect:** Frosted glass — `backdrop-filter: blur(12px)`, reduced opacity to 0.85, subtle shadow
- **Mobile (<=991px):** Hamburger toggle, full-screen drawer with nav links + category list
- **Mobile (<=575px):** Site title hidden, logo only, reduced padding

### Homepage (categories.tpl)

- **Hero section:** Centered, secondary background, site title (40px/700 weight) + tagline (16px secondary text, max 640px)
- **Categories grid:** 2-column (1-column on tablet/mobile), 16px gap
- **Category cards:** White, subtle border, 12px radius, 24px padding, hover shadow lift. Icon (56px rounded), title as stretched link, truncated description, subcategory badges (accent-light pills), stats (right-aligned, desktop only)

### Category Page (category.tpl)

- **Header:** Category icon, name, topic/post counts
- **Topic list:** Row-based, 16px row padding, hover background. Title (14px/600 weight), labels/tags as accent-light badges, secondary stats, tertiary timestamps

### Topic/Thread View (topic.tpl)

- **Topic header:** Title, labels (scheduled/pinned/locked), category badge, tags, stats
- **Posts:** 24px top padding each, subtle top divider (no first-child border). Avatar 44px circular, username 600 weight, tertiary timestamps
- **Content styling:** 16px/1.65 line-height. Code blocks in secondary background with mono font. Blockquotes with 3px accent left border + light accent background. Images max 600px, rounded. Tables with secondary header background
- **Actions:** 32x32 circular buttons, tertiary colour, hover background. Votes accent/red. Reactions with accent border on hover
- **Quick reply:** Sticky bottom, white textarea with border-medium, ghost + primary buttons

### User Profile (account/header.tpl)

- **Banner:** 200px height, accent-primary background, supports background image + edit controls
- **Avatar:** 96px circular, -64px margin overlap onto banner, edit-on-hover
- **Info:** Display name (h1), username (secondary), group badges, status indicators
- **Actions:** Follow/unfollow, chat button, admin menu for moderators

### Login/Register

- Centered 440px white card, 40px padding, subtle border + shadow

### Footer

- Centered layout: Ministry logo (32px) + site name, tagline (caption/secondary), link row (24px gap), copyright (tertiary), LVZ attribution

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| **Desktop (>991px)** | Full horizontal nav, 2-column category grid, all stats visible |
| **Tablet (<=991px)** | Hamburger nav + drawer, 1-column categories, topic stats hidden, composer full-width, profile banner 140px |
| **Mobile (<=575px)** | Logo only in navbar, 12px page padding, hero title 1.5rem, avatars 36px, quick reply icon hidden |

---

## Pages Not Yet Built — Design Direction

The following pages require new templates and styling. They should follow the established design system (colours, typography, spacing, card aesthetic) and maintain the same Apple-inspired minimal feel.

### Document Library

A structured repository of evaluation reports, methodological guides, toolkits, and case studies. Documents have metadata (title, author, date, tags, category, region, sector) and access control (public vs members-only).

**Design intent:** Professional reference library, not a file dump. Card-based document listings with clear metadata hierarchy. Filter sidebar or toolbar with dropdowns for category, region, sector, tag. Document detail page showing metadata, AI summary, download button, and version history. Upload form with mandatory/optional field groupings.

### Member Directory

Searchable, filterable listing of evaluation professionals. Users search by expertise, filter by region, organisation type, sector.

**Design intent:** Grid of profile cards (similar aesthetic to category cards) showing avatar, name, organisation, expertise tags, region. Filter bar across top with dropdowns. Clicking opens full profile. Should feel like a professional network directory, not a user list.

### Events

Upcoming training sessions, webinars, and professional gatherings within the Evenements category. Each event includes Zoom/Teams meeting link, date/time (WAT), description, optional registration link.

**Design intent:** Event cards with prominent date display, clear title, meeting link as a teal-green CTA button, description. Calendar-like visual treatment for dates. Distinguish from regular discussion topics with a structured layout.

---

## Design Constraints

- Built as a NodeBB theme using Benchpress templates (.tpl), SCSS, Bootstrap 5
- Extends `nodebb-theme-harmony` — override only what changes
- Fully responsive — desktop, tablet, mobile
- Performant — Inter font loaded with `font-display: swap`, no heavy assets or animations
- Ministry branding applied (logo, accent colour, site title)
- All UI text in French via theme language files
