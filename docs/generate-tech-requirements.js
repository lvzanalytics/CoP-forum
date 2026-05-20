/**
 * CoP Platform — Technical Requirements Summary
 * Generates: CoP-Technical-Requirements.docx
 * Run: NODE_PATH=$(npm root -g) node docs/generate-tech-requirements.js
 */

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber,
} = require("docx");

const BLUE   = "2B579A";
const WHITE  = "FFFFFF";
const GREY   = "F2F2F2";
const DKGREY = "404040";

const PAGE_W = 11906;
const PAGE_H = 16838;

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "BBBBBB" };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

function cell(text, width, shading) {
  return new TableCell({
    borders: cellBorders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text: String(text), font: "Calibri", size: 21, color: DKGREY })] })],
  });
}

function hdrCell(text, width) {
  return new TableCell({
    borders: cellBorders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: { fill: BLUE, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "Calibri", size: 21, color: WHITE })] })],
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

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 160 },
    children: [new TextRun({ text, bold: true, font: "Calibri", size: 28, color: BLUE })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 220, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Calibri", size: 24, color: BLUE })] });
}

function para(text) {
  const runs = typeof text === "string" ? [normal(text)] : text;
  return new Paragraph({ spacing: { after: 100, line: 276 }, children: runs });
}

function bold(t) { return new TextRun({ text: t, bold: true, font: "Calibri", size: 21, color: DKGREY }); }
function normal(t) { return new TextRun({ text: t, font: "Calibri", size: 21, color: DKGREY }); }
function code(t) { return new TextRun({ text: t, font: "Consolas", size: 20, color: "333333" }); }
function gap() { return new Paragraph({ spacing: { after: 60 }, children: [] }); }

function bullet(runs) {
  if (typeof runs === "string") runs = [normal(runs)];
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 50, line: 276 }, children: runs });
}

// ════════════════════════════════════════════════════════════════════

const doc = new Document({
  creator: "LVZ Analytics Corp",
  title: "CoP Platform - Technical Requirements",
  styles: {
    default: { document: { run: { font: "Calibri", size: 21, color: DKGREY } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Calibri", color: BLUE },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Calibri", color: BLUE },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ],
    }],
  },
  sections: [{
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
          children: [new TextRun({ text: "CoP Platform \u2014 Technical Requirements", font: "Calibri", size: 18, color: BLUE, italics: true })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
          children: [
            new TextRun({ text: "LVZ Analytics Corp \u2014 Page ", font: "Calibri", size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 16, color: "999999" }),
          ],
        })],
      }),
    },
    children: [

      // ── TITLE ──────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "CoP Platform", font: "Calibri", size: 36, bold: true, color: BLUE })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 40 },
        children: [new TextRun({ text: "Technical Requirements for Deployment", font: "Calibri", size: 26, color: DKGREY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 8 } },
        children: [new TextRun({ text: "May 2026  \u2022  LVZ Analytics Corp", font: "Calibri", size: 20, italics: true, color: "999999" })],
      }),

      // ── WHAT IS THIS? ─────────────────────────────────────────
      h1("What Is This Platform?"),
      para("The CoP (Community of Practice) is a web-based discussion and collaboration platform built on NodeBB, an open-source forum framework. It runs as a Node.js application connected to a PostgreSQL database, with files stored on Cloudflare R2 cloud storage."),
      para("In short, to run this platform you need four things: a server that runs Node.js, a PostgreSQL database, cloud storage for files, and an email service for notifications. The sections below explain each one."),

      // ── 1. SERVER ─────────────────────────────────────────────
      h1("1. Server (Node.js Application)"),
      para("This is a Node.js application. It needs to be deployed on a server or platform that supports Node.js."),
      gap(),
      makeTable(
        ["Requirement", "Detail"],
        [
          ["Node.js version", "Version 22 (this exact major version is required)"],
          ["Package manager", "pnpm (install with: npm install -g pnpm)"],
          ["Minimum RAM", "1 GB (2 GB recommended)"],
          ["Disk space", "10 GB minimum (file storage is handled separately by R2)"],
          ["Operating system", "Any Linux distribution (Ubuntu 22.04+ recommended)"],
        ],
        [3000, 6026]
      ),
      gap(),
      para([bold("For staging"), normal(", we used Render (render.com), a PaaS platform that handles deployment automatically. You can continue using Render and simply attach a custom domain, or move to any VPS provider of your choice (Hetzner, DigitalOcean, AWS Lightsail, etc.). Any server that can run Node.js 22 will work.")]),
      gap(),
      para([bold("To start the application"), normal(" in production, run: "), code("node app.js"), normal(". The app listens on port 4567 by default.")]),

      // ── 2. DATABASE ───────────────────────────────────────────
      h1("2. Database (PostgreSQL)"),
      para("The platform uses PostgreSQL as its database. No other database engine is needed \u2014 there is no Redis or MongoDB requirement."),
      gap(),
      para([bold("For staging"), normal(", we used Neon (neon.tech), a hosted PostgreSQL service with a free tier. You can continue using Neon or switch to any other PostgreSQL provider. All the platform needs is a standard PostgreSQL connection string (host, port, username, password, database name). SSL must be enabled for remote connections.")]),

      // ── 3. FILE STORAGE ───────────────────────────────────────
      h1("3. File Storage (Cloudflare R2)"),
      para("All uploaded files (user profile photos, images posted in discussions, document attachments) are stored on Cloudflare R2, which is an S3-compatible cloud storage service."),
      gap(),
      para("To set this up, you need a Cloudflare account with an R2 bucket. Once created, you generate an access key pair (Access Key ID and Secret Access Key) and provide these to the platform. The configuration is entered through environment variables."),

      // ── 4. EMAIL ──────────────────────────────────────────────
      h1("4. Email (SMTP)"),
      para("The platform sends emails for notifications (new replies, mentions), email verification when users sign up, and password resets. This requires an SMTP email service."),
      gap(),
      para([normal("Email is configured through the "), bold("admin panel"), normal(" (Administration > Settings > Email). You just need SMTP credentials from your email provider \u2014 server address, port, username, and password. We used SMTP2GO during development, but any SMTP provider works.")]),

      // ── 5. AI FEATURES ────────────────────────────────────────
      h1("5. AI Features"),
      para("The platform includes AI-powered features (e.g., discussion summarization). These require an API key from an AI provider. The platform supports multiple providers:"),
      bullet("Google Gemini"),
      bullet("Anthropic (Claude)"),
      bullet("OpenAI (ChatGPT)"),
      gap(),
      para([normal("The AI provider and API key are configured through the "), bold("admin panel"), normal(". You only need one provider \u2014 pick whichever your organization prefers or already has an account with.")]),

      // ── 6. ADMIN PANEL ────────────────────────────────────────
      h1("6. Admin Panel"),
      para([normal("A lot of the platform\u2019s configuration is managed through the built-in "), bold("admin panel"), normal(" (accessible at "), code("/admin"), normal(" on your site). This includes:")]),
      bullet("Email / SMTP setup"),
      bullet("AI provider configuration"),
      bullet("File upload settings and limits"),
      bullet("User registration and access controls"),
      bullet("Site branding (logo, colors, site name)"),
      bullet("Navigation menus and categories"),
      bullet("Language and localization settings"),
      gap(),
      para("It would be helpful for whoever manages the platform to become familiar with the admin panel, as most day-to-day configuration changes are made there rather than in code or config files."),

      // ── 7. ENVIRONMENT VARIABLES ──────────────────────────────
      h1("7. Environment Variables"),
      para("The following environment variables need to be set on the server. These are the main settings that connect all the pieces together:"),
      gap(),
      makeTable(
        ["Variable", "What It Does", "Example"],
        [
          ["NODE_ENV", "Set to \"production\" for live deployment", "production"],
          ["URL", "The public URL where the site will be accessed", "https://cop.example.ci"],
          ["PORT", "Port the app listens on (default 4567)", "4567"],
          ["SECRET", "A unique random string for session security", "(generate a UUID)"],
          ["DATABASE", "Database type (always \"postgres\")", "postgres"],
          ["POSTGRES_HOST", "Database server address", "(from your DB provider)"],
          ["POSTGRES_PORT", "Database port", "5432"],
          ["POSTGRES_USERNAME", "Database username", "(from your DB provider)"],
          ["POSTGRES_PASSWORD", "Database password", "(from your DB provider)"],
          ["POSTGRES_DATABASE", "Database name", "(from your DB provider)"],
          ["POSTGRES_SSL", "Must be true for remote databases", "true"],
          ["S3_UPLOADS_BUCKET", "Your R2 bucket name", "(from Cloudflare)"],
          ["S3_UPLOADS_ENDPOINT", "R2 endpoint URL", "(from Cloudflare)"],
          ["S3_UPLOADS_HOST", "Public URL for stored files", "(your custom domain or R2 URL)"],
          ["S3_UPLOADS_ACCESS_KEY_ID", "R2 access key", "(from Cloudflare)"],
          ["S3_UPLOADS_SECRET_ACCESS_KEY", "R2 secret key", "(from Cloudflare)"],
        ],
        [3200, 3600, 2226]
      ),
      gap(),
      para([normal("Email and AI settings are "), bold("not"), normal(" set through environment variables \u2014 they are configured in the admin panel as described in sections 4, 5, and 6 above.")]),

      // ── SUMMARY ───────────────────────────────────────────────
      gap(),
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 8 } },
        spacing: { before: 200, after: 120 },
        children: [new TextRun({ text: "Summary", bold: true, font: "Calibri", size: 26, color: BLUE })],
      }),
      makeTable(
        ["What You Need", "Where to Get It"],
        [
          ["Server running Node.js 22", "Render, Hetzner, DigitalOcean, or any VPS"],
          ["PostgreSQL database", "Neon, Supabase, or any PostgreSQL host"],
          ["Cloudflare R2 storage", "Cloudflare account with R2 enabled"],
          ["SMTP email service", "SMTP2GO, Mailgun, SendGrid, or any provider"],
          ["AI provider API key", "Gemini, Anthropic, or OpenAI account"],
        ],
        [4500, 4526]
      ),
    ],
  }],
});

// ── Generate ─────────────────────────────────────────────────────────
const OUTPUT = "/home/edguard/Documents/NodeBB/docs/CoP-Technical-Requirements.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`Generated: ${OUTPUT}`);
  console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error("Failed:", err);
  process.exit(1);
});
