import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { pingIndexNow } from "@/lib/indexnow";
import {
  serviceTag,
  updatedServiceTag,
  industryTag,
  blogTag,
  casestudyTag,
  caseStudyLatestTag,
  jobTag,
  sbcTag,
  sbcCityTag,
  LIST_CASE_STUDY_LATEST,
  LIST_TESTIMONIALS,
  LIST_VIDEOS,
  LIST_RATINGS,
  LIST_EMPLOYEES,
  LIST_FAQS,
  NAV_SERVICES,
  NAV_INDUSTRIES,
} from "@/lib/cacheTags";

/**
 * Single on-demand revalidation route. Handles BOTH callers:
 *
 *   1. Admin forms (client)       → body `{ path, oldPath, secret }`,
 *                                    secret = NEXT_PUBLIC_PREVIEW_SECRET.
 *   2. Backend revalidateFrontend → body `{ slug, oldSlug, type, market?, city? }` +
 *                                    `x-revalidate-secret` header = REVALIDATE_SECRET.
 *
 * Two invalidation mechanisms are used, deliberately:
 *
 *   revalidatePath(p)  purges every cached fetch made while rendering `p`.
 *     Next attaches an implicit `_N_T_<pathname>` tag to those entries, so this
 *     works for dynamically rendered routes too — it does not require the route
 *     to be in the Full Route Cache.
 *
 *   revalidateTag(t)   purges one entity wherever it is rendered. Used for
 *     shared content (navigation, testimonials, videos, ratings) that appears
 *     on pages we cannot enumerate by path.
 */

/**
 * Next 16 requires a second argument on revalidateTag. `{ expire: 0 }` is the
 * immediate-purge profile: it expires the entry now rather than serving it
 * stale-while-revalidate. Do not remove — omitting it logs a deprecation
 * warning and changes the purge semantics. (`updateTag` is Server-Action-only
 * and cannot be used from a route handler.)
 */
const PURGE_NOW = { expire: 0 } as const;

/** Content types that render on the homepage and therefore must invalidate "/". */
const HOME_AFFECTING = new Set([
  "blog",
  "casestudy",
  "case-study-latest",
  "testimonial",
  "video",
  "industry",
  "service",
]);

/** Detail-page prefix per content type, for `{ slug, type }` callers. */
const DETAIL_PREFIX: Record<string, string> = {
  service: "/services",
  industry: "/industries",
  blog: "/blog",
  casestudy: "/case-studies",
  "case-study-latest": "/case-studies",
  job: "/career",
  career: "/career",
};

/** Public listing pages that must refresh when a content type changes. */
const LISTINGS: Record<string, string[]> = {
  service: ["/services"],
  industry: ["/industries"],
  blog: ["/blog"],
  casestudy: ["/case-studies"],
  "case-study-latest": ["/case-studies"],
  job: ["/career"],
  career: ["/career"],
  sbc: ["/country"],
  city: ["/country"],
  employee: ["/about-us"],
  // Category renames change the chips on the blog index and every category page.
  "blog-category": ["/blog", "/blog/category/[slug]"],
};

/** Entity tags to purge for a given type + slug. */
function entityTags(
  type: string,
  slug?: string,
  market?: string,
  city?: string
): string[] {
  if (!slug) return [];
  switch (type) {
    // Location pages are already covered by their path, but purging the tag too
    // keeps them correct if the same document is ever rendered on another route.
    case "sbc":
      return [sbcTag(market, slug)];
    case "city":
      return [sbcCityTag(market, city, slug)];
    // A service slug may be backed by either collection; purge both.
    case "service":
      return [serviceTag(slug), updatedServiceTag(slug)];
    case "industry":
      return [industryTag(slug)];
    case "blog":
      return [blogTag(slug)];
    case "casestudy":
      return [casestudyTag(slug), caseStudyLatestTag(slug)];
    case "case-study-latest":
      return [caseStudyLatestTag(slug), casestudyTag(slug)];
    case "job":
    case "career":
      return [jobTag(slug)];
    default:
      return [];
  }
}

/** Shared-content list tags to purge for a given type. */
const SHARED_TAGS: Record<string, string[]> = {
  service: [NAV_SERVICES],
  industry: [NAV_INDUSTRIES],
  casestudy: [LIST_CASE_STUDY_LATEST],
  "case-study-latest": [LIST_CASE_STUDY_LATEST],
  testimonial: [LIST_TESTIMONIALS],
  video: [LIST_VIDEOS],
  rating: [LIST_RATINGS],
  employee: [LIST_EMPLOYEES],
  faq: [LIST_FAQS],
};

export async function POST(request: Request) {
  let body: {
    path?: string;
    oldPath?: string;
    secret?: string;
    slug?: string;
    oldSlug?: string;
    type?: string;
    market?: string;
    city?: string;
    oldMarket?: string;
    oldCity?: string;
  } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const {
    path,
    oldPath,
    secret,
    slug,
    oldSlug,
    type,
    market,
    city,
    oldMarket,
    oldCity,
  } = body;

  // Admin forms send the preview secret in the body; the backend sends
  // REVALIDATE_SECRET in a header. Accept either.
  const headerSecret = request.headers.get("x-revalidate-secret");
  const previewSecret = process.env.NEXT_PUBLIC_PREVIEW_SECRET;
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  const authorized =
    (!!previewSecret && secret === previewSecret) ||
    (!!revalidateSecret && headerSecret === revalidateSecret);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paths = new Set<string>();
  const tags = new Set<string>();

  const indexNowPaths: string[] = [];

  const addPage = (p: string, crawlable = true) => {
    paths.add(p);
    if (crawlable) indexNowPaths.push(p);
  };

  const cascadeCaseStudyListings = () => {
    paths.add("/case-studies");
    paths.add("/case-studies/category/[slug]");
  };

  // ── Backend contract: { slug, type } ──────────────────────────────────────
  if (type) {
    const prefix = DETAIL_PREFIX[type];

    if (prefix && slug) {
      addPage(`${prefix}/${slug}`);
      // A slug rename leaves the old URL cached — purge it too.
      if (oldSlug && oldSlug !== slug) paths.add(`${prefix}/${oldSlug}`);
    }

    if (type === "sbc" && market && slug) {
      addPage(`/${market}/${slug}`);
      const prevMarket = oldMarket || market;
      const prevSlug = oldSlug || slug;
      if (prevMarket !== market || prevSlug !== slug) {
        paths.add(`/${prevMarket}/${prevSlug}`);
      }
    }

    if (type === "city" && market && city && slug) {
      addPage(`/${market}/${city}/${slug}`);
      const prevMarket = oldMarket || market;
      const prevCity = oldCity || city;
      const prevSlug = oldSlug || slug;
      if (prevMarket !== market || prevCity !== city || prevSlug !== slug) {
        paths.add(`/${prevMarket}/${prevCity}/${prevSlug}`);
      }
    }

    for (const p of LISTINGS[type] || []) paths.add(p);
    for (const t of entityTags(type, slug, market, city)) tags.add(t);
    if (oldSlug && oldSlug !== slug) {
      for (const t of entityTags(type, oldSlug, oldMarket || market, oldCity || city)) {
        tags.add(t);
      }
    }
    for (const t of SHARED_TAGS[type] || []) tags.add(t);

    if (type === "casestudy" || type === "case-study-latest") {
      cascadeCaseStudyListings();
    }
    if (HOME_AFFECTING.has(type)) paths.add("/");
  }

  // ── Admin contract: explicit { path, oldPath } ────────────────────────────
  if (path) {
    addPage(path);
    if (oldPath && oldPath !== path) paths.add(oldPath);
    if (path.startsWith("/case-studies")) {
      cascadeCaseStudyListings();
      paths.add("/");
    }
    if (path.startsWith("/blog/")) {
      paths.add("/blog");
      paths.add("/");
    }
    // Broad bust for the country/city segment. The route is the catch-all
    // /[market]/[...path]; the previous "/[market]/[slug]" pattern matched no
    // real route and silently did nothing.
    const marketSegments = path.split("/").filter(Boolean);
    if (marketSegments.length === 2 || marketSegments.length === 3) {
      paths.add("/[market]/[...path]");
    }
  }

  // Sitemaps always refresh so newly published URLs are discoverable at once.
  paths.add("/sitemap");
  paths.add("/sitemaps/locations.xml");
  paths.add("/sitemaps/services.xml");
  paths.add("/sitemaps/blogs.xml");
  paths.add("/sitemaps/case-studies.xml");
  paths.add("/sitemaps/industries.xml");
  paths.add("/sitemaps/pages.xml");
  paths.add("/sitemaps/authors.xml");

  // A route *pattern* needs the "page" type argument; a concrete URL must not
  // get one, or the implicit tag would not match what the renderer registered.
  for (const p of paths) {
    if (p.includes("[")) revalidatePath(p, "page");
    else revalidatePath(p);
  }

  for (const t of tags) {
    revalidateTag(t, PURGE_NOW);
  }

  // Fire-and-forget — pingIndexNow() never throws, so this can't fail the response.
  if (indexNowPaths.length > 0) {
    void pingIndexNow(indexNowPaths);
  }

  return NextResponse.json({
    revalidated: true,
    type,
    slug,
    oldSlug,
    path,
    oldPath,
    paths: [...paths],
    tags: [...tags],
    indexNowPaths,
  });
}
