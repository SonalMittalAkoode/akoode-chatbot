# DOCX import — document structure

The importer is **structure-first**: it reads section headings and field
labels, never the authored content. Any document following this shape imports,
whatever city/country/copy it describes.

## Section headings

One heading per section. Leading numbering (`1.`, `16.`), a trailing
"Section", a parenthetical `(Trust Section)`, and a trailing `- N items` are
all ignored — so `Hero`, `2. Hero` and `Hero Section` are equivalent.

Recognized: `Core Information`, `Hero`, `Trust` / `Choose Us`,
`Why Location`, `Services Offered`, `Process` / `How We Deliver` /
`What We Do`, `Tech Stack`, `Industries` / `Industries We Serve`,
`Engagement Models`, `FAQ`, `Case Studies`, `Testimonials`,
`Blog` / `Blog Insights`, `Why Choose Us`, `Final CTA`, `Meta`.

The Why Location section is usually named after the page's location
(`Why Canada`, `Why the UK`, `Why Toronto`) — any `Why <place>` heading maps
there. `Why Choose Us` is matched first and always maps to Why Choose;
matching is longest-alias-first so `Why Choose Us` never falls into
`Choose Us`.

> **`Process` maps to What We Do, not Services Offered.** In this CMS
> `process` is the schema field behind *Services Offered* (`process.services[]`)
> while `whatWeDo` holds the delivery stages (`whatWeDo.steps[]`). The
> documents label the delivery stages "Process Section", so that is where they
> are routed.

Content before the first recognized heading is treated as Core Information.

## Field labels — three accepted forms

**1. Bare label, value on the next line** (section-level):

```
Section Heading
Reliability Engineering for a Market...
```

Only labels in the curated vocabulary (`labels.js`) are recognized this way,
so ordinary prose is never mistaken for a label. A bare label whose field can
belong to an entry (`Heading`, `Paragraph`, `Bullet Points`, `Tags`,
`CTA Button Link`, …) stays inside the open entry; any other label
(`Section Image / Alt Text`, `Card Footer`, `Intro`) closes the entry and
writes at section level.

Bullet lists do not have to be real Word lists — a `Bullet Points` label
followed by one plain paragraph per bullet collects them all. The same holds
for `Deliverables` and `Perks`.

**2. Inline `Label: value`** (stays in the current scope — entry or section):

```
Number: 01
Heading (H2): Custom Ecommerce Development...
Icon: FiHome
```

A colon with nothing after it means the value follows on the next lines —
used for bulleted lists (`Bullet Points:`, `Deliverables:`).

**3. Compound entry line** with pipe-separated inline fields:

```
Feature 1 - Icon: FiLayers | Title: Built for a Market...
Card 1 - Value: 4.9 | Label: Google Rating
```

Parenthetical qualifiers are folded into the label first and stripped only as
a fallback, so `Main Heading (H1)`, `Heading (H2)`, `Slug (URL)` and
`Short Title (nav)` resolve to their canonical field while `Heading (lead)`
and `Heading (accent)` stay apart. `H1` / `H1 (on-page)` and `Hero Body` are
accepted alongside `Heading` and `Body`.

## Repeatable entries

Four accepted forms:

1. **Keyword + number** — `Service 1`, `Stage 3`, `Feature 2`, `Tab 1`,
   `Industry 5`, `FAQ 2`, `Card 1`, `Client Love 1`, and also `Step`, `Item`,
   `Model`, `Testimonial`, `Case Study`, `Platform Rating`, `Hero Card`,
   `Stat`, `Pill`.
2. **Counter** — `01 / 06  The Product People Actually Carry With Them`.
3. **Q&A** — `Q1: <question>` followed by `A1: <answer>` (FAQ only).
4. **Plain numbering** — `1. Healthcare` or `01 - iOS App Development`, used
   only inside sections that hold repeatable items, and only when the text
   isn't itself a section name.
5. **Bold title line** — a fully bold line that is not a known label, inside a
   section that holds entries, starts an entry titled with that line
   (`**Real Estate**` above its description). ALL-CAPS bold is treated as an
   instruction to the editor (`STAT FEATURES (4)`), not a title.

A card slot that names no card (`Feature Card 1`, `Proof Card 2`) takes its
title from the paragraph underneath, split on the first spaced dash —
`Mountain Time Overlap - Structured Canada-India working hours...`. Hero stat
cards written as one line (`1. Google Rating - 4.9 (91 reviews)`) are split
the same way into label / value / sub.

### Group headers

When a section holds two different runs of entries, the header above each run
identifies which is which — `Features` vs `What Clients Love` / `Client Love
Items` in Choose Us, `Hero Stat Cards` / `Stat Cards` in Hero, `Feature
Cards` / `Stat Features`, `Proof Cards`, `Platform Ratings`. Without the
header, entries written as `Item N Title: ...` are indistinguishable and all
land in the first bucket.

Text after the number is used as the entry's title when the entry has no
explicit `Title:` / `Heading:` field (`Tab 1 - Ecommerce Platforms`). An
unlabelled line directly beneath an entry with no body becomes its body —
which is how a tech-stack tab's comma-separated technology list is picked up.

Group headers that merely introduce a run of entries (`Hero Stat Cards`,
`Features (Trust Section) - 4 items`, `Client Love Items`, `Proof Cards`)
consume nothing.

## Slug

The slug may be the bare value (`mobile-app-development-company`) or the full
public path (`/canada/mobile-app-development-company`). A path is split into
the existing fields — `/{market}/{slug}` for country pages,
`/{market}/{citySlug}/{slug}` for city pages — rather than dropped whole into
the slug field, which would double the market segment in the public URL.

## Page Template

Accepts the enum value or the admin dropdown's label — `ecommerce-development`
and `Ecommerce Development` both resolve. An unrecognized value is reported as
a warning and the field is left for the admin (never silently substituted).

## Fallbacks

- **City name**: documents rarely carry a `City Name` field — it is read back
  off the slug path (`/ca/edmonton/...` → `Edmonton`) with a warning, rather
  than failing the import.
- **Meta**: `Meta Title` / `Meta Description` written into the Core Info block
  (`Core Info & Meta`) are used when there is no Meta section of its own.
- **`Body`** stands in for a section's `Intro` / `Subtitle` / `Paragraph 1`
  when the document gives the section only one paragraph.
- **Editor notes**: everything from a heading like `NOTES FOR ... — DO NOT
  PASTE INTO THE CMS` onward is ignored.

## What the importer does NOT do

- **Images**: never touched. Image fields are always left for the admin.
- **Case Studies / Testimonials / Blog picks**: these reference existing DB
  records by `_id`, which a document cannot safely supply. Only their
  heading/subtitle copy is imported.
- **Country Page records, templates, slugs**: never created or modified. An
  unresolved country reference (including a failed lookup) is a warning.
