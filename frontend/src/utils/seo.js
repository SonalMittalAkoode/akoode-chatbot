/**
 * Centralized SEO configuration and schema data.
 * Used by root layout (metadata + Organization/WebSite schema) and homepage (LocalBusiness, BreadcrumbList, ItemList).
 */
import { SITE_URL } from "@/config/site";
import { homeFaqData } from "@/data/homeFaqData";
export const normalizedSiteUrl = SITE_URL;

export const defaultOgImage = `${normalizedSiteUrl}/fav-logo1.png`;

export function ogImageUrl(src) {
  if (!src) return defaultOgImage;
  return `${normalizedSiteUrl}/api/og-image?src=${encodeURIComponent(src)}`;
}

/** Social share (OG/Twitter) image used by the Home and About Us pages. */
export const homeOgImage = {
  url: `${normalizedSiteUrl}/hero/homeOg.webp`,
  width: 3780,
  height: 1890,
  alt: "Akoode Technologies",
};

/** Twitter/X handle for the site (twitter:site card attribute). */
export const twitterSite = "@akoodetech";

/** Canonical URL for a path (no trailing slash on base). */
export function buildCanonical(path = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedSiteUrl}${cleanPath}`;
}

/** Schema.org @id for Organization and WebSite (no duplicate schema on inner pages). */
export const organizationId = normalizedSiteUrl ? `${normalizedSiteUrl}/#organization` : "#organization";
export const websiteId = normalizedSiteUrl ? `${normalizedSiteUrl}/#website` : "#website";

/** Shared organization data for schema (address, contact, sameAs). */
export const organizationSchemaBase = {
  telephone: "+91-9899300017",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Tower B4, SPAZE ITECH PARK, UN 616, Badshahpur Sohna Rd, Sector 49",
    addressLocality: "Gurugram",
    addressRegion: "Haryana",
    postalCode: "122018",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.facebook.com/akoodetechnologies/",
    "https://x.com/akoodetech",
    "https://in.linkedin.com/company/akoode-technologies/",
    "https://www.instagram.com/akoodetechnologies/",
  ],
};

/** US office — used for the secondary LocalBusiness schema node. */
export const usOfficeSchemaBase = {
  telephone: "+1-712-214-1784",
  address: {
    "@type": "PostalAddress",
    streetAddress: "10816 South Olmsted St W",
    addressLocality: "Jenks",
    addressRegion: "OK",
    postalCode: "74037",
    addressCountry: "US",
  },
};

/** Homepage-only JSON-LD graph: LocalBusiness, BreadcrumbList, ItemList. Root layout already outputs Organization + WebSite. */
export function getHomePageSchemaGraph() {
  const orgId = `${normalizedSiteUrl}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${normalizedSiteUrl}/#localbusiness`,
        name: "Akoode Technologies",
        image: `${normalizedSiteUrl}/fav-logo1.png`,
        url: normalizedSiteUrl,
        // sameAs must be external profile URLs; the Organization link belongs in parentOrganization.
        sameAs: organizationSchemaBase.sameAs,
        parentOrganization: { "@id": orgId },
        telephone: organizationSchemaBase.telephone,
        address: organizationSchemaBase.address,
        // reviewCount is commented out until confirmed from Clutch dashboard
        // (matches the pattern used on industries/[slug] pages).
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          // reviewCount: "648",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${normalizedSiteUrl}/#localbusiness-us`,
        name: "Akoode Technologies",
        url: normalizedSiteUrl,
        parentOrganization: { "@id": orgId },
        telephone: usOfficeSchemaBase.telephone,
        address: usOfficeSchemaBase.address,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${normalizedSiteUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: normalizedSiteUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${normalizedSiteUrl}#services`,
        name: "Our Services",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@type": "Service", name: "Software Development", url: `${normalizedSiteUrl}/services/software-development` } },
          { "@type": "ListItem", position: 2, item: { "@type": "Service", name: "Mobile Development", url: `${normalizedSiteUrl}/services/mobile-app-development` } },
          { "@type": "ListItem", position: 3, item: { "@type": "Service", name: "Artificial Intelligence", url: `${normalizedSiteUrl}/services/artificial-intelligence` } },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${normalizedSiteUrl}/#faq`,
        mainEntity: homeFaqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
