// Parent sitemap index

import { SITE_URL } from '@/config/site';

const getBaseUrl = () => SITE_URL;

const escapeXml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildSitemapIndex = (urls) => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <sitemap><loc>${escapeXml(url)}</loc></sitemap>`).join('\n')}
</sitemapindex>`;

// Lists all child sitemaps for scalable crawling

export async function GET() {
  const baseUrl = getBaseUrl();
  const urls = [
    `${baseUrl}/sitemaps/pages.xml`,
    `${baseUrl}/sitemaps/services.xml`,
    `${baseUrl}/sitemaps/blogs.xml`,
    `${baseUrl}/sitemaps/authors.xml`,
    `${baseUrl}/sitemaps/case-studies.xml`,
    `${baseUrl}/sitemaps/industries.xml`,
    `${baseUrl}/sitemaps/locations.xml`,
  ];

  return new Response(buildSitemapIndex(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
