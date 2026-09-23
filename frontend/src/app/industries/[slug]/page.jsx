import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "../_components/HeroSection";
import WhySection from "../_components/WhySection";
import AkoodeAdvantageSection from "../_components/AkoodeAdvantageSection";
import WhatWeBuildSection from "../_components/WhatWeBuildSection";
import Experties from "../_components/Experties";
import Capabilities from "../_components/Capabilities";
import CaseStudy from "../_components/CaseStudy";
import Testimonial from "../_components/Testimonial";
import Advantage from "../_components/Advantage";
import TechStack from "../_components/TechStack";
import WhatsChanging from "../_components/WhatsChanging";
import HowWeWork from "../_components/HowWeWork";
import WhyChooseAkoode from "../_components/WhyChooseAkoode";
import FAQ from "../_components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import SubscribeForm from "@/components/SubscribeForm";
import { getIndustryBySlug } from "@/api/frontend/industries";
import { ogImageUrl } from "@/utils/seo";
import { SITE_URL } from "@/config/site";
import { getTestimonialById } from "@/api/frontend/testimonial";
import { getCasestudyById } from "@/api/frontend/casestudy";
import { getCaseStudyLatestList } from "@/api/caseStudyLatest";
import { getBlogTableData, getBlogById } from "@/api/frontend/blog";
import PreviewEditLink from "@/app/[market]/[...path]/PreviewEditLink";

// Uses draftMode() for preview and the root layout reads headers(), so this route
// already renders dynamically at runtime — `revalidate` provided no static caching.
// Force dynamic to keep it off the static-prerender path (which throws
// DYNAMIC_SERVER_USAGE when request-scoped APIs like headers()/draftMode() run).
export const dynamic = "force-dynamic";

// Map a newly-designed case study (case-study-latest schema) onto the same
// fields the CaseStudy section reads from a legacy case study, so cards from
// either collection render identically. Detail links share /case-studies/[slug],
// which already resolves both collections.
function normalizeLatestForIndustryCard(doc) {
  if (!doc) return null;
  const strip = (v) => String(v || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const chips = Array.isArray(doc.hero?.metaChips) ? doc.hero.metaChips : [];
  const chipBy = (re) => chips.find((c) => re.test(String(c?.label || "")));
  const industry = chipBy(/industry|sector|domain/i)?.value || chips[0]?.value || "";
  const country = chipBy(/region|country|location|market/i)?.value || "";

  const cards = Array.isArray(doc.hero?.floatingCards) ? doc.hero.floatingCards : [];
  const stats = Array.isArray(doc.rethinking?.stats) ? doc.rethinking.stats : [];
  // Keep only the numeric portion of a stat (e.g. "6 IntegratedFiUser" → "6",
  // "40%" → "40%", "$2M" → "$2M"). The card shows the number alone; the label
  // line below carries the descriptive text.
  const numOnly = (s) => {
    const m = String(s || "").match(/[$₹€£]?\s?\d[\d.,]*\s?(%|x|X|\+|k|K|m|M|b|B)?/);
    return m ? m[0].replace(/\s+/g, "") : "";
  };
  const statVal = (i) => {
    const fc = cards[i];
    if (fc && (fc.value || fc.unit)) return numOnly(`${strip(fc.value)} ${strip(fc.unit)}`);
    return stats[i] ? numOnly(stats[i].value) : "";
  };
  const statLbl = (i) => {
    const fc = cards[i];
    if (fc && fc.label) return strip(fc.label);
    return stats[i] ? strip(stats[i].title) : "";
  };

  return {
    _id: String(doc._id || ""),
    title: doc.title || strip(doc.hero?.heading) || "Case Study",
    slug: doc.slug || "",
    industry: strip(industry),
    country: strip(country),
    shortdescription: strip(doc.hero?.body || doc.rethinking?.body || ""),
    whychooseus: {
      pulseStat1Value: statVal(0),
      pulseStat1Label: statLbl(0),
      pulseStat2Value: statVal(1),
      pulseStat2Label: statLbl(1),
    },
    casestudyimage: doc.hero?.listingImage || doc.hero?.heroImage || "",
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getIndustryBySlug(slug);
  if (!data || data.status !== "active") return {};
  const title = data.metaTitle || data.name || "";
  const description = data.metaDescription || "";
  const canonicalUrl = `${SITE_URL}/industries/${slug}`;
  // Serve the hero as a converted JPEG (WebP og:image breaks social previews).
  // Falls back to the same default hero the HeroSection component renders.
  const rawHeroImage = data?.hero?.image || `${SITE_URL}/industries_page/hero.webp`;
  const ogImage = ogImageUrl(rawHeroImage);
  const ogImageAlt = data?.hero?.imageAlt || data?.name || title || "Akoode Technologies";
  return {
    title,
    description,
    keywords: data.metaKeywords || undefined,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Akoode",
      type: "website",
      locale: "en_US",
      images: [{ url: ogImage, type: "image/jpeg", width: 1200, height: 630, alt: ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@akoode_in",
      images: [ogImage],
    },
  };
}

export default async function IndustrySlugPage({ params, searchParams }) {
  const { slug } = await params;
  const { edit } = (await searchParams) || {};
  const { isEnabled: isPreview } = await draftMode();
  const data = await getIndustryBySlug(slug, isPreview);
  if (!data || (!isPreview && data.status !== "active")) notFound();

  // Section is shown unless its `enabled` flag is explicitly false.
  const on = (key) => data?.[key]?.enabled !== false;

  // Resolve selected testimonials in admin-defined order.
  const testimonialIds = Array.isArray(data?.testimonial?.featuredIds)
    ? data.testimonial.featuredIds
    : [];
  const testimonials = (
    await Promise.all(testimonialIds.map((id) => getTestimonialById(String(id))))
  ).filter(Boolean);

  // Resolve featured case study and up to 2 side case studies.
  const caseStudyFeaturedId = data?.caseStudy?.featuredId;
  const caseStudySideIds = Array.isArray(data?.caseStudy?.featuredIds)
    ? data.caseStudy.featuredIds.map(String).filter(Boolean).slice(0, 2)
    : [];

  // Index the newly-designed case studies (case-study-latest) by id so picks
  // from that collection resolve without a per-id lookup, then fall back to the
  // legacy collection for any id that isn't a "latest" one.
  const latestList = await getCaseStudyLatestList().catch(() => []);
  const latestById = new Map(
    (Array.isArray(latestList) ? latestList : [])
      .filter((d) => d?._id)
      .map((d) => [String(d._id), normalizeLatestForIndustryCard(d)])
  );
  const resolveCase = (id) => {
    if (!id) return Promise.resolve(null);
    const sid = String(id);
    if (latestById.has(sid)) return Promise.resolve(latestById.get(sid));
    return getCasestudyById(sid).catch(() => null);
  };

  const [featuredCaseStudy, ...resolvedSides] = await Promise.all([
    resolveCase(caseStudyFeaturedId),
    ...caseStudySideIds.map((id) => resolveCase(id)),
  ]);

  // Only the featured case study is mandatory. The two side cards are fully
  // optional: show whatever the admin picked (0, 1, or 2) with no DB fallback.
  const sideCaseStudies = resolvedSides.filter(Boolean);

  // Resolve blogs for WhatsChanging section: use admin-selected IDs if set, else recent.
  const selectedBlogIds = Array.isArray(data?.whatsChanging?.featuredIds)
    ? data.whatsChanging.featuredIds.map(String).filter(Boolean)
    : [];
  let recentBlogs = [];
  if (selectedBlogIds.length > 0) {
    recentBlogs = (
      await Promise.all(
        selectedBlogIds.map((id) => getBlogById(id).then((r) => r?.data || null).catch(() => null))
      )
    ).filter(Boolean);
  } else {
    const blogsRes = await getBlogTableData(1, 5);
    recentBlogs = Array.isArray(blogsRes?.blogs) ? blogsRes.blogs : [];
  }

  const canonicalUrl = `${SITE_URL}/industries/${slug}`;
  const stripHtmlText = (s) => String(s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  // FAQ items for FAQPage schema
  const faqItems = (() => {
    const raw = data?.faq?.items;
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return raw.map((it) => ({
      q: stripHtmlText(it.question ?? it.q ?? ""),
      a: stripHtmlText(it.answer ?? it.a ?? ""),
    })).filter((it) => it.q && it.a);
  })();

  const AKOODE_ORG_ID = `${SITE_URL}#organization`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization — entity anchor for all pages
      {
        "@type": "Organization",
        "@id": AKOODE_ORG_ID,
        name: "Akoode Technologies",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/akoode_logo.png`,
          width: 200,
          height: 60,
        },
        foundingDate: "2023",
        email: "info@akoode.com",
        address: [
          {
            "@type": "PostalAddress",
            streetAddress: "Tower B4, SPAZE ITECH PARK, UN 616, Badshahpur Sohna Rd, Sector 49",
            addressLocality: "Gurugram",
            addressRegion: "Haryana",
            postalCode: "122018",
            addressCountry: "IN",
          },
          {
            "@type": "PostalAddress",
            streetAddress: "10816 South Olmsted St W",
            addressLocality: "Jenks",
            addressRegion: "OK",
            postalCode: "74037",
            addressCountry: "US",
          },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91-9899300017",
            contactType: "customer service",
            areaServed: "IN",
            availableLanguage: "English",
          },
          {
            "@type": "ContactPoint",
            telephone: "+1-712-214-1784",
            contactType: "customer service",
            areaServed: "US",
            availableLanguage: "English",
          },
        ],
        sameAs: [
          "https://in.linkedin.com/company/akoode-technologies/",
          "https://x.com/akoodetech",
          "https://www.instagram.com/akoodetechnologies/",
          "https://www.facebook.com/akoodetechnologies",
          "https://www.youtube.com/@akoodetechnologies",
        ],
      },

      // 2. LocalBusiness — primary (India) office
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: "Akoode Technologies",
        url: SITE_URL,
        telephone: "+91-9899300017",
        email: "info@akoode.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Tower B4, SPAZE ITECH PARK, UN 616, Badshahpur Sohna Rd, Sector 49",
          addressLocality: "Gurugram",
          addressRegion: "Haryana",
          postalCode: "122018",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 28.4089,
          longitude: 77.0422,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          opens: "09:00",
          closes: "18:30",
        },
        parentOrganization: { "@id": AKOODE_ORG_ID },
      },

      // 3. Service
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        name: data.name,
        description: stripHtmlText(data.metaDescription || data.hero?.subtitle || ""),
        provider: { "@id": AKOODE_ORG_ID },
        url: canonicalUrl,
        areaServed: "Worldwide",
        serviceType: data.name,
      },

      // 4. FAQPage — only injected when the FAQ section has items
      ...(faqItems.length > 0 ? [{
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: faqItems.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      }] : []),

      // 5. BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Industries", item: `${SITE_URL}/industries` },
          { "@type": "ListItem", position: 3, name: data.name, item: canonicalUrl },
        ],
      },

      // 6. WebPage
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: data.metaTitle || data.name || "",
        description: stripHtmlText(data.metaDescription || ""),
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}#website`,
          url: SITE_URL,
          name: "Akoode Technologies",
        },
        about: { "@id": AKOODE_ORG_ID },
        ...(data.createdAt ? { datePublished: new Date(data.createdAt).toISOString().split("T")[0] } : {}),
        ...(data.updatedAt ? { dateModified: new Date(data.updatedAt).toISOString().split("T")[0] } : {}),
      },

      // 7. AggregateRating — based on verified ratings shown on the page
      // reviewCount is commented out until confirmed from Clutch dashboard
      {
        "@type": "AggregateRating",
        "@id": `${canonicalUrl}#rating`,
        itemReviewed: { "@id": AKOODE_ORG_ID },
        ratingValue: "5.0",
        bestRating: "5",
        worstRating: "1",
        // reviewCount: "47",
        description: "5.0 on Clutch · 4.9 on Google",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar />
      {isPreview && <PreviewEditLink editPath={edit || ""} />}
      <div className="industry-page">
      {on("hero") && <HeroSection data={data.hero} name={data.name} />}
      {on("why") && <WhySection data={data.why} />}
      {on("akoodeAdvantage") && <AkoodeAdvantageSection data={data.akoodeAdvantage} />}
      {on("whatWeBuild") && <WhatWeBuildSection data={data.whatWeBuild} />}
      {on("experties") && <Experties data={data.experties} />}
      {on("capabilities") && <Capabilities data={data.capabilities} />}
      {on("caseStudy") && <CaseStudy data={data.caseStudy} featured={featuredCaseStudy} others={sideCaseStudies.filter(Boolean)} />}
      {on("testimonial") && <Testimonial data={data.testimonial} testimonials={testimonials} />}
      {on("advantage") && <Advantage data={data.advantage} />}
      {on("techStack") && <TechStack data={data.techStack} />}
      {on("whatsChanging") && <WhatsChanging data={data.whatsChanging} blogs={recentBlogs} />}
      {on("whyChooseAkoode") && <WhyChooseAkoode data={data.whyChooseAkoode} />}
      {on("howWeWork") && <HowWeWork data={data.howWeWork} />}
      {on("faq") && <FAQ data={data.faq} />}
      {on("finalCta") && (
        <FinalCTA
          variant="dark"
          service={data?.name ? `${data.name} Software Development` : "Industry Software Development"}
          data={{
            heading: "Start your",
            headingAccent: data?.name ? `${data.name} project` : "project",
            subtitle:
              "Tell us what you're building. A senior engineer — not an account manager — will reply within thirty working minutes.",
            ...data.finalCta,
          }}
        />
      )}
      </div>
      <SubscribeForm />
      <Footer />
    </>
  );
}
