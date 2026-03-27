# CoP Landing Page — Cinematic Marketing Page

## Role

Act as a World-Class Senior Creative Technologist. You are adding a cinematic marketing landing page to an existing NodeBB forum theme. You build within the system — not beside it. Every scroll intentional, every animation weighted and professional. Eradicate all generic AI patterns.

---

## System Architecture — READ THIS FIRST

You are working inside `nodebb-theme-cop`, a custom NodeBB theme plugin. This is NOT a standalone site. Everything you build must integrate with the existing theme infrastructure.

### How NodeBB themes work
- NodeBB is a Node.js forum (Express server, PostgreSQL database)
- Themes are plugins that live in their own directory (`nodebb-theme-cop/`)
- Templates use **Benchpress** (.tpl files) — a Mustache-like templating engine with `{{{ if }}}`, `{{{ each }}}`, `{variable}`, and `<!-- IMPORT partial.tpl -->` syntax
- Every page renders inside a shared shell: `header.tpl` (navbar, drawer, `<head>`) and `footer.tpl` (footer, scripts, closing tags)
- Styles are **SCSS** compiled by NodeBB's build system — partials in `scss/`, imported by `theme.scss`
- Client JS files listed in `plugin.json` `"scripts"` are automatically loaded on every page
- Page-specific JS can be loaded via NodeBB's `require()` AMD module system
- Routes are registered in `library.js` via the `static:app.load` hook
- The theme extends `nodebb-theme-harmony` (base theme) — only overridden files are replaced

### Current theme file structure
```
nodebb-theme-cop/
  plugin.json          — hooks, scripts, staticDirs, languages
  theme.json           — theme metadata, baseTheme: harmony
  library.js           — server-side hooks (init, routes, config, middleware)
  package.json         — dependencies
  theme.scss           — main SCSS entry (imports all partials)
  scss/
    _variables.scss    — design system tokens (colours, type scale, spacing, radii)
    _base.scss         — global resets, Bootstrap overrides
    _navbar.scss       — 64px fixed frosted-glass navbar
    _layout.scss       — page wrapper, max-width 1120px
    _categories.scss   — homepage hero + category cards
    _messages.scss     — post/thread styling
    _pages.scss        — per-page styles (users, account, login, etc.)
    _composer.scss     — rich text editor
    _footer.scss       — site footer
    _responsive.scss   — tablet/mobile breakpoints
    _utilities.scss    — alerts, toasts, misc overrides
    _fonts.scss        — Inter font loading
    overrides.scss     — (empty, reserved)
  templates/
    header.tpl         — shared HTML head, navbar import, mobile drawer, opens <main>
    footer.tpl         — closes <main>, site footer, toast tray, JS import
    categories.tpl     — homepage (hero + category grid) — currently the `/` route
    category.tpl       — single category page
    topic.tpl          — discussion thread page
    partials/
      header/topbar.tpl — the navbar component
      categories/item.tpl — single category card
      account/header.tpl — user profile banner
      account/footer.tpl
      sidebar-left.tpl
  public/
    cop.js             — client-side JS (navbar scroll, mobile drawer, active nav, NProgress)
    logo.JPG           — Ministry logo
  languages/
    fr/themes/cop.json — French UI strings
    en-GB/themes/cop.json
```

### How the homepage currently works
- NodeBB has a `homePageRoute` admin setting (default: `'categories'`)
- When set to `'custom'` + a route name, it fires `action:homepage.get:{routeName}`
- A plugin can register that hook to render any template at `/`
- The existing `categories.tpl` (category grid) remains accessible at `/categories`

### How to add the landing page — THE PLAN
1. **Create template:** `templates/landing.tpl` — the full landing page markup
2. **Create SCSS partial:** `scss/_landing.scss` — all landing page styles
3. **Import SCSS:** Add `@import '_landing';` to `theme.scss`
4. **Create client JS:** `public/landing.js` — GSAP animations for the landing page only
5. **Register route + hook in `library.js`:**
   - In `library.init()`, register the `action:homepage.get:landing` hook that renders `landing.tpl`
   - Add `'landing'` to the homepage route options via `filter:homepage.get`
6. **Add `landing.js` to `plugin.json`** `"scripts"` array (or load it conditionally via `require()` in the template)
7. **Set admin config:** `homePageRoute: 'custom'`, `homePageCustom: 'landing'`

### Critical rules for building within this system
- **Templates are Benchpress, not JSX/HTML.** Use `{{{ if loggedIn }}}`, `{{{ each }}}`, `{config.siteTitle}`, `{relative_path}`, `[[themes/cop:key]]` for translations.
- **SCSS only.** No Tailwind, no CSS-in-JS. Use the existing `$variables` from `_variables.scss`. Add new partials, import them in `theme.scss`.
- **No npm dependencies for the landing page.** GSAP and ScrollTrigger load via CDN `<script>` tags inside the template (or via NodeBB's `require()` if shimmed). The theme's only npm dependency is `@fontsource/inter`.
- **The landing page renders inside `header.tpl` / `footer.tpl`.** The navbar, mobile drawer, and footer are already present. Your template provides only the content between them.
- **Fonts are already loaded.** Inter is available globally. Add Google Fonts `<link>` tags for Cormorant Garamond and IBM Plex Mono in `header.tpl` or via the `customHTML` admin setting.
- **Images:** Use real Unsplash URLs. Reference them in SCSS as `background-image` or as `<img>` tags in the template.
- **Guest vs member:** Use `{{{ if !loggedIn }}}` to show the full marketing page to visitors. Logged-in members can see a condensed version or be redirected to `/categories`.
- **All text in French.** Add new translation keys to `languages/fr/themes/cop.json` and reference them as `[[themes/cop:landing.keyname]]` in the template.
- **jQuery is available globally** (`$`). NodeBB's client JS runs in a jQuery + AMD require environment.
- **NodeBB ajaxify:** Internal navigation is AJAX-based. Use `href="{relative_path}/register"` for links. The page won't full-reload on navigation.

---

## Design System — USE THE EXISTING TOKENS

These are already defined in `scss/_variables.scss`. Use them directly in your `_landing.scss`:

### Palette
```scss
$surface-page:       #FAFAF8;    // Page background
$surface-primary:    #FFFFFF;    // Cards, content
$surface-secondary:  #F5F5F3;   // Alt sections
$surface-tertiary:   #EBEBEA;   // Active states
$text-primary:       #1D1D1F;   // Headings, body
$text-secondary:     #6E6E73;   // Descriptions
$text-tertiary:      #AEAEB2;   // Placeholders
$accent-primary:     #2D6A4F;   // CTAs, links (teal-green)
$accent-hover:       #1B4332;   // Hover
$accent-light:       rgba(45, 106, 79, 0.08); // Subtle backgrounds
$gold:               #D4A843;   // Distinction
$red:                #D32F2F;   // Error
$blue:               #1976D2;   // Info
```

### Typography tokens
```scss
$font-primary:  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-mono:     'JetBrains Mono', 'Fira Code', monospace;
$type-hero:     2.5rem;   // 40px
$type-h1:       1.75rem;  // 28px
$type-h2:       1.375rem; // 22px
$type-h3:       1.125rem; // 18px
$type-body:     1rem;     // 16px
$type-body-sm:  0.875rem; // 14px
$type-caption:  0.8125rem;// 13px
```

### Spacing, radii, shadows, transitions
```scss
$radius-sm: 4px; $radius-md: 8px; $radius-lg: 12px; $radius-xl: 16px; $radius-full: 9999px;
$shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
$shadow-md: 0 4px 16px rgba(0,0,0,0.06);
$shadow-lg: 0 8px 24px rgba(0,0,0,0.08);
$transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
$transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
$navbar-height: 64px;
$content-max-width: 1120px;
```

### Additional tokens for landing page (add to `_variables.scss`)
```scss
$font-drama:    'Cormorant Garamond', 'Georgia', serif;  // Display/contrast font
$font-data:     'IBM Plex Mono', $font-mono;              // Stats/counters
$dark:          #1A1A1A;                                   // Dark sections
```

---

## Visual Texture & Micro-Interactions

### Noise overlay
Implement a CSS noise overlay using an inline SVG `<feTurbulence>` filter at **0.05 opacity** on the page background to eliminate flat digital feel.

### Container radii
Use `$radius-xl` (16px) to `2rem` for large containers and section cards. No sharp corners on feature cards or section blocks.

### Button interactions
- Subtle `transform: scale(1.03)` on hover with `cubic-bezier(0.25, 0.46, 0.45, 0.94)` easing.
- `overflow: hidden` with a sliding background `<span>` layer for colour transitions.
- Interactive elements get `translateY(-1px)` lift on hover.

### GSAP animations
- Load GSAP + ScrollTrigger via CDN `<script>` in the landing template (before closing `</div>` of content area, or shimmed via `require()`).
- Scope all animations to the landing page container. Clean up if the user navigates away (listen for `action:ajaxify.start`).
- Default easing: `power3.out` for entrances, `power2.inOut` for morphs.
- Stagger: `0.08` for text, `0.15` for cards.

---

## Content — ALL FRENCH

### Brand
- **Name:** Communaute de Pratique — Evaluation des Politiques Publiques
- **Short:** CoP Evaluation
- **Operator:** Ministere du Plan et du Developpement, Republique de Cote d'Ivoire
- **Tagline:** "Ensemble, renforcons la culture de l'evaluation en Cote d'Ivoire"

### Hero
- **Line 1 (Inter bold):** "L'evaluation est"
- **Line 2 (Cormorant Garamond italic, massive):** "notre force collective."
- **Sub-text:** "La plateforme numerique des professionnels de l'evaluation des politiques publiques en Cote d'Ivoire."
- **Primary CTA:** "Rejoindre la communaute" → `{relative_path}/register`
- **Secondary CTA:** "Se connecter" → `{relative_path}/login`

### 3 Feature Cards
1. **Forums de Discussion** — "Echangez avec vos pairs sur les methodologies, les outils et les bonnes pratiques en evaluation."
2. **Bibliotheque Documentaire** — "Accedez a une bibliotheque structuree de rapports d'evaluation, guides methodologiques et etudes de cas."
3. **Annuaire des Evaluateurs** — "Trouvez des experts en evaluation par domaine d'expertise, region ou type d'organisation."

### Manifesto
- **Neutral:** "La plupart des plateformes professionnelles se contentent de lister des profils et des fichiers."
- **Bold:** "Nous construisons un espace vivant ou le savoir circule, ou les experts se trouvent, et ou chaque evaluation contribue a de **meilleures politiques publiques**."

### How It Works (3 Steps)
1. **Inscrivez-vous** — "Creez votre profil professionnel en quelques minutes."
2. **Explorez et Contribuez** — "Participez aux discussions, consultez la bibliotheque, connectez-vous avec d'autres evaluateurs."
3. **Renforcez vos Competences** — "Beneficiez des syntheses IA, participez aux evenements et accedez aux ressources."

### Stats (animated counters)
- **14+** regions couvertes
- **5** secteurs d'evaluation
- **100%** en francais
- **Gratuit** pour tous les professionnels

### Final CTA
- **Heading:** "Pret a rejoindre la communaute ?"
- **Sub:** "L'inscription est gratuite et ouverte a tous les professionnels de l'evaluation."
- **Button:** "Creer mon compte" → `{relative_path}/register`
- **Link:** "Deja membre ? Se connecter" → `{relative_path}/login`

### Image Mood (Unsplash search terms)
African professionals conference, Abidjan cityscape, policy discussion, professional collaboration Africa, modern office, library archives, data analysis

---

## Component Architecture

### A. HERO — "The Opening Shot"
- `100dvh` minus navbar height. Full-bleed background image with heavy dark gradient overlay.
- Content pushed to bottom-left third.
- Typography: "L'evaluation est" (Inter 700) / "notre force collective." (Cormorant Garamond italic, 3-5x larger).
- GSAP staggered fade-up on text + CTAs.
- Two buttons: solid accent + ghost outline.
- **Note:** The navbar from `header.tpl` is already rendered above this. Do NOT add a second navbar.

### B. FEATURES — "Interactive Artifacts"
Three cards. Each must feel like a functional micro-UI, not a marketing card:

**Card 1 — "Forums":** Overlapping discussion-preview cards cycling vertically with spring-bounce. Labels are realistic French topic titles about evaluation.

**Card 2 — "Bibliotheque":** Monospace typewriter that types document titles with a pulsing accent cursor and "Nouveaux documents" label.

**Card 3 — "Annuaire":** Animated SVG cursor entering a mini profile grid, clicking a card to reveal expertise tags (Sante, Education, Gouvernance).

White surface, subtle border, large radius, drop shadow.

### C. MANIFESTO — "The Philosophy"
- Full-width `$dark` (#1A1A1A) background section.
- Parallaxing Unsplash texture at low opacity.
- Contrast typography: neutral line (smaller, secondary) vs bold line (massive Cormorant Garamond italic, accent keyword).
- GSAP word-by-word fade-up on scroll.

### D. PROTOCOL — "Sticky Stacking Steps"
3 cards that stack on scroll using GSAP ScrollTrigger `pin: true`.
- Previous card scales to 0.9, blurs, fades as next enters.
- Each card has a unique SVG/canvas animation:
  1. Rotating network graph (community connections)
  2. Scanning line across document grid (library search)
  3. Pulsing growth chart (professional development)
- Card content: step number (mono), title (Inter bold), description.

### E. STATS
- Horizontal row, animated number counters on scroll entry.
- IBM Plex Mono for numbers. Labels in Inter.

### F. FINAL CTA
- `$accent-light` background.
- Large heading, sub-text, prominent accent button, secondary login link.

### G. FOOTER
The existing `footer.tpl` already renders below your content. You may add a landing-specific pre-footer section with dark background and `border-radius: 2rem 2rem 0 0` containing navigation columns, Ministry info, and the "Plateforme operationnelle" indicator with pulsing green dot. The standard theme footer follows below it automatically.

---

## Deliverables — Exact Files to Create or Modify

### New files:
1. `nodebb-theme-cop/templates/landing.tpl` — landing page template (Benchpress)
2. `nodebb-theme-cop/scss/_landing.scss` — all landing page styles
3. `nodebb-theme-cop/public/landing.js` — GSAP animations, scoped to landing page

### Modified files:
4. `nodebb-theme-cop/theme.scss` — add `@import '_landing';`
5. `nodebb-theme-cop/library.js` — register `action:homepage.get:landing` hook + `filter:homepage.get` to add landing route option
6. `nodebb-theme-cop/plugin.json` — add `public/landing.js` to `"scripts"` array (or load conditionally)
7. `nodebb-theme-cop/scss/_variables.scss` — add `$font-drama`, `$font-data`, `$dark`
8. `nodebb-theme-cop/languages/fr/themes/cop.json` — add all landing page translation keys
9. `nodebb-theme-cop/languages/en-GB/themes/cop.json` — English fallbacks

### Admin config change:
10. Set `homePageRoute: 'custom'`, `homePageCustom: 'landing'` in NodeBB admin panel (Settings > General > Homepage Route)

---

## Build Sequence

1. Add new SCSS variables to `_variables.scss`
2. Create `_landing.scss` with all section styles
3. Import it in `theme.scss`
4. Create `landing.tpl` with full Benchpress markup (remember: it renders inside header.tpl/footer.tpl shell)
5. Create `landing.js` with all GSAP animations, scoped and cleaned up on ajaxify navigation
6. Register the route and hook in `library.js`
7. Add translation keys to both language files
8. Update `plugin.json` if adding landing.js to global scripts
9. Run `./nodebb build` to compile
10. Set homepage route in admin panel

**Execution Directive:** "Do not build a disconnected page; build a cinematic entrance to an existing system. Every scroll should feel intentional, every animation weighted and professional. This is the front door to a Ministry platform — it must command respect. Eradicate all generic AI patterns."
