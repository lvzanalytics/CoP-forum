/**
 * DEPLOYMENT GUIDE GENERATOR — CoP Platform
 * ==========================================
 * Generates: Guide-de-Deploiement-CoP.docx (English deployment guide for review)
 * Run: NODE_PATH=$(npm root -g) node docs/generate-deployment-guide.js
 *
 * STRUCTURE (14 sections, all in English):
 *   Cover page — title, subtitle, date, prepared by LVZ Analytics Corp
 *   Table of contents — auto-generated from headings
 *   1.  Infrastructure overview
 *   2.  Technical prerequisites
 *   3.  Database configuration
 *   4.  File storage (R2)
 *   5.  Email (SMTP2GO)
 *   6.  Build & start commands
 *   7.  Environment variables — full reference table (17 vars)
 *   8.  Hosting options
 *   9.  Security
 *   10. Data backup strategy
 *   11. Custom plugins
 *   12. Production checklist
 *   13. Contacts & support
 *   14. Recommended maintenance
 *
 * FORMATTING:
 *   - Blue headings (#2B579A)
 *   - Alternating grey/white table rows
 *   - White text on blue table headers
 *   - Header with blue underline, footer with page numbers
 *   - A4 page size, Calibri font throughout
 */

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak,
} = require("docx");

// ── Colour palette ──────────────────────────────────────────────────
const BLUE    = "2B579A";
const WHITE   = "FFFFFF";
const GREY    = "F2F2F2";
const DKGREY  = "404040";
const RED     = "CC0000";

// ── A4 layout (DXA units: 1440 = 1 inch) ───────────────────────────
const PAGE_W  = 11906;
const PAGE_H  = 16838;

// ── Reusable table styling ──────────────────────────────────────────
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "BBBBBB" };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

function cell(text, width, shading) {
  return new TableCell({
    borders: cellBorders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text: String(text), font: "Calibri", size: 20, color: DKGREY })] })],
  });
}

function hdrCell(text, width) {
  return new TableCell({
    borders: cellBorders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: { fill: BLUE, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "Calibri", size: 20, color: WHITE })] })],
  });
}

function makeTable(headers, rows, colWidths) {
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({ children: headers.map((h, i) => hdrCell(h, colWidths[i])) }),
      ...rows.map((r, ri) =>
        new TableRow({
          children: r.map((c, ci) => cell(c, colWidths[ci], ri % 2 === 1 ? GREY : undefined)),
        })
      ),
    ],
  });
}

// ── Text helpers ────────────────────────────────────────────────────

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, font: "Calibri", size: 32, color: BLUE })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, font: "Calibri", size: 26, color: BLUE })] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Calibri", size: 22, color: BLUE })] });
}

function para(runs) {
  if (typeof runs === "string") runs = [normal(runs)];
  return new Paragraph({ spacing: { after: 120 }, children: runs });
}

function bold(text) { return new TextRun({ text, bold: true, font: "Calibri", size: 22, color: DKGREY }); }
function normal(text) { return new TextRun({ text, font: "Calibri", size: 22, color: DKGREY }); }
function code(text) { return new TextRun({ text, font: "Consolas", size: 20, color: "333333" }); }
function warning(text) { return new TextRun({ text, bold: true, font: "Calibri", size: 22, color: RED }); }
function emptyLine() { return new Paragraph({ spacing: { after: 80 }, children: [] }); }

function codeBlock(lines) {
  return lines.map(l =>
    new Paragraph({
      spacing: { after: 0 },
      shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
      indent: { left: 360 },
      children: [new TextRun({ text: l, font: "Consolas", size: 18, color: "333333" })],
    })
  );
}

function bullet(runs) {
  if (typeof runs === "string") runs = [normal(runs)];
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: runs });
}

function checkbox(text) {
  return new Paragraph({ numbering: { reference: "checklist", level: 0 }, spacing: { after: 60 },
    children: [normal(text)] });
}

// ════════════════════════════════════════════════════════════════════
//  DOCUMENT DEFINITION
// ════════════════════════════════════════════════════════════════════

const doc = new Document({
  creator: "LVZ Analytics Corp",
  title: "Deployment Guide - Community of Practice (CoP)",
  description: "Technical deployment document for the Ministry IT department",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22, color: DKGREY } },
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: BLUE },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: BLUE },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: BLUE },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ],
      },
      {
        reference: "checklist",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2610", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ],
      },
    ],
  },
  sections: [
    // ================================================================
    //  COVER PAGE
    // ================================================================
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        emptyLine(), emptyLine(), emptyLine(), emptyLine(), emptyLine(),
        emptyLine(), emptyLine(), emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "DEPLOYMENT GUIDE", font: "Calibri", size: 52, bold: true, color: BLUE })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 8 } },
          children: [new TextRun({ text: "Community of Practice (CoP)", font: "Calibri", size: 36, color: BLUE })],
        }),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ text: "Public Policy Evaluation Platform", font: "Calibri", size: 24, color: DKGREY })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ text: "Republic of C\u00F4te d\u2019Ivoire", font: "Calibri", size: 24, color: DKGREY })],
        }),
        emptyLine(), emptyLine(), emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Technical document for the Ministry IT department", font: "Calibri", size: 22, italics: true, color: DKGREY })],
        }),
        emptyLine(), emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 60 },
          children: [new TextRun({ text: "May 2026", font: "Calibri", size: 24, bold: true, color: DKGREY })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 60 },
          children: [new TextRun({ text: "Version 1.0", font: "Calibri", size: 22, color: DKGREY })],
        }),
        emptyLine(), emptyLine(), emptyLine(), emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Prepared by LVZ Analytics Corp", font: "Calibri", size: 22, color: DKGREY })],
        }),
      ],
    },

    // ================================================================
    //  MAIN CONTENT
    // ================================================================
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 4 } },
            children: [new TextRun({ text: "Deployment Guide \u2014 CoP", font: "Calibri", size: 18, color: BLUE, italics: true })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
            children: [
              new TextRun({ text: "LVZ Analytics Corp \u2014 Confidential \u2014 Page ", font: "Calibri", size: 16, color: "999999" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 16, color: "999999" }),
            ],
          })],
        }),
      },
      children: [
        // ── TABLE OF CONTENTS ───────────────────────────────────────
        h1("Table of Contents"),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 1: INFRASTRUCTURE OVERVIEW
        // ════════════════════════════════════════════════════════════
        h1("1. Infrastructure Overview"),
        para("The Community of Practice (CoP) is a collaborative platform for public policy evaluation professionals in C\u00F4te d\u2019Ivoire, per Law No. 666 of December 14, 2022 on strengthening evaluation culture."),
        emptyLine(),
        makeTable(
          ["Component", "Detail"],
          [
            ["Platform", "NodeBB v4.9.1 (open-source community forum)"],
            ["Custom theme", "nodebb-theme-cop (extends Harmony)"],
            ["Custom plugins", "3 dedicated plugins (documents, directory, uploads)"],
            ["Current staging", "https://cop-forum.onrender.com"],
            ["Interface language", "French"],
          ],
          [3200, 5826]
        ),
        emptyLine(),
        h2("General Architecture"),
        para("The architecture follows this model:"),
        bullet([bold("Node.js application"), normal(" \u2192 NodeBB server (port 4567)")]),
        bullet([bold("Database"), normal(" \u2192 PostgreSQL (Neon, serverless)")]),
        bullet([bold("File storage"), normal(" \u2192 Cloudflare R2 (S3-compatible)")]),
        bullet([bold("Transactional email"), normal(" \u2192 SMTP2GO")]),
        bullet([bold("DNS / CDN"), normal(" \u2192 To be determined by the Ministry")]),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 2: TECHNICAL PREREQUISITES
        // ════════════════════════════════════════════════════════════
        h1("2. Technical Prerequisites"),
        para("The following components are mandatory for deploying the platform:"),
        emptyLine(),
        makeTable(
          ["Component", "Version / Specification", "Notes"],
          [
            ["Node.js", "v22 (mandatory)", "Lower or higher versions are not supported"],
            ["pnpm", "Latest stable version", "Required package manager"],
            ["PostgreSQL", "v14+", "Any compatible PostgreSQL provider"],
            ["S3-compatible storage", "Cloudflare R2 / AWS S3", "For file uploads"],
            ["SMTP service", "SMTP2GO recommended", "For email notifications"],
            ["Operating system", "Linux (Ubuntu 22.04+ recommended)", "Or any OS supporting Node.js 22"],
            ["Minimum RAM", "1 GB", "2 GB recommended in production"],
            ["Disk space", "10 GB minimum", "Excluding file storage (R2)"],
          ],
          [2400, 2800, 3826]
        ),
        emptyLine(),
        h3("pnpm Configuration"),
        para([normal("The "), code(".npmrc"), normal(" file must contain the following line at the project root:")]),
        ...codeBlock(["shamefully-hoist=true"]),
        emptyLine(),
        para("This is necessary because NodeBB assumes a flat node_modules structure."),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 3: DATABASE CONFIGURATION
        // ════════════════════════════════════════════════════════════
        h1("3. Database Configuration"),
        para("PostgreSQL is the only supported database for this installation. MongoDB and Redis are not used."),
        emptyLine(),
        h2("3.1 Current Provider"),
        para([normal("The platform currently uses "), bold("Neon"), normal(" (serverless PostgreSQL). However, any standard PostgreSQL provider is compatible.")]),
        emptyLine(),
        h2("3.2 SSL Connection"),
        para("SSL is mandatory for all remote database connections. The POSTGRES_SSL parameter must be set to true."),
        emptyLine(),
        h2("3.3 Configuration Variables"),
        para([normal("Configuration is done via "), code("config.json"), normal(" or environment variables:")]),
        emptyLine(),
        makeTable(
          ["Variable", "Description", "Example"],
          [
            ["POSTGRES_HOST", "PostgreSQL server address", "ep-xxx.neon.tech"],
            ["POSTGRES_PORT", "Connection port", "5432"],
            ["POSTGRES_USERNAME", "Username", "(provided by provider)"],
            ["POSTGRES_PASSWORD", "Password", "(secret)"],
            ["POSTGRES_DATABASE", "Database name", "(provided by provider)"],
            ["POSTGRES_SSL", "Enable SSL encryption", "true"],
          ],
          [3000, 3200, 2826]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 4: FILE STORAGE (CLOUDFLARE R2)
        // ════════════════════════════════════════════════════════════
        h1("4. File Storage (Cloudflare R2)"),
        para("Two plugins handle file storage on Cloudflare R2 (S3-compatible):"),
        emptyLine(),
        h2("4.1 Main Plugin: @nodebb/nodebb-plugin-s3-uploads"),
        para([normal("Version: "), bold("3.1.0")]),
        para("This plugin handles native NodeBB uploads:"),
        bullet("User avatars"),
        bullet("Images in posts"),
        bullet("Message attachments"),
        emptyLine(),
        h2("4.2 Document Plugin: nodebb-plugin-cop-documents"),
        para("This custom plugin handles the document library with its own R2 integration and enriched metadata (tags, categories, descriptions)."),
        emptyLine(),
        h2("4.3 R2 Environment Variables"),
        makeTable(
          ["Variable", "Description"],
          [
            ["S3_UPLOADS_BUCKET", "Cloudflare R2 bucket name"],
            ["S3_UPLOADS_ENDPOINT", "R2 endpoint (account URL)"],
            ["S3_UPLOADS_HOST", "Public URL for accessing files (custom domain)"],
            ["S3_UPLOADS_ACCESS_KEY_ID", "R2 access key"],
            ["S3_UPLOADS_SECRET_ACCESS_KEY", "R2 secret key"],
          ],
          [3800, 5226]
        ),
        emptyLine(),
        h2("4.4 Default Limits"),
        bullet("Maximum file size: 2 MB"),
        bullet("Allowed extensions: png, jpg, bmp, txt, webp, webm, mp4, gif"),
        para([normal("These limits are configurable in the admin panel under "), code("Settings > Uploads"), normal(".")]),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 5: EMAIL (SMTP2GO)
        // ════════════════════════════════════════════════════════════
        h1("5. Email (SMTP2GO)"),
        para("The email service is essential for:"),
        bullet("User notifications (replies, mentions)"),
        bullet("Email address verification at registration"),
        bullet("Periodic activity digests"),
        bullet("Password reset"),
        emptyLine(),
        h2("5.1 SMTP Configuration"),
        makeTable(
          ["Parameter", "Value"],
          [
            ["Recommended provider", "SMTP2GO"],
            ["SMTP server", "mail.smtp2go.com"],
            ["Port", "587"],
            ["Security", "TLS (STARTTLS)"],
            ["Authentication", "SMTP2GO credentials"],
          ],
          [3200, 5826]
        ),
        emptyLine(),
        para([normal("Configuration is done in the admin panel: "), code("Administration > Settings > Email"), normal(".")]),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 6: BUILD & START COMMANDS
        // ════════════════════════════════════════════════════════════
        h1("6. Build and Start Commands"),
        emptyLine(),
        makeTable(
          ["Step", "Command", "Description"],
          [
            ["Install dependencies", "pnpm install", "Install all Node.js packages"],
            ["Build", "./nodebb build", "Compile assets (JS, CSS, templates)"],
            ["Start (development)", "./nodebb start", "Start with built-in process manager"],
            ["Start (production)", "node app.js", "Direct start for production environments"],
            ["Stop", "./nodebb stop", "Stop the NodeBB process"],
            ["Development mode", "./nodebb dev", "Start with verbose logging"],
          ],
          [2600, 2400, 4026]
        ),
        emptyLine(),
        h2("6.1 Important Warning"),
        para([
          warning("WARNING: "),
          normal("Do NOT use "),
          code("node loader.js"),
          normal(" for startup on Render or in production. This command breaks the application routing. Always use "),
          code("node app.js"),
          normal(" in production."),
        ]),
        emptyLine(),
        h2("6.2 Listening Port"),
        para([normal("The default port is "), bold("4567"), normal(". It is configurable via the "), code("PORT"), normal(" environment variable.")]),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 7: ENVIRONMENT VARIABLES (complete reference)
        // ════════════════════════════════════════════════════════════
        h1("7. Environment Variables (Complete Reference)"),
        para("The table below lists all environment variables needed for deployment:"),
        emptyLine(),
        makeTable(
          ["Variable", "Description", "Example"],
          [
            ["NODE_VERSION", "Node.js version", "22"],
            ["NODE_ENV", "Runtime environment", "production"],
            ["URL", "Public platform URL", "https://cop.example.ci"],
            ["PORT", "Listening port", "4567"],
            ["DATABASE", "Database type", "postgres"],
            ["POSTGRES_HOST", "PostgreSQL host", "(provider)"],
            ["POSTGRES_PORT", "PostgreSQL port", "5432"],
            ["POSTGRES_USERNAME", "PostgreSQL user", "(provider)"],
            ["POSTGRES_PASSWORD", "PostgreSQL password", "(secret)"],
            ["POSTGRES_DATABASE", "Database name", "(provider)"],
            ["POSTGRES_SSL", "Enable SSL", "true"],
            ["SECRET", "Session secret key", "(generated UUID)"],
            ["S3_UPLOADS_BUCKET", "R2 bucket name", "(Cloudflare)"],
            ["S3_UPLOADS_ENDPOINT", "R2 endpoint", "(Cloudflare)"],
            ["S3_UPLOADS_HOST", "Public file URL", "(custom domain)"],
            ["S3_UPLOADS_ACCESS_KEY_ID", "R2 access key", "(Cloudflare)"],
            ["S3_UPLOADS_SECRET_ACCESS_KEY", "R2 secret key", "(Cloudflare)"],
          ],
          [3200, 3200, 2626]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 8: HOSTING OPTIONS (production)
        // ════════════════════════════════════════════════════════════
        h1("8. Hosting Options (Production)"),
        para("Several options are available for production hosting. The choice depends on the Ministry\u2019s performance, cost, and data sovereignty requirements."),
        emptyLine(),
        h2("8.1 Application Hosting"),
        makeTable(
          ["Provider", "Monthly Cost", "Notes"],
          [
            ["Render Professional", "19 USD+", "Current (staging), auto-scaling"],
            ["Hetzner Cloud", "~3.50 EUR", "Cloud server, European infrastructure"],
            ["DigitalOcean", "4 USD+", "Droplet, easy to configure"],
            ["Amazon Lightsail", "3.50 USD+", "Integrated with AWS ecosystem"],
            ["Self-hosted VPS", "Variable", "Full control, more administration required"],
          ],
          [2600, 2200, 4226]
        ),
        emptyLine(),
        h2("8.2 Database Hosting"),
        makeTable(
          ["Provider", "Monthly Cost", "Notes"],
          [
            ["Neon (current)", "0\u201350 USD", "Serverless, free tier available"],
            ["Supabase", "0\u201325 USD", "Managed PostgreSQL, dashboard included"],
            ["Self-hosted PostgreSQL", "Included in VPS", "More administration required"],
          ],
          [2600, 2200, 4226]
        ),
        emptyLine(),
        h2("8.3 Recommendation"),
        para("For a ministerial production environment, we recommend Hetzner Cloud (application) + Neon or Supabase (database), offering a good balance between cost, performance, and manageability."),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 9: SECURITY
        // ════════════════════════════════════════════════════════════
        h1("9. Security"),
        para("The platform integrates several security measures:"),
        emptyLine(),
        h2("9.1 Authentication and Sessions"),
        makeTable(
          ["Parameter", "Value"],
          [
            ["Session duration", "14 days"],
            ["Lockout after failures", "5 attempts \u2192 60-minute lockout"],
            ["Minimum password length", "6 characters"],
            ["Email verification", "Enabled"],
          ],
          [3800, 5226]
        ),
        emptyLine(),
        h2("9.2 Data Protection"),
        bullet("HSTS: must be enabled in production"),
        bullet("GDPR: user account self-deletion enabled"),
        bullet("All user input is sanitized server-side"),
        bullet("Passwords are hashed with bcrypt"),
        bullet("Built-in CSRF protection on all forms"),
        emptyLine(),
        h2("9.3 Additional Recommendations"),
        bullet("Configure a firewall (ufw/iptables) allowing only ports 80, 443, and SSH"),
        bullet("Use a reverse proxy (nginx/Caddy) with Let\u2019s Encrypt SSL certificate"),
        bullet("Restrict SSH access to public key authentication only"),
        bullet("Set up fail2ban for brute-force protection"),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 10: DATA BACKUP STRATEGY (CRITICAL)
        // ════════════════════════════════════════════════════════════
        h1("10. Data Backup Strategy"),
        para([
          warning("CRITICAL: "),
          normal("The backup strategy is an essential element of the deployment. The Functional Specification Document (FSD, section 6.1) provides for the full transfer of backup responsibility to the Ministry at delivery."),
        ]),
        emptyLine(),
        h2("10.1 Database"),
        para("Neon provides automatic daily backups. For alternative hosting, configure daily pg_dump."),
        emptyLine(),
        h3("Manual Backup Procedure"),
        ...codeBlock([
          "pg_dump -h [HOST] -U [USER] -d [DATABASE] \\",
          "  --format=custom -f backup_$(date +%Y%m%d).dump",
        ]),
        emptyLine(),
        h3("Restore Procedure"),
        ...codeBlock([
          "pg_restore -h [HOST] -U [USER] -d [DATABASE] \\",
          "  --clean backup_YYYYMMDD.dump",
        ]),
        emptyLine(),
        h2("10.2 Files (Cloudflare R2)"),
        para("Cloudflare R2 ensures 99.999999999% data durability (11 nines). For additional backup, use rclone:"),
        ...codeBlock(["rclone sync r2:cop-bucket /path/to/backup/r2/"]),
        emptyLine(),
        h2("10.3 Recommended Frequency"),
        makeTable(
          ["Type", "Frequency", "Method"],
          [
            ["Database", "Daily", "Automated pg_dump (cron)"],
            ["R2 files", "Weekly", "rclone sync"],
            ["Integrity check", "Monthly", "Restore test"],
            ["Full restore test", "Quarterly", "Restore to test environment"],
          ],
          [2600, 2200, 4226]
        ),
        emptyLine(),
        h2("10.4 Responsibility"),
        para([bold("Full backup responsibility transfers to the Ministry at delivery"), normal(", per FSD section 6.1. LVZ Analytics Corp will provide the necessary documentation and training before the transfer.")]),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 11: CUSTOM PLUGINS
        // ════════════════════════════════════════════════════════════
        h1("11. Custom Plugins"),
        para("The CoP platform uses four plugins, three of which were developed specifically:"),
        emptyLine(),
        makeTable(
          ["Plugin", "Type", "Description"],
          [
            ["nodebb-theme-cop", "Theme", "Custom theme extending Harmony with ministerial branding"],
            ["nodebb-plugin-cop-documents", "Plugin", "Document library with R2 integration, metadata, and tags"],
            ["nodebb-plugin-cop-directory", "Plugin", "Evaluator member directory with filters and search"],
            ["@nodebb/nodebb-plugin-s3-uploads", "Plugin (third-party)", "Upload management to S3-compatible storage (R2)"],
          ],
          [3000, 1400, 4626]
        ),
        emptyLine(),
        para("All custom plugins are included in the source repository with no additional external dependencies."),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 12: PRODUCTION CHECKLIST
        // ════════════════════════════════════════════════════════════
        h1("12. Production Checklist"),
        para("Before going to production, verify that each step below is completed:"),
        emptyLine(),
        h2("12.1 Infrastructure"),
        checkbox("Create a production PostgreSQL project"),
        checkbox("Create a Cloudflare R2 bucket and generate access keys"),
        checkbox("Configure the SMTP2GO account"),
        checkbox("Generate a new SECRET (UUID) \u2014 do not reuse the staging one"),
        emptyLine(),
        h2("12.2 Network and Domain"),
        checkbox("Point the production domain to the hosting provider"),
        checkbox("Enable HTTPS/SSL (Let\u2019s Encrypt certificate or other)"),
        checkbox("Configure the reverse proxy (nginx or Caddy)"),
        checkbox("Enable HSTS in configuration"),
        emptyLine(),
        h2("12.3 Application"),
        checkbox("Verify NODE_VERSION=22 in environment variables"),
        checkbox("Set all environment variables (see section 7)"),
        checkbox("Run pnpm install"),
        checkbox("Run ./nodebb build"),
        checkbox("Test startup with node app.js"),
        emptyLine(),
        h2("12.4 Functional Tests"),
        checkbox("Test file uploads with the S3 plugin"),
        checkbox("Test email sending (notifications, verification)"),
        checkbox("Create production admin accounts"),
        checkbox("Verify French language display"),
        checkbox("Test the document library"),
        checkbox("Test the member directory"),
        emptyLine(),
        h2("12.5 Monitoring and Maintenance"),
        checkbox("Configure automatic database backups"),
        checkbox("Configure monitoring and alerts (uptime, errors)"),
        checkbox("Document escalation procedures"),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 13: CONTACTS & SUPPORT
        // ════════════════════════════════════════════════════════════
        h1("13. Contacts and Support"),
        para("Reference resources and documentation:"),
        emptyLine(),
        makeTable(
          ["Resource", "URL"],
          [
            ["NodeBB Documentation", "https://nodebb.org/"],
            ["Neon Documentation", "https://neon.tech/docs/"],
            ["Cloudflare R2 Documentation", "https://developers.cloudflare.com/r2/"],
            ["SMTP2GO Documentation", "https://www.smtp2go.com/"],
            ["PostgreSQL Documentation", "https://www.postgresql.org/docs/"],
          ],
          [3200, 5826]
        ),
        emptyLine(),
        h2("13.1 Developer"),
        makeTable(
          ["Information", "Detail"],
          [
            ["Company", "LVZ Analytics Corp"],
            ["Role", "CoP platform development and integration"],
            ["Support", "Per maintenance contract terms"],
          ],
          [3200, 5826]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // ════════════════════════════════════════════════════════════
        // SECTION 14: RECOMMENDED MAINTENANCE
        // ════════════════════════════════════════════════════════════
        h1("14. Recommended Maintenance"),
        para("A regular maintenance program is essential to ensure platform stability and security:"),
        emptyLine(),
        makeTable(
          ["Frequency", "Action", "Responsible"],
          [
            ["Weekly", "Check error logs", "IT team"],
            ["Weekly", "Check disk space and memory", "IT team"],
            ["Monthly", "Verify backup integrity", "IT team"],
            ["Monthly", "Test email delivery", "IT team"],
            ["Monthly", "Check Node.js security updates", "IT team"],
            ["Quarterly", "Update Node.js dependencies", "IT team / Developer"],
            ["Quarterly", "Test full restore", "IT team"],
            ["Quarterly", "User account review", "Administrator"],
            ["Annual", "Full security audit", "External provider"],
            ["Annual", "Hosting cost optimization", "IT team / Management"],
          ],
          [2000, 4200, 2826]
        ),
        emptyLine(),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 8 } },
          spacing: { before: 400 },
          children: [new TextRun({ text: "End of document", font: "Calibri", size: 20, italics: true, color: "999999" })],
        }),
      ],
    },
  ],
});

// ── Generate the .docx file ─────────────────────────────────────────
const OUTPUT = "/home/edguard/Documents/NodeBB/docs/Guide-de-Deploiement-CoP.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`Document generated: ${OUTPUT}`);
  console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error("Generation failed:", err);
  process.exit(1);
});
