export const dynamic = 'force-dynamic';

// Author profile sitemap — only authors who actually have published posts, so
// empty profiles (which are noindexed) never enter the crawl queue.

import { SITE_URL } from '@/config/site';
import { authorSlug } from '@/utils/authorSlug';

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

export async function GET() {
  const baseUrl = getBaseUrl();
  const apiBase = getApiBase();

  let employees = [];
  if (apiBase) {
    try {
      // includeHidden: someone kept off the About Us carousel still gets an
      // author page, so their profile belongs in the sitemap.
      const response = await fetch(`${apiBase}api/employee/list?includeHidden=true`, {
        next: { revalidate: 3600 },
      });
      if (response.ok) {
        const data = await response.json();
        employees = Array.isArray(data) ? data : [];
      }
    } catch {
      employees = [];
    }
  }

  const entries = await Promise.all(
    employees.map(async (employee) => {
      const slug = authorSlug(employee?.name);
      if (!slug) return null;
      try {
        const response = await fetch(`${apiBase}api/employee/author/${slug}`, {
          next: { revalidate: 3600 },
        });
        if (!response.ok) return null;
        const payload = await response.json();
        const blogs = payload?.data?.blogs;
        if (!Array.isArray(blogs) || blogs.length === 0) return null;
        const newest = blogs[0];
        return {
          loc: `${baseUrl}/author/${slug}`,
          lastmod: normalizeLastMod(
            employee?.updatedAt || newest?.publishedAt || newest?.createdAt
          ),
        };
      } catch {
        return null;
      }
    })
  );

  return new Response(buildUrlSet(entries.filter(Boolean)), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
