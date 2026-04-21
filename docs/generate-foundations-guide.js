const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, ExternalHyperlink,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TabStopType, TabStopPosition,
} = require("docx");

// Brand colors
const TEAL = "2D6A4F";
const DARK = "333333";
const GRAY = "666666";
const LIGHT_GRAY = "F5F5F5";
const BORDER_COLOR = "CCCCCC";

// Page dimensions (US Letter)
const PAGE_WIDTH = 12240;
const PAGE_HEIGHT = 15840;
const MARGIN = 1440;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

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

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })],
  });
}

function numberedItem(text) {
  return new Paragraph({
    numbering: { reference: "steps", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })],
  });
}

function tipBox(text) {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: TEAL },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: TEAL },
              left: { style: BorderStyle.SINGLE, size: 6, color: TEAL },
              right: { style: BorderStyle.SINGLE, size: 1, color: TEAL },
            },
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            shading: { fill: "E8F5EE", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [new Paragraph({
              children: [
                new TextRun({ text: "Note: ", bold: true, font: "Arial", size: 22, color: TEAL }),
                new TextRun({ text, font: "Arial", size: 22, color: DARK }),
              ],
            })],
          }),
        ],
      }),
    ],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: TEAL, space: 1 } },
    children: [],
  });
}

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
        reference: "steps",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
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
                new TextRun({ text: "Community of Practice \u2014 Public Policy Evaluation", font: "Arial", size: 18, color: TEAL, italics: true }),
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
        // ============================================================
        // TITLE PAGE
        // ============================================================
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: "Platform Guide", font: "Arial", size: 44, bold: true, color: TEAL })],
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: "Foundations", font: "Arial", size: 36, color: DARK })],
        }),

        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [2400, 6960],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Project:", bold: true, font: "Arial", size: 22, color: GRAY })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6960, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Community of Practice \u2014 Public Policy Evaluation", font: "Arial", size: 22, color: DARK })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Client:", bold: true, font: "Arial", size: 22, color: GRAY })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6960, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Ministry of Planning and Development", font: "Arial", size: 22, color: DARK })] })] }),
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

        bodyText("This guide covers the foundations of the platform: how to navigate, participate in discussions, manage your account, and \u2014 for administrators and moderators \u2014 how to govern and maintain the community. For feature-specific guides, refer to the separate documents covering the Document Library, Member Directory, and Events."),

        subHeading("Test Access"),

        bodyText("To test the platform with administrator privileges, use the following credentials:"),

        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [3200, 6160],
          rows: [
            new TableRow({ children: [headerCell("Field", 3200), headerCell("Value", 6160)] }),
            new TableRow({ children: [
              bodyCell("Username", 3200, { bold: true }),
              bodyCell("admin", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Password", 3200, { bold: true, shaded: true }),
              bodyCell("cop@dmin1", 6160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Email", 3200, { bold: true }),
              bodyCell("admin@cop.example.com", 6160),
            ]}),
          ],
        }),

        new Paragraph({ spacing: { after: 120 }, children: [] }),

        tipBox("These credentials are for the staging environment only. The password must be changed before production deployment."),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================================
        // 1. PLATFORM OVERVIEW
        // ============================================================
        sectionHeading("1. Platform Overview"),

        bodyText("The Community of Practice (CoP) platform is a professional space for public policy evaluation practitioners in C\u00f4te d\u2019Ivoire. It brings together evaluators, researchers, policymakers, and students to share knowledge, collaborate on methodology, and strengthen the culture of evaluation established by Law No. 666 of December 14, 2022."),

        bodyText("The platform is organised around three pillars:"),

        bulletItem("Discussion spaces \u2014 ", "Four forum categories where members hold conversations, share insights, and ask questions."),
        bulletItem("Resources \u2014 ", "A document library for evaluation reports and tools, a member directory, and an events system for meetings and webinars."),
        bulletItem("Governance \u2014 ", "A role-based system that gives administrators and moderators the tools to maintain quality and order across the platform."),

        subHeading("Navigation"),

        bodyText("The top navigation bar is present on every page and provides access to all areas of the platform:"),

        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [2800, 6560],
          rows: [
            new TableRow({ children: [headerCell("Menu Item", 2800), headerCell("What It Contains", 6560)] }),
            new TableRow({ children: [
              bodyCell("Accueil", 2800, { bold: true }),
              bodyCell("The landing page with an overview of the platform and its purpose", 6560),
            ]}),
            new TableRow({ children: [
              bodyCell("Espaces (dropdown)", 2800, { bold: true, shaded: true }),
              bodyCell("The four discussion categories: Annonces, Discussions G\u00e9n\u00e9rales, M\u00e9thodologie & Outils, \u00c9v\u00e9nements", 6560, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Ressources (dropdown)", 2800, { bold: true }),
              bodyCell("Rencontres (events), Documents (library), Annuaire (member directory), R\u00e9cents (recent activity)", 6560),
            ]}),
          ],
        }),

        new Paragraph({ spacing: { after: 120 }, children: [] }),

        bodyText("The top-right icons provide quick access to:"),

        bulletItem("Search (magnifying glass) \u2014 ", "Full-text search across topics, posts, and tags. You can filter results by category, author, or date."),
        bulletItem("Notifications (bell) \u2014 ", "Shows unread notifications. Click to view the list; click a notification to go directly to the relevant content."),
        bulletItem("Messages (chat icon) \u2014 ", "Access your private conversations with other members."),
        bulletItem("Your avatar \u2014 ", "Opens a menu with links to your profile, settings, status, and logout."),

        divider(),

        // ============================================================
        // 2. DISCUSSION SPACES
        // ============================================================
        sectionHeading("2. Discussion Spaces"),

        bodyText("The forum is the core of the platform. Discussions are organised into four categories, each accessible from the Espaces dropdown menu:"),

        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [3000, 6360],
          rows: [
            new TableRow({ children: [headerCell("Category", 3000), headerCell("Purpose", 6360)] }),
            new TableRow({ children: [
              bodyCell("Annonces", 3000, { bold: true }),
              bodyCell("Official communications from the Ministry and community leadership", 6360),
            ]}),
            new TableRow({ children: [
              bodyCell("Discussions G\u00e9n\u00e9rales", 3000, { bold: true, shaded: true }),
              bodyCell("Open exchanges between members on any evaluation-related topic", 6360, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("M\u00e9thodologie & Outils", 3000, { bold: true }),
              bodyCell("Evaluation methods, frameworks, tools, and lessons learned", 6360),
            ]}),
            new TableRow({ children: [
              bodyCell("\u00c9v\u00e9nements", 3000, { bold: true, shaded: true }),
              bodyCell("Discussions linked to meetings, webinars, and training sessions", 6360, { shaded: true }),
            ]}),
          ],
        }),

        subHeading("Browsing a Category"),

        bodyText("When you open a category, you see the topic list. Each topic row shows:"),

        bulletItem("Title \u2014 ", "The subject of the discussion. Click to open it."),
        bulletItem("Labels \u2014 ", "Small badges indicating status: Suivi (you are following this topic), \u00c9pingl\u00e9 (pinned by a moderator), Verrouill\u00e9 (locked \u2014 no new replies allowed)."),
        bulletItem("Reply count and views \u2014 ", "How many responses the topic has received and how many times it has been viewed."),
        bulletItem("Last activity \u2014 ", "Who replied last and when, so you can quickly see which discussions are active."),

        bodyText("Above the topic list, you will find:"),

        bulletItem("Tag filter \u2014 ", "Filter topics by keyword tags."),
        bulletItem("Sort options \u2014 ", "Sort by recent replies, newest topics, most popular, etc."),
        bulletItem("Nouveau sujet button \u2014 ", "Create a new topic in this category (visible if you have permission)."),

        subHeading("Creating a Topic"),

        numberedItem("Navigate to the category where you want to start a discussion."),
        numberedItem("Click the Nouveau sujet button (green, top right)."),
        numberedItem("Enter a clear, descriptive title."),
        numberedItem("Write your message in the editor. The editor supports Markdown formatting (see the formatting table below)."),
        numberedItem("Add tags (keywords) to help others find your topic via search and filters."),
        numberedItem("Click Publier to post the topic."),

        new Paragraph({ spacing: { after: 120 }, children: [] }),

        tipBox("Topics can also be scheduled for future publication. Use the scheduling option in the composer if you want a topic to appear at a specific date and time."),

        subHeading("Replying to a Topic"),

        numberedItem("Open the topic you want to respond to."),
        numberedItem("Click the R\u00e9pondre button (green, top right)."),
        numberedItem("Write your response in the editor."),
        numberedItem("Click Publier to post your reply."),

        bodyText("Additional reply options:"),

        bulletItem("Quote \u2014 ", "Click the quote icon under any post to reply with a citation of that message. This helps keep context in long threads."),
        bulletItem("@mention \u2014 ", "Type @ followed by a username (e.g., @jean) to notify that member directly. A dropdown will suggest matching usernames as you type."),

        subHeading("Formatting Your Messages"),

        bodyText("The editor supports Markdown syntax:"),

        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [3200, 3000, 3160],
          rows: [
            new TableRow({ children: [headerCell("Format", 3200), headerCell("Syntax", 3000), headerCell("Result", 3160)] }),
            new TableRow({ children: [
              bodyCell("Bold", 3200, { bold: true }),
              bodyCell("**text**", 3000),
              bodyCell("text (bold)", 3160),
            ]}),
            new TableRow({ children: [
              bodyCell("Italic", 3200, { bold: true, shaded: true }),
              bodyCell("*text*", 3000, { shaded: true }),
              bodyCell("text (italic)", 3160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Link", 3200, { bold: true }),
              bodyCell("[label](url)", 3000),
              bodyCell("label (clickable)", 3160),
            ]}),
            new TableRow({ children: [
              bodyCell("Bullet list", 3200, { bold: true, shaded: true }),
              bodyCell("- item", 3000, { shaded: true }),
              bodyCell("\u2022 item", 3160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Heading", 3200, { bold: true }),
              bodyCell("## Heading", 3000),
              bodyCell("Heading (level 2)", 3160),
            ]}),
            new TableRow({ children: [
              bodyCell("Block quote", 3200, { bold: true, shaded: true }),
              bodyCell("> quoted text", 3000, { shaded: true }),
              bodyCell("quoted text (indented)", 3160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Image", 3200, { bold: true }),
              bodyCell("![alt](image url)", 3000),
              bodyCell("Embedded image", 3160),
            ]}),
          ],
        }),

        new Paragraph({ spacing: { after: 120 }, children: [] }),

        bodyText("You can also upload images and files directly by dragging them into the editor or using the upload button in the toolbar."),

        subHeading("Following and Ignoring Topics"),

        bodyText("When you create a topic or reply to one, you automatically follow it and will receive notifications for new replies."),

        bodyText("To follow a topic without replying:"),

        numberedItem("Open the topic."),
        numberedItem("Click the Suivi dropdown in the topic toolbar."),
        numberedItem("Select Suivre to receive notifications for all new replies."),

        bodyText("To stop receiving notifications, open the same dropdown and select Ne plus suivre. To hide a topic entirely from your feed, select Ignorer."),

        subHeading("Voting on Posts"),

        bodyText("Each post has upvote and downvote buttons. Voting serves two purposes:"),

        bulletItem("Quality signal \u2014 ", "Highly voted posts surface as the most valued contributions within a discussion."),
        bulletItem("Reputation \u2014 ", "Upvotes contribute to the author\u2019s reputation score, visible on their profile. This helps the community identify experienced and helpful members."),

        divider(),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================================
        // 3. YOUR ACCOUNT
        // ============================================================
        sectionHeading("3. Your Account"),

        subHeading("Registration"),

        numberedItem("Visit the platform URL and click the registration button."),
        numberedItem("Provide a username, email address, and password."),
        numberedItem("A verification email will be sent. Click the link to activate your account."),
        numberedItem("Once logged in, complete your professional profile."),

        new Paragraph({ spacing: { after: 120 }, children: [] }),

        tipBox("Email verification is mandatory. You will not be able to post or send messages until your email is confirmed."),

        subHeading("Profile Setup"),

        bodyText("Click your avatar (top right) then Profile, then Edit. The following professional fields are available:"),

        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [3200, 6160],
          rows: [
            new TableRow({ children: [headerCell("Field", 3200), headerCell("Description", 6160)] }),
            new TableRow({ children: [
              bodyCell("Organisation", 3200, { bold: true }),
              bodyCell("Your affiliated organisation", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Titre / Fonction", 3200, { bold: true, shaded: true }),
              bodyCell("Your professional title or role", 6160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Type d\u2019organisation", 3200, { bold: true }),
              bodyCell("Consultant, public administration, NGO, university, or international organisation", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Domaines d\u2019expertise", 3200, { bold: true, shaded: true }),
              bodyCell("Multiple selection from 14 evaluation domains (health, education, environment, agriculture, governance, etc.)", 6160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("R\u00e9gion", 3200, { bold: true }),
              bodyCell("Your district within C\u00f4te d\u2019Ivoire (13 regions)", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Secteur d\u2019intervention", 3200, { bold: true, shaded: true }),
              bodyCell("Your primary sector of activity", 6160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Biographie professionnelle", 3200, { bold: true }),
              bodyCell("Free-form bio (visible only to logged-in members)", 6160),
            ]}),
          ],
        }),

        new Paragraph({ spacing: { after: 120 }, children: [] }),

        bodyText("You can also set a profile picture and cover image from your profile page. These are visible to all visitors."),

        subHeading("Online Status"),

        bodyText("Click your avatar and select a status to control your visibility:"),

        bulletItem("Online \u2014 ", "You appear as active to other members."),
        bulletItem("Away \u2014 ", "You appear as temporarily unavailable."),
        bulletItem("Do Not Disturb \u2014 ", "Notifications are suppressed."),
        bulletItem("Invisible \u2014 ", "You appear offline to others but can still use the platform normally."),

        subHeading("Password Reset"),

        numberedItem("On the login page, click \u201CForgot password.\u201D"),
        numberedItem("Enter your email address."),
        numberedItem("A reset link will be sent (valid for 2 hours)."),
        numberedItem("Click the link and set a new password."),

        subHeading("Notification Preferences"),

        bodyText("By default, the platform sends notifications for replies, mentions, quotes, and reactions. You can configure the delivery method for each type:"),

        numberedItem("Click your avatar, then Settings."),
        numberedItem("Go to the Notifications section."),
        numberedItem("For each notification type, choose:"),

        bulletItem("Immediate \u2014 ", "An email is sent as soon as the event occurs."),
        bulletItem("Daily digest \u2014 ", "A summary email sent once per day."),
        bulletItem("Weekly digest \u2014 ", "A summary email sent once per week."),
        bulletItem("Disabled \u2014 ", "No email for this type (on-platform notifications under the bell icon are always active)."),

        divider(),

        // ============================================================
        // 4. PRIVATE MESSAGING
        // ============================================================
        sectionHeading("4. Private Messaging"),

        bodyText("Members can exchange direct messages through the platform. Private messages are only visible to the participants in the conversation."),

        subHeading("Starting a Conversation"),

        numberedItem("Click the chat icon in the navigation bar."),
        numberedItem("Click the + button to start a new conversation."),
        numberedItem("Search for the member by username."),
        numberedItem("Type your message and send."),

        bodyText("You can also send a message directly from any member\u2019s profile page by clicking the Message button."),

        subHeading("Managing Conversations"),

        bulletItem("History \u2014 ", "All conversations are preserved and accessible via the chat icon."),
        bulletItem("Unread indicator \u2014 ", "A badge shows how many unread messages you have."),
        bulletItem("Search \u2014 ", "Use the search bar within the chat panel to find a past conversation."),

        divider(),

        // ============================================================
        // 5. SEARCH
        // ============================================================
        sectionHeading("5. Search"),

        bodyText("The search function is accessible via the magnifying glass icon in the navigation bar."),

        numberedItem("Click the magnifying glass or press the / key (keyboard shortcut)."),
        numberedItem("Type your search terms."),
        numberedItem("Results display matching topics and posts, ranked by relevance."),
        numberedItem("Use the filters to narrow results by category, author, or date range."),

        new Paragraph({ spacing: { after: 120 }, children: [] }),

        bodyText("Search covers topic titles, post content, and tags. To find members, use the Member Directory (Annuaire) under the Ressources menu instead."),

        divider(),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================================
        // 6. ROLES & GOVERNANCE
        // ============================================================
        sectionHeading("6. Roles & Governance"),

        bodyText("The platform uses a role-based access system that determines what each user can see and do. Understanding these roles is essential for both using the platform and administering it."),

        subHeading("User Roles"),

        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [2600, 6760],
          rows: [
            new TableRow({ children: [headerCell("Role", 2600), headerCell("Permissions", 6760)] }),
            new TableRow({ children: [
              bodyCell("Administrator", 2600, { bold: true }),
              bodyCell("Full platform control: system settings, category management, user management, plugin configuration, backups, email settings. Can perform all moderator actions across all categories.", 6760),
            ]}),
            new TableRow({ children: [
              bodyCell("Global Moderator", 2600, { bold: true, shaded: true }),
              bodyCell("Moderation powers across all categories: edit, move, lock, pin, and delete content. Manage the flag queue. Cannot access system settings or plugin configuration.", 6760, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Moderator", 2600, { bold: true }),
              bodyCell("Same moderation powers as Global Moderator, but limited to specific assigned categories.", 6760),
            ]}),
            new TableRow({ children: [
              bodyCell("Member", 2600, { bold: true, shaded: true }),
              bodyCell("Create topics, reply, vote, send private messages, upload documents, RSVP to events, follow topics, manage their own profile.", 6760, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Visitor (not logged in)", 2600, { bold: true }),
              bodyCell("Read-only access. Cannot post, message, vote, or access members-only content.", 6760),
            ]}),
          ],
        }),

        subHeading("How Roles Are Assigned"),

        bodyText("Administrators assign roles through the admin panel:"),

        numberedItem("Go to the admin panel (/admin)."),
        numberedItem("Navigate to Manage \u2192 Users."),
        numberedItem("Search for the user by name or email."),
        numberedItem("From the user\u2019s page, use the role controls to promote or demote."),

        bodyText("A user can be promoted to Moderator for specific categories, to Global Moderator for platform-wide moderation, or to Administrator for full control."),

        subHeading("Category Permissions"),

        bodyText("Each category has its own permission settings that control access at a granular level. Administrators can configure, per category, who can:"),

        bulletItem("View \u2014 ", "See the category and its topics (can be restricted to members only, or opened to visitors)."),
        bulletItem("Create topics \u2014 ", "Start new discussions in the category."),
        bulletItem("Reply \u2014 ", "Respond to existing topics."),
        bulletItem("Moderate \u2014 ", "Edit, move, lock, pin, or delete content within the category."),

        bodyText("To configure category permissions:"),

        numberedItem("Go to the admin panel, then Manage \u2192 Categories."),
        numberedItem("Click the category you want to configure."),
        numberedItem("Open the Privileges tab."),
        numberedItem("Set permissions per user group (e.g., registered users can post, guests can only view)."),

        new Paragraph({ spacing: { after: 120 }, children: [] }),

        tipBox("The Annonces category is typically restricted so that only administrators and moderators can create topics, while all members can read and reply."),

        subHeading("Content Lifecycle"),

        bodyText("Understanding how content flows through the platform helps both members and moderators:"),

        subSubHeading("Topics"),

        bulletItem("Created \u2014 ", "A member posts a new topic in a category. It immediately appears in the topic list."),
        bulletItem("Active \u2014 ", "Members reply, vote, and discuss. The topic rises in the listing with each new reply."),
        bulletItem("Pinned \u2014 ", "A moderator pins the topic to keep it at the top of the category. Pinning can have an expiry date, after which the topic returns to normal sorting."),
        bulletItem("Locked \u2014 ", "A moderator locks the topic. The content remains visible, but no new replies are allowed. Useful for concluded discussions or resolved questions."),
        bulletItem("Moved \u2014 ", "A moderator moves the topic to a more appropriate category. A redirect notice is left in the original category."),
        bulletItem("Deleted \u2014 ", "A moderator soft-deletes the topic. It becomes invisible to members but can be restored by an administrator. Purging (permanent deletion) is irreversible and reserved for administrators."),

        subSubHeading("Posts"),

        bulletItem("Published \u2014 ", "A reply is posted and immediately visible."),
        bulletItem("Edited \u2014 ", "The author or a moderator edits the post. An \u201Cedited\u201D indicator is shown."),
        bulletItem("Flagged \u2014 ", "Any member can flag a post for moderator review. The post remains visible while under review."),
        bulletItem("Deleted \u2014 ", "A moderator removes the post. It can be restored if needed."),

        divider(),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================================
        // 7. MODERATION
        // ============================================================
        sectionHeading("7. Moderation"),

        bodyText("This section is relevant for moderators and administrators responsible for maintaining content quality on the platform."),

        subHeading("Flagging Content (All Members)"),

        bodyText("Any logged-in member can flag a post they believe is inappropriate, off-topic, or in violation of community guidelines:"),

        numberedItem("Click the options menu (\u2026) under the post in question."),
        numberedItem("Select Flag."),
        numberedItem("Provide a brief reason for the flag."),
        numberedItem("The flag is submitted to the moderation queue for review."),

        subHeading("The Flag Queue"),

        bodyText("Moderators and administrators review flagged content through the flag queue:"),

        numberedItem("Access the flag queue from the moderation dashboard."),
        numberedItem("Each flag shows the reported post, the reporter, and the reason given."),
        numberedItem("Review the content in context by clicking through to the original topic."),
        numberedItem("Take action: dismiss the flag (if the content is acceptable), edit the post, delete the post, or warn/ban the author."),
        numberedItem("The flag is marked as resolved."),

        subHeading("Moderation Actions"),

        bodyText("The following actions are available to moderators on topics and posts:"),

        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [2400, 6960],
          rows: [
            new TableRow({ children: [headerCell("Action", 2400), headerCell("What It Does", 6960)] }),
            new TableRow({ children: [
              bodyCell("Edit", 2400, { bold: true }),
              bodyCell("Modify the content of a post. An \u201Cedited\u201D indicator is shown to readers.", 6960),
            ]}),
            new TableRow({ children: [
              bodyCell("Move", 2400, { bold: true, shaded: true }),
              bodyCell("Transfer a topic to a different category. A redirect notice is left in the original location.", 6960, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Lock", 2400, { bold: true }),
              bodyCell("Prevent new replies on a topic. Existing content remains visible.", 6960),
            ]}),
            new TableRow({ children: [
              bodyCell("Pin", 2400, { bold: true, shaded: true }),
              bodyCell("Fix a topic at the top of its category. Can be set with an expiry date (e.g., pin for 7 days).", 6960, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Delete", 2400, { bold: true }),
              bodyCell("Soft-delete: content is hidden from members but can be restored by an administrator.", 6960),
            ]}),
            new TableRow({ children: [
              bodyCell("Purge", 2400, { bold: true, shaded: true }),
              bodyCell("Permanent deletion. Irreversible. Available to administrators only.", 6960, { shaded: true }),
            ]}),
          ],
        }),

        subHeading("User Management"),

        bodyText("Administrators can manage users from the admin panel (Manage \u2192 Users):"),

        bulletItem("Search \u2014 ", "Find users by name, username, or email address."),
        bulletItem("Promote/demote \u2014 ", "Change a user\u2019s role (member, moderator, global moderator, administrator)."),
        bulletItem("Ban \u2014 ", "Temporarily or permanently suspend a user\u2019s access. Banned users cannot log in or post."),
        bulletItem("Delete \u2014 ", "Permanently remove an account. This action is irreversible."),

        subHeading("Audit Log"),

        bodyText("Every moderation and administrative action is recorded automatically. The audit log is accessible in the admin panel under Advanced \u2192 Events. Over 40 event types are tracked, including:"),

        bulletItem("Content changes \u2014 ", "Post edits, deletions, topic moves, pins, and locks."),
        bulletItem("User actions \u2014 ", "Bans, unbans, role changes, account deletions."),
        bulletItem("System changes \u2014 ", "Settings modifications, plugin activations, category changes."),

        bodyText("The audit log provides accountability and a complete history of who did what and when. It is an essential governance tool for the Ministry."),

        divider(),

        // ============================================================
        // 8. ADMINISTRATION
        // ============================================================
        sectionHeading("8. Administration"),

        bodyText("This section covers platform-wide settings that only administrators can access."),

        subHeading("Managing Categories"),

        bodyText("Administrators can create, edit, and reorganise discussion categories:"),

        numberedItem("Go to the admin panel (/admin), then Manage \u2192 Categories."),
        numberedItem("To create a category: click Add Category, provide a name, description, and icon."),
        numberedItem("To edit: click an existing category and adjust its settings (name, description, permissions, colour)."),
        numberedItem("To reorder: drag and drop categories into the desired order."),
        numberedItem("To set permissions: open the Privileges tab within a category to control who can view, post, and moderate."),

        subHeading("Email Configuration"),

        bodyText("The platform sends emails for account verification, password resets, and notification digests. Email delivery is configured through the admin panel:"),

        numberedItem("Go to Settings \u2192 Email in the admin panel."),
        numberedItem("Enable the SMTP transport."),
        numberedItem("Enter the SMTP server credentials (host, port, username, password, security mode)."),
        numberedItem("Set the sender address (e.g., noreply@your-domain.ci)."),
        numberedItem("Send a test email to verify the configuration."),

        subHeading("Platform Settings"),

        bodyText("Key settings available in the admin panel:"),

        bulletItem("Site title and description \u2014 ", "Displayed in the browser tab and in search engine results."),
        bulletItem("Registration settings \u2014 ", "Control whether registration is open, requires admin approval, or is invitation-only."),
        bulletItem("Default language \u2014 ", "The platform defaults to French; users can individually switch to English in their settings."),
        bulletItem("User settings \u2014 ", "Minimum password length, username rules, default notification preferences."),
        bulletItem("Post settings \u2014 ", "Minimum/maximum post length, allowed file types for uploads, rate limits."),

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

const outputPath = path.join(__dirname, "guide-fondations.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document written to ${outputPath}`);
}).catch(err => {
  console.error("Error generating document:", err);
  process.exit(1);
});
