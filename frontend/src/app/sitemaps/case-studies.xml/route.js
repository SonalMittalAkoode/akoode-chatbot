export const dynamic = 'force-dynamic';

import { SITE_URL } from '@/config/site';

const getBaseUrl = () => SITE_URL;

const getApiBase = () =>
  process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  '';

const escapeXml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const normalizeLastMod = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const buildUrlSet = (items) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items
  .map(({ loc, lastmod }) => {
    const lastmodTag = lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : '';
    return `  <url><loc>${escapeXml(loc)}</loc>${lastmodTag}</url>`;
  })
  .join('\n')}
</urlset>`;

const extractList = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.items)) return response.items;
  return [];
};

export async function GET() {
  const baseUrl = getBaseUrl();
  const apiBase = getApiBase();

  // Fetch old-schema case studies (/frontend/api/casestudy/list)
  let legacyCaseStudies = [];
  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}api/casestudy/list`, { next: { revalidate: 300 } });
      if (res.ok) legacyCaseStudies = extractList(await res.json());
    } catch { /* fall through */ }
  }

  // Fetch new-schema case studies (/frontend/api/case-study-latest/list — singular
  // "case-study", matching the actual backend route used by getCaseStudyLatestList
  // in src/api/caseStudyLatest.ts; this route previously called the plural
  // "case-studies-latest" path, which 404s, so every one of these pages silently
  // fell out of the sitemap even though they're live and linked from the hub).
  // These are added via the redesigned admin and served to [slug]/page.jsx
  // but were missing from the sitemap entirely.
  let latestCaseStudies = [];
  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}api/case-study-latest/list?limit=200`, { next: { revalidate: 300 } });
      if (res.ok) latestCaseStudies = extractList(await res.json());
    } catch { /* fall through */ }
  }

  // Merge both sources, deduplicate by slug, prefer latestCaseStudies lastmod
  const seenSlugs = new Set();
  const merged = [...legacyCaseStudies, ...latestCaseStudies].filter((item) => {
    if (!item?.slug || seenSlugs.has(item.slug)) return false;
    seenSlugs.add(item.slug);
    return true;
  });

  const urls = [
    { loc: `${baseUrl}/case-studies` },
    ...merged
      .map((item) => {
        const slug = item?.slug;
        if (!slug) return null;
        return {
          loc: `${baseUrl}/case-studies/${slug}`,
          lastmod: normalizeLastMod(item?.updatedAt || item?.modifiedAt || item?.createdAt),
        };
      })
      .filter(Boolean),
  ];

  return new Response(buildUrlSet(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
