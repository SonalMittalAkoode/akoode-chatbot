/**
 * Enables the per-market "cities we serve" map band (`citiesMap`) on a
 * service-by-country document.
 *
 * The frontend renders this section only when `citiesMap.show === true` — it
 * deliberately defaults OFF so markets don't inherit another country's map —
 * and the admin form has no fields for it yet, so this script is the way to
 * switch it on until the CMS catches up.
 *
 * Usage:
 *   node scripts/enableCitiesMap.js                                  # dry run, defaults below
 *   node scripts/enableCitiesMap.js --apply
 *   node scripts/enableCitiesMap.js --market=us --slug=... --variant=us --apply
 *   node scripts/enableCitiesMap.js --off --apply                    # hide it again
 *
 * Requires MONGODB_URL (same env var used by config/dbConnect.js).
 */

require("dotenv").config();
const mongoose = require("mongoose");

const APPLY = process.argv.includes("--apply");
const OFF = process.argv.includes("--off");

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
};

const MARKET = arg("market", "us");
const SLUG = arg("slug", "software-development-company");
// Must match a key in VARIANTS in frontend/src/app/country/_components/CitiesMap.jsx
const VARIANT = arg("variant", "us");

async function main() {
  if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL is not set. Aborting.");
    process.exit(1);
  }

  console.log(`Mode: ${APPLY ? "APPLY (writing changes)" : "DRY RUN (no writes)"}`);
  console.log(`Target: market="${MARKET}" slug="${SLUG}"`);
  console.log(`Action: ${OFF ? "hide section" : `show section, variant="${VARIANT}"`}\n`);

  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });

  const col = mongoose.connection.db.collection("servicebycountries");
  const doc = await col.findOne(
    { market: MARKET, slug: SLUG },
    { projection: { title: 1, market: 1, slug: 1, citiesMap: 1 } }
  );

  if (!doc) {
    console.error(`No document found for market="${MARKET}" slug="${SLUG}".`);
    console.error("Check the exact market/slug pair in the admin list, then re-run with --market= and --slug=.");
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Found: "${doc.title}"`);
  console.log(`  citiesMap before: ${JSON.stringify(doc.citiesMap ?? null)}`);

  const $set = OFF
    ? { "citiesMap.show": false }
    : { "citiesMap.show": true, "citiesMap.variant": VARIANT };

  console.log(`  citiesMap $set:   ${JSON.stringify($set)}`);

  if (!APPLY) {
    console.log("\nDry run — nothing written. Re-run with --apply to save.");
    await mongoose.disconnect();
    return;
  }

  const res = await col.updateOne({ _id: doc._id }, { $set });
  console.log(`\nMatched ${res.matchedCount}, modified ${res.modifiedCount}.`);

  const after = await col.findOne({ _id: doc._id }, { projection: { citiesMap: 1 } });
  console.log(`  citiesMap after:  ${JSON.stringify(after.citiesMap)}`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
