# NodeBB Events Plugin (CoP) — UI Only

This plugin provides a modern and beautiful UI for the Events Integration feature of the CoP platform.

## Features
- **Events List**: `/events`
- **Calendar View**: `/events/calendar`
- **Event Details**: `/events/:slug`
- **Event Management**: `/events/create` and `/events/:slug/edit`

## Design Specs
- **Aesthetic**: Apple-inspired, clean, content-first.
- **Accents**: Teal-green (#2D6A4F).
- **Effects**: Glassmorphism (backdrop blur) and subtle shadows.
- **Responsive**: Mobile-first design using Bootstrap 5.

## Components
- `templates/events/list.tpl`: Filterable list of events.
- `templates/events/calendar.tpl`: Responsive month view calendar.
- `templates/events/view.tpl`: High-impact event page with hero banner.
- `templates/events/form.tpl`: Professional creation/editing form.
- `scss/events.scss`: All custom styling for the events feature.
- `languages/fr/events.json`: French translations for all UI labels.
