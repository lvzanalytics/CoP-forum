

**FUNCTIONAL SPECIFICATION DOCUMENT**

Community of Practice Platform — Public Policy Evaluation

**Prepared for:**

**Ministère du Plan et du Développement**

République de Côte d'Ivoire

**Prepared by:**

**LVZ Analytics Corp**

| Document Version | 1.0 — Initial Release |
| :---- | :---- |
| **Date** | March 2026 |
| **Status** | Final Draft — Awaiting Client Review |
| **Classification** | Confidential |

**1\. Purpose and Scope of This Document**

This Functional Specification Document defines the features, behaviours, access rules, integrations, and security controls of the Community of Practice (CoP) platform to be delivered by LVZ Analytics Corp to the Ministère du Plan et du Développement. It is the authoritative reference against which the delivered platform will be assessed during User Acceptance Testing and at handover.

This document establishes mutual agreement on what the platform will do. It protects the Ministry by making the expected functionality explicit and verifiable. It protects LVZ Analytics Corp by defining the boundary of scope — any capability not described in this document is outside the contracted delivery.

This document does not cover community governance, member engagement strategy, training programme design, or operational procedures. Those are addressed in separate project deliverables.

**1.1 Parties**

| Client | Ministère du Plan et du Développement, République de Côte d'Ivoire |
| :---- | :---- |
| **Service Provider** | LVZ Analytics Corp |
| **Platform Language** | French — all user-facing interface text, labels, notifications, and error messages |
| **Data Ownership** | All code, data, and content are the exclusive property of the Ministry upon handover |

**1.2 Scope Boundary**

The table below defines what is and is not within the scope of this document and this platform delivery.

| In Scope — Specified in This Document | Out of Scope — Addressed Elsewhere |
| :---- | :---- |
| ● Discussion forum module ● Documentation repository ● Member registration and profiles ● Four-tier access control system ● Evaluator member directory ● Videoconferencing and social media integrations ● Email notification system ● Ministry branding and French localisation ● Authentication and platform security controls ● Admin dashboard and moderation tools ● AI summarisation with cost-control architecture ● Acceptance criteria and UAT process | ● Community governance structure and roles ● Member engagement strategy and activities ● Operational charter and code of conduct ● Stakeholder consultation process ● Training programme design and delivery ● Hosting infrastructure procurement ● Ongoing platform maintenance procedures ● Content seeding and community launch |

**2\. Platform Overview**

The CoP platform is a purpose-built digital environment for evaluation professionals in Côte d'Ivoire. It brings together discussion forums, a structured documentation library, a professional member directory, event management, and AI-assisted knowledge tools within a single, integrated system delivered and configured by LVZ Analytics Corp.

The platform is fully responsive and functions on mobile devices without requiring an app download, consistent with connectivity conditions in Côte d'Ivoire. All source code, custom-built components, and configuration are transferred to the Ministry at handover. There are no per-seat fees, ongoing licensing costs, or third-party vendor access rights to Ministry data.

**2.1 AI Provider Architecture**

The platform integrates with external AI services for summarisation features described in Section 5\. To protect the Ministry from vendor pricing changes and ensure long-term flexibility, the integration is built against a provider abstraction layer. Switching between AI providers requires only a configuration change — no code change. Gemini, OpenAI and Anthropic are supported at launch. The Ministry will be informed of the active provider before go-live and may switch at any time.

**3\. Functional Requirements**

**3.1 Discussion Forum**

The forum is the primary interaction space. It is organised into named categories and supports the full lifecycle of professional discussion.

| Feature | Specified Behaviour | Minimum Access |
| :---- | :---- | :---- |
| **Topic Creation** | Members create topics with a title, body, and optional tags. The category is selected at time of creation. | Registered Member |
| **Threaded Replies** | Replies are attributed to the responding member and displayed in chronological order. Members may quote a specific post in their reply. | Registered Member |
| **Rich Text Editor** | Composer supports: bold, italic, headings, bulleted lists, numbered lists, code blocks, inline code, hyperlinks, image embeds, and file attachments. | Registered Member |
| **Reactions** | Members may like any post. Post authors receive a notification. Reaction counts are visible on each post. | Registered Member |
| **Category Organisation** | Four initial categories: Annonces, Discussions Générales, Méthodologie & Outils, Événements. Categories are configurable by Administrators. | All users (view) |
| **Pinned Topics** | Moderators and Administrators may pin a topic to the top of its category. Pinned topics remain visible above unpinned content. | Moderator |
| **Content Moderation** | Moderators may: edit any post, move a topic to a different category, lock a topic to prevent further replies, or delete posts and topics. All actions are logged. | Moderator |
| **Flagging** | Members may flag any post for moderator review. Flagged posts appear in the moderation queue in the admin dashboard. | Registered Member |
| **Follow and Notify** | Members may follow any topic. They receive an in-platform notification and email when a new reply is posted to that topic. | Registered Member |

**3.2 Documentation Repository**

The documentation repository provides a structured, searchable library for evaluation reports, methodological guides, policy documents, and training materials.

| Requirement | Specification |
| :---- | :---- |
| **Accepted File Types** | PDF, Microsoft Word (.docx), Excel (.xlsx), PowerPoint (.pptx), and common image formats (JPG, PNG). Maximum file size: configurable by Administrator (default 20 MB per file). |
| **Mandatory Metadata** | Every uploaded document must include: Title, Author name, Upload date (auto-populated), Description (minimum 50 characters), Category, and at least one Tag. |
| **Optional Metadata** | Region, Sector, Source organisation, Publication date (distinct from upload date), Language. |
| **Document Categories** | Initial categories: Evaluation Reports, Methodological Tools, Policy Documents, Case Studies, Training Resources. Configurable by Administrator. |
| **Search** | Full-text search across document titles, descriptions, tags, and AI-generated summaries. Results may be filtered by Category, Region, Sector, and Tag. |
| **Access Control** | Each document is assigned one of two visibility levels at upload: Public (accessible to all visitors) or Members Only (requires registration). Administrators may change visibility after upload. |
| **Upload Moderation** | Registered Members may submit documents. Submitted documents are held in a pending queue and are not publicly visible until approved by a Moderator or Administrator. Configurable: Administrators may set categories to allow direct publication without moderation. |
| **Version Control** | Document owners may upload a revised version. The original version is retained in the system record. Visitors see the latest version; Administrators may access version history. A new AI summary is generated automatically for each new version. |
| **Download** | Any user with access to a document may download the original file. Download events are recorded in the admin analytics dashboard. |

**3.3 Member Management**

**3.3.1 Registration and Profiles**

Registration is email-based. Upon submitting a valid email address and password, the prospective member receives a verification email. Access to member-only features is withheld until the email link is clicked.

| Registration Fields | Required: email address, display name, password (minimum 8 characters). All other fields are optional at registration and may be completed later. |
| :---- | :---- |
| **Profile Fields** | Full name, organisation, title/role, expertise areas, region (within Côte d'Ivoire), organisation type, professional biography, optional profile photo. |
| **Privacy Controls** | Each profile field carries an independent visibility setting: visible to all visitors, visible to registered members only, or private (visible only to the member themselves and Administrators). |
| **Direct Messaging** | Registered Members may send private messages to other members through the platform. No email address is exposed in this process. |
| **Account Deletion** | Members may request deletion of their account. Upon confirmation, personal profile data is removed. Posts are anonymised (attributed to a deleted account placeholder) rather than deleted, to preserve discussion integrity. |

**3.3.2 Access Levels**

The platform enforces four distinct access levels. Permissions are additive — each level inherits the capabilities of all levels below it.

| Level | Intended User | Platform Capabilities | How Assigned |
| :---- | :---- | :---- | :---- |
| **Public Visitor** | External stakeholders, general public | View public discussion topics and posts. Browse public documents. View member directory (names and organisations only, subject to privacy settings). | Default — no registration required |
| **Registered Member** | Evaluation practitioners | All Visitor capabilities. Create topics, reply, react. Upload documents. Access members-only content. Use private messaging. Use AI summarisation subject to admin-configured access rules. | Self-registration \+ email verification |
| **Moderator** | Community managers, senior practitioners | All Member capabilities. Edit, move, lock, pin, or delete any topic or post. Approve or reject document uploads. Manage flagged content queue. View moderation log. | Assigned by Administrator |
| **Administrator** | Ministry IT staff | All Moderator capabilities. Full platform configuration. User account management. Category management. AI feature configuration and access rule management. Access to all analytics and system logs. | Assigned by LVZ Analytics Corp at handover |

**3.4 Evaluator Member Directory**

The Evaluator Directory is a dedicated, searchable view of registered members who have completed their extended profile. It serves as a professional discovery tool for locating evaluation practitioners by expertise, region, sector, and organisation type.

| Display Condition | A member appears in the directory only if they have completed their extended profile fields. Members may opt out of the directory while retaining their platform account. |
| :---- | :---- |
| **Search** | Free-text search across member names, organisations, and biography text. |
| **Filter: Expertise** | Filter by stated expertise area (e.g., health evaluation, gender-responsive evaluation, M\&E system design). Members select from a configurable list of expertise tags. |
| **Filter: Region** | Filter by region within Côte d'Ivoire, or by country for international members. |
| **Filter: Organisation Type** | Filter by: Independent Consultant, Government Agency, NGO, Academic Institution, International Organisation. |
| **Filter: Sector Focus** | Filter by primary sector: Health, Education, Agriculture, Governance, Infrastructure, Social Protection, Other. |
| **Profile View** | Clicking a directory listing opens the full member profile subject to their privacy settings. A Send Message button is available on every profile visible to Registered Members. |
| **Admin Configuration** | The list of available expertise tags, sectors, and organisation types is configurable by Administrators. |

**4\. Integration Specifications**

**4.1 Videoconferencing — Zoom and Microsoft Teams**

The platform supports a structured event post type within the Événements category with dedicated fields for meeting links. This is a template-based implementation and does not require OAuth authentication or API-level access with Zoom or Teams.

| Event Post Fields | Event Title, Date and Time (with timezone), Meeting Link (Zoom or Teams URL), Description, optional Registration Link. |
| :---- | :---- |
| **Display** | Event posts display the meeting link as a prominent, clearly labelled call-to-action button. Date and time are formatted for the West Africa Time (WAT) timezone by default. |
| **Notifications** | Members following the Événements category receive the standard topic follow notification when a new event is posted. |
| **Scope** | This integration embeds links only. The platform does not create, manage, or authenticate with Zoom or Teams accounts. Meeting hosts manage their sessions within Zoom or Teams directly. |

**4.2 Social Media Sharing**

Members and public visitors may share individual discussion topics and repository documents to external social platforms using the Open Graph metadata protocol.

| Supported Platforms | Facebook, LinkedIn, X (Twitter). |
| :---- | :---- |
| **Share Content** | Shared links use Open Graph metadata: page title, description excerpt, and platform logo as the preview image. |
| **Visibility Rule** | Members-only content that is shared externally will require the recipient to register and log in before the content is accessible. The share link is valid but access-gated. |

**4.3 Email Notification System**

The platform sends transactional emails for account management events and community activity. Email delivery is handled via SMTP, configured at deployment based on Ministry infrastructure.

| Email Type | Trigger | Recipient |
| :---- | :---- | :---- |
| **Email Verification** | New account registration | Registering user |
| **Password Reset** | Member initiates account recovery | Account owner |
| **Topic Reply Notification** | New reply posted to a topic the member is following | Topic followers |
| **Mention Notification** | Member is @mentioned in a post | Mentioned member |
| **Reaction Notification** | A member's post receives a reaction | Post author |
| **Document Pending Approval** | A new document is submitted and awaiting moderation | Moderators and Administrators |

Members control notification preferences individually. Each notification type can be set to: immediate email, daily digest, weekly digest, or disabled. In-platform notifications are always delivered regardless of email preference.

**5\. AI Summarisation Features**

AI summarisation is a core platform feature. The architecture is designed around a cost-control framework that gives Administrators granular control over how and when AI services are invoked, preventing runaway API costs while delivering a responsive experience to members.

**5.1 Design Principles**

Three principles govern the AI architecture across all summarisation features:

**1\.  Cache-first.**  Generate-once, serve-many. Summaries are generated by an API call once, then stored in the platform database. All subsequent requests for the same summary are served from storage at no cost. API calls are only made when no valid cached summary exists.

**2\.  Explicit triggers only.**  No summarisation occurs silently in the background without a member or system action explicitly triggering it. This keeps API usage predictable and auditable.

**3\.  Administrator-controlled access.**  Administrators configure access rules, trigger thresholds, cache durations, and per-member usage limits from the admin panel. No code changes are required to adjust these parameters post-deployment.

**5.2 Document Summarisation**

Document summarisation provides a brief AI-generated abstract for every document in the repository, displayed on the document detail page alongside the manually entered description.

| Behaviour | Specification |
| :---- | :---- |
| **Generation Trigger** | A summary is generated when a document is first uploaded and approved, or when a new version is uploaded. For documents uploaded before the AI feature is activated, a summary is generated on the first  request. |
| **Caching** | The generated summary is stored permanently against the document record. The same summary is served to all subsequent visitors at no additional API cost. The cache is invalidated only when a new document version is uploaded. |
| **Summary Content** | The summary is 3 to 5 sentences in length, covering the document's purpose, scope, key findings or contents, and intended audience. Generated in French. |
| **Access Control** | Administrator configures whether document summaries are visible to: all visitors (including public), registered members only, or no one (feature disabled)and whether summaries can be requested by all. |
| **Member Request** | If a summary has not yet been generated for a document (e.g., legacy documents), a registered member with access may click a Generate Summary button. This triggers a single API call. The result is cached immediately and served to all subsequent visitors. |

**5.3 Discussion Thread Summarisation**

Discussion thread summarisation allows members to request a structured summary of a long discussion thread without reading every reply. The design balances usefulness with strict cost control.

| Behaviour | Specification |
| :---- | :---- |
| **Trigger Mechanism** | Summarisation is never automatic. A Summarise this discussion button is displayed on threads that meet the minimum reply threshold (configurable by Administrator, default: 15 replies). The member explicitly clicks to request a summary. |
| **Minimum Threshold** | The button is not displayed on threads below the configured reply threshold. This prevents API calls on short discussions that do not benefit from summarisation. |
| **Cache Window** | Once generated, a summary is cached and served to all subsequent requests within the cache window. The cache window is configurable by the Administrator (default: 12 hours). When a member clicks the button within an active cache window, the stored summary is returned at no API cost. |
| **Cache Invalidation** | The cache is invalidated when either: (a) the cache window expires, or (b) the thread has received a configurable number of new replies since the last summary was generated (default: 10 new replies). Whichever condition is met first triggers a fresh summary on the next member request. |
| **Per-Member Daily Limit** | Administrators may configure a daily limit on the number of discussion summaries a registered member can trigger (default: 5 per day). Requests that would serve a cached result do not count against this limit — the limit applies to requests that would trigger a new API call. |
| **Access Control** | Administrator configures which access level can trigger discussion summaries. Options: Registered Members and above, Moderators and above, Administrators only. The feature can also be disabled entirely from the admin panel without a code change. |
| **Summary Content** | The summary covers: the original question or topic, the main positions or findings raised in replies, any consensus or conclusions reached, and open questions remaining. Generated in French. Maximum length: 200 words. |

**5.4 Catch-Up Digest Summarisation**

The catch-up digest helps members who have been away from the platform understand what they missed without reading through every new topic individually.

| Behaviour | Specification |
| :---- | :---- |
| **Trigger Mechanism** | On-demand only. When a member who has not logged in for longer than the configured absence threshold (default: 14 days) logs in, they are offered a Catch me up button on their home screen. No digest is generated until the member explicitly clicks it. |
| **Digest Content** | The digest presents new topics created since the member's last login, grouped by category, each with a one to two sentence summary. Topics with no replies are listed by title only with no API call. Summaries are only generated for topics that meet the minimum reply threshold defined in Section 5.3. |
| **Caching** | Individual topic summaries used in the digest are drawn from the discussion summary cache (Section 5.3). If a valid cached summary exists for a topic, it is reused at no cost. A new API call is made only for topics that exceed the reply threshold and do not have a valid cached summary. |
| **Cache Window** | Once a member has generated a catch-up digest, the same digest is served from cache if they click the button again within a configurable window (default: 6 hours). This covers the case of a member accidentally closing and reopening the platform. |
| **Access Control** | Available to all Registered Members. Administrators may disable the feature globally or adjust the absence threshold and cache window from the admin panel. |

**5.5 AI Administration Panel**

All AI feature parameters are managed from a dedicated AI Configuration section within the admin dashboard. No code changes or server access are required to adjust these settings after deployment.

| Feature Toggles | Each AI feature (document summarisation, discussion summarisation, catch-up digest) can be independently enabled or disabled from the admin panel. |
| :---- | :---- |
| **Access Level Rules** | Per feature, the Administrator sets the minimum access level required to trigger a summary: all registered members, moderators and above, or administrators only. |
| **Threshold Configuration** | Minimum reply count before a discussion summary button appears; number of new replies that invalidates a cached discussion summary. |
| **Cache Duration Settings** | Cache window duration for discussion summaries; cache window duration for catch-up digests. Document summaries use permanent caching and have no configurable duration. |
| **Per-Member Daily Limits** | Maximum number of new API-triggering summary requests per registered member per day, configurable per feature type. |
| **Usage Dashboard** | The admin panel displays a summary of AI API calls made in the current billing period, broken down by feature type, to assist the Ministry in monitoring costs. |

**6\. Security and Data Protection**

**6.1 Authentication and Access Controls**

| Control | Implementation |
| :---- | :---- |
| **Password Storage** | Passwords are hashed using bcrypt before storage. The plaintext password is never written to the database. In the event of a database breach, stored hashes cannot be practically reversed to recover passwords. |
| **Transport Encryption** | All traffic between the browser and the server is encrypted via HTTPS/TLS. Unencrypted HTTP connections are automatically redirected to HTTPS. SSL certificates are provisioned and configured as part of the deployment. |
| **Session Security** | Session tokens are cryptographically generated and stored server-side. Sessions expire after a configurable inactivity period. Logging out invalidates the session token immediately. |
| **Password Reset** | Account recovery uses a time-limited, single-use token delivered by email. The token expires after 1 hour. Expired or previously used tokens are rejected. |
| **Brute-Force Protection** | Repeated failed login attempts from the same IP address trigger a temporary lockout. The lockout duration and attempt threshold are configurable by Administrators. |
| **Role Enforcement** | Elevated roles are explicitly assigned and do not self-escalate. All administrative actions — role assignment, content deletion, user suspension — are recorded in the system audit log with timestamp and acting user. |
| **Input Sanitisation** | All user-submitted content is sanitised server-side before storage to prevent cross-site scripting (XSS) injection. File uploads are validated against an allowlist of permitted file types. |
| **Data Backup Configuration** | Backup procedures are configured and documented as part of the platform deployment. This includes database backup scripts and a documented restore procedure. Full responsibility for executing and maintaining backups transfers to the Ministry at handover. |

**6.2 Data Ownership and Sovereignty**

The platform is deployed on infrastructure under the exclusive administrative control of the Ministry. LVZ Analytics Corp does not retain access to the production server, database, or member data at any point after formal handover. All server credentials, database credentials, and administrative accounts are transferred to the Ministry at the end of the project.

All source code, including custom-built components and configuration, is fully available to the Ministry for inspection, modification, or independent audit at any time. There is no proprietary component that cannot be examined or replaced.

**6.3 AI Data Handling**

The following rules govern what data is transmitted to the AI provider and under what conditions.

| Data Transmitted | Only the text content of the discussion thread or document being summarised is transmitted to the AI API. No member account data, email addresses, passwords, private messages, or profile information is ever transmitted. |
| :---- | :---- |
| **Scope Limitation** | API calls are made only for the specific content item being summarised. No bulk data, member lists, or platform-wide exports are sent to the AI provider. |
| **Provider Terms** | The Ministry must review and accept the selected AI provider's data processing terms before the AI features are activated on the production platform. LVZ Analytics Corp will provide the relevant documentation for this review. |
| **Provider Switching** | As described in Section 2.1, the provider abstraction layer allows the Ministry to switch AI providers through a configuration change. The data handling rules above apply regardless of the active provider. |

**6.4 Member Data Privacy**

| Privacy Settings | Every profile field has an independent visibility control: public, members-only, or private. Members set these at registration and may change them at any time. |
| :---- | :---- |
| **Data Minimisation** | The platform collects only the information necessary for its operation. No advertising trackers, third-party behavioural analytics, or fingerprinting scripts are included. |
| **Account Deletion** | Members may request full account deletion. Profile data is removed. Posts are anonymised to a deleted-user placeholder to preserve discussion continuity. |
| **No Exposed Contact Details** | Member email addresses are never displayed on the platform. Direct contact between members occurs through the internal messaging system only. |
| **Administrator Access Logging** | Any Administrator action that accesses or modifies member account data is recorded in the audit log with timestamp, acting administrator, and action taken. |
| **Terms and Privacy Notice** | A privacy notice drafted in French is presented to the user at registration and remains accessible from the platform footer at all times. No account can be created without the user confirming they have read and accepted it. |

**7\. Non-Functional Requirements**

| Language | All user-facing interface text, labels, buttons, error messages, email templates, system notifications, and AI-generated summaries are in French. |
| :---- | :---- |
| **Mobile Compatibility** | The platform must function correctly on modern mobile browsers (iOS Safari, Android Chrome) at viewport widths from 320px upward. Touch targets must be appropriately sized. No feature specified in this document is restricted to desktop. |
| **Browser Support** | The platform must function correctly on the current and one prior version of: Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge. |
| **Performance** | Standard page loads (topic list, topic view, member directory) must complete within 4 seconds on a 4G mobile connection under normal load. Cached AI summaries must display within the same page load time. Uncached AI summary generation may take up to 10 seconds; a loading indicator is displayed during generation. |
| **Accessibility** | The platform must meet WCAG 2.1 Level AA for all primary member-facing screens: registration, login, topic view, forum index, and document repository. |
| **Concurrent Users** | The platform must remain stable and performant with a minimum of 200 simultaneous logged-in users. |
| **Uptime** | The platform is expected to be available 99% of the time during normal operating hours, excluding scheduled maintenance windows communicated to Administrators in advance. |
| **Audit Logging** | All moderation actions, administrator account changes, role assignments, and AI feature configuration changes are written to an append-only audit log accessible only to Administrators. |

**8\. Acceptance Criteria and UAT Process**

**8.1 Definition of Done**

The platform is considered complete and ready for handover when all of the following conditions are met:

**1\.**  All features specified in Sections 3, 4, 5, and 6 of this document are implemented and functioning as described.

**2\.**  The platform passes cross-browser testing on Chrome, Firefox, Safari, and Edge (current and prior versions).

**3\.**  The platform passes mobile testing on iOS Safari and Android Chrome at multiple screen sizes.

**4\.**  All security controls listed in Section 6.1 are verified through structured test cases.

**5\.**  All AI summarisation features function correctly including cache behaviour, access control enforcement, and per-member limits.

**6\.**  All user-facing text and AI-generated summaries are in French.

**7\.**  Ministry staff have completed User Acceptance Testing and all Critical and Major defects have been resolved.

**8\.**  All platform credentials, source code, and documentation have been transferred to the Ministry.

**8.2 User Acceptance Testing Process**

UAT is conducted by Ministry staff on a pre-production environment that mirrors the production deployment. LVZ Analytics Corp provides a structured test script covering every specified feature. Ministry staff execute each test case and record the result.

| Defect Severity | Definition | Resolution Commitment |
| :---- | :---- | :---- |
| **Critical** | A specified feature does not function at all, or a security control is absent or bypassable | Blocks go-live. Must be resolved and re-tested before production deployment proceeds. |
| **Major** | A feature functions but deviates materially from its specification in a way that affects usability | Resolved within 48 hours of identification. Re-tested before go-live. |
| **Minor** | Cosmetic issues, non-blocking inconsistencies, or minor deviations from specification that do not affect function | Documented and resolved in the first post-launch maintenance cycle. Does not block go-live. |

UAT sign-off is provided in writing by the designated Ministry project lead. Sign-off confirms that all Critical and Major defects have been resolved to the Ministry's satisfaction and that the platform meets the requirements of this document.

**9\. Document Control and Sign-Off**

**9.1 Revision History**

| Version | Date | Summary | Author |
| :---- | :---- | :---- | :---- |
| 1.0 | March 2026 | Initial release — submitted for Ministry review | LVZ Analytics Corp |
|  |  |  |  |
|  |  |  |  |

**9.2 Change Control**

Any request to add, remove, or modify a feature described in this document after sign-off constitutes a change request. Change requests must be submitted in writing, assessed for timeline and cost impact by LVZ Analytics Corp, and approved in writing by the Ministry project lead before implementation begins. Work on the change does not commence until written approval is received.

LVZ Analytics Corp is not obligated to implement any feature not described in this document within the contracted timeline or budget.

**9.3 Sign-Off**

Signing below confirms that the signing party has read this document, that it accurately represents the agreed platform scope, and that development may proceed on this basis.

| Role | Name | Date | Signature |
| :---- | :---- | :---- | :---- |
| **Ministry Project Lead** |   |   |   |
| **LVZ Analytics Corp — Project Lead** |   |   |   |

All code, custom-built components, theme files, and documentation produced under this contract are the exclusive intellectual property of the Ministère du Plan et du Développement, République de Côte d'Ivoire, upon handover. LVZ Analytics Corp retains no right to reuse, reproduce, or reference Ministry platform data or content beyond the duration of this contract.