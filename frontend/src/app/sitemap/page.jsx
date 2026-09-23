export const dynamic = "force-dynamic";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { getCasestudyList } from "@/api/frontend/casestudy";
import { getPublicSBCList } from "@/api/serviceByCountry";
import { getPublicSBCCityList } from "@/api/serviceByCity";
import { getFrontendJobs } from "@/api/frontend/job";
import { listIndustries } from "@/api/frontend/industries";
import SitemapExplorer from "./SitemapExplorer";

export const metadata = {
  title: "Sitemap | Akoode Technologies – Full Site Index",
  description: "Navigate through the comprehensive list of services, industries, and locations served by Akoode Technologies.",
};

async function getSitemapData() {
  const ensureArray = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.data?.items)) return raw.data.items;
    return [];
  };

  let services = [];
  let industries = [];
  let caseStudies = [];
  let countries = [];
  let cities = [];
  let jobs = [];

  try {
    const raw = await listIndustries();
    industries = raw
      .filter((i) => i?.slug)
      .map((i) => ({ label: i.name || i.title || i.slug, href: `/industries/${i.slug}` }));
  } catch (err) {
    console.error("Sitemap: Failed to fetch industries", err);
  }

  const stripHtml = (v) => (v || "").toString().replace(/<[^>]*>/g, "").trim();

  // Uses the same admin `/api/services` endpoint as NavBar (parent/child
  // structured response) rather than the public `api/service/list` endpoint,
  // which returns every service flattened with no parent/child grouping.
  try {
    const ADMIN_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
    const res = await fetch(`${ADMIN_BASE}/api/services`, { next: { revalidate: 300 } });
    const servicesRes = res.ok ? await res.json() : [];
    services = ensureArray(servicesRes).map((s) => ({
      label: stripHtml(s.project || s.title) || "Service",
      href: `/services/${s.slug}`,
      children: Array.isArray(s.children)
        ? s.children
            .filter((c) => c?.slug)
            .map((c) => ({
              label: stripHtml(c.project || c.title) || "Service",
              href: `/services/${c.slug}`,
            }))
        : [],
    }));
  } catch (err) {
    console.error("Sitemap: Failed to fetch services", err);
  }

  try {
    const res = await getCasestudyList(1, 100);
    caseStudies = ensureArray(res)
      .filter((c) => c?.slug)
      .map((c) => ({ label: c.title || c.slug, href: `/case-studies/${c.slug}` }));
  } catch (err) {
    console.error("Sitemap: Failed to fetch case studies", err);
  }

  try {
    let page = 1;
    while (true) {
      const res = await getFrontendJobs(page, 100);
      const batch = Array.isArray(res?.data) ? res.data : [];
      jobs.push(
        ...batch
          .filter((j) => j?.slug)
          .map((j) => ({ label: j.title || j.slug, href: `/career/${j.slug}` }))
      );
      if (page >= (res?.pagination?.totalPages ?? 1)) break;
      page++;
    }
  } catch (err) {
    console.error("Sitemap: Failed to fetch jobs", err);
  }

  const toMarketSlug = (v) =>
    (v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const prettify = (v) =>
    (v || "")
      .toString()
      .replace(/[-_]+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  try {
    const [sbcRes, sbcCityRes] = await Promise.all([
      getPublicSBCList(),
      getPublicSBCCityList(),
    ]);

    countries = ensureArray(sbcRes).map((l) => {
      const market = l.market || toMarketSlug(l.country) || "global";
      const country = prettify(l.country) || prettify(market) || "Global";
      return { label: l.title || "Location", href: `/${market}/${l.slug}`, country };
    });

    cities = ensureArray(sbcCityRes).map((l) => {
      const market = l.market || toMarketSlug(l.country) || "global";
      const citySlug = l.citySlug || toMarketSlug(l.city) || "city";
      const country = prettify(l.country) || prettify(market) || "Global";
      const city = prettify(l.city || l.citySlug) || "City";
      // Use the admin "Page Title" (short, consistent) rather than the long hero H1.
      const label = l.title || city || "Location";
      return { label, href: `/${market}/${citySlug}/${l.slug}`, country, city };
    });
  } catch (err) {
    console.error("Sitemap: Failed to fetch locations", err);
  }

  return { services, industries, caseStudies, countries, cities, jobs };
}

export default async function SitemapPage() {
  const { services, industries, caseStudies, countries, cities, jobs } =
    await getSitemapData();

  const sections = [
    {
      title: "Company",
      desc: "Who we are, our story, and how to reach us.",
      items: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about-us" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Blogs", href: "/blog" },
        { label: "Career", href: "/career" },
        { label: "Contact Us", href: "/contact-us" },
        { label: "Post a Requirement", href: "/post-requirement" },
      ],
    },
    {
      title: "Our Services",
      desc: "End-to-end engineering — from AI and cloud to marketing.",
      items:
        services.length > 0
          ? services
          : [
              { label: "Software Development", href: "/services/software-development" },
              { label: "Web Development", href: "/services/web-development" },
              { label: "AI Development", href: "/services/ai-development" },
            ],
    },
    {
      title: "Industries We Serve",
      desc: "Tailored software solutions across every sector.",
      items: industries,
    },
    {
      title: "Case Studies",
      desc: "Real client outcomes across AI, web, and mobile builds.",
      items: caseStudies,
    },
    {
      title: "Career Openings",
      desc: "Join the team building tomorrow’s solutions today.",
      items: jobs,
    },
    {
      title: "Resources & Legal",
      desc: "Policies and reading material from our team.",
      items: [
        { label: "Blog & Insights", href: "/blog" },
        { label: "AI Usage Policy", href: "/ai-usage-policy" },
        { label: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
    {
      title: "Locations We Serve",
      desc: "Offices in India and the USA, serving clients worldwide.",
      items:
        countries.length + cities.length > 0
          ? [...countries, ...cities]
          : [{ label: "UK Software Development", href: "/uk/software-development-company-uk" }],
    },
  ].filter((sec) => sec.items.length > 0);

  return (
    <>
      <NavBar />
      <SitemapExplorer sections={sections} />
      <Footer />
    </>
  );
}
