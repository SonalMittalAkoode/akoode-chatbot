/**
 * One-time cleanup for the HtmlEditor `rel="noopener noreferrer nofollow"`
 * bug: the Tiptap Link extension previously baked that rel (plus
 * target="_blank") into every link's stored HTML at authoring time,
 * regardless of whether the link pointed to an internal akoode.com page or
 * an external site. This script re-derives the correct rel/target per link
 * (same rule as frontend/src/utils/processHtmlLinks.js: internal links lose
 * nofollow/noopener/noreferrer/target, external links keep
 * noopener+noreferrer+nofollow) across every rich-text field in every
 * collection that uses the shared HtmlEditor component.
 *
 * Usage:
 *   node scripts/fixLinkRels.js            # dry run — reports what would change, writes nothing
 *   node scripts/fixLinkRels.js --apply    # writes the fixes to MongoDB
 *
 * Requires MONGODB_URL (same env var used by config/dbConnect.js) and
 * optionally SITE_ORIGIN (defaults to https://www.akoode.com).
 */

const mongoose = require("mongoose");

const SITE_ORIGIN = (process.env.SITE_ORIGIN || "https://www.akoode.com").replace(/\/+$/, "");
const APPLY = process.argv.includes("--apply");

// Collections that use the shared HtmlEditor (Tiptap) component for at least
// one field. Every string field in each document is scanned generically, so
// exact field names don't need to be enumerated per-schema.
const COLLECTIONS = [
  "blogs",
  "industries",
  "jobpostings",
  "faqs",
  "casestudies",
  "casestudylatests",
  "servicebycities",
  "servicebycountries",
  "updatedservices",
  "services",
  "servicestwhatweoffers",
];

function isInternalHref(href) {
  if (!href || typeof href !== "string") return true;
  const h = href.trim();
  if (h.startsWith("#") || h === "" || h.startsWith("/")) return true;
  try {
    const base = new URL(SITE_ORIGIN);
    return new URL(h, SITE_ORIGIN).origin === base.origin;
  } catch {
    return false;
  }
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

// Mirrors frontend/src/utils/processHtmlLinks.js so the DB cleanup and the
// render-time fix agree on the same internal/external rule.
function fixLinkRels(html) {
  if (!html || typeof html !== "string" || !html.includes("<a")) return html;

  return html.replace(/<a\s+([^>]*?)>/gi, (fullMatch, attrs) => {
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1] : "";
    const internal = isInternalHref(href);

    const relMatch = attrs.match(/rel\s*=\s*["']([^"']*)["']/i);
    const relTokens = relMatch ? relMatch[1].split(/\s+/).filter(Boolean) : [];

    const withoutRel = attrs.replace(/\s*rel\s*=\s*["'][^"']*["']/gi, "").trim();
    const withoutTarget = internal
      ? withoutRel.replace(/\s*target\s*=\s*["'][^"']*["']/gi, "").trim()
      : withoutRel;

    const nextRelTokens = internal
      ? relTokens.filter((t) => !["noopener", "noreferrer", "nofollow"].includes(t.toLowerCase()))
      : uniq([...relTokens, "noopener", "noreferrer", "nofollow"]);

    const relAttr = nextRelTokens.length ? ` rel="${nextRelTokens.join(" ")}"` : "";
    const newAttrs = `${withoutTarget}${relAttr}`.trim();
    return `<a ${newAttrs}>`;
  });
}

// Walks a plain object/array, yielding [dotPath, stringValue] for every
// string leaf so we can $set the exact field back via dot notation without
// needing to know each schema's field names up front.
function* walkStrings(value, path = []) {
  if (typeof value === "string") {
    yield [path, value];
    return;
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* walkStrings(value[i], [...path, i]);
    return;
  }
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (key === "_id" || key === "__v") continue;
      yield* walkStrings(value[key], [...path, key]);
    }
  }
}

function pathToDotNotation(path) {
  return path.reduce((acc, segment) => (acc ? `${acc}.${segment}` : String(segment)), "");
}

async function processCollection(db, name) {
  const collection = db.collection(name);
  const exists = await db.listCollections({ name }).hasNext();
  if (!exists) {
    console.log(`skip ${name} (collection not found)`);
    return { docsChanged: 0, fieldsChanged: 0 };
  }

  // Full scan, filtered client-side per-string-field in the loop below.
  // Collections here are CMS content (small), not user-scale data, so this
  // is fine for a one-time job.
  const docs = await collection.find({}).toArray();

  let docsChanged = 0;
  let fieldsChanged = 0;
  const bulkOps = [];

  for (const doc of docs) {
    const setOps = {};
    let changedInDoc = false;

    for (const [path, str] of walkStrings(doc)) {
      if (!str.includes("<a") || !str.toLowerCase().includes("nofollow")) continue;
      const fixed = fixLinkRels(str);
      if (fixed !== str) {
        const dotPath = pathToDotNotation(path);
        setOps[dotPath] = fixed;
        changedInDoc = true;
        fieldsChanged++;
        console.log(`\n[${name}] _id=${doc._id} field=${dotPath}`);
        console.log(`  before: ${str.slice(0, 160)}${str.length > 160 ? "..." : ""}`);
        console.log(`  after:  ${fixed.slice(0, 160)}${fixed.length > 160 ? "..." : ""}`);
      }
    }

    if (changedInDoc) {
      docsChanged++;
      if (APPLY) {
        bulkOps.push({ updateOne: { filter: { _id: doc._id }, update: { $set: setOps } } });
      }
    }
  }

  if (APPLY && bulkOps.length) {
    const result = await collection.bulkWrite(bulkOps);
    console.log(`[${name}] wrote ${result.modifiedCount} document(s)`);
  }

  return { docsChanged, fieldsChanged };
}

async function main() {
  if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL is not set. Aborting.");
    process.exit(1);
  }

  console.log(`Mode: ${APPLY ? "APPLY (writing changes)" : "DRY RUN (no writes)"}`);
  console.log(`Site origin for internal/external check: ${SITE_ORIGIN}\n`);

  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });

  const db = mongoose.connection.db;
  let totalDocs = 0;
  let totalFields = 0;

  for (const name of COLLECTIONS) {
    const { docsChanged, fieldsChanged } = await processCollection(db, name);
    totalDocs += docsChanged;
    totalFields += fieldsChanged;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Documents affected: ${totalDocs}`);
  console.log(`Fields affected: ${totalFields}`);
  if (!APPLY && totalDocs > 0) {
    console.log(`\nRun again with --apply to write these changes.`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
