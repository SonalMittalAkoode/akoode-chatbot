import "./_listing/typography.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm from "@/components/SubscribeForm";
import ListingHero from "./_listing/ListingHero";
import IndustriesWeBuild from "./_listing/IndustriesWeBuild";
import Tech_Stack from "./_listing/Tech_Stack";
import PlatformValue from "./_listing/PlatformValue";
import WayWeWork from "./_listing/WayWeWork";
import ServicesDeliver from "./_listing/ServicesDeliver";
import WhyChooseAkoode from "./_listing/WhyChooseAkoode";
import Testimonials from "./_listing/Testimonials";
import Trends from "./_listing/Trends";
import Engagement from "./_listing/Engagement";
import CaseStudies from "./_listing/CaseStudies";
import RelatedBlogs from "./_listing/RelatedBlogs";
import Faq from "./_listing/Faq";
import { ogImageUrl, normalizedSiteUrl } from "@/utils/seo";

// Convert the WebP hero to a JPEG for social previews (scrapers don't render WebP).
const listOgImage = ogImageUrl(`${normalizedSiteUrl}/industries_page/list_hero.webp`);

export const metadata = {
  alternates: {
    canonical: `${normalizedSiteUrl}/industries`,
  },
  title: "Industries We Serve | Software Development for 15 Verticals | Akoode",
  description:
    "Akoode builds custom software across 15 industries including Healthcare, Finance, Real Estate, Retail, Logistics, and more. Explore domain-specific engineering for your vertical.",
  openGraph: {
    title: "Industries We Serve | Software Development for 15 Verticals | Akoode",
    description:
      "Akoode builds custom software across 15 industries including Healthcare, Finance, Real Estate, Retail, Logistics, and more. Explore domain-specific engineering for your vertical.",
    url: `${normalizedSiteUrl}/industries`,
    siteName: "Akoode",
    images: [
      {
        url: listOgImage,
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "Industry software dashboard — Akoode",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Industries We Serve | Software Development for 15 Verticals | Akoode",
    description:
      "Akoode builds custom software across 15 industries including Healthcare, Finance, Real Estate, Retail, Logistics, and more. Explore domain-specific engineering for your vertical.",
    images: [listOgImage],
  },
};
 
const stripHtml = (value) => String(value ?? "").replace(/<[^>]*>/g, "").trim();

// Pull the live services list (ISR-cached) so the listing stays in sync with the
// admin and is server-rendered for crawlers — no hardcoded service array.
async function getServiceItems() {
  const ADMIN_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
  try {
    const res = await fetch(`${ADMIN_BASE}/api/services`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .map((s) => ({
        slug: s?.slug || "",
        title: stripHtml(s?.project || s?.title || ""),
        desc: stripHtml(s?.shortdescription || s?.description || ""),
        href: s?.slug ? `/services/${s.slug}` : "#",
      }))
      .filter((s) => s.title);
  } catch {
    return [];
  }
}

// Pull the live, published industries (ISR-cached) so the grid stays in sync with
// the admin and is server-rendered for crawlers — no hardcoded industry array.
async function getIndustryItems() {
  const ADMIN_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
  const SERVER_BASE = ADMIN_BASE.replace(/\/admin$/, "");
  try {
    const res = await fetch(`${SERVER_BASE}/frontend/api/industry/list?limit=100`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    return items
      .map((i) => ({
        _id: i?._id || "",
        name: stripHtml(i?.name || ""),
        slug: i?.slug || "",
        desc: stripHtml(i?.metaDescription || i?.hero?.subtitle || i?.hero?.heading || ""),
      }))
      .filter((i) => i.name && i.slug)
      // oldest-first (ObjectId embeds creation timestamp) — matches NavBar order.
      .sort((a, b) => (a._id < b._id ? -1 : 1));
  } catch {
    return [];
  }
}

// Pull the latest 3 published case studies (ISR-cached) so the section stays in
// sync with the admin and is server-rendered for crawlers — no hardcoded samples.
async function getCaseStudyItems() {
  const ADMIN_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "").replace(/\/$/, "");
  const SERVER_BASE = ADMIN_BASE.replace(/\/admin$/, "");
  try {
    const res = await fetch(`${SERVER_BASE}/frontend/api/case-study-latest/list?limit=3&page=1`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    return items
      .slice(0, 3)
      .map((cs) => ({
        slug: cs?.slug || "",
        title: stripHtml(cs?.title || ""),
        rethinking: { stats: Array.isArray(cs?.rethinking?.stats) ? cs.rethinking.stats : [] },
        challenges: { intro: cs?.challenges?.intro || "" },
        build: { intro: cs?.build?.intro || "" },
      }))
      .filter((cs) => cs.slug && cs.title);
  } catch {
    return [];
  }
}

export default async function IndustriesIndexPage() {
  const [serviceItems, industryItems, caseStudyItems] = await Promise.all([
    getServiceItems(),
    getIndustryItems(),
    getCaseStudyItems(),
  ]);

  return (
    <main>
      <NavBar forceTransparent />
 
      {/* Hero + Industries share one continuous dark canvas: squared grid lines
          (faded toward the left) and a bottom-left blue glow span both sections. */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #1A1D30 0%, #191D31 42%, #20243C 74%, #232744 100%)" }}
      >
        {/* squared grid lines — left half fully cleared, and faded out
            vertically so the grid ends around the industries heading (not the
            page bottom). Two masks intersected: left→right + top→bottom. */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 2px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 2px, transparent 1px)",
            backgroundSize: "132px 132px",
            maskImage:
              "linear-gradient(to right, transparent 0%, transparent 46%, rgba(0,0,0,0.55) 64%, #000 82%), linear-gradient(to bottom, #000 0%, #000 32%, transparent 54%)",
            maskComposite: "intersect",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, transparent 28%, rgba(0,0,0,0.55) 54%, #000 82%), linear-gradient(to bottom, #000 0%, #000 32%, transparent 54%)",
            WebkitMaskComposite: "source-in",
          }}
        />
 
        {/* left-edge blue glow — starts just below the CTA button and fades out
            around the second row of industry cards (percentage-based so it tracks
            the combined hero+industries height). */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 52% 40% at -6% 56%, rgba(102,121,228,0.42) 0%, rgba(102,121,228,0.12) 42%, transparent 75%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 30% 24% at -4% 52%, rgba(135,154,245,0.28) 0%, transparent 72%)" }}
          />
        </div>
 
        <div className="relative z-10">
          <ListingHero />
          <IndustriesWeBuild items={industryItems} />
        </div>
      </div>
 
      <PlatformValue />
      <WayWeWork />
      <Trends />
      <WhyChooseAkoode/>
      <ServicesDeliver items={serviceItems} />
      <Tech_Stack />
      <Engagement />
      <CaseStudies caseStudies={caseStudyItems} />
      <Testimonials />
      <RelatedBlogs />
      <Faq />
      <SubscribeForm />
      <Footer />
    </main>
  );
}
 
 
 