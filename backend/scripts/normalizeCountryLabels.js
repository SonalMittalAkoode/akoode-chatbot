require("dotenv").config();
const mongoose = require("mongoose");
const { normalizeCountryLabel } = require("../utils/normalizeCountryLabel");

const APPLY = process.argv.includes("--apply");

const preview = (value, width = 70) => {
  const text = String(value ?? "");
  return text.length > width ? `${text.slice(0, width)}…` : text;
};

async function main() {
  if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL is not set. Aborting.");
    process.exit(1);
  }

  console.log(`Mode: ${APPLY ? "APPLY (writing changes)" : "DRY RUN (no writes)"}`);
  console.log(`Host: ${process.env.MONGODB_URL.replace(/\/\/[^@]*@/, "//***@")}\n`);

  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });

  const countries = mongoose.connection.db.collection("servicebycountries");
  const cities = mongoose.connection.db.collection("servicebycities");

  // ── Country pages ─────────────────────────────────────────────────────────
  const countryDocs = await countries
    .find({}, { projection: { title: 1, country: 1, market: 1 } })
    .toArray();

  const labelByCountryId = new Map();
  let countryChanges = 0;

  for (const doc of countryDocs) {
    const next = normalizeCountryLabel(doc.country);
    labelByCountryId.set(String(doc._id), next);
    if (next === (doc.country ?? "")) continue;

    countryChanges += 1;
    console.log(`COUNTRY "${doc.title}" (${doc.market})`);
    console.log(`   before: ${JSON.stringify(preview(doc.country))}`);
    console.log(`   after:  ${JSON.stringify(next)}`);
    if (APPLY) await countries.updateOne({ _id: doc._id }, { $set: { country: next } });
  }

  // ── City pages ────────────────────────────────────────────────────────────
  const cityDocs = await cities
    .find({}, { projection: { title: 1, city: 1, country: 1, market: 1, countryRef: 1 } })
    .toArray();

  let cityChanges = 0;

  for (const doc of cityDocs) {
    const parentLabel = doc.countryRef ? labelByCountryId.get(String(doc.countryRef)) : undefined;
    const next = parentLabel || normalizeCountryLabel(doc.country);
    if (next === (doc.country ?? "")) continue;

    cityChanges += 1;
    console.log(`CITY    "${doc.city}" (${doc.market}) — ${doc.title}`);
    console.log(`   before: ${JSON.stringify(preview(doc.country))}`);
    console.log(`   after:  ${JSON.stringify(next)}`);
    if (APPLY) await cities.updateOne({ _id: doc._id }, { $set: { country: next } });
  }

  console.log(
    `\n${countryChanges} country page(s) and ${cityChanges} city page(s) ${APPLY ? "updated" : "would change"}.`
  );
  if (!APPLY && countryChanges + cityChanges > 0) {
    console.log("Dry run — nothing written. Re-run with --apply to save.");
  }
  if (APPLY && countryChanges + cityChanges > 0) {
    console.log("Revalidate or re-deploy the affected pages so breadcrumbs pick up the new label.");
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
