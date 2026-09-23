export const dynamic = 'force-dynamic';

import { SITE_URL } from '@/config/site';

// Service-by-country ("/usa/software-development-company") and
// service-by-city ("/usa/philadelphia/software-development-company") pages
// were live and fully built but appeared in no sitemap at all — this is the
// only sitemap covering that entire page family. URL shape matches the
// resolver in src/app/[market]/[...path]/page.jsx: 2 segments = country
// page (market/slug), 3 segments = city page (market/city/slug).

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

const extractItems = (response) => {
  if (!response) return [];
  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

// Only published, non-draft records should ever reach the sitemap — same
// gate the CMS list screens use for "live".
const isPublished = (item) => item?.status === true && !item?.isDraft;

const fetchJson = async (url) => {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export async function GET() {
  const baseUrl = getBaseUrl();
  const apiBase = getApiBase();

  let countryPages = [];
  let cityPages = [];

  if (apiBase) {
    const [countryRes, cityRes] = await Promise.all([
      fetchJson(`${apiBase}api/service-by-country/list?limit=200`),
      fetchJson(`${apiBase}api/service-by-city/list?limit=200`),
    ]);
    countryPages = extractItems(countryRes).filter(isPublished);
    cityPages = extractItems(cityRes).filter(isPublished);
  }

  const urls = [
    ...countryPages
      .map((item) => {
        const { market, slug } = item || {};
        if (!market || !slug) return null;
        return {
          loc: `${baseUrl}/${market}/${slug}`,
          lastmod: normalizeLastMod(item?.updatedAt || item?.modifiedAt || item?.createdAt),
        };
      })
      .filter(Boolean),
    ...cityPages
      .map((item) => {
        const { market, citySlug, slug } = item || {};
        if (!market || !citySlug || !slug) return null;
        return {
          loc: `${baseUrl}/${market}/${citySlug}/${slug}`,
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
