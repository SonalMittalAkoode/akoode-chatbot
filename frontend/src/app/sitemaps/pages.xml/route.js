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

// item: string (loc) or { loc, lastmod? }
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

const extractJobs = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.jobs)) return response.jobs;
  return [];
};

const fetchAllJobs = async (apiBase) => {
  const limit = 100;
  const jobsUrl = `${apiBase}/frontend/api/job/jobs`;
  const firstResponse = await fetch(`${jobsUrl}?page=1&limit=${limit}`, {
    next: { revalidate: 300 },
  });
  if (!firstResponse.ok) return [];
  const firstData = await firstResponse.json();
  const jobs = extractJobs(firstData);
  const totalPages = firstData?.pagination?.totalPages ?? 1;
  if (totalPages <= 1) return jobs;
  const results = [...jobs];
  for (let page = 2; page <= totalPages; page += 1) {
    const response = await fetch(`${jobsUrl}?page=${page}&limit=${limit}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) continue;
    const data = await response.json();
    results.push(...extractJobs(data));
  }
  return results;
};

export async function GET() {
  const baseUrl = getBaseUrl();
  const apiBase = getApiBase();

  const staticUrls = [
    `${baseUrl}/`,
    `${baseUrl}/about-us`,
    `${baseUrl}/services`,
    `${baseUrl}/industries`,
    `${baseUrl}/contact-us`,
    `${baseUrl}/privacy-policy`,
    `${baseUrl}/post-requirement`,
    `${baseUrl}/career`,
  ];

  let careerUrls = [];
  if (apiBase) {
    try {
      const jobs = await fetchAllJobs(apiBase);
      careerUrls = jobs
        .map((job) => {
          const slug = job?.slug;
          if (!slug) return null;
          return {
            loc: `${baseUrl}/career/${slug}`,
            lastmod: normalizeLastMod(
              job?.updatedAt || job?.modifiedAt || job?.createdAt || job?.publishedAt
            ),
          };
        })
        .filter(Boolean);
    } catch {
      careerUrls = [];
    }
  }

  const urls = [...staticUrls, ...careerUrls];

  return new Response(buildUrlSet(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
