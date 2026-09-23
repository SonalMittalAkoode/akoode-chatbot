import resolveImageUrl from "@/utils/resolveImageUrl";
import {
    getCaseStudyTypes,
    getCategoriesForTypesInOrder,
} from "@/config/caseStudyCategories";

export const BUCKET_BY_SLUG = {
    "artificial-intelligence": "ai",
    "mobile-app-development": "mobile",
    "software-development": "software",
    "web-digital-desktop": "webDigitalDesktop",
};

const norm = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");

const stripHtml = (s) =>
    (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/** First ~`words` words of plain text, with an ellipsis if truncated. */
const excerpt = (s, words = 14) => {
    const parts = stripHtml(s).split(" ").filter(Boolean);
    if (parts.length <= words) return parts.join(" ");
    return `${parts.slice(0, words).join(" ")}…`;
};

/** Value of a meta chip by label (case-insensitive), or "". */
const chipValue = (chips, label) => {
    const target = norm(label);
    const hit = (Array.isArray(chips) ? chips : []).find(
        (c) => norm(c?.label) === target
    );
    return hit?.value || "";
};

export function toCard(doc) {
    const chips = doc?.hero?.metaChips || [];
    const image =
        resolveImageUrl(doc?.hero?.listingImage || doc?.hero?.heroImage) ||
        "/caseStudy/what_we_build.png";
    return {
        title: doc?.title || "Case Study",
        client: chipValue(chips, "Client"),
        category:
            chipValue(chips, "Industry") || chipValue(chips, "Type") || "Case Study",
        result: excerpt(doc?.hero?.body || doc?.meta?.description, 14),
        image,
        href: doc?.slug ? `/case-studies/${doc.slug}` : "/case-studies",
    };
}

export const MAX_CARDS_PER_SECTION = 6;

export function groupCaseStudiesByType(
    list,
    { limitPerCategory = MAX_CARDS_PER_SECTION } = {}
) {
    const buckets = Object.fromEntries(
        Object.values(BUCKET_BY_SLUG).map((k) => [k, []])
    );

    const placed = new Set();

    for (const doc of Array.isArray(list) ? list : []) {
        const docKey = doc?.slug || doc?._id;
        if (docKey && placed.has(docKey)) continue;

        const docTypes = getCaseStudyTypes(doc);
        const categories = getCategoriesForTypesInOrder(docTypes);

        for (const category of categories) {
            const key = BUCKET_BY_SLUG[category.slug];
            if (!key) continue;
            if (limitPerCategory > 0 && buckets[key].length >= limitPerCategory) continue;

            buckets[key].push(toCard(doc));
            if (docKey) placed.add(docKey);
            break;
        }
    }

    return buckets;
}
