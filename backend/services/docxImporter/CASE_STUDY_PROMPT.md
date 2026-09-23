# Case Study Latest — DOCX import contract + master prompt

Same pipeline as Service-by-Country / Service-by-City:

```
.docx → mammoth → parser.js (blocks) → sectionParser.js (sections/entries/fields)
      → caseStudyMapper.js → CaseStudyForm.onPopulate → form state
```

The parser is **structure-first**: it only reads section headings, field
labels and numbered entry lines. It never inspects the prose. So the whole job
of the writer (human or LLM) is to emit the right *shape*. Part A below is the
prompt that makes an LLM emit that shape. Part B is the exact contract the
mapper implements.

---

## Part A — MASTER PROMPT

Paste this into Claude/ChatGPT together with the raw research (repo notes,
client brief, call transcript). The output goes into Word, saved as `.docx`,
then uploaded on **Add / Edit Case Study Latest → Import from DOCX**.

---

You are writing a case study document for the Akoode CMS. The document is
uploaded to an admin panel and read by a structure-first DOCX importer, so the
STRUCTURE below is a hard contract. The content is yours; the structure is not.

### NON-NEGOTIABLE RULES

1. Output the sections below in the exact order given, each as a **Heading 2**
   line containing exactly the section name shown. No extra sections, no
   renamed sections, no numbering of your own.
2. Field labels are written as `Label: value` on their own line. Use the exact
   label spellings listed. Never invent a label.
3. Repeatable items start with `<Keyword> <number>` on its own line
   (`Card 1`, `Step 3`, `Feature 2`). Everything under it, up to the next entry
   line or section heading, belongs to that item.
4. A label ending in a bare colon (`Bullets:`) means the value is the bulleted
   list on the following lines. Use a real Word bulleted list.
5. Never put two fields on one line except in the documented compound form
   `Keyword N - Label: value | Label: value`.
6. Leave a field out entirely if you have nothing for it. Never write "N/A",
   "TBD", or an empty value.
7. No images. Images are uploaded by hand in the admin. Only ever supply the
   *alt text* fields.
8. Icon values must be react-icons `Fi*` names (FiLayers, FiCode, FiShield…).
   One icon per icon field, nothing else on the line.
9. Plain prose inside body/description fields — no markdown syntax, no bold or
   italic markers, no headings inside a field value.
10. British English, specific, evidence-led. No superlatives, no "cutting-edge",
    no invented metrics. Every number must come from the source material.

### LENGTH TARGETS

- Hero body: 40–60 words.
- About the Client body: 3 paragraphs, 250–350 words total.
- Section intros: 50–90 words.
- Card / step descriptions: 25–45 words.
- Feature descriptions: 45–70 words, plus exactly 3 bullets of 8–16 words.
- Meta description: 150–160 characters.

### DOCUMENT TEMPLATE

```
Core Information
Title: <full case study title>
Slug: <kebab-case-url-slug>
Keywords: <5-8 comma-separated keywords>

Hero
Heading: <lead half of the H1, ends mid-sentence>
Heading Accent: <coloured second half of the H1>
Body: <one paragraph, 40-60 words>
Hero Image Alt: <alt text>
Listing Image Alt: <alt text>

Meta Chips
Chip 1 - Label: Services | Value: <comma-separated Akoode service names>
Chip 2 - Label: Industry | Value: <industry>
Chip 3 - Label: Client | Value: <client, country>
Chip 4 - Label: Type | Value: <comma-separated category types>

Floating Cards
Floating Card 1 - Icon: Fi<Name> | Heading: <2-3 words> | Text: <4-6 words>
Floating Card 2 - Icon: Fi<Name> | Heading: <2-3 words> | Text: <4-6 words>
Floating Card 3 - Icon: Fi<Name> | Heading: <2-3 words> | Text: <4-6 words>

About the Client
Heading: <lead>
Heading Accent: <accent>
Body: <paragraph 1>
<paragraph 2>
<paragraph 3>
CTA Text: Start Your Project
CTA Link: /post-requirement
Project Info Title: Project Info

Stats
Stat 1 - Value: <number> | Title: <2-4 words>
Sub: <one sentence>
Stat 2 - Value: <number> | Title: <2-4 words>
Sub: <one sentence>
Stat 3 - Value: <number> | Title: <2-4 words>
Sub: <one sentence>
Stat 4 - Value: <number> | Title: <2-4 words>
Sub: <one sentence>

Project Info
Project Info 1 - Icon: FiUser | Label: Client | Value: <value>
Project Info 2 - Icon: FiLayers | Label: Industry | Value: <value>
Project Info 3 - Icon: FiCheckCircle | Label: Use Case | Value: <value>
Project Info 4 - Icon: FiCode | Label: Solution | Value: <value>
Project Info 5 - Icon: FiAward | Label: Engagement | Value: <Fixed Cost | Time & Material | Dedicated Team>

The Problem
Heading: <lead>
Heading Accent: <accent>
Intro: <50-90 words>
Card 1 - Icon: Fi<Name> | Title: <3-6 words>
Description: <25-45 words>
Card 2 - Icon: Fi<Name> | Title: <3-6 words>
Description: <25-45 words>
Card 3 - Icon: Fi<Name> | Title: <3-6 words>
Description: <25-45 words>
Card 4 - Icon: Fi<Name> | Title: <3-6 words>
Description: <25-45 words>
Quote: <one sharp sentence naming the real constraint>

Project Objectives
Heading: <lead>
Heading Accent: <accent>
Intro: <50-90 words>
Card 1 - Number: 01 | Title: <4-7 words>
Description: <35-55 words>
Card 2 - Number: 02 | Title: <4-7 words>
Description: <35-55 words>
Card 3 - Number: 03 | Title: <4-7 words>
Description: <35-55 words>
Card 4 - Number: 04 | Title: <4-7 words>
Description: <35-55 words>
Card 5 - Number: 05 | Title: <4-7 words>
Description: <35-55 words>

The Solution
Heading: <lead>
Heading Accent: <accent>
Intro: <50-90 words>
Step 1 - Number: 01 | Title: <3-7 words>
Description: <40-70 words>
Step 2 - Number: 02 | Title: <3-7 words>
Description: <40-70 words>
Step 3 - Number: 03 | Title: <3-7 words>
Description: <40-70 words>
Step 4 - Number: 04 | Title: <3-7 words>
Description: <40-70 words>
Step 5 - Number: 05 | Title: <3-7 words>
Description: <40-70 words>

Core Features
Heading: <lead>
Heading Accent: <accent>
Feature 1 - Tag: Highlight 01 | Title: <5-9 words>
Media Alt: <alt text>
Description: <45-70 words>
Bullets:
- <bullet>
- <bullet>
- <bullet>
Feature 2 - Tag: Highlight 02 | Title: <5-9 words>
Media Alt: <alt text>
Description: <45-70 words>
Bullets:
- <bullet>
- <bullet>
- <bullet>
(repeat through Feature 5)

Tech Stack
Heading: <lead>
Heading Accent: <accent>
Intro: <60-100 words on why this stack, given the constraints>
CTA Text: Start Your Project
CTA Link: /post-requirement
Category 1 - Icon: FiSmartphone | Title: <category name>
Description: <30-50 words>
Pills: <comma-separated technology names>
Category 2 - Icon: FiMonitor | Title: <category name>
Description: <30-50 words>
Pills: <comma-separated technology names>
Category 3 - Icon: FiDatabase | Title: <category name>
Description: <30-50 words>
Pills: <comma-separated technology names>

Engineering Challenges
Heading: <lead>
Heading Accent: <accent>
Intro: <60-100 words>
Hub Badge: <product name>
Hub Image Alt: <alt text>
CTA Text: Let us Solve Your Challenges
CTA Link: /post-requirement
Card 1 - Icon: Fi<Name> | Title: <5-9 words>
Problem: <25-45 words, the failure mode>
Approach: <25-45 words, what was actually done>
Stat: <short outcome line, under 10 words>
Card 2 - Icon: Fi<Name> | Title: <5-9 words>
Problem: <...>
Approach: <...>
Stat: <...>
(repeat through Card 4)

Results & Impact
Heading: <lead>
Heading Accent: <accent>
Intro: <60-100 words>
Column 1 - Label: BEFORE
Card 1 - Icon: Fi<Name> | Title: <3-5 words>
Description: <20-35 words>
Card 2 - Icon: Fi<Name> | Title: <3-5 words>
Description: <20-35 words>
Card 3 - Icon: Fi<Name> | Title: <3-5 words>
Description: <20-35 words>
Card 4 - Icon: Fi<Name> | Title: <3-5 words>
Description: <20-35 words>
Column 2 - Label: OUR SOLUTION
Card 1 - Icon: Fi<Name> | Title: <3-5 words>
Description: <20-35 words>
(4 cards)
Column 3 - Label: AFTER
Card 1 - Icon: Fi<Name> | Title: <3-5 words>
Description: <20-35 words>
(4 cards)

Result Stats
Result Stat 1 - Icon: Fi<Name> | Value: <number> | Label: <2-4 words>
Description: <15-25 words>
Result Stat 2 - Icon: Fi<Name> | Value: <number> | Label: <2-4 words>
Description: <15-25 words>
Result Stat 3 - Icon: Fi<Name> | Value: <number> | Label: <2-4 words>
Description: <15-25 words>

Use Cases
Heading: <lead>
Heading Accent: <accent>
Intro: <50-90 words>
CTA Text: <button label>
CTA Link: /post-requirement
CTA Note: <one short reassurance line>
Item 1 - Icon: Fi<Name> | Title: <3-6 words>
Description: <25-40 words>
Item 2 - Icon: Fi<Name> | Title: <3-6 words>
Description: <25-40 words>
(3-6 items)

Why Akoode
Heading: <lead>
Heading Accent: <accent>
Intro: <50-90 words>
Card 1 - Icon: Fi<Name> | Title: <3-6 words>
Description: <25-40 words>
(3-4 cards)

Final CTA
Heading: <one line>
Subtitle: <one line>

Meta
Meta Title: <55-60 characters>
Meta Description: <150-160 characters>
```

---

## Part B — THE CONTRACT (what the mapper implements)

### Section headings → schema keys

| Heading in the doc | Aliases also accepted | Schema key |
|---|---|---|
| Core Information | Core Info | *(core fields)* |
| Hero | — | `hero` |
| About the Client | Rethinking, The Client | `rethinking` |
| The Problem | Challenges, Problem | `challenges` |
| Project Objectives | What We Set Out To Build, Build, Objectives | `build` |
| The Solution | Pipeline, How We Built It, Solution | `pipeline` |
| Core Features | What Makes This Powerful, Powerful, Features | `powerful` |
| Tech Stack | Technology Stack | `techStack` |
| Engineering Challenges | Key Challenges | `keyChallenges` |
| Results & Impact | What Changed, Results | `whatChanged` |
| Use Cases | Analytics, Performance Analytics | `analytics` |
| Why Akoode | Why Choose Us, Why Choose | `whyChoose` |
| More Case Studies | — | `moreCaseStudies` |
| Final CTA | CTA | `finalCta` |
| Meta | Meta Information, SEO Meta | `meta` |

Leading numbering (`3.`), a trailing `Section`, a parenthetical, and a trailing
`- N items` are stripped before matching, exactly as today. Content before the
first recognised heading falls into Core Information.

**Collision to watch:** the existing `SECTION_ALIASES` already maps
`"features" → process` and `"solution"`-ish wording for the services pages. The
case-study alias table must be a **separate map**, selected by import kind —
not merged into the country/city one, or `Core Features` in a country document
starts routing to `powerful`.

### Group headers (a section with two runs of entries)

`Meta Chips`, `Floating Cards`, `Stats`, `Project Info`, `Result Stats`.

Without them, `Stat 1` under About the Client and `Result Stat 1` under
Results & Impact are indistinguishable and land in the wrong bucket.

### Entry keywords

`Chip`, `Floating Card`, `Stat`, `Project Info`, `Card`, `Step`, `Feature`,
`Category`, `Column`, `Result Stat`, `Item` — each followed by a number, then
optionally ` - Label: value | Label: value`.

`Card N` inside `Column N` nests: a `Column` entry opens a column, and every
`Card` until the next `Column` belongs to it.

### Shapes the parser also accepts (real Word documents)

The template in Part A is the recommended form, but authors write in Word and
the importer handles what that actually produces. All of the following are
equivalent to the template:

- **Fields as bullets.** Nearly every field in a real document is a bullet
  point. List items are parsed as field lines, not as one opaque value. A
  bulleted list is only treated as a *value* when it directly follows a bare
  `Bullets:` label.
- **`·` as a field separator**, as well as `|`:
  `Icon: FiGrid · Title: Cart Actions · Description: A cart is where…`
  A segment after the separator that is not itself `Label: value` is glued back
  onto the previous value, so `Meta Title: Something | Akoode` stays one field.
- **Unnumbered entries.** A run of bullets under a group header needs no
  `Card 1` / `Card 2` lines. The next entry opens when the field that opened
  the current one reappears — a second `Icon:` starts a second card, a second
  `Tag:` a second feature, a second `Number:` a second step. Long-form fields
  are exempt, so a second `Description:` is a continuation, not a new entry.
- **Numbered section headings** — `1. Core Information`, `14. Meta (SEO)`. The
  numbering, a trailing `Section`, and any parenthetical are stripped.
- **`—` in an entry line** — `Column 1 — Label: BEFORE`.
- **Slash-separated lists** — `Pills: OpenCart / Product Catalogue / Cart` and
  `Bullets: One thing / Another thing / A third`.
- **Image guidance is dropped.** `Image Note:`, `Media:`,
  `Media (image only): upload`, `Hero Image (right side):`,
  `Hub (centre) Image: upload` carry no page content and are discarded rather
  than being appended to the body copy above them. They still steer which image
  a following bare `Alt Text:` belongs to — the `Alt Text` under
  `Hero Image` becomes `heroImageAlt`, the one under `Listing Image` becomes
  `listingImageAlt`, the one under `Hub (centre) Image` becomes `hubImageAlt`,
  and the one under `Media` becomes a feature's `mediaAlt`.
- **`________` separator rules** between sections are ignored.
- **Label variants**: `Body / subtitle` = `Body`, `Body copy` = `Body`,
  `Project Info card title` = `Project Info Title`, `Quote strip` = `Quote`,
  `Hub badge text` = `Hub Badge`, `Stat pill text` = `Stat`,
  `Subtext` = the Final CTA subtitle, `Slug (URL)` = `Slug`.

### Field labels → canonical keys (additions to `labels.js`)

| Label in doc | Canonical | Lands on |
|---|---|---|
| Heading / Heading Accent | `heading` / `headingAccent` | every section |
| Body / Intro / Description | `body` / `intro` / `desc` | section or entry |
| Title | `title` | entry |
| Number | `n` | build cards, pipeline steps |
| Icon | `icon` | entry |
| Value / Label / Sub | `value` / `label` / `sub` | stats, chips, project info |
| Text | `sub` | floating card subtitle |
| Tag | `tag` | powerful features |
| Bullets | `bullets` | powerful features |
| Pills | `pills` | tech stack categories |
| Problem / Approach / Stat | `problem` / `approach` / `stat` | keyChallenges cards |
| Quote | `quote` | challenges |
| Hub Badge / Hub Image Alt | `hubBadge` / `hubImageAlt` | keyChallenges |
| Hero Image Alt / Listing Image Alt | `heroImageAlt` / `listingImageAlt` | hero |
| Media Alt | `mediaAlt` | powerful features |
| Project Info Title | `projectInfoTitle` | rethinking |
| CTA Text / CTA Link / CTA Note | `ctaText` / `ctaLink` / `ctaNote` | per section |
| Subtitle | `subtitle` | finalCta |
| Meta Title / Meta Description | `metaTitle` / `metaDescription` | meta |

### Field-level quirks the mapper must honour

- **Floating cards** are stored as `{ label, value, unit }` where `unit` = the
  icon name, `label` = the heading, `value` = the subtitle text
  (`CaseStudyForm.jsx:550`). The doc labels them `Icon` / `Heading` / `Text`;
  the mapper does the swap.
- **`metaChips[].services`** — when a chip's label is `Services`, the value is
  split on commas and matched against the live services list to build
  `{ name, link }`. Unmatched names stay as plain text and raise a warning, not
  an error.
- **`show` toggles** — a section is switched on iff it produced content.
- **Images are never imported.** Only the `*Alt` fields are filled; the admin
  uploads the files afterwards.
- **Validation errors**: missing `Title` or `Slug`. Everything else is a
  warning, so a partial document still populates.

### Code touched to ship this

| File | Change |
|---|---|
| `backend/services/docxImporter/labels.js` | add the labels + group headers above |
| `backend/services/docxImporter/sectionParser.js` | per-kind section alias map, new entry keywords, `Column`→`Card` nesting |
| `backend/services/docxImporter/caseStudyMapper.js` | **new** — sections → CaseStudyLatest shape |
| `backend/services/docxImporter/index.js` | `importCaseStudyDocx()` + its own `ALL_SECTIONS` |
| `backend/services/docxImporter/validator.js` | `validateCaseStudyDocument()` |
| `backend/routes/docxImportRouter.js` | `POST /case-study-latest` |
| `backend/controller/docxImportCtrl.js` | `importCaseStudyLatestDocx` |
| `frontend/src/api/docxImport.ts` | `importCaseStudyLatestDocxAPI` |
| `frontend/src/components/admin/DocxImportPanel.jsx` | section checklist must be a prop, not the hardcoded country/city list |
| `.../case-study-latest/_components/CaseStudyForm.jsx` | mount the panel + `onPopulate` mapping nested data → flat form keys |
