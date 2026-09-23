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

const extractBlogs = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.blogs)) return response.blogs;
  if (Array.isArray(response.data)) return response.data;
  return [];
};

const fetchAllBlogs = async (apiBase) => {
  const limit = 100;
  const firstResponse = await fetch(`${apiBase}api/blog/list?page=1&limit=${limit}`, {
    next: { revalidate: 300 },
  });
  if (!firstResponse.ok) return [];
  const firstData = await firstResponse.json();
  const blogs = extractBlogs(firstData);
  const totalPages = firstData?.pagination?.totalPages;
  if (!totalPages || totalPages <= 1) {
    return blogs;
  }
  const results = [...blogs];
  for (let page = 2; page <= totalPages; page += 1) {
    const response = await fetch(
      `${apiBase}api/blog/list?page=${page}&limit=${limit}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) continue;
    const data = await response.json();
    results.push(...extractBlogs(data));
  }
  return results;
};

export async function GET() {
  const baseUrl = getBaseUrl();
  const apiBase = getApiBase();

  let blogs = [];
  if (apiBase) {
    try {
      blogs = await fetchAllBlogs(apiBase);
    } catch {
      blogs = [];
    }
  }

  const urls = [
    { loc: `${baseUrl}/blog` },
    ...blogs
      .map((blog) => {
        const slug = blog?.slug;
        if (!slug) return null;
        return {
          loc: `${baseUrl}/blog/${slug}`,
          lastmod: normalizeLastMod(blog?.updatedAt || blog?.modifiedAt || blog?.date || blog?.publishedOn || blog?.createdAt),
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
