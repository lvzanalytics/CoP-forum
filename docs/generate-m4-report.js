const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, LevelFormat, ExternalHyperlink,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TabStopType, TabStopPosition,
} = require("docx");

const SCREENSHOTS_DIR = path.join(__dirname, "..", "african-business");

// Brand colors
const TEAL = "2D6A4F";
const DARK = "333333";
const LIGHT_TEAL = "E8F5EE";
const MEDIUM_TEAL = "D0EBDB";
const GRAY = "666666";
const LIGHT_GRAY = "F5F5F5";
const BORDER_COLOR = "CCCCCC";

// Page dimensions (US Letter)
const PAGE_WIDTH = 12240;
const PAGE_HEIGHT = 15840;
const MARGIN = 1440;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN; // 9360

function loadImage(filename) {
  return fs.readFileSync(path.join(SCREENSHOTS_DIR, filename));
}

const border = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: TEAL, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 22 })],
    })],
  });
}

function bodyCell(text, width, opts = {}) {
  const runs = [];
  if (opts.bold) {
    runs.push(new TextRun({ text, bold: true, font: "Arial", size: 22, color: DARK }));
  } else {
    runs.push(new TextRun({ text, font: "Arial", size: 22, color: DARK }));
  }
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.shaded ? { fill: LIGHT_GRAY, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [new Paragraph({ children: runs })],
  });
}

function screenshotWithCaption(filename, caption) {
  const imgData = loadImage(filename);
  const ext = filename.endsWith(".png") ? "png" : "jpg";
  return [
    new Paragraph({ spacing: { before: 300, after: 100 }, alignment: AlignmentType.CENTER, children: [
      new ImageRun({
        type: ext,
        data: imgData,
        transformation: { width: 580, height: 326 },
        altText: { title: caption, description: caption, name: filename },
      }),
    ]}),
    new Paragraph({
      spacing: { after: 300 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: caption, italics: true, font: "Arial", size: 20, color: GRAY })],
    }),
  ];
}

function bulletItem(boldPart, rest) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: [
      new TextRun({ text: boldPart, bold: true, font: "Arial", size: 22, color: DARK }),
      new TextRun({ text: rest, font: "Arial", size: 22, color: DARK }),
    ],
  });
}

function checklistItem(text) {
  return new Paragraph({
    numbering: { reference: "checklist", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })],
  });
}

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: TEAL })],
  });
}

function subHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: DARK })],
  });
}

function subSubHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: TEAL })],
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 160 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK, ...(opts.italics ? { italics: true } : {}) })],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: TEAL, space: 1 } },
    children: [],
  });
}

// Build the document
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: DARK } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "checklist",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2610", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "nextSteps",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              spacing: { after: 100 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 4 } },
              children: [
                new TextRun({ text: "Communaut\u00e9 de Pratique \u2014 \u00c9valuation des Politiques Publiques", font: "Arial", size: 18, color: TEAL, italics: true }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 4 } },
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              children: [
                new TextRun({ text: "LVZ Analytics Corp", font: "Arial", size: 16, color: GRAY }),
                new TextRun({ text: "\tPage ", font: "Arial", size: 16, color: GRAY }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: GRAY }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Title
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: "Milestone 4", font: "Arial", size: 44, bold: true, color: TEAL })],
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: "Integration & Admin Tools", font: "Arial", size: 36, color: DARK })],
        }),

        // Metadata table
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [2400, 6960],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Project:", bold: true, font: "Arial", size: 22, color: GRAY })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6960, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Communaut\u00e9 de Pratique \u2014 \u00c9valuation des Politiques Publiques", font: "Arial", size: 22, color: DARK })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Client:", bold: true, font: "Arial", size: 22, color: GRAY })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6960, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Minist\u00e8re", font: "Arial", size: 22, color: DARK })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Developer:", bold: true, font: "Arial", size: 22, color: GRAY })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6960, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "LVZ Analytics Corp", font: "Arial", size: 22, color: DARK })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Platform URL:", bold: true, font: "Arial", size: 22, color: GRAY })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6960, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new ExternalHyperlink({ link: "https://cop-forum.onrender.com", children: [new TextRun({ text: "https://cop-forum.onrender.com", style: "Hyperlink", font: "Arial", size: 22 })] })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true, font: "Arial", size: 22, color: GRAY })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6960, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "April 2026", font: "Arial", size: 22, color: DARK })] })] }),
            ]}),
          ],
        }),

        divider(),

        // ============================================================
        // What Was Delivered
        // ============================================================
        sectionHeading("What Was Delivered"),
        bodyText("Milestone 4 adds event management, social sharing, email notifications, and moderation tools to the platform. These features prepare the Community of Practice for day-to-day operations \u2014 administrators can now organize meetings, members receive timely notifications, and moderators have full control over content quality."),

        // ---- Event Management ----
        subHeading("Event Management"),
        bodyText("A complete event management system has been built as a dedicated plugin (nodebb-plugin-cop-events), allowing administrators and global moderators to create, edit, and manage meetings, webinars, and workshops. Each event automatically generates a discussion topic in the \u00c9v\u00e9nements category, connecting the event to the community\u2019s conversation space."),
        bodyText("Key capabilities delivered:"),

        bulletItem("Event creation \u2014 ", "Administrators can create events with a title, date/time, sector, region, location, meeting platform (Zoom/Teams/other), meeting link, registration link, banner image, and a Markdown description."),
        bulletItem("Calendar view \u2014 ", "A month-view calendar displays all events, allowing members to browse by date and plan their participation."),
        bulletItem("List view with filters \u2014 ", "Events can be browsed in list format, searched by keyword, and filtered by region or sector. Tabs separate upcoming and past events."),
        bulletItem("Event detail page \u2014 ", "Each event has a dedicated page with a hero banner, prominent \u201CRejoindre la r\u00e9union\u201D button, full event details, and a sidebar with RSVP, timezone information, social sharing, and calendar download."),
        bulletItem("RSVP system \u2014 ", "Logged-in members can indicate their participation with a single click. A live participant count is displayed on the event page."),
        bulletItem("Auto-created discussion topic \u2014 ", "When an event is created, a discussion topic is automatically posted in the \u00c9v\u00e9nements category with the event\u2019s date, time, location, and meeting link. Editing or deleting an event updates or removes the associated topic."),
        bulletItem("Banner image uploads \u2014 ", "Event banners are stored on Cloudflare R2, with automatic fallback to local storage."),
        bulletItem("Add to calendar \u2014 ", "Members can download a .ics file to add the event to their personal calendar (Outlook, Google Calendar, Apple Calendar)."),
        bulletItem("Admin panel \u2014 ", "A settings page at /admin/plugins/cop-events allows configuring the default discussion category and backfilling topics for existing events."),

        // Screenshots - Event Management
        ...screenshotWithCaption("Pasted image (4).png", "The event creation form with all fields: title, sector, region, banner upload, dates, and meeting details"),
        ...screenshotWithCaption("Pasted image (2).png", "The events list page with search, filters, and meeting cards"),
        ...screenshotWithCaption("Pasted image (3).png", "The calendar view showing events for the month"),

        new Paragraph({ children: [new PageBreak()] }),

        ...screenshotWithCaption("Pasted image.png", "Event detail page with hero banner, meeting link, RSVP, social sharing, and calendar download"),
        ...screenshotWithCaption("Pasted image (5).png", "The \u00c9v\u00e9nements category showing the auto-created discussion topic"),
        ...screenshotWithCaption("Pasted image (6).png", "The auto-created discussion thread with event details and meeting link"),

        // ---- Social Media Sharing ----
        subHeading("Social Media Sharing"),
        bodyText("Social sharing buttons have been integrated into event detail pages, enabling members to share events on LinkedIn, Twitter/X, and Facebook. Open Graph metadata is generated automatically by NodeBB for all topics and pages, ensuring that shared links display rich previews with the correct title, description, and image."),

        bulletItem("Share buttons \u2014 ", "LinkedIn, Twitter/X, and Facebook sharing links are displayed on every event detail page."),
        bulletItem("Open Graph metadata \u2014 ", "Titles, descriptions, and images are embedded in page headers for rich link previews across social platforms."),
        bulletItem("Access-gated content \u2014 ", "Members-only content remains protected even when shared \u2014 visitors are prompted to log in before accessing restricted pages."),

        // ---- Email Notifications ----
        subHeading("Email Notification System"),
        bodyText("The platform\u2019s email notification system is fully operational. NodeBB\u2019s built-in email capabilities handle verification, password resets, and notification delivery. SMTP delivery is configured through the admin panel \u2014 no code changes required."),
        bodyText("Notifications supported:"),

        bulletItem("Email verification \u2014 ", "New users must verify their email address before accessing the platform."),
        bulletItem("Password reset \u2014 ", "Secure password reset emails with a 2-hour expiry token."),
        bulletItem("Topic reply notifications \u2014 ", "Members are notified when someone replies to a topic they follow."),
        bulletItem("@mention notifications \u2014 ", "Members are notified when they are mentioned in a post."),
        bulletItem("Reaction notifications \u2014 ", "Members are notified when someone reacts to their post."),
        bulletItem("Document approval notifications \u2014 ", "Administrators and global moderators are notified when a new document is uploaded and awaiting approval."),
        bulletItem("Preference controls \u2014 ", "Each member can configure notification delivery per type: immediate, daily digest, weekly digest, or disabled."),

        // ---- Moderation & Admin ----
        subHeading("Moderation & Administration"),
        bodyText("All moderation and administration capabilities are provided by NodeBB\u2019s built-in tools, which have been verified and configured for the platform:"),

        bulletItem("Content moderation \u2014 ", "Moderators can edit, move, lock, pin (with optional expiry), and delete posts and topics. Deleted content can be restored."),
        bulletItem("Flag queue \u2014 ", "Members can flag inappropriate content for moderator review via a centralized queue."),
        bulletItem("Audit logging \u2014 ", "All moderator and administrator actions are logged (40+ event types) for accountability."),
        bulletItem("User management \u2014 ", "Administrators can manage user accounts, roles, bans, and group memberships."),
        bulletItem("Category management \u2014 ", "Administrators can create, edit, reorder, and configure categories and their permissions."),

        divider(),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================================
        // How to Verify
        // ============================================================
        sectionHeading("How to Verify"),
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Please visit ", font: "Arial", size: 22, color: DARK }),
            new ExternalHyperlink({ link: "https://cop-forum.onrender.com", children: [new TextRun({ text: "https://cop-forum.onrender.com", style: "Hyperlink", font: "Arial", size: 22, bold: true })] }),
            new TextRun({ text: " and confirm the following:", font: "Arial", size: 22, color: DARK }),
          ],
        }),

        // Event Management checklist
        subSubHeading("Event Management"),
        checklistItem("Navigate to Rencontres in the top menu \u2014 the events list page loads with search bar, region/sector filters, and list/calendar tabs"),
        checklistItem("Switch to the Calendrier tab \u2014 the month calendar view displays with event indicators"),
        checklistItem("Click \u201CCr\u00e9er une rencontre\u201D \u2014 the event creation form appears with all fields (title, sector, region, location, banner, dates, meeting link, description)"),
        checklistItem("Create a test event with a Zoom or Teams meeting link"),
        checklistItem("The event appears in the list and calendar views"),
        checklistItem("Navigate to the event detail page \u2014 the hero banner, \u201CRejoindre la r\u00e9union\u201D button, and all event details are displayed"),
        checklistItem("Click \u201CParticiper\u201D \u2014 the RSVP is recorded and the participant count updates"),
        checklistItem("Click \u201CAjouter au calendrier\u201D \u2014 a .ics file downloads"),
        checklistItem("Navigate to \u00c9v\u00e9nements in the Espaces menu \u2014 a discussion topic was automatically created for the event"),
        checklistItem("Open the discussion topic \u2014 the event details (date, time, location, meeting link) appear in the first post"),

        // Social Sharing checklist
        subSubHeading("Social Media Sharing"),
        checklistItem("On an event detail page, the social sharing icons (LinkedIn, Twitter/X, Facebook) are visible"),
        checklistItem("Click a share button \u2014 the corresponding platform opens with the event URL pre-filled"),
        checklistItem("Share an event link on any social platform \u2014 the link preview shows the correct title and description"),

        // Email checklist
        subSubHeading("Email Notifications"),
        checklistItem("Navigate to /admin/settings/email \u2014 SMTP settings are visible and configurable"),
        checklistItem("Configure SMTP credentials and send a test email from the admin panel"),
        checklistItem("Register a new account \u2014 a verification email is received"),
        checklistItem("Request a password reset \u2014 a reset email is received"),
        checklistItem("Reply to a followed topic \u2014 the topic author receives an email notification"),
        checklistItem("Check notification preferences in user settings \u2014 per-type controls (immediate/daily/weekly/disabled) are available"),

        // Moderation checklist
        subSubHeading("Moderation & Administration"),
        checklistItem("As a moderator, edit a post and verify the changes are saved"),
        checklistItem("Move a topic to a different category"),
        checklistItem("Lock and then unlock a topic"),
        checklistItem("Pin a topic with an expiry date"),
        checklistItem("Flag a post and verify it appears in the moderator flag queue"),
        checklistItem("Navigate to /admin/manage/users \u2014 user management tools are accessible"),
        checklistItem("Check /admin/advanced/events \u2014 moderator actions are logged"),

        divider(),

        // ============================================================
        // What Comes Next
        // ============================================================
        sectionHeading("What Comes Next \u2014 Milestone 5"),
        bodyText("The final milestone focuses on AI-powered features and platform finalization:"),

        new Paragraph({
          numbering: { reference: "nextSteps", level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "AI discussion summaries \u2014 ", bold: true, font: "Arial", size: 22, color: DARK }),
            new TextRun({ text: "A \u201CSummarise this discussion\u201D button on long threads, generating concise French-language summaries powered by a configurable AI provider (Gemini, OpenAI, or Anthropic).", font: "Arial", size: 22, color: DARK }),
          ],
        }),
        new Paragraph({
          numbering: { reference: "nextSteps", level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "AI document summaries \u2014 ", bold: true, font: "Arial", size: 22, color: DARK }),
            new TextRun({ text: "Automatic 3\u20135 sentence summaries generated when documents are uploaded or approved, with caching and admin-configurable visibility.", font: "Arial", size: 22, color: DARK }),
          ],
        }),
        new Paragraph({
          numbering: { reference: "nextSteps", level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Catch-up digest \u2014 ", bold: true, font: "Arial", size: 22, color: DARK }),
            new TextRun({ text: "A \u201CCatch me up\u201D feature for members returning after an absence, summarizing recent activity across categories.", font: "Arial", size: 22, color: DARK }),
          ],
        }),
        new Paragraph({
          numbering: { reference: "nextSteps", level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Security & performance \u2014 ", bold: true, font: "Arial", size: 22, color: DARK }),
            new TextRun({ text: "Security audit, accessibility review, load testing, backup automation, and preparation of administrator handover documentation.", font: "Arial", size: 22, color: DARK }),
          ],
        }),

        divider(),

        // Footer attribution
        new Paragraph({
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Prepared by the development team \u2014 LVZ Analytics Corp", font: "Arial", size: 20, italics: true, color: GRAY })],
        }),
      ],
    },
  ],
});

// Generate the document
const outputPath = path.join(__dirname, "milestone-4-report.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document written to ${outputPath}`);
}).catch(err => {
  console.error("Error generating document:", err);
  process.exit(1);
});
