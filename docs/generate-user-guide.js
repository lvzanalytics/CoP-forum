const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, ExternalHyperlink,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TabStopType, TabStopPosition, TableOfContents,
} = require("docx");

// ============================================================
// BRAND & LAYOUT CONSTANTS
// ============================================================

const TEAL = "2D6A4F";
const DARK = "333333";
const GRAY = "666666";
const LIGHT_GRAY = "F5F5F5";
const BORDER_COLOR = "CCCCCC";

const PAGE_WIDTH = 12240;
const PAGE_HEIGHT = 15840;
const MARGIN = 1440;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

// ============================================================
// REUSABLE HELPERS
// ============================================================

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
                new TextRun({ text: "Tip: ", bold: true, font: "Arial", size: 22, color: TEAL }),
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

function spacer() {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ============================================================
// PART 1: COVER PAGE + INTRODUCTION + GETTING STARTED
// ============================================================

function buildPart1() {
  return [
    // Title
    new Paragraph({
      spacing: { before: 600, after: 80 },
      children: [new TextRun({ text: "Platform User Guide", font: "Arial", size: 48, bold: true, color: TEAL })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: "Communaut\u00e9 de Pratique \u2014 \u00c9valuation des Politiques Publiques", font: "Arial", size: 30, color: DARK })],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [new TextRun({ text: "A practical guide for navigating and using the platform", font: "Arial", size: 24, color: GRAY, italics: true })],
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
            children: [new Paragraph({ children: [new TextRun({ text: "Minist\u00e8re du Plan et du D\u00e9veloppement", font: "Arial", size: 22, color: DARK })] })] }),
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

    // About this guide
    bodyText("This guide is written for all users of the Community of Practice (CoP) platform \u2014 from first-time visitors and community members to moderators and Ministry administrators. It walks through every feature of the platform with step-by-step instructions. No technical knowledge is required."),

    bodyText("The guide is organised from general to specific: it begins with how to access and navigate the platform, then covers each major feature area (discussions, documents, directory, events, AI tools), and concludes with sections dedicated to moderators and administrators."),

    pageBreak(),

    // ============================================================
    // 1. GETTING STARTED
    // ============================================================
    sectionHeading("1. Getting Started"),

    subHeading("Accessing the Platform"),

    bodyText("Open a web browser (Chrome, Firefox, Safari, or Edge on desktop or mobile) and navigate to the platform URL. The homepage will load with a welcome banner, an overview of the community\u2019s purpose, and buttons to join or sign in."),

    bodyText("Visitors who are not logged in can browse public discussions and documents but cannot post, message other members, or access members-only content."),

    subHeading("Creating an Account"),

    numberedItem("Click \u201CRejoindre la Communaut\u00e9\u201D (Join the Community) on the homepage, or click the registration button in the top-right corner."),
    numberedItem("Provide a username, email address, and password."),
    numberedItem("A verification email will be sent to the address you provided. Open the email and click the confirmation link."),
    numberedItem("Once verified, log in with your username and password."),

    spacer(),
    tipBox("Email verification is mandatory. You will not be able to post, send messages, or access members-only content until your email is confirmed."),

    subHeading("Logging In"),

    numberedItem("Click the \u201CConnexion\u201D (Sign In) button in the top-right corner of any page."),
    numberedItem("Enter your username (or email) and password."),
    numberedItem("Click \u201CConnexion\u201D to access your account."),

    subHeading("Resetting Your Password"),

    bodyText("If you forget your password:"),

    numberedItem("On the login page, click \u201CMot de passe oubli\u00e9\u201D (Forgot password)."),
    numberedItem("Enter the email address associated with your account."),
    numberedItem("A reset link will be sent by email. The link is valid for 2 hours."),
    numberedItem("Click the link and set a new password."),

    divider(),

    pageBreak(),

    // ============================================================
    // 2. NAVIGATING THE PLATFORM
    // ============================================================
    sectionHeading("2. Navigating the Platform"),

    bodyText("A fixed navigation bar appears at the top of every page. It provides access to all areas of the platform and adapts to your screen size."),

    subHeading("Main Menu"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [2800, 6560],
      rows: [
        new TableRow({ children: [headerCell("Menu Item", 2800), headerCell("What It Contains", 6560)] }),
        new TableRow({ children: [
          bodyCell("Accueil", 2800, { bold: true }),
          bodyCell("The homepage \u2014 a landing page with an overview of the community, its purpose, and quick links to key areas.", 6560),
        ]}),
        new TableRow({ children: [
          bodyCell("Espaces", 2800, { bold: true, shaded: true }),
          bodyCell("A dropdown listing the four discussion categories: Annonces, Discussions G\u00e9n\u00e9rales, M\u00e9thodologie & Outils, and \u00c9v\u00e9nements. Each entry shows an icon and brief description.", 6560, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Ressources", 2800, { bold: true }),
          bodyCell("A dropdown with four links: Rencontres (events and meetings), Documents (the document library), Annuaire (member directory), and R\u00e9cents (recent activity across all categories).", 6560),
        ]}),
      ],
    }),

    spacer(),

    subHeading("Top-Right Icons"),

    bodyText("When logged in, the right side of the navigation bar displays four icons:"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [2800, 6560],
      rows: [
        new TableRow({ children: [headerCell("Icon", 2800), headerCell("Function", 6560)] }),
        new TableRow({ children: [
          bodyCell("Magnifying glass", 2800, { bold: true }),
          bodyCell("Opens the search page. You can search across all topics, posts, and tags.", 6560),
        ]}),
        new TableRow({ children: [
          bodyCell("Bell", 2800, { bold: true, shaded: true }),
          bodyCell("Shows your unread notifications \u2014 replies to your topics, mentions of your name, reactions to your posts, and document approval alerts.", 6560, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Chat bubble", 2800, { bold: true }),
          bodyCell("Opens your private messages. A badge shows the count of unread messages.", 6560),
        ]}),
        new TableRow({ children: [
          bodyCell("Your avatar", 2800, { bold: true, shaded: true }),
          bodyCell("Opens a menu with links to your profile, account settings, online status, bookmarks, and sign-out.", 6560, { shaded: true }),
        ]}),
      ],
    }),

    subHeading("Mobile Navigation"),

    bodyText("On phones and small tablets, the full menu is replaced by a hamburger icon (\u2261) in the top-left corner. Tapping it opens a drawer that lists all navigation items: Home, Rencontres, Documents, Annuaire, R\u00e9cents, and all discussion categories. Tapping any link closes the drawer and navigates to that page."),

    subHeading("The Homepage"),

    bodyText("The homepage serves as the entry point to the platform. It is divided into several visual sections:"),

    bulletItem("Hero banner \u2014 ", "A large welcome area with the platform\u2019s title, a short description of the community\u2019s mission, and two buttons: \u201CRejoindre la Communaut\u00e9\u201D (register) and \u201CD\u00e9couvrir la plateforme\u201D (browse)."),
    bulletItem("Activity overview \u2014 ", "Three cards highlighting the expert directory, an upcoming event, and a platform feature."),
    bulletItem("Dialogue Spaces \u2014 ", "A section introducing the discussion forums, with a link to browse them."),
    bulletItem("Intelligent Library \u2014 ", "A section introducing the document library and its AI-powered summaries, with a link to browse documents."),
    bulletItem("Role cards \u2014 ", "Four cards describing how different professionals (policy makers, researchers, evaluators, students) can benefit from the platform."),
    bulletItem("Call to action \u2014 ", "A registration prompt for visitors who have not yet joined."),
    bulletItem("Partners \u2014 ", "Logos of partner organisations (CLEAR FA, AFD, CESAG, GEI)."),

    divider(),

    pageBreak(),

    // ============================================================
    // 3. YOUR ACCOUNT
    // ============================================================
    sectionHeading("3. Your Account"),

    subHeading("Setting Up Your Profile"),

    bodyText("Once logged in, complete your professional profile so that other members and the directory can display your information correctly."),

    numberedItem("Click your avatar in the top-right corner, then select your username to open your profile page."),
    numberedItem("Click \u201CEdit\u201D to open the profile editor."),
    numberedItem("Fill in the standard fields: display name, profile picture, and cover image."),
    numberedItem("Scroll down to find the professional fields listed below. Fill in as many as possible \u2014 these appear in the member directory and help other professionals find you."),

    spacer(),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [3200, 6160],
      rows: [
        new TableRow({ children: [headerCell("Field", 3200), headerCell("Description", 6160)] }),
        new TableRow({ children: [
          bodyCell("Organisation", 3200, { bold: true }),
          bodyCell("Your affiliated organisation (e.g. ministry, consulting firm, university).", 6160),
        ]}),
        new TableRow({ children: [
          bodyCell("Titre / Fonction", 3200, { bold: true, shaded: true }),
          bodyCell("Your professional title or role (e.g. \u201CCharg\u00e9 d\u2019\u00e9valuation\u201D, \u201CDirecteur de programme\u201D).", 6160, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Type d\u2019organisation", 3200, { bold: true }),
          bodyCell("Select one: Consultant, Administration publique, ONG, Universit\u00e9, or Organisation internationale.", 6160),
        ]}),
        new TableRow({ children: [
          bodyCell("Domaines d\u2019expertise", 3200, { bold: true, shaded: true }),
          bodyCell("Select one or more from 14 evaluation domains (e.g. Sant\u00e9, \u00c9ducation, Environnement, Gouvernance). Multiple selections are allowed.", 6160, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("R\u00e9gion", 3200, { bold: true }),
          bodyCell("Your district within C\u00f4te d\u2019Ivoire (e.g. District d\u2019Abidjan, Yamoussoukro, Bouak\u00e9). 14 regions available.", 6160),
        ]}),
        new TableRow({ children: [
          bodyCell("Secteur d\u2019intervention", 3200, { bold: true, shaded: true }),
          bodyCell("Your primary sector of activity (e.g. Sant\u00e9, Agriculture, \u00c9nergie). 11 sectors available.", 6160, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Biographie professionnelle", 3200, { bold: true }),
          bodyCell("A free-form professional biography. This field is visible only to logged-in members.", 6160),
        ]}),
      ],
    }),

    subHeading("Online Status"),

    bodyText("You can set your online status by clicking your avatar and selecting one of the following:"),

    bulletItem("Online \u2014 ", "You appear as active to other members."),
    bulletItem("Away \u2014 ", "You appear as temporarily unavailable."),
    bulletItem("Do Not Disturb \u2014 ", "Notifications are suppressed."),
    bulletItem("Invisible \u2014 ", "You appear offline to others but can still use the platform normally."),

    subHeading("Notification Preferences"),

    bodyText("The platform notifies you about replies, mentions, reactions, and more. You can control how these notifications reach you:"),

    numberedItem("Click your avatar, then Settings."),
    numberedItem("Go to the Notifications section."),
    numberedItem("For each notification type, choose a delivery method:"),

    bulletItem("Immediate \u2014 ", "An email is sent as soon as the event occurs."),
    bulletItem("Daily digest \u2014 ", "A summary email sent once per day."),
    bulletItem("Weekly digest \u2014 ", "A summary email sent once per week."),
    bulletItem("Disabled \u2014 ", "No email is sent. You will still see in-platform notifications under the bell icon."),

    spacer(),
    tipBox("In-platform notifications (under the bell icon) are always active regardless of your email settings. You will never miss an important event as long as you visit the platform."),

    divider(),
  ];
}

// ============================================================
// PART 2: DISCUSSION SPACES + DOCUMENT LIBRARY
// ============================================================

function buildPart2() {
  return [
    pageBreak(),

    // ============================================================
    // 4. DISCUSSION SPACES
    // ============================================================
    sectionHeading("4. Discussion Spaces"),

    bodyText("The forum is the core of the platform. Discussions are organised into four categories, each accessible from the Espaces dropdown menu:"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [3000, 6360],
      rows: [
        new TableRow({ children: [headerCell("Category", 3000), headerCell("Purpose", 6360)] }),
        new TableRow({ children: [
          bodyCell("Annonces", 3000, { bold: true }),
          bodyCell("Official communications from the Ministry and community leadership. Only administrators and moderators can create topics here; all members can read and reply.", 6360),
        ]}),
        new TableRow({ children: [
          bodyCell("Discussions G\u00e9n\u00e9rales", 3000, { bold: true, shaded: true }),
          bodyCell("Open exchanges between members on any topic related to public policy evaluation.", 6360, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("M\u00e9thodologie & Outils", 3000, { bold: true }),
          bodyCell("Focused conversations about evaluation methods, frameworks, analytical tools, and lessons learned from fieldwork.", 6360),
        ]}),
        new TableRow({ children: [
          bodyCell("\u00c9v\u00e9nements", 3000, { bold: true, shaded: true }),
          bodyCell("Discussions linked to meetings, webinars, and training sessions. When an event is created on the platform, a discussion topic is automatically posted here.", 6360, { shaded: true }),
        ]}),
      ],
    }),

    subHeading("The Categories Hub"),

    bodyText("When you click Espaces or navigate to the categories page, you see the categories hub. This page shows:"),

    bulletItem("Channel cards \u2014 ", "Each category appears as a card with its icon, name, description, number of topics and posts, and the time of the most recent activity."),
    bulletItem("Sidebar widgets \u2014 ", "On the right side (desktop) or below (mobile), you will find widgets showing upcoming events, recent documents, and (if you have been away) an AI-generated activity summary."),

    subHeading("Browsing a Category"),

    bodyText("Click a category card to view its topics. The topic list shows, for each topic:"),

    bulletItem("Title \u2014 ", "The subject of the discussion. Click it to open."),
    bulletItem("Labels \u2014 ", "Small badges such as \u00c9pingl\u00e9 (pinned to the top by a moderator), Verrouill\u00e9 (locked \u2014 no new replies), or Suivi (you are following this topic)."),
    bulletItem("Reply count and views \u2014 ", "How many responses the topic has received and how often it has been viewed."),
    bulletItem("Last activity \u2014 ", "Who replied most recently and when."),

    bodyText("Above the topic list you will find:"),

    bulletItem("Tag filter \u2014 ", "Filter topics by keyword tags."),
    bulletItem("Sort options \u2014 ", "Sort by recent replies, newest topics, most popular, and more."),
    bulletItem("Nouveau sujet \u2014 ", "A button to create a new topic (visible if you have permission to post in this category)."),

    subHeading("Creating a Topic"),

    numberedItem("Navigate to the category where you want to start a discussion."),
    numberedItem("Click the Nouveau sujet button (green button, typically at the top right)."),
    numberedItem("Enter a clear, descriptive title."),
    numberedItem("Write your message in the editor. The editor supports text formatting (see the formatting reference below)."),
    numberedItem("Optionally, add tags \u2014 keywords that help others find your topic via search and filters."),
    numberedItem("Click Publier to post the topic."),

    subHeading("Replying to a Topic"),

    numberedItem("Open the topic you want to respond to."),
    numberedItem("Click the R\u00e9pondre button."),
    numberedItem("Write your response in the editor."),
    numberedItem("Click Publier to post your reply."),

    bodyText("Additional reply options:"),

    bulletItem("Quote \u2014 ", "Click the quote icon under any post to reply with a citation of that message, preserving context in long discussions."),
    bulletItem("@mention \u2014 ", "Type @ followed by a username (e.g. @jean) to notify that member directly. A dropdown will suggest matching names as you type."),

    subHeading("Formatting Your Messages"),

    bodyText("The editor supports Markdown syntax for formatting:"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [3200, 3000, 3160],
      rows: [
        new TableRow({ children: [headerCell("Format", 3200), headerCell("What You Type", 3000), headerCell("What You See", 3160)] }),
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
          bodyCell("clickable link", 3160),
        ]}),
        new TableRow({ children: [
          bodyCell("Bullet list", 3200, { bold: true, shaded: true }),
          bodyCell("- item", 3000, { shaded: true }),
          bodyCell("\u2022 item", 3160, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Heading", 3200, { bold: true }),
          bodyCell("## Heading", 3000),
          bodyCell("Section heading", 3160),
        ]}),
        new TableRow({ children: [
          bodyCell("Block quote", 3200, { bold: true, shaded: true }),
          bodyCell("> quoted text", 3000, { shaded: true }),
          bodyCell("indented quote", 3160, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Image", 3200, { bold: true }),
          bodyCell("![alt](image url)", 3000),
          bodyCell("embedded image", 3160),
        ]}),
      ],
    }),

    spacer(),
    bodyText("You can also upload images and files by dragging them into the editor or clicking the upload button in the toolbar."),

    subHeading("Following and Ignoring Topics"),

    bodyText("When you create a topic or reply to one, you automatically follow it and will receive notifications for new replies. To follow a topic without replying:"),

    numberedItem("Open the topic."),
    numberedItem("Click the Suivi dropdown in the topic toolbar."),
    numberedItem("Select Suivre to receive notifications for all new replies."),

    bodyText("To stop receiving notifications, open the same dropdown and select Ne plus suivre. To hide a topic from your feed entirely, select Ignorer."),

    subHeading("Voting on Posts"),

    bodyText("Each post has upvote and downvote buttons. Voting serves two purposes:"),

    bulletItem("Quality signal \u2014 ", "Highly voted posts surface as the most valued contributions within a discussion."),
    bulletItem("Reputation \u2014 ", "Upvotes contribute to the author\u2019s reputation score, visible on their profile. This helps the community identify experienced and helpful members."),

    subHeading("Search"),

    bodyText("To search for topics, posts, or tags:"),

    numberedItem("Click the magnifying glass icon in the navigation bar."),
    numberedItem("Type your search terms."),
    numberedItem("Results display matching topics and posts, ranked by relevance."),
    numberedItem("Use the filters on the results page to narrow by category, author, or date range."),

    spacer(),
    tipBox("Search covers topic titles, post content, and tags. To find members, use the Member Directory (Annuaire) under the Ressources menu instead."),

    subHeading("Private Messaging"),

    bodyText("Members can exchange direct messages through the platform. Messages are private and visible only to the participants."),

    numberedItem("Click the chat icon in the navigation bar."),
    numberedItem("Click the + button to start a new conversation."),
    numberedItem("Search for the member by username."),
    numberedItem("Type your message and send."),

    bodyText("You can also send a message directly from any member\u2019s profile page by clicking the Message button. All conversations are preserved and accessible via the chat icon at any time."),

    divider(),

    pageBreak(),

    // ============================================================
    // 5. DOCUMENT LIBRARY
    // ============================================================
    sectionHeading("5. Document Library"),

    bodyText("The document library is a structured repository for evaluation resources \u2014 reports, methodological tools, policy documents, case studies, and training materials. It is accessible via the Ressources \u2192 Documents menu."),

    subHeading("Browsing Documents"),

    bodyText("The library page displays all approved documents as a grid of cards. Each card shows:"),

    bulletItem("File type icon \u2014 ", "Indicates the document format (PDF, Word, Excel, etc.)."),
    bulletItem("Category badge \u2014 ", "One of five categories: Rapports, Outils, Documents de Politique, \u00c9tudes de Cas, or Formation."),
    bulletItem("Title and author \u2014 ", "The document\u2019s title (up to two lines) and the name of the author."),
    bulletItem("Description \u2014 ", "A brief summary of the document\u2019s content (up to three lines)."),
    bulletItem("Tags \u2014 ", "Keyword labels to help with searching and filtering."),
    bulletItem("AI summary snippet \u2014 ", "If an AI summary has been generated, a brief excerpt appears on the card."),
    bulletItem("Download count \u2014 ", "How many times the document has been downloaded."),

    subHeading("Searching and Filtering"),

    bodyText("Above the document grid, a toolbar lets you narrow the list:"),

    bulletItem("Search bar \u2014 ", "Type keywords to search across document titles, descriptions, and author names."),
    bulletItem("Category filter \u2014 ", "Select a specific category (Rapports, Outils, etc.) to show only documents of that type."),
    bulletItem("Region filter \u2014 ", "Show only documents associated with a specific region of C\u00f4te d\u2019Ivoire."),
    bulletItem("Sector filter \u2014 ", "Show only documents from a specific sector (e.g. Sant\u00e9, \u00c9ducation)."),
    bulletItem("Sort \u2014 ", "Order results by newest, oldest, or most downloaded."),

    subHeading("Viewing a Document"),

    bodyText("Click a document card to open the detail page. This page includes:"),

    bulletItem("Document header \u2014 ", "The title, author, date, category badge, and status indicator."),
    bulletItem("Download button \u2014 ", "Click to download the file to your device. The download counter increments automatically."),
    bulletItem("Preview panel \u2014 ", "PDF documents display an embedded preview directly in the browser. Images display in a lightbox (click to view full-screen). Other file types show a placeholder with the download button."),
    bulletItem("Description \u2014 ", "The full description provided by the uploader."),
    bulletItem("AI Summary \u2014 ", "If available, a 3\u20135 sentence AI-generated summary of the document\u2019s content appears in a dedicated panel. Moderators and administrators see a button to generate or regenerate the summary."),
    bulletItem("Version history \u2014 ", "If the document has been updated, a timeline shows each version with its upload date, the person who uploaded it, and any notes. Downloads always provide the most recent version."),
    bulletItem("Details sidebar \u2014 ", "On desktop, a collapsible sidebar on the right shows file metadata: size, format, upload date, tags, region, sector, source organisation, and language."),

    subHeading("Uploading a Document"),

    bodyText("Any logged-in member can upload documents to the library:"),

    numberedItem("Navigate to Documents and click T\u00e9l\u00e9verser un document (Upload a document)."),
    numberedItem("Select the file from your device. Accepted formats: PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), and images (JPG, PNG). Maximum file size: 20 MB."),
    numberedItem("Fill in the required fields:"),

    bulletItem("Title \u2014 ", "A clear, descriptive title for the document."),
    bulletItem("Author \u2014 ", "The name of the person or organisation that produced the document."),
    bulletItem("Date \u2014 ", "The date associated with the document."),
    bulletItem("Description \u2014 ", "A summary of at least 50 characters explaining the document\u2019s content."),
    bulletItem("Category \u2014 ", "Select one of the five categories."),
    bulletItem("Tags \u2014 ", "Add keywords to help others find the document."),

    numberedItem("Optionally fill in the additional fields: region, sector, source organisation, publication date, language, and access level."),
    numberedItem("Click Publier (Submit)."),

    spacer(),
    tipBox("By default, uploaded documents enter a moderation queue and must be approved by a moderator or administrator before they appear in the library. Some categories may be configured for automatic approval."),

    subHeading("Access Levels"),

    bodyText("Each document has an access level that controls who can view and download it:"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [2800, 6560],
      rows: [
        new TableRow({ children: [headerCell("Level", 2800), headerCell("Who Can Access", 6560)] }),
        new TableRow({ children: [
          bodyCell("Public", 2800, { bold: true }),
          bodyCell("Anyone, including visitors who are not logged in.", 6560),
        ]}),
        new TableRow({ children: [
          bodyCell("Members", 2800, { bold: true, shaded: true }),
          bodyCell("Only logged-in members of the platform.", 6560, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Moderators", 2800, { bold: true }),
          bodyCell("Only global moderators and administrators.", 6560),
        ]}),
        new TableRow({ children: [
          bodyCell("Admin", 2800, { bold: true, shaded: true }),
          bodyCell("Administrators only.", 6560, { shaded: true }),
        ]}),
      ],
    }),

    subHeading("Your Documents"),

    bodyText("To see all documents you have uploaded, click Mes documents (My Documents) on the library page. This page shows your documents with their current status:"),

    bulletItem("Pending \u2014 ", "The document is awaiting moderator review."),
    bulletItem("Approved \u2014 ", "The document is live and visible in the library."),
    bulletItem("Rejected \u2014 ", "The document was not approved. A rejection reason may be provided."),

    bodyText("You can filter by status using the tabs at the top of the page."),

    subHeading("Uploading a New Version"),

    bodyText("If a document needs to be updated with a new file (for example, a revised report), you do not need to upload a separate document. Instead:"),

    numberedItem("Open the document\u2019s detail page."),
    numberedItem("Scroll down to the version section."),
    numberedItem("Select the updated file and optionally add a note describing the changes."),
    numberedItem("Submit the new version."),

    bodyText("The previous version is preserved in the version history. Downloads will automatically serve the most recent version."),

    divider(),
  ];
}

// ============================================================
// PART 3: MEMBER DIRECTORY + EVENTS + AI FEATURES
// ============================================================

function buildPart3() {
  return [
    pageBreak(),

    // ============================================================
    // 6. MEMBER DIRECTORY
    // ============================================================
    sectionHeading("6. Member Directory"),

    bodyText("The member directory lets you find and connect with other evaluation professionals. It is accessible via the Ressources \u2192 Annuaire menu."),

    subHeading("Browsing the Directory"),

    bodyText("The directory displays members as a grid of cards. Each card shows the member\u2019s avatar, name, organisation, professional title, region, sector, and areas of expertise (displayed as tags). Click \u201CVoir le profil\u201D on any card to view the full profile."),

    subHeading("Searching for Members"),

    bodyText("Use the search bar at the top of the directory to find members by name, organisation, professional title, or biography. The search matches any part of the text (you do not need to type the full name)."),

    subHeading("Filtering"),

    bodyText("Four dropdown filters are available below the search bar:"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [3200, 6160],
      rows: [
        new TableRow({ children: [headerCell("Filter", 3200), headerCell("What It Filters By", 6160)] }),
        new TableRow({ children: [
          bodyCell("Domaine d\u2019expertise", 3200, { bold: true }),
          bodyCell("The member\u2019s declared areas of evaluation expertise (e.g. Sant\u00e9, Gouvernance, Agriculture).", 6160),
        ]}),
        new TableRow({ children: [
          bodyCell("R\u00e9gion", 3200, { bold: true, shaded: true }),
          bodyCell("The member\u2019s district within C\u00f4te d\u2019Ivoire.", 6160, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Secteur d\u2019intervention", 3200, { bold: true }),
          bodyCell("The member\u2019s primary sector of professional activity.", 6160),
        ]}),
        new TableRow({ children: [
          bodyCell("Type d\u2019organisation", 3200, { bold: true, shaded: true }),
          bodyCell("The kind of organisation the member belongs to (Consultant, Administration publique, ONG, Universit\u00e9, Organisation internationale).", 6160, { shaded: true }),
        ]}),
      ],
    }),

    spacer(),
    bodyText("Selecting a value in any filter immediately refreshes the results. Filters can be combined (e.g. show only consultants in the health sector from the Abidjan district). You can also sort results by name or by most recently joined."),

    subHeading("Opting Out of the Directory"),

    bodyText("If you prefer not to appear in the directory:"),

    numberedItem("Navigate to the directory page (Ressources \u2192 Annuaire)."),
    numberedItem("At the top of the page, find the checkbox labelled \u201CNe pas appara\u00eetre dans l\u2019annuaire\u201D."),
    numberedItem("Check the box. Your card will immediately disappear from the directory."),
    numberedItem("To reappear, uncheck the box."),

    spacer(),
    tipBox("Opting out of the directory does not affect your account or your ability to participate in discussions. It only removes your card from the directory listing."),

    subHeading("Contacting a Member"),

    bodyText("From a member\u2019s profile page, you can click the chat button to start a private conversation. You can also navigate to their profile from the directory by clicking \u201CVoir le profil\u201D on their card."),

    subHeading("Privacy"),

    bodyText("Profile field visibility is controlled by the administrator. Some fields (such as the professional biography) may be visible only to logged-in members. Administrators and moderators can always see all fields. You can see all your own fields on your own profile regardless of visibility settings."),

    divider(),

    pageBreak(),

    // ============================================================
    // 7. EVENTS & MEETINGS
    // ============================================================
    sectionHeading("7. Events & Meetings"),

    bodyText("The events system lets administrators organise and announce meetings, webinars, and workshops. Members can browse upcoming and past events, RSVP, join virtual meetings, and add events to their personal calendars. The events section is accessible via Ressources \u2192 Rencontres."),

    subHeading("List View"),

    bodyText("The default view shows events as a list of cards. Each card displays:"),

    bulletItem("Date block \u2014 ", "The day and month (e.g. 15 MAI) in a coloured badge on the left."),
    bulletItem("Title and description \u2014 ", "The event\u2019s name and a brief description (up to two lines)."),
    bulletItem("Sector badge \u2014 ", "The event\u2019s sector (e.g. M\u00e9thodologie, Formation, Politique, \u00c9tude de cas)."),
    bulletItem("Region \u2014 ", "The location or region associated with the event."),
    bulletItem("Time \u2014 ", "The start time (and end time if set)."),
    bulletItem("Banner image \u2014 ", "On desktop, a banner image appears on the right side of the card."),

    bodyText("Above the list, you will find:"),

    bulletItem("Search bar \u2014 ", "Search events by title or description."),
    bulletItem("Region and sector filters \u2014 ", "Narrow the list by geographic area or thematic sector."),
    bulletItem("Upcoming / Past tabs \u2014 ", "Switch between future and past events."),
    bulletItem("List / Calendar toggle \u2014 ", "Switch between list view and calendar view."),

    subHeading("Calendar View"),

    bodyText("Click the Calendrier tab to switch to a month-view calendar. Each day cell that has one or more events shows a coloured dot indicator. Navigate between months using the left and right arrow buttons at the top of the calendar."),

    spacer(),
    tipBox("Hover over a day with an event indicator to see the event titles in a tooltip."),

    subHeading("Event Detail Page"),

    bodyText("Click on an event card (or a day in the calendar) to open the event detail page. This page includes:"),

    bulletItem("Hero banner \u2014 ", "A large banner image (if uploaded) with the event title, date, time, and location displayed over a gradient overlay."),
    bulletItem("\u201CRejoindre la r\u00e9union\u201D button \u2014 ", "A prominent button linking directly to the Zoom, Teams, or other meeting link. Opens in a new browser tab."),
    bulletItem("\u201CS\u2019inscrire\u201D button \u2014 ", "If a registration link was provided, a separate button appears to register for the event."),
    bulletItem("Description \u2014 ", "The full event description, which may include an agenda, speaker list, and other details. Supports Markdown formatting."),
    bulletItem("Discussion link \u2014 ", "A link to the automatically created discussion topic in the \u00c9v\u00e9nements category, where members can discuss the event before and after it takes place."),

    bodyText("On the right sidebar (desktop) or below the description (mobile), you will find:"),

    bulletItem("RSVP button \u2014 ", "Click \u201CParticiper\u201D to indicate that you plan to attend. The participant count updates immediately. Click again to cancel your RSVP. You must be logged in to RSVP."),
    bulletItem("Timezone \u2014 ", "Events use the Africa/Abidjan timezone (WAT, which is UTC+0)."),
    bulletItem("Social sharing \u2014 ", "Share the event on LinkedIn, Twitter/X, or Facebook using the share buttons."),
    bulletItem("Add to calendar \u2014 ", "Click \u201CAjouter au calendrier\u201D to download a .ics file. Open this file to add the event to Outlook, Google Calendar, or Apple Calendar."),
    bulletItem("Organiser \u2014 ", "A card showing the avatar and username of the person who created the event."),

    subHeading("How Events Connect to Discussions"),

    bodyText("When an administrator creates an event, the platform automatically posts a discussion topic in the \u00c9v\u00e9nements category. This topic includes the event\u2019s date, time, location, and meeting link. Members can use this discussion thread to ask questions before the event, share notes during the event, or follow up afterwards. If the event is edited, the discussion topic is updated to reflect the changes. If the event is deleted, the associated topic is also removed."),

    divider(),

    pageBreak(),

    // ============================================================
    // 8. AI-POWERED FEATURES
    // ============================================================
    sectionHeading("8. AI-Powered Features"),

    bodyText("The platform includes artificial intelligence features that help members save time by summarising long discussions, documents, and recent activity. All AI-generated summaries are in French and are written in a professional, factual tone."),

    spacer(),
    tipBox("AI features use an external AI provider (configurable by the administrator). Only the text content of discussions and documents is sent to the AI service \u2014 no personal information such as usernames, emails, or profile data is transmitted."),

    subHeading("Discussion Summaries"),

    bodyText("Long discussion threads can be summarised into a concise overview. Here is how it works:"),

    numberedItem("Open a discussion topic that has received several replies."),
    numberedItem("Look for the AI Summary section near the top of the topic page, below the topic title and tags."),
    numberedItem("If a cached summary exists, you will see a preview (the first few lines). Click \u201CLire le r\u00e9sum\u00e9 complet\u201D (Read full summary) to view the full text in a popup window."),
    numberedItem("If no summary exists and the topic meets the minimum reply threshold, administrators and moderators will see a \u201CR\u00e9sumer cette discussion\u201D (Summarise this discussion) button. Click it to generate a summary."),
    numberedItem("A loading indicator appears while the AI processes the content (typically 3\u20138 seconds). Once complete, the summary appears."),

    bodyText("How summaries work behind the scenes:"),

    bulletItem("Minimum replies \u2014 ", "Regular members only see the summary button when a topic has at least 15 replies (this threshold is configurable by administrators). Administrators and moderators can generate summaries for any topic regardless of reply count."),
    bulletItem("Caching \u2014 ", "Once generated, a summary is cached for 12 hours. During this time, all members see the same cached summary without needing to regenerate it."),
    bulletItem("Automatic refresh \u2014 ", "If 10 or more new replies are posted after a summary was generated, the cache is automatically invalidated, and a new summary can be generated."),
    bulletItem("Daily limit \u2014 ", "Each member can generate up to 5 AI summaries per day across all features. This limit is configurable by administrators."),

    subHeading("Document Summaries"),

    bodyText("Documents in the library can receive AI-generated summaries that describe the document\u2019s objective, scope, main conclusions, and target audience in 3\u20135 sentences."),

    bulletItem("Automatic generation \u2014 ", "When a moderator approves a newly uploaded document, the platform automatically generates an AI summary. This happens in the background and requires no action from the user."),
    bulletItem("Manual generation \u2014 ", "For documents that were uploaded before the AI feature was activated, or when a summary needs to be regenerated, moderators and administrators can click the \u201CG\u00e9n\u00e9rer le r\u00e9sum\u00e9\u201D (Generate summary) button on the document detail page."),
    bulletItem("Progress indicator \u2014 ", "During generation, a three-step progress indicator appears: extraction (reading the document), analysis (processing the content), and generation (writing the summary). Time estimates are shown based on the file size."),
    bulletItem("Version updates \u2014 ", "When a new version of a document is uploaded, the existing summary is automatically cleared so that a fresh summary can be generated for the updated content."),
    bulletItem("Visibility \u2014 ", "The administrator controls who can see document summaries: all visitors, members only, or disabled entirely."),

    subHeading("Catch-Up Digest"),

    bodyText("If you have been away from the platform for a period of time, a catch-up digest helps you get up to speed on what you missed. The digest appears as a widget on the categories hub page (the sidebar on the right)."),

    bulletItem("When it appears \u2014 ", "The digest widget is shown to logged-in members who have been away from the platform for a configurable number of days (default: 14 days). Administrators can generate the digest at any time regardless of absence."),
    bulletItem("What it covers \u2014 ", "The digest summarises recent discussions (grouped by category), upcoming events, and recently published documents. It draws from all three areas of the platform to give you a complete picture."),
    bulletItem("How to use it \u2014 ", "If a cached digest is available, it appears automatically in the sidebar widget. Administrators see a \u201CG\u00e9n\u00e9rer\u201D (Generate) or \u201CActualiser\u201D (Refresh) button to create or update the digest."),
    bulletItem("Caching \u2014 ", "The digest is cached for 6 hours. All members see the same shared digest during this period."),

    divider(),
  ];
}

// ============================================================
// PART 4: MODERATION + ADMINISTRATION + REFERENCE
// ============================================================

function buildPart4() {
  return [
    pageBreak(),

    // ============================================================
    // 9. FOR MODERATORS
    // ============================================================
    sectionHeading("9. For Moderators"),

    bodyText("This section is for users with the Global Moderator or Moderator role. Moderators maintain content quality across the platform by reviewing flagged posts, approving documents, and managing discussions."),

    subHeading("User Roles Overview"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [2600, 6760],
      rows: [
        new TableRow({ children: [headerCell("Role", 2600), headerCell("Permissions", 6760)] }),
        new TableRow({ children: [
          bodyCell("Administrator", 2600, { bold: true }),
          bodyCell("Full platform control: system settings, category management, user management, plugin configuration, email settings. Can perform all moderator actions across all categories.", 6760),
        ]}),
        new TableRow({ children: [
          bodyCell("Global Moderator", 2600, { bold: true, shaded: true }),
          bodyCell("Moderation powers across all categories: edit, move, lock, pin, and delete content. Manage the flag queue and document approvals. Cannot access system settings or plugin configuration.", 6760, { shaded: true }),
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
          bodyCell("Visitor", 2600, { bold: true }),
          bodyCell("Read-only access to public content. Cannot post, message, vote, or access members-only areas.", 6760),
        ]}),
      ],
    }),

    subHeading("Moderating Discussions"),

    bodyText("As a moderator, you have the following actions available on topics and posts:"),

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
          bodyCell("Fix a topic at the top of its category. Can be set with an expiry date (e.g. pin for 7 days, after which it returns to normal sorting).", 6960, { shaded: true }),
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

    subHeading("The Flag Queue"),

    bodyText("Any logged-in member can flag a post they believe is inappropriate. Flags enter a queue for moderator review:"),

    numberedItem("A member clicks the options menu (\u2026) under a post and selects \u201CFlag.\u201D They provide a brief reason."),
    numberedItem("The flag appears in the moderator\u2019s flag queue (accessible from the moderation dashboard)."),
    numberedItem("The moderator reviews the flagged post and its context."),
    numberedItem("The moderator takes action: dismiss the flag (if the content is acceptable), edit the post, delete the post, or warn/ban the author."),
    numberedItem("The flag is marked as resolved."),

    subHeading("Approving Documents"),

    bodyText("When a member uploads a document, it enters a pending status by default. Moderators and administrators review pending documents:"),

    numberedItem("Navigate to Documents and click the pending documents banner (or go directly to the pending page)."),
    numberedItem("A table lists all pending documents with their title, uploader, date, and category."),
    numberedItem("Click \u201CApprouver\u201D to approve a document \u2014 it will immediately appear in the library."),
    numberedItem("Click \u201CRejeter\u201D to reject a document \u2014 you will be asked to provide a reason. The uploader can see the rejection reason on their \u201CMy Documents\u201D page."),
    numberedItem("Click \u201CSupprimer\u201D to permanently remove the document."),

    spacer(),
    tipBox("Administrators can configure certain document categories for automatic approval in the document library settings. Documents uploaded to those categories skip the moderation queue entirely."),

    subHeading("Creating Events"),

    bodyText("Only administrators and global moderators can create, edit, and delete events:"),

    numberedItem("Navigate to Ressources \u2192 Rencontres and click \u201CCr\u00e9er une rencontre.\u201D"),
    numberedItem("Fill in the form:"),

    bulletItem("Title \u2014 ", "The name of the event (required)."),
    bulletItem("Sector \u2014 ", "Select from M\u00e9thodologie, Formation, Politique, or \u00c9tude de cas."),
    bulletItem("Region \u2014 ", "The geographic area (free text)."),
    bulletItem("Location \u2014 ", "The venue or virtual platform name."),
    bulletItem("Banner image \u2014 ", "Drag and drop or click to upload a banner (recommended 1200\u00d7400 pixels)."),
    bulletItem("Start date and time \u2014 ", "Required. Set the event\u2019s start date and time."),
    bulletItem("End date and time \u2014 ", "Optional. If provided, it must be after the start."),
    bulletItem("Meeting platform \u2014 ", "Select Zoom, Microsoft Teams, or Autre (Other)."),
    bulletItem("Meeting link \u2014 ", "The URL to join the virtual meeting."),
    bulletItem("Registration link \u2014 ", "An optional URL for advance registration."),
    bulletItem("Description \u2014 ", "Full description of the event. Supports Markdown formatting."),

    numberedItem("Click \u201CCr\u00e9er une rencontre\u201D to publish the event."),
    numberedItem("A discussion topic is automatically created in the \u00c9v\u00e9nements category with the event details."),

    bodyText("To edit an event, open its detail page and click \u201CModifier.\u201D To delete it, click \u201CSupprimer\u201D \u2014 this also removes the associated discussion topic."),

    subHeading("Generating AI Summaries"),

    bodyText("Moderators and administrators have additional AI capabilities:"),

    bulletItem("Discussion summaries \u2014 ", "You can generate a summary for any topic, regardless of reply count. Click \u201CR\u00e9sumer cette discussion\u201D on the topic page."),
    bulletItem("Document summaries \u2014 ", "On any document\u2019s detail page, you can click \u201CG\u00e9n\u00e9rer le r\u00e9sum\u00e9\u201D to create or regenerate the AI summary."),
    bulletItem("Catch-up digest \u2014 ", "On the categories hub, you can generate or refresh the shared digest that all members see."),

    subHeading("Audit Log"),

    bodyText("Every moderation and administrative action is recorded automatically. The audit log is accessible in the admin panel under Advanced \u2192 Events. Over 40 event types are tracked, including content edits, deletions, topic moves, user bans, role changes, and settings modifications. This log provides full accountability and a complete history of who did what and when."),

    divider(),

    pageBreak(),

    // ============================================================
    // 10. FOR ADMINISTRATORS
    // ============================================================
    sectionHeading("10. For Administrators"),

    bodyText("This section covers platform-wide settings that only administrators can access. All administration is done through the admin panel, accessible at /admin or via the administrator menu in the top navigation."),

    subHeading("Managing Categories"),

    numberedItem("Go to the admin panel, then Manage \u2192 Categories."),
    numberedItem("To create a category: click \u201CAdd Category,\u201D provide a name, description, and icon."),
    numberedItem("To edit: click an existing category and adjust its settings (name, description, colour, icon)."),
    numberedItem("To reorder: drag and drop categories into the desired position."),
    numberedItem("To set permissions: open the Privileges tab within a category to control who can view, create topics, reply, and moderate."),

    subHeading("Managing Users"),

    numberedItem("Go to the admin panel, then Manage \u2192 Users."),
    numberedItem("Search for a user by name, username, or email address."),
    numberedItem("From the user\u2019s page, you can:"),

    bulletItem("Promote/demote \u2014 ", "Change the user\u2019s role (member, moderator, global moderator, or administrator)."),
    bulletItem("Ban \u2014 ", "Temporarily or permanently suspend access. Banned users cannot log in or post."),
    bulletItem("Delete \u2014 ", "Permanently remove the account. This action is irreversible."),

    subHeading("Email Configuration"),

    bodyText("The platform sends emails for account verification, password resets, and notification digests. To configure email delivery:"),

    numberedItem("Go to Settings \u2192 Email in the admin panel."),
    numberedItem("Enable the SMTP transport."),
    numberedItem("Enter your SMTP credentials (host, port, username, password, security mode)."),
    numberedItem("Set the sender address (e.g. noreply@your-domain.ci)."),
    numberedItem("Send a test email to verify the configuration."),

    subHeading("Custom Profile Fields"),

    bodyText("The professional fields that appear on member profiles (expertise, region, sector, organisation type, etc.) are managed at Manage \u2192 Users \u2192 Custom Fields. From there, you can:"),

    bulletItem("Edit field options \u2014 ", "Add, remove, or reorder the values in dropdown fields (e.g. add a new expertise domain or region)."),
    bulletItem("Set visibility \u2014 ", "Control who can see each field: everyone, logged-in members only, or administrators only."),
    bulletItem("Add new fields \u2014 ", "Create additional profile fields if needed."),

    subHeading("Document Library Settings"),

    bodyText("The document library has its own settings panel at /admin/plugins/cop-documents:"),

    bulletItem("Max file size \u2014 ", "The maximum upload size in megabytes (default: 20 MB)."),
    bulletItem("Allowed extensions \u2014 ", "A list of permitted file types (default: pdf, docx, xlsx, pptx, jpg, png)."),
    bulletItem("Auto-approve categories \u2014 ", "Select which document categories skip the moderation queue and are approved immediately on upload."),

    subHeading("Events Settings"),

    bodyText("The events plugin has a settings panel at /admin/plugins/cop-events:"),

    bulletItem("Default category \u2014 ", "The discussion category where auto-created event topics are posted (default: \u00c9v\u00e9nements)."),
    bulletItem("Backfill button \u2014 ", "If events were created before the auto-topic feature was set up, click \u201CCr\u00e9er les sujets manquants\u201D to generate discussion topics for existing events retroactively."),

    subHeading("Member Directory Settings"),

    bodyText("The directory plugin has a settings panel at /admin/plugins/cop-directory:"),

    bulletItem("Results per page \u2014 ", "How many member cards appear on each page (default: 20)."),
    bulletItem("Default sort \u2014 ", "Whether results are sorted by name or by most recently joined."),
    bulletItem("Enable opt-out \u2014 ", "Whether members can choose to hide themselves from the directory."),

    subHeading("AI Feature Settings"),

    bodyText("The AI plugin has a comprehensive settings panel at /admin/plugins/cop-ai, organised into tabs:"),

    subSubHeading("Provider Tab"),

    bodyText("Configure which AI service powers the summaries:"),

    bulletItem("Provider \u2014 ", "Select from OpenAI, Anthropic (Claude), Google (Gemini), or Agent SDK."),
    bulletItem("API Key \u2014 ", "Enter the API key for your chosen provider."),
    bulletItem("Model \u2014 ", "Specify the model to use (e.g. gpt-4o-mini, claude-sonnet-4-20250514, gemini-2.0-flash)."),
    bulletItem("API Base URL \u2014 ", "Optional. If using an OpenAI-compatible proxy, enter the base URL here."),

    spacer(),
    tipBox("You can switch providers at any time by changing the dropdown and API key. No code changes are required. Existing cached summaries remain valid regardless of which provider generated them."),

    subSubHeading("Feature Tabs (Documents, Discussions, Digest)"),

    bodyText("Each AI feature has its own tab with the following controls:"),

    bulletItem("Enable/disable toggle \u2014 ", "Turn the feature on or off entirely."),
    bulletItem("Access level \u2014 ", "Control who can see AI summaries: all visitors, members only, or disabled."),

    bodyText("The Discussions tab has additional settings:"),

    bulletItem("Minimum replies \u2014 ", "How many replies a topic must have before regular members see the summarise button (default: 15). Administrators and moderators can always generate summaries regardless of this threshold."),
    bulletItem("Cache invalidation replies \u2014 ", "How many new replies after a summary was generated trigger automatic cache invalidation (default: 10)."),
    bulletItem("Cache duration \u2014 ", "How many hours a cached summary remains valid (default: 12)."),

    bodyText("The Digest tab has additional settings:"),

    bulletItem("Absence threshold \u2014 ", "How many days a member must be away before the catch-up digest is offered (default: 14)."),
    bulletItem("Cache duration \u2014 ", "How many hours the shared digest remains valid (default: 6)."),

    subSubHeading("Limits Tab"),

    bulletItem("Daily summary limit \u2014 ", "The maximum number of AI summaries any single member can generate per day across all features (default: 5)."),

    subSubHeading("Usage Tab"),

    bodyText("The Usage tab provides visibility into AI usage and cache management:"),

    bulletItem("Token usage \u2014 ", "A table showing the number of AI tokens consumed per day, broken down by feature (discussions, documents, digests). This helps monitor API costs."),
    bulletItem("Cache counts \u2014 ", "Badges showing how many discussion summaries, document summaries, digests, and rate-limit records are currently cached."),
    bulletItem("Clear buttons \u2014 ", "Buttons to clear each cache type. Clearing a cache means new summaries will need to be regenerated."),

    subHeading("Platform Settings"),

    bodyText("Additional key settings available in the admin panel:"),

    bulletItem("Site title and description \u2014 ", "Displayed in the browser tab and search engine results."),
    bulletItem("Registration \u2014 ", "Control whether registration is open, requires admin approval, or is invitation-only."),
    bulletItem("Default language \u2014 ", "The platform defaults to French. Individual users can switch to English in their personal settings."),
    bulletItem("User settings \u2014 ", "Minimum password length, username rules, default notification preferences."),
    bulletItem("Post settings \u2014 ", "Minimum/maximum post length, allowed file types for in-post uploads, rate limits for posting."),

    divider(),

    pageBreak(),

    // ============================================================
    // 11. QUICK REFERENCE
    // ============================================================
    sectionHeading("11. Quick Reference"),

    subHeading("Platform URLs"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [3600, 5760],
      rows: [
        new TableRow({ children: [headerCell("Page", 3600), headerCell("URL Path", 5760)] }),
        new TableRow({ children: [
          bodyCell("Homepage", 3600, { bold: true }),
          bodyCell("/", 5760),
        ]}),
        new TableRow({ children: [
          bodyCell("Categories hub", 3600, { bold: true, shaded: true }),
          bodyCell("/categories", 5760, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Recent activity", 3600, { bold: true }),
          bodyCell("/recent", 5760),
        ]}),
        new TableRow({ children: [
          bodyCell("Document library", 3600, { bold: true, shaded: true }),
          bodyCell("/documents", 5760, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Upload a document", 3600, { bold: true }),
          bodyCell("/documents/upload", 5760),
        ]}),
        new TableRow({ children: [
          bodyCell("My documents", 3600, { bold: true, shaded: true }),
          bodyCell("/documents/my", 5760, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Pending documents", 3600, { bold: true }),
          bodyCell("/documents/pending", 5760),
        ]}),
        new TableRow({ children: [
          bodyCell("Member directory", 3600, { bold: true, shaded: true }),
          bodyCell("/directory", 5760, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Events list", 3600, { bold: true }),
          bodyCell("/events", 5760),
        ]}),
        new TableRow({ children: [
          bodyCell("Events calendar", 3600, { bold: true, shaded: true }),
          bodyCell("/events/calendar", 5760, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Create an event", 3600, { bold: true }),
          bodyCell("/events/create", 5760),
        ]}),
        new TableRow({ children: [
          bodyCell("Search", 3600, { bold: true, shaded: true }),
          bodyCell("/search", 5760, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Admin panel", 3600, { bold: true }),
          bodyCell("/admin", 5760),
        ]}),
      ],
    }),

    subHeading("Admin Plugin Pages"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [3600, 5760],
      rows: [
        new TableRow({ children: [headerCell("Plugin", 3600), headerCell("Settings URL", 5760)] }),
        new TableRow({ children: [
          bodyCell("CoP Theme", 3600, { bold: true }),
          bodyCell("/admin/plugins/cop-theme", 5760),
        ]}),
        new TableRow({ children: [
          bodyCell("Document Library", 3600, { bold: true, shaded: true }),
          bodyCell("/admin/plugins/cop-documents", 5760, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("Member Directory", 3600, { bold: true }),
          bodyCell("/admin/plugins/cop-directory", 5760),
        ]}),
        new TableRow({ children: [
          bodyCell("Events", 3600, { bold: true, shaded: true }),
          bodyCell("/admin/plugins/cop-events", 5760, { shaded: true }),
        ]}),
        new TableRow({ children: [
          bodyCell("AI Features", 3600, { bold: true }),
          bodyCell("/admin/plugins/cop-ai", 5760),
        ]}),
        new TableRow({ children: [
          bodyCell("S3/R2 Uploads", 3600, { bold: true, shaded: true }),
          bodyCell("/admin/plugins/s3-uploads", 5760, { shaded: true }),
        ]}),
      ],
    }),

    subHeading("Keyboard Shortcuts"),

    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [3600, 5760],
      rows: [
        new TableRow({ children: [headerCell("Shortcut", 3600), headerCell("Action", 5760)] }),
        new TableRow({ children: [
          bodyCell("/", 3600, { bold: true }),
          bodyCell("Open search", 5760),
        ]}),
      ],
    }),

    divider(),

    // Footer attribution
    new Paragraph({
      spacing: { before: 400 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Prepared by the development team \u2014 LVZ Analytics Corp", font: "Arial", size: 20, italics: true, color: GRAY })],
    }),
  ];
}

// ============================================================
// ASSEMBLE DOCUMENT
// ============================================================

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
                new TextRun({ text: "Communaut\u00e9 de Pratique \u2014 Platform User Guide", font: "Arial", size: 18, color: TEAL, italics: true }),
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
        ...buildPart1(),
        ...buildPart2(),
        ...buildPart3(),
        ...buildPart4(),
      ],
    },
  ],
});

// Generate the document
const outputPath = path.join(__dirname, "user-guide.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`User guide written to ${outputPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error("Error generating document:", err);
  process.exit(1);
});
