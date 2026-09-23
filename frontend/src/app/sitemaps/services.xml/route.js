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

const extractServices = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.items)) return response.items;
  return [];
};

export async function GET() {
  const baseUrl = getBaseUrl();
  const apiBase = getApiBase();

  let services = [];
  let countryPages = [];
  let cityPages = [];
  let updatedServices = [];
  if (apiBase) {
    try {
      const [svcRes, countryRes, cityRes, updatedSvcRes] = await Promise.all([
        fetch(`${apiBase}api/service/list?limit=1000`, { next: { revalidate: 300 } }),
        fetch(`${apiBase}api/service-by-country/list?limit=1000`, { next: { revalidate: 300 } }),
        fetch(`${apiBase}api/service-by-city/list?limit=2000`, { next: { revalidate: 300 } }),
        // Only source of edit timestamps for service pages: api/service/list
        // returns a 6-field projection with no createdAt/updatedAt, so every
        // <url> came out bare. The updated-services records do carry them.
        fetch(`${apiBase}api/updated-services/list?limit=1000`, { next: { revalidate: 300 } }),
      ]);

      if (svcRes.ok) {
        const svcData = await svcRes.json();
        services = extractServices(svcData);
      }

      if (countryRes.ok) {
        const countryData = await countryRes.json();
        countryPages = countryData?.items || countryData?.data || [];
      }

      if (cityRes.ok) {
        const cityData = await cityRes.json();
        cityPages = cityData?.items || cityData?.data || [];
      }

      if (updatedSvcRes.ok) {
        const updatedSvcData = await updatedSvcRes.json();
        updatedServices = extractServices(updatedSvcData);
      }
    } catch (error) {
      console.error("Sitemap fetch error:", error);
    }
  }

  // slug -> last edit date, for the service records that expose one. Pages with
  // no known date are emitted without <lastmod> rather than with a guessed one:
  // a wrong date is a worse recrawl signal than an absent one.
  const lastModBySlug = new Map();
  for (const record of updatedServices) {
    const slug = record?.slug;
    if (!slug) continue;
    const lastmod = normalizeLastMod(record?.updatedAt || record?.modifiedAt || record?.createdAt);
    if (lastmod) lastModBySlug.set(slug, lastmod);
  }

  const serviceUrls = services
    .map((service) => {
      const slug = service?.slug;
      if (!slug) return null;
      return {
        loc: `${baseUrl}/services/${slug}`,
        lastmod:
          normalizeLastMod(service?.updatedAt || service?.modifiedAt || service?.createdAt) ||
          lastModBySlug.get(slug) ||
          null,
      };
    })
    .filter(Boolean);

  const toMarketSlug = (v) =>
    (v || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const countryUrls = countryPages
    .map((page) => {
      const slug = page?.slug;
      if (!slug) return null;
      const market = page?.market || toMarketSlug(page?.country) || 'global';
      return {
        loc: `${baseUrl}/${market}/${slug}`,
        lastmod: normalizeLastMod(page?.updatedAt || page?.modifiedAt || page?.createdAt),
      };
    })
    .filter(Boolean);

  // City pages: /{market}/{citySlug}/{slug}  — were missing from sitemap entirely
  const cityUrls = cityPages
    .map((page) => {
      const slug = page?.slug;
      if (!slug) return null;
      const market = page?.market || toMarketSlug(page?.country);
      const citySlug = page?.citySlug || toMarketSlug(page?.city);
      if (!market || !citySlug) return null;
      return {
        loc: `${baseUrl}/${market}/${citySlug}/${slug}`,
        lastmod: normalizeLastMod(page?.updatedAt || page?.modifiedAt || page?.createdAt),
      };
    })
    .filter(Boolean);

  const urls = [...serviceUrls, ...countryUrls, ...cityUrls];

  return new Response(buildUrlSet(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
