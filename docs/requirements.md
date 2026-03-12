# CoP Platform — Requirements

Source: `cop-project-details.docx.md` (full technical proposal), `notes.md` (NodeBB mapping), `plan.md` (dev timeline)

## Purpose

A Community of Practice platform for public policy evaluation professionals in Côte d'Ivoire, established following Law No. 666 of December 14, 2022. The platform creates a central space where evaluation professionals can connect, collaborate, and share knowledge. Built by LVZ Analytics Corp for the Ministry. All user-facing content in French. Ministry staff must be able to manage the platform independently after handover.

## Three Project Components

1. **Community structure and governance design** — stakeholder needs, governance architecture, operational charter, engagement plan
2. **Interactive digital platform delivery** — the NodeBB-based platform with all features below
3. **Training, documentation, and knowledge transfer** — user guides, admin guides, video tutorials, maintenance plan, hands-on training

## Nine Deliverables

1. Stakeholder needs analysis report
2. Conceptual model and operational charter
3. Community engagement plan with activities calendar
4. Technology options analysis report
5. Validated platform specifications
6. Functional platform (tested and operational)
7. User guide and technical documentation
8. Training report and materials
9. Maintenance and after-sales service plan

---

## User Roles & Access Levels

| Role | Capabilities |
|------|-------------|
| **Public Visitor** | View public discussions and documents, browse member directory |
| **Registered Member** | Participate in discussions, upload documents, connect with members |
| **Moderator** | All member privileges + edit/delete content, move topics, pin discussions |
| **Administrator** | Full platform control — manage users, configure settings, manage categories |

---

## Feature Requirements

### Discussion Forums

- Topic creation by any registered member with title and tags
- Threaded conversations showing who responded to whom
- Rich content: bold, italics, lists, embedded images, file attachments, links
- Reactions: likes and "mark as helpful"
- Email notifications for followed topics
- Categories organized by evaluation topics

### Documentation Repository

- Structured library for evaluation reports, methodological guides, toolkits, case studies
- Upload support: PDF, Word, Excel, PowerPoint
- Document metadata: title, author, date, description, tags
- Organized by type (reports, tools, case studies), sector, region
- Search across document titles, descriptions, and tags
- Access control: some documents public, others require membership

### Member Profiles

- Registration with email verification
- Profile fields: name, organization, expertise areas, location, bio, professional interests
- Optional profile photo
- Privacy controls — members choose what is visible to others

### Member Directory

- Search by expertise (e.g. health sector evaluators)
- Filter by location/region
- Filter by organization type (consultant, government, NGO, academic)
- Contact members directly through the platform

### Integration

- Event posts with Zoom/Teams meeting links
- Upcoming events display on the platform
- Social media sharing to Facebook, LinkedIn, Twitter
- Email notifications with member-controlled frequency

### Security & Data Protection

- Secure password storage with modern encryption
- Minimum 8 character passwords
- Password reset via email
- Automatic logout after inactivity
- HTTPS — all data encrypted in transit
- Daily automated backups of database and uploaded files
- Spam protection against spam registrations
- Members can delete their accounts and data

### Mobile Experience

- Responsive design that adjusts to screen size
- Touch-friendly navigation
- Readable text without zooming
- No app download required

### AI Features (Optional, subject to budget approval)

- Thread summarization: auto-generate summaries of long discussions with key points and conclusions
- Document summarization: brief overviews of uploaded evaluation reports
- Catch-up summaries: help returning members understand what they missed
- Uses established AI services (OpenAI, Anthropic, or similar)
- Requires ongoing API costs and key management

---

## Milestone Breakdown

### Milestone 1 — Setup & Planning (Weeks 1-2) — DONE

- [x] NodeBB installed on development and staging servers
- [x] Database provisioned (Neon PostgreSQL)
- [x] Basic categories created in French (Annonces, Discussions Générales, Méthodologie & Outils, Événements)
- [x] User roles verified (guests, registered-users, Global Moderators, administrators)
- [x] Default language set to French
- [x] Admin account configured

### Milestone 2 — Branding & User Profiles (Weeks 3-4)

- [ ] Custom theme (`nodebb-theme-cop`) extending Harmony
- [ ] Ministry branding applied: logo, colours, typography
- [ ] Homepage redesigned — professional community hub, not a generic forum
- [ ] User profile fields: organization, expertise, sector, region, bio
- [ ] Permissions configured for all user types
- [ ] Registration flow in French

### Milestone 3 — Document Library & Directory (Weeks 5-6)

- [ ] Document upload and organization system with tagging and metadata
- [ ] Document categories: type, sector, region
- [ ] Document search across titles, descriptions, tags
- [ ] Document access control (public vs members-only)
- [ ] File storage integration (Cloudflare R2)
- [ ] Searchable member directory with filters (expertise, location, org type)

### Milestone 4 — Integration & Admin Tools (Weeks 7-8)

- [ ] Event posting with Zoom/Teams meeting links
- [ ] Email notifications setup (SMTP2GO)
- [ ] Notification frequency controls for members
- [ ] Moderation tools and workflows configured
- [ ] Privacy and data protection settings
- [ ] Admin panel configured for Ministry needs
- [ ] Social media sharing
- [ ] Testing with different user scenarios

### Milestone 5 — AI Features & Final Testing (Weeks 9-10)

- [ ] AI discussion summarization
- [ ] AI document summarization
- [ ] Catch-up summaries for returning members
- [ ] Summarization UI and controls
- [ ] Final testing and bug fixes
- [ ] Performance optimization
- [ ] Handoff documentation

---

## Documentation Deliverables

### User Guide (French, with screenshots)
- Registration and profile creation
- Participating in discussions
- Sharing documents and resources
- Finding and connecting with members

### Administrator Guide
- Approving registrations
- Assigning roles and permissions
- Moderating discussions and content
- Managing documentation repository
- Platform configuration and settings
- Backup and restore procedures
- Troubleshooting common issues

### Video Tutorials
- Key user tasks (registration, discussion, document sharing)
- Administrator functions (moderation, user management)
- Maintenance procedures (backups)

### Maintenance Plan
- Bug fix and issue resolution procedures
- Security update and patch process
- Software update schedule
- Hosting and server management
- Backup and disaster recovery
- Technical support contacts and response times
- Ongoing costs and budget

---

## Non-Functional Requirements

- **Language**: French (all UI, notifications, emails, documentation)
- **Performance**: Fast load times, responsive on mobile
- **Security**: HTTPS, secure auth, daily backups, spam protection, data privacy
- **Hosting**: Staging on Render, production TBD
- **Database**: Neon PostgreSQL (serverless)
- **File storage**: Cloudflare R2
- **Mobile**: Responsive, touch-friendly, no app required
- **Ownership**: All code, data, and content owned by the Ministry
- **Handover**: Ministry staff must manage platform independently after training
