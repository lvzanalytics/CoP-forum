You are designing a custom theme for a Community of Practice platform built on NodeBB (a Node.js forum platform). The theme extends the existing "Harmony" base theme using Benchpress templates, SCSS, and the Bootstrap 5 grid system.

The platform serves public policy evaluation professionals in Côte d'Ivoire — government officials, researchers, consultants, and development practitioners working in programme and policy evaluation. The entire interface is in French. Users access the platform on both desktop and mobile devices.

The current platform looks like a stock NodeBB forum. We need it transformed into a world-class professional community platform with exquisite, modern UI design. The design should feel premium and intentional — every element considered, nothing generic. We expect exceptional taste in typography, colour, spacing, imagery, and interaction design. Do not play it safe. Be bold with layout decisions, use of colour, whitespace, imagery, and visual hierarchy. Make it beautiful.

Here is what users do on the platform and what they need from each key page:

**Homepage**: This is the front door. Visitors — including Ministry officials, potential members, and sponsors looking for evaluators — land here first. They need to immediately understand what this community is, see recent activity, and feel that it's a living, active professional space. It should not look like a forum index with a list of categories. It should feel like a professional community hub.

**Category and topic listings**: Members browse discussion categories (Annonces, Discussions Générales, Méthodologie & Outils, Événements) to find conversations. They scan for recent activity, new topics, and trending discussions. The experience should make it easy to find what's relevant and encourage participation.

**Topic/thread view**: Members read and reply to discussion threads. They read through multiple replies, quote other members, attach files, format text, and react to posts. Long threads need to remain readable and navigable. The reading and writing experience should feel comfortable for extended use.

**User profiles**: Each member's profile showcases their professional identity — name, organization, title, areas of expertise in evaluation, region, bio, and contributions to the community. Profiles are how members establish credibility and how others find collaborators. Sponsors and government officials use profiles to identify qualified evaluators.

**Member directory**: A searchable, filterable listing of all community members. Users search by expertise (e.g. health sector evaluation), filter by region, filter by organization type (consultant, government, NGO, academic). This is a core feature — it's how people find each other.

**Document library**: A structured repository of evaluation reports, methodological guides, toolkits, and case studies. Documents have metadata (title, author, date, tags) and are organized by type, sector, and region. Users browse, search, and download resources. This is a professional reference library, not a file dump.

**Events**: Upcoming training sessions, webinars, and professional gatherings. Each event can include Zoom/Teams meeting links. Members need to see what's coming up and access event details easily.

**Registration and login**: The entry point for new members joining the community. The registration collects professional information (organization, expertise, region). The experience should feel welcoming and professional, not like a generic signup form.

**Navigation and header**: The persistent navigation that ties everything together. Members need quick access to discussions, documents, directory, events, and their own profile. The header carries the platform's identity — the Ministry's branding, logo, and site title ("Communauté de Pratique — Évaluation des Politiques Publiques").

Design constraints:
- Built as a NodeBB theme using Benchpress templates (.tpl files), SCSS, and Bootstrap 5
- Must be fully responsive — desktop and mobile
- Must be performant — no heavy assets or animations that hurt load times
- Brand assets (logo, colours, fonts) will be provided by the Ministry — use placeholders for now
- The theme extends `nodebb-theme-harmony`, so you override only what you change

Deliver visual designs, a cohesive colour palette and typography system, and component styles. Show how the platform looks and feels across these pages. Make it something the Ministry would be proud to launch.
