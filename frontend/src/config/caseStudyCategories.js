

export const STANDARD_TYPES = [
    "Artificial Intelligence",
    "Mobile App Development",
    "Software Development",
    "Website Development",
    "Digital Transformation",
    "Desktop Application",
];

export const CASE_STUDY_CATEGORIES = [
    {
        slug: "artificial-intelligence",
        label: "Artificial Intelligence",
        shortLabel: "Artificial Intelligence",
        types: ["artificial intelligence"],
    },
    {
        slug: "software-development",
        label: "Software Development",
        shortLabel: "Software Development",
        types: ["software development"],
    },
    {
        slug: "mobile-app-development",
        label: "Mobile App Development",
        shortLabel: "Mobile App Development",
        types: ["mobile app development"],
    },
    {
        slug: "web-digital-desktop",
        label: "Web, Digital & Desktop Solutions",
        shortLabel: "Web, Digital & Desktop",
        types: [
            "website development",
            "digital transformation",
            "desktop application",
        ],
    },
];

/** Normalize a Type/label value for comparison. */
export const normalizeType = (value) =>
    typeof value === "string" ? value.trim().toLowerCase() : "";

/** Read all `Type` chip values from a case-study record as a normalized array. */
export function getCaseStudyTypes(doc) {
    const chips = doc?.hero?.metaChips;
    const hits = (Array.isArray(chips) ? chips : []).filter(
        (c) => normalizeType(c?.label) === "type"
    );
    const types = new Set();
    for (const h of hits) {
        if (!h?.value) continue;
        const parts = String(h.value).split(",").map((s) => s.trim()).filter(Boolean);
        for (const p of parts) {
            types.add(normalizeType(p));
        }
    }
    return Array.from(types);
}

/** Read the `Type` chip value from a case-study record (joined string). */
export function getCaseStudyType(doc) {
    const types = getCaseStudyTypes(doc);
    return types.join(", ");
}

/** Category whose `slug` matches, or null. */
export function getCategoryBySlug(slug) {
    if (!slug) return null;
    const target = normalizeType(slug);
    return CASE_STUDY_CATEGORIES.find((c) => c.slug === target) || null;
}

/** Categories that match any given raw Type value(s), or empty array. */
export function getCategoriesForTypes(typeValues) {
    const list = Array.isArray(typeValues)
        ? typeValues.map(normalizeType)
        : String(typeValues || "").split(",").map((s) => normalizeType(s.trim())).filter(Boolean);
    if (list.length === 0) return [];
    return CASE_STUDY_CATEGORIES.filter((category) =>
        category.types.some((t) => list.includes(t))
    );
}

/** Category that owns a given raw Type value, or null (returns first match). */
export function getCategoryForType(typeValue) {
    const categories = getCategoriesForTypes(typeValue);
    return categories[0] || null;
}

/**
 * Categories for the given Type value(s), ordered by the ORDER THE TYPES WERE
 * WRITTEN rather than by CASE_STUDY_CATEGORIES order.
 *
 * The admin's Type chip preserves selection order — ticking Mobile App
 * Development and then Artificial Intelligence stores
 * "Mobile App Development, Artificial Intelligence" — so the first type listed
 * is the one the author considers primary. The listing page uses this to decide
 * which section a case study appears in, which means an editor can move a case
 * study between sections just by re-ticking its types in a different order,
 * with no code change.
 *
 * A type that belongs to no category is skipped, so a custom value never
 * silently swallows the decision.
 */
export function getCategoriesForTypesInOrder(typeValues) {
    const list = Array.isArray(typeValues)
        ? typeValues.map(normalizeType).filter(Boolean)
        : String(typeValues || "").split(",").map((s) => normalizeType(s.trim())).filter(Boolean);

    const seen = new Set();
    const ordered = [];
    for (const type of list) {
        const category = CASE_STUDY_CATEGORIES.find((c) => c.types.includes(type));
        if (category && !seen.has(category.slug)) {
            seen.add(category.slug);
            ordered.push(category);
        }
    }
    return ordered;
}

/** True when a case-study record belongs to the given category. */
export function isInCategory(doc, category) {
    if (!category) return false;
    const docTypes = getCaseStudyTypes(doc);
    return category.types.some((t) => docTypes.includes(t));
}

/** Path to the filtered listing for a category slug. */
export const categoryHref = (slug) =>
    slug ? `/case-studies/category/${slug}` : "/case-studies";
