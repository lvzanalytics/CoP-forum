const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, LevelFormat, ExternalHyperlink,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TabStopType, TabStopPosition,
} = require("docx");

const SCREENSHOTS_DIR = path.join(__dirname, "m3-screnshots");

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

// Get image dimensions and scale to fit content width
function getImageDimensions(filename, maxWidth) {
  // Scale all screenshots to ~6 inches wide (sensible default for screenshots)
  const w = maxWidth || 8640; // 6 inches in DXA
  const h = Math.round(w * 0.56); // ~16:9 aspect ratio for screenshots
  return { width: w / 15, height: h / 15 }; // Convert DXA to pixels (approx)
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
          children: [new TextRun({ text: "Milestone 3", font: "Arial", size: 44, bold: true, color: TEAL })],
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: "Document Library & Member Directory", font: "Arial", size: 36, color: DARK })],
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
                children: [new Paragraph({ children: [new TextRun({ text: "March 2026", font: "Arial", size: 22, color: DARK })] })] }),
            ]}),
          ],
        }),

        divider(),

        // What Was Delivered
        sectionHeading("What Was Delivered"),
        bodyText("Two major capabilities were added to the platform in this milestone: a Documentation Repository for storing, organizing, and searching evaluation resources, and a Member Directory that lets professionals find and connect with one another. Together, these features transform the platform from a discussion space into a comprehensive knowledge-sharing and networking hub for the evaluation community."),

        // Documentation Repository
        subHeading("Documentation Repository"),
        bodyText("A full-featured document management system has been built into the platform, allowing members to upload, organize, and search evaluation resources. This system was designed to handle the specific needs of evaluation professionals \u2014 from methodological guides and policy reports to training materials and case studies."),
        bodyText("Key capabilities delivered:"),

        bulletItem("File uploads \u2014 ", "Members can upload documents in common formats (PDF, Word, Excel, PowerPoint, images), with a configurable size limit currently set to 20 MB."),
        bulletItem("Structured metadata \u2014 ", "Every document requires a title, author, date, description (minimum 50 characters), category, and tags. Optional fields include region, sector, source organization, publication date, and language."),
        bulletItem("Five document categories \u2014 ", "Reports, Tools, Policy Documents, Case Studies, and Training Materials \u2014 each available in French and English."),
        bulletItem("Search and filtering \u2014 ", "Documents can be searched by title, description, or tags, and filtered by category, region, and sector."),
        bulletItem("Access control \u2014 ", "Each document can be marked as public (visible to all visitors) or members-only (requiring login)."),
        bulletItem("Moderation workflow \u2014 ", "Uploaded documents enter a review queue where moderators can approve or reject them before they become visible. Certain categories can be configured for automatic approval."),
        bulletItem("Version control \u2014 ", "When a document is updated, the original version is preserved. Administrators can view the full version history of any document."),
        bulletItem("Download tracking \u2014 ", "The system records how many times each document has been downloaded, supporting usage analytics."),
        bulletItem("Cloud storage ready \u2014 ", "The system supports Cloudflare R2 cloud storage for scalable file hosting, with automatic fallback to local storage if cloud credentials are not configured."),

        // Screenshots - Document Library
        ...screenshotWithCaption("Pasted image (3).png", "The document library with search and filter capabilities"),
        ...screenshotWithCaption("Pasted image (2).png", "The document upload form with structured metadata fields"),
        ...screenshotWithCaption("Pasted image (7).png", "Administrative settings for the document library, including cloud storage configuration"),

        new Paragraph({ children: [new PageBreak()] }),

        // Member Directory
        subHeading("Member Directory"),
        bodyText("A searchable directory has been added to the platform, making it easy for evaluation professionals to find colleagues by expertise, region, sector, or organization type. This feature is essential for building professional connections within the community and facilitating collaboration across institutions."),
        bodyText("Key capabilities delivered:"),

        bulletItem("Member cards \u2014 ", "Each member appears as a card showing their name, organization, role, region, sector, and areas of expertise."),
        bulletItem("Search \u2014 ", "Free-text search across names, organizations, roles, and biographies."),
        bulletItem("Filters \u2014 ", "Dropdown filters for expertise area, region, sector of focus, and organization type \u2014 all drawn from the same fields members fill in on their profiles."),
        bulletItem("Privacy controls \u2014 ", "Members can opt out of appearing in the directory entirely, using a toggle directly on the directory page."),
        bulletItem("Direct messaging \u2014 ", "Each member card links to a messaging function, allowing members to connect privately through the platform."),
        bulletItem("Admin-configurable \u2014 ", "The expertise tags, sectors, regions, and organization types that appear in filters are managed by administrators, ensuring the directory stays current as the community evolves."),

        // Screenshots - Directory
        ...screenshotWithCaption("Pasted image (5).png", "The member directory with search, filters, and member cards"),
        ...screenshotWithCaption("Pasted image (6).png", "Platform navigation showing integrated access to all community sections"),

        // Enhanced Member Profiles
        subHeading("Enhanced Member Profiles"),
        bodyText("To support the directory, member profiles have been enriched with professional fields tailored to the evaluation community. These fields ensure that the directory is populated with meaningful, searchable information about each member\u2019s professional background."),

        // Screenshots - Profiles
        ...screenshotWithCaption("Pasted image.png", "Custom profile fields configured for evaluation professionals"),
        ...screenshotWithCaption("Pasted image (4).png", "A member\u2019s profile with professional information and expertise areas"),

        bodyText("The following fields are available on every member profile:"),

        // Profile fields table
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [3200, 6160],
          rows: [
            new TableRow({ children: [headerCell("Field", 3200), headerCell("Description", 6160)] }),
            new TableRow({ children: [
              bodyCell("Organisation", 3200, { bold: true }),
              bodyCell("The member\u2019s affiliated organization", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Titre / Fonction", 3200, { bold: true, shaded: true }),
              bodyCell("Professional title or role", 6160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Type d\u2019organisation", 3200, { bold: true }),
              bodyCell("Category of organization (consultant, government, NGO, academic, international)", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Domaines d\u2019expertise", 3200, { bold: true, shaded: true }),
              bodyCell("Areas of evaluation expertise (14 domains, multiple selections allowed)", 6160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("R\u00e9gion", 3200, { bold: true }),
              bodyCell("District within C\u00f4te d\u2019Ivoire (14 regions)", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Biographie professionnelle", 3200, { bold: true, shaded: true }),
              bodyCell("Professional biography (visible to members only)", 6160, { shaded: true }),
            ]}),
            new TableRow({ children: [
              bodyCell("Secteur d\u2019intervention", 3200, { bold: true }),
              bodyCell("Sector of focus (11 sectors including health, education, environment, and more)", 6160),
            ]}),
          ],
        }),

        divider(),

        new Paragraph({ children: [new PageBreak()] }),

        // How to Verify
        sectionHeading("How to Verify"),
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Please visit ", font: "Arial", size: 22, color: DARK }),
            new ExternalHyperlink({ link: "https://cop-forum.onrender.com", children: [new TextRun({ text: "https://cop-forum.onrender.com", style: "Hyperlink", font: "Arial", size: 22, bold: true })] }),
            new TextRun({ text: " and confirm the following:", font: "Arial", size: 22, color: DARK }),
          ],
        }),

        // Document Library checklist
        subSubHeading("Document Library"),
        checklistItem("Navigate to Documents in the top menu"),
        checklistItem("The document library page loads with search bar, filters (category, region, sector), and a sort option"),
        checklistItem("Click T\u00e9l\u00e9verser un document \u2014 the upload form appears with all required fields"),
        checklistItem("Upload a test document (PDF or Word) with all required metadata"),
        checklistItem("The document enters the moderation queue (unless auto-approval is enabled for that category)"),
        checklistItem("As an administrator, navigate to the pending documents page and approve the test document"),
        checklistItem("The approved document appears in the library and can be found via search"),
        checklistItem("Download the document and confirm the download counter increments"),

        // Directory checklist
        subSubHeading("Member Directory"),
        checklistItem("Navigate to Annuaire in the top menu"),
        checklistItem("The directory displays member cards with professional information"),
        checklistItem("Use the search bar to find a member by name or organization"),
        checklistItem("Use the filter dropdowns to narrow results by expertise, region, sector, or organization type"),
        checklistItem("Click \u201CVoir le profil\u201D on a member card to view their full profile"),
        checklistItem("Toggle \u201CNe pas appara\u00eetre dans l\u2019annuaire\u201D to opt out, then verify your card disappears"),

        // Profiles checklist
        subSubHeading("Member Profiles"),
        checklistItem("Log in and navigate to your profile settings"),
        checklistItem("All professional fields are visible and editable (organization, title, expertise, region, sector, bio)"),
        checklistItem("The expertise field allows selecting multiple domains"),
        checklistItem("Privacy controls are respected \u2014 biography is visible only to logged-in members"),

        divider(),

        // What Comes Next
        sectionHeading("What Comes Next \u2014 Milestone 4"),
        bodyText("Milestone 4 focuses on integration and administration tools to prepare the platform for day-to-day operations:"),

        new Paragraph({
          numbering: { reference: "nextSteps", level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Event management \u2014 ", bold: true, font: "Arial", size: 22, color: DARK }),
            new TextRun({ text: "Ability to post events in the \u00c9v\u00e9nements space with date, time, and meeting links (Zoom/Teams), making it easy for members to join virtual sessions.", font: "Arial", size: 22, color: DARK }),
          ],
        }),
        new Paragraph({
          numbering: { reference: "nextSteps", level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Email notifications \u2014 ", bold: true, font: "Arial", size: 22, color: DARK }),
            new TextRun({ text: "Configuration of the email delivery system so members receive notifications for replies, mentions, and document approvals.", font: "Arial", size: 22, color: DARK }),
          ],
        }),
        new Paragraph({
          numbering: { reference: "nextSteps", level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Social media sharing \u2014 ", bold: true, font: "Arial", size: 22, color: DARK }),
            new TextRun({ text: "Share buttons on discussions and documents for Facebook, LinkedIn, and Twitter.", font: "Arial", size: 22, color: DARK }),
          ],
        }),
        new Paragraph({
          numbering: { reference: "nextSteps", level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Moderation workflows \u2014 ", bold: true, font: "Arial", size: 22, color: DARK }),
            new TextRun({ text: "Final configuration of content review processes and administrator tools.", font: "Arial", size: 22, color: DARK }),
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
const outputPath = path.join(__dirname, "milestone-3-report.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document written to ${outputPath}`);
}).catch(err => {
  console.error("Error generating document:", err);
  process.exit(1);
});
