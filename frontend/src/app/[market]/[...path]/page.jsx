import { getSBCBySlug } from "@/api/serviceByCountry";
import { getSBCCityBySlug } from "@/api/serviceByCity";
import ServiceByCountryClient from "@/app/country/_components/ServiceByCountryClient";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { buildCanonical, normalizedSiteUrl, defaultOgImage, twitterSite } from "@/utils/seo";
import resolveImageUrl from "@/utils/resolveImageUrl";
import { normalizeCountryLabel } from "@/utils/countryLabel";
import JsonLdScript from "@/components/security/JsonLdScript";
import PreviewEditLink from "./PreviewEditLink";

export const revalidate = 3600; // ISR baseline — on-demand revalidation via /api/revalidate overrides this

const stripHtml = (v) => (v ? String(v).replace(/<[^>]*>/g, "").trim() : "");

function resolveSegments(market, path = []) {
  if (path.length === 1) return { type: "country", slug: path[0], city: null };
  if (path.length === 2) return { type: "city", city: path[0], slug: path[1] };
  return { type: "unknown" };
}

export async function generateMetadata({ params, searchParams }) {
  const { market, path } = await params;
  const secret = process.env.NEXT_PUBLIC_PREVIEW_SECRET;
  const { isEnabled: isPreview } = await draftMode();
  const { type, slug, city } = resolveSegments(market, path);

  let data = null;
  if (type === "country") data = await getSBCBySlug(slug, market, isPreview ? secret : undefined);
  else if (type === "city") data = await getSBCCityBySlug(slug, market, city, isPreview ? secret : undefined);
  if (!data) return {};

  const title = data.meta?.title || data.title || "";
  const description = stripHtml(data.meta?.description || data.hero?.body || "").slice(0, 160);
  const urlPath = type === "city" ? `${market}/${city}/${slug}` : `${market}/${slug}`;
  const url = buildCanonical(urlPath);

  const rawLocationImage = data?.whyLocation?.image || "";
  const resolvedLocationImage = rawLocationImage ? resolveImageUrl(rawLocationImage) : null;
  const rawHeroImage = data?.heroImage || data?.hero?.heroImage || data?.hero?.image || "";
  const resolvedHeroImage = rawHeroImage ? resolveImageUrl(rawHeroImage) : null;
  const ogImageUrl = resolvedLocationImage || resolvedHeroImage || defaultOgImage;
  const ogImageAlt = data?.whyLocation?.imageAlt || data?.heroImageAlt || data?.hero?.imageAlt || title || "Akoode Technologies";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Akoode Technologies",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      site: twitterSite,
    },
  };
}

export default async function MarketPage({ params, searchParams }) {
  const { market, path } = await params;
  const { edit } = (await searchParams) || {};
  const secret = process.env.NEXT_PUBLIC_PREVIEW_SECRET;
  const { isEnabled: isPreview } = await draftMode();

  const { type, slug, city } = resolveSegments(market, path);
  if (type === "unknown") notFound();

  let data = null;
  let canonical = "";
  let schemaId = "";
  let parentPage = null;

  if (type === "country") {
    data = await getSBCBySlug(slug, market, isPreview ? secret : undefined);
    canonical = buildCanonical(`${market}/${slug}`);
    schemaId = isPreview ? "schema-sbc-preview" : "schema-sbc";
  } else {
    const [cityData, countryData] = await Promise.all([
      getSBCCityBySlug(slug, market, city, isPreview ? secret : undefined),
      getSBCBySlug(slug, market, isPreview ? secret : undefined),
    ]);
    data = cityData;
    canonical = buildCanonical(`${market}/${city}/${slug}`);
    schemaId = isPreview ? "schema-sbc-city-preview" : "schema-sbc-city";
    if (countryData?.title) {
      const countryLabel = normalizeCountryLabel(countryData.country);
      parentPage = { label: countryLabel || market.toUpperCase(), href: `/${market}/${slug}` };
    }
  }

  if (!data) notFound();

  const title = data.meta?.title || data.title || "Service - Akoode";
  const description = stripHtml(data.meta?.description || "");
  const organizationId = normalizedSiteUrl ? `${normalizedSiteUrl}/#organization` : "#organization";
  const websiteId = normalizedSiteUrl ? `${normalizedSiteUrl}/#website` : "#website";

  const faqEntities = (Array.isArray(data?.faq?.items) ? data.faq.items : [])
    .map((f) => ({ question: stripHtml(f?.question || f?.title), answer: stripHtml(f?.answer || f?.description) }))
    .filter((f) => f.question && f.answer);

  const reviewEntities = (Array.isArray(data?.testimonials?.items) ? data.testimonials.items : [])
    .map((t) => ({
      body: stripHtml(t?.quote),
      author: stripHtml(t?.name),
      org: stripHtml(t?.company),
    }))
    .filter((t) => t.body && t.author);


  const cityCrumbs = [
    { "@type": "ListItem", position: 1, name: "Home", item: normalizedSiteUrl || "/" },
    ...(parentPage
      ? [{ "@type": "ListItem", position: 2, name: parentPage.label, item: buildCanonical(`${market}/${slug}`) }]
      : []),
    { "@type": "ListItem", position: parentPage ? 3 : 2, name: data?.title || "Service", item: canonical },
  ];

  const breadcrumb = type === "city"
    ? cityCrumbs
    : [
        { "@type": "ListItem", position: 1, name: "Home", item: normalizedSiteUrl || "/" },
        { "@type": "ListItem", position: 2, name: data?.title || "Service", item: canonical },
      ];

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, name: title, description, url: canonical, isPartOf: { "@id": websiteId }, about: { "@id": organizationId } },
      { "@type": "Service", "@id": `${canonical}#service`, name: data?.title || title, description, serviceType: data?.title || title, provider: { "@id": organizationId }, url: canonical },
      { "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement: breadcrumb },
      ...(faqEntities.length > 0 ? [{
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqEntities.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      }] : []),
      ...(reviewEntities.length > 0 ? reviewEntities.map((r, i) => ({
        "@type": "Review",
        "@id": `${canonical}#review-${i + 1}`,
        itemReviewed: { "@id": `${canonical}#service` },
        reviewBody: r.body,
        author: {
          "@type": "Person",
          name: r.author,
          ...(r.org ? { worksFor: { "@type": "Organization", name: r.org } } : {}),
        },
      })) : []),
    ],
  };

  return (
    <>
      <JsonLdScript id={schemaId} data={schemaJsonLd} />
      <ServiceByCountryClient data={data} parentPage={parentPage} />
      {isPreview ? <PreviewEditLink editPath={edit || ""} /> : null}
    </>
  );
}
