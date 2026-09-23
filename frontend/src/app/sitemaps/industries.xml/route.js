export const dynamic = 'force-dynamic';

import { SITE_URL } from '@/config/site';

const getBaseUrl = () => SITE_URL;

const getApiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

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
  .map((item) => {
    const loc = typeof item === 'string' ? item : item.loc;
    const lastmod = typeof item === 'string' ? null : item.lastmod;
    const lastmodTag = lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : '';
    return `  <url><loc>${escapeXml(loc)}</loc>${lastmodTag}</url>`;
  })
  .join('\n')}
</urlset>`;

export async function GET() {
  const baseUrl = getBaseUrl();
  const apiBase = getApiBase();

  let industryUrls = [];
  try {
    const res = await fetch(`${apiBase}/frontend/api/industry/list?limit=200`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const json = await res.json();
      const items = Array.isArray(json?.items) ? json.items : [];
      industryUrls = items
        .map((item) => {
          const slug = item?.slug;
          if (!slug) return null;
          return {
            loc: `${baseUrl}/industries/${slug}`,
            lastmod: normalizeLastMod(item?.updatedAt || item?.createdAt),
          };
        })
        .filter(Boolean);
    }
  } catch {
    industryUrls = [];
  }

  return new Response(buildUrlSet(industryUrls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
