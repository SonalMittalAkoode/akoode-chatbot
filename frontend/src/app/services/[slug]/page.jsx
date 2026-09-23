import { cache } from 'react';
import { getServiceBySlug } from '@/api/frontend/services';
import { getUpdatedServiceBySlug } from '@/api/updatedService';
import ServicePage from '../components';
import SoftwareDevelopmentTemplate from '@/app/services-v2/software-development/SoftwareDevelopmentTemplate';
import MobileAppDevelopmentTemplate from '@/app/services-v2/mobile-app-development/MobileAppDevelopmentTemplate';
import AiDevelopmentTemplate from '@/app/services-v2/ai-development/AiDevelopmentTemplate';
import EcommerceDevelopmentTemplate from '@/app/services-v2/ecommerce-development/EcommerceDevelopmentTemplate';
import WebDevelopmentTemplate from '@/app/services-v2/web-development/WebDevelopmentTemplate';
import StaffAugmentationTemplate from '@/app/services-v2/staff-augmentation/StaffAugmentationTemplate';
import DevopsTemplate from '@/app/services-v2/devops/DevopsTemplate';
import DigitalTransformationTemplate from '@/app/services-v2/digital-transformation/DigitalTransformationTemplate';
import { SA_SERVICES } from '@/app/services-v2/staff-augmentation/saData';
import { DT_SERVICES } from '@/app/services-v2/digital-transformation/components/DtServices';

// Offering lists for templates whose services section ships as code rather than
// CMS data. Without this the Service node advertises no offerings at all, even
// though the page renders seven of them under an H2.
const TEMPLATE_FALLBACK_OFFERINGS = {
  'staff-augmentation': SA_SERVICES,
  'digital-transformation': DT_SERVICES,
};

// Which section key holds a template's offerings. Templates absent here use the
// shared `services` key.
const SERVICES_SECTION_KEY_BY_TEMPLATE = {
  'ecommerce-development': 'ecommerceServices',
  'staff-augmentation': 'staffServices',
  'devops': 'devopsServices',
  'digital-transformation': 'dtServices',
};

// Templates whose page body renders the founder CTA strip.
const FOUNDER_STRIP_TEMPLATES = new Set([
  'devops',
  'digital-transformation',
  'staff-augmentation',
  'web-development',
]);

// Templates that render via the new design system (Updated Services CMS).
const NEW_DESIGN_TEMPLATES = {
  'software-development': SoftwareDevelopmentTemplate,
  'mobile-development': MobileAppDevelopmentTemplate,
  'ai': AiDevelopmentTemplate,
  'ecommerce-development': EcommerceDevelopmentTemplate,
  'web-development': WebDevelopmentTemplate,
  'staff-augmentation': StaffAugmentationTemplate,
  'devops': DevopsTemplate,
  'digital-transformation': DigitalTransformationTemplate,
};
// Intrinsic pixel dimensions of each built-in social card, so og:image:width /
// og:image:height describe the file actually served. Every one of these is 3:2,
// but the metadata previously hard-coded 1200x630 (1.91:1) for all of them —
// declaring a ratio no template ships makes scrapers letterbox or crop the card.
const HERO_OG_BY_TEMPLATE = {
  'mobile-development': { path: '/mobile-app/mobile.png', width: 848, height: 566 },
  ai: { path: '/services/artificial-intelligence.svg' },
  // JPEG, not PNG: the source was a 606 KB palette PNG of a photographic
  // composition, which PNG cannot compress well (448 KB even re-quantised).
  // Same 1200x800 pixels at q82 is 145 KB. JPEG rather than WebP because
  // LinkedIn and WhatsApp scrapers are unreliable on WebP.
  'ecommerce-development': { path: '/e-commerce/OGecom.jpg', width: 1200, height: 800 },
  'web-development': { path: '/web_dev/web_og.png', width: 1536, height: 1024 },
  'staff-augmentation': { path: '/staff_augmentation/staff_augmentation.png', width: 1619, height: 971 },
  // The on-page hero is a 2.4:1 transparent WebP, so it cannot serve as the
  // social card. This is that artwork composited onto the page background at
  // the 1.91:1 summary_large_image ratio.
  'digital-transformation': { path: '/digital-transformation/og-digital-transformation.jpg', width: 1200, height: 630 },
};
const HERO_OG_DEFAULT = { path: '/software_development/hero.png', width: 625, height: 416 };

const heroOgEntryFor = (template) => HERO_OG_BY_TEMPLATE[template] || HERO_OG_DEFAULT;
const heroOgFor = (template) => heroOgEntryFor(template).path;
import { notFound } from 'next/navigation';
import { normalizedSiteUrl, defaultOgImage, buildCanonical, twitterSite } from '@/utils/seo';
import JsonLdScript from "@/components/security/JsonLdScript";
import resolveImageUrl from '@/utils/resolveImageUrl';

const TEMPLATE_META_DESCRIPTIONS = {
  'ecommerce-development':
    'AI-powered custom ecommerce development company in India delivering intelligent, scalable online stores for businesses worldwide. Build faster, convert more, and grow with AI-driven ecommerce solutions.',
  'web-development':
    'Custom web development company building fast, measurable websites, web applications and AI-powered platforms for businesses across India, UK, US and UAE.',
  'staff-augmentation':
    'Staff augmentation company placing vetted engineers, designers and QA specialists directly inside your team. Onboarded in weeks, not quarters, across India, UK, US and UAE.',
  'devops':
    'Cloud and DevOps company building CI/CD pipelines, cloud architecture and Kubernetes platforms that let engineers ship without a war room. Serving India, UK, US and UAE.',
};


const HERO_LOCAL_PREFIXES = ['/mobile-app/', '/software_development/', '/ai/', '/services/', '/tech_stacks/', '/badge/', '/strip/', '/whyus_badge/'];

const resolveHeroOgImage = (updatedService) => {
  const fallback = `${normalizedSiteUrl}${heroOgFor(updatedService?.template)}`;

  // These templates each ship a purpose-built OG image (not the on-page hero
  // image, which is a different aspect ratio) — always use it rather than
  // letting a CMS-set hero.heroImage silently override the social card.
  if (
    updatedService?.template === 'ecommerce-development' ||
    updatedService?.template === 'web-development' ||
    updatedService?.template === 'staff-augmentation' ||
    updatedService?.template === 'digital-transformation'
  ) return fallback;
  const raw = updatedService?.hero?.heroImage;
  if (!raw) return fallback;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (HERO_LOCAL_PREFIXES.some((p) => raw.startsWith(p))) return `${normalizedSiteUrl}${raw}`;
  return resolveImageUrl(raw) || fallback;
};

const toTitleCase = (value) => {
  if (!value) return '';
  return value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const humanizeSlug = (slug) => {
  if (!slug) return 'Metaverse Development Company';
  const normalized = slug.replace(/[-_]+/g, ' ').trim();
  return toTitleCase(normalized || slug);
};

const createFallbackMetadata = (slug) => {
  const humanSlug = humanizeSlug(slug);
  const canonical = buildCanonical(`/services/${slug || ''}`);

  return {
    title: `${humanSlug} - Akoode Technologies`,
    description: `Discover ${humanSlug} solutions from Akoode Technologies. We deliver immersive experiences across AR, VR, 3D modeling, metaverse platforms, and spatial computing to accelerate your digital transformation.`,
    authors: [{ name: 'Akoode Technologies' }],
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${humanSlug} - Akoode Technologies`,
      description: `Discover ${humanSlug} solutions from Akoode Technologies. We deliver immersive experiences across AR, VR, 3D modeling, metaverse platforms, and spatial computing to accelerate your digital transformation.`,
      url: canonical,
      siteName: 'Akoode Technologies',
      type: 'website',
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${humanSlug} - Akoode Technologies`,
      description: `Discover ${humanSlug} solutions from Akoode Technologies. We deliver immersive experiences across AR, VR, 3D modeling, metaverse platforms, and spatial computing to accelerate your digital transformation.`,
      images: [defaultOgImage],
      site: twitterSite,
    },
  };
};

const normalizeFaqList = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  return [];
};

const stripHtml = (value) => {
  if (!value) return '';
  return String(value).replace(/<[^>]*>/g, '').trim();
};

// React.cache deduplicates calls within the same request — generateMetadata and
// the page component both call this, so without cache() the backend gets hit twice.
const fetchService = cache(async (slug) => {
  if (!slug) {
    return null;
  }
  try {
    const response = await getServiceBySlug(slug);
    const serviceData = response?.data ?? response ?? null;

    // Validate that we have actual service data
    if (!serviceData || (typeof serviceData === 'object' && Object.keys(serviceData).length === 0)) {
      console.warn('Empty or invalid service data for slug:', slug);
      return null;
    }

    return serviceData;
  } catch (error) {
    console.error('Failed to fetch service detail:', error);
    return null;
  }
});

// previewToken lets a Draft/Inactive record be fetched from the admin's
// "Preview" button — without it, getUpdatedServiceBySlug only returns
// published (status: true) records. cache() is keyed on all arguments, so
// preview and non-preview calls within the same request are still deduped
// independently.
const fetchUpdatedService = cache(async (slug, previewToken) => {
  if (!slug) return null;
  try {
    return await getUpdatedServiceBySlug(slug, previewToken);
  } catch {
    return null;
  }
});

// This route emits an inline JSON-LD <script> carrying the per-request CSP nonce
// (via JsonLdScript -> headers()). The root layout also reads headers(), so every
// page already renders dynamically at runtime — there is no static caching to lose.
// Declaring `revalidate` + `generateStaticParams` only pushed this route down the
// static-prerender path, where headers() throws DYNAMIC_SERVER_USAGE and 500s the
// whole route in production. Render dynamically so the nonce is valid every request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) || {};
  const slugParam = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug[0] : resolvedParams?.slug;
  const previewToken = resolvedSearchParams?.preview;
  const fallback = createFallbackMetadata(slugParam);

  // Updated service takes precedence
  const updatedService = await fetchUpdatedService(slugParam, previewToken);
  if (updatedService?.template && NEW_DESIGN_TEMPLATES[updatedService.template]) {
    const canonical = buildCanonical(`/services/${slugParam}`);
    const title = stripHtml(updatedService.meta?.title || updatedService.title) || humanizeSlug(slugParam);
    const description =
      stripHtml(updatedService.meta?.description) ||
      TEMPLATE_META_DESCRIPTIONS[updatedService.template] ||
      fallback.description;
    const heroOgImage = resolveHeroOgImage(updatedService);
    // Only declare dimensions when the served file is one of the built-in cards
    // whose size we know. If a CMS hero image won the resolve, its dimensions
    // are unknown — omitting them is correct; asserting the wrong ones is not.
    const heroOgEntry = heroOgEntryFor(updatedService.template);
    const heroOgIsBuiltIn = heroOgImage === `${normalizedSiteUrl}${heroOgEntry.path}`;
    const heroOgSize =
      heroOgIsBuiltIn && heroOgEntry.width && heroOgEntry.height
        ? { width: heroOgEntry.width, height: heroOgEntry.height }
        : {};
    return {
      title,
      description,
      authors: fallback.authors,
      alternates: { canonical },
      openGraph: { title, description, url: canonical, siteName: 'Akoode Technologies', type: 'website', images: [{ url: heroOgImage, ...heroOgSize, alt: title }] },
      twitter: { card: 'summary_large_image', title, description, images: [heroOgImage], site: twitterSite },
    };
  }

  const service = await fetchService(slugParam);

  if (!service) {
    return fallback;
  }

  const canonical =
    service.canonicalUrl || service.canonicalurl || fallback.alternates?.canonical;
  const title = service.metatitle || fallback.title;
  const description = service.metadescription || fallback.description;
  const ogImage = resolveImageUrl(service.logoimage || service.servicesimage || service.aboutimage) || defaultOgImage;

  return {
    title,
    description,
    authors: fallback.authors,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Akoode Technologies',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      site: twitterSite,
    },
  };
}

export default async function ServiceDetailPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) || {};
  const slugParam = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug[0] : resolvedParams?.slug;
  const previewToken = resolvedSearchParams?.preview;

  if (!slugParam) {
    notFound();
  }

  // Updated service takes precedence over legacy
  const updatedService = await fetchUpdatedService(slugParam, previewToken);
  const NewDesignTemplate = updatedService?.template ? NEW_DESIGN_TEMPLATES[updatedService.template] : null;
  if (NewDesignTemplate) {
    const canonical = buildCanonical(`/services/${slugParam}`);
    const organizationId = normalizedSiteUrl ? `${normalizedSiteUrl}/#organization` : '#organization';
    const websiteId = normalizedSiteUrl ? `${normalizedSiteUrl}/#website` : '#website';
    // Strip HTML so the H1's <span> markup never leaks into JSON-LD text fields.
    const usTitle = stripHtml(updatedService.meta?.title || updatedService.title) || humanizeSlug(slugParam);
    const usDescription = stripHtml(updatedService.meta?.description || '');
    // Distinct from usTitle (the SEO <title> tag text): a clean entity name for
    // the Service schema node, from the dashboard's own "title" field rather
    // than the keyword-optimized meta title.
    const usServiceName = stripHtml(updatedService.title) || usTitle;

    const usFaqEntities = (Array.isArray(updatedService.faq?.items) ? updatedService.faq.items : [])
      .map((f) => ({ question: stripHtml(f?.q), answer: stripHtml(f?.a) }))
      .filter((f) => f.question && f.answer);

    const usHeroImage = resolveHeroOgImage(updatedService);

    // Freshness signals. These templates lean hard on being current ("Where
    // eCommerce Development Stands in 2026"), but exposed no date anywhere, so
    // nothing distinguished a page edited yesterday from a stale one.
    const toIsoDate = (value) => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    };
    const usDateModified = toIsoDate(updatedService.updatedAt);
    const usDatePublished = toIsoDate(updatedService.createdAt);

    const breadcrumbId = `${canonical}#breadcrumb`;

    // The services section key differs per template (`ecommerceServices` on the
    // commerce template, `services` elsewhere) and item labels live under either
    // `title` or `label`. Skipped when the section is toggled off, so the schema
    // never advertises offerings the page doesn't actually show.
    // Pick the services section by template, not by first-truthy. Mongoose
    // materialises every declared subdocument (`show` carries a default), so
    // `ecommerceServices` is a truthy `{show:false, items:[]}` on every record
    // — an `||` chain always short-circuited there, and the `show === false`
    // branch below then emptied the offerings for every template.
    const usServicesSection = updatedService[SERVICES_SECTION_KEY_BY_TEMPLATE[updatedService.template] || 'services'];
    const usCmsOfferings = Array.isArray(usServicesSection?.items) ? usServicesSection.items : [];
    const usOfferings = (usServicesSection?.show === false
      ? []
      : usCmsOfferings.length > 0
        ? usCmsOfferings
        : TEMPLATE_FALLBACK_OFFERINGS[updatedService.template] || []
    )
      .map((item) => ({
        name: stripHtml(item?.title || item?.label),
        // Code-defined offerings carry their copy in blocks[] rather than a
        // flat `desc`; blocks[0] is the "What it is" paragraph.
        description: stripHtml(item?.desc || item?.blocks?.[0]?.body || ''),
      }))
      .filter((item) => item.name);

    const usSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: usTitle,
          description: usDescription,
          url: canonical,
          image: usHeroImage,
          inLanguage: 'en',
          isPartOf: { '@id': websiteId },
          about: { '@id': organizationId },
          breadcrumb: { '@id': breadcrumbId },
          ...(usHeroImage && { primaryImageOfPage: usHeroImage }),
          ...(usDatePublished && { datePublished: usDatePublished }),
          ...(usDateModified && { dateModified: usDateModified }),
        },
        {
          '@type': 'Service',
          // Every other node in this graph is addressable by @id; without one
          // nothing (here or on another page) can reference the Service.
          '@id': `${canonical}#service`,
          name: usServiceName,
          description: usDescription,
          serviceType: usServiceName,
          // Reference the canonical Organization node (defined once in the root
          // layout) by @id — avoids emitting a second Organization node.
          provider: { '@id': organizationId },
          url: canonical,
          mainEntityOfPage: canonical,
          // Akoode's stated served markets (India, UK, US, UAE — same set named
          // in these templates' own default copy) rather than per-page CMS data,
          // since which countries the company serves doesn't vary by service.
          areaServed: [
            { '@type': 'Country', name: 'India' },
            { '@type': 'Country', name: 'United Kingdom' },
            { '@type': 'Country', name: 'United States' },
            { '@type': 'Country', name: 'United Arab Emirates' },
          ],
          ...(usOfferings.length > 0 && {
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: `${usServiceName} Services`,
              itemListElement: usOfferings.map((offering) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: offering.name,
                  ...(offering.description && { description: offering.description }),
                },
              })),
            },
          }),
        },
        {
          '@type': 'BreadcrumbList',
          '@id': breadcrumbId,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: normalizedSiteUrl || '/' },
            { '@type': 'ListItem', position: 2, name: 'Services', item: `${normalizedSiteUrl}/services` },
            // The dashboard `title` ("eCommerce Development Company"), not the SEO
            // meta title — the leaf used to render the full pipe-delimited title
            // tag, which both looked broken in SERP breadcrumbs and disagreed with
            // the breadcrumb visible on the page.
            { '@type': 'ListItem', position: 3, name: usServiceName, item: canonical },
          ],
        },
      ],
    };

    // Templates that render <FounderCtaStrip>, i.e. the pages that actually
    // depict the founder. Scoped deliberately: a Person node on a page that
    // never shows that person is an unsupported claim.
    if (FOUNDER_STRIP_TEMPLATES.has(updatedService.template)) {
      usSchema['@graph'].push({
        '@type': 'Person',
        '@id': `${normalizedSiteUrl}/#founder`,
        name: 'Akhilesh K Verma',
        jobTitle: 'Founder',
        worksFor: { '@id': organizationId },
        image: `${normalizedSiteUrl}/aboutUs/akhil.webp`,
      });
    }

    if (usFaqEntities.length > 0) {
      usSchema['@graph'].push({
        '@type': 'FAQPage',
        mainEntity: usFaqEntities.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      });
    }

    return (
      <>
        <JsonLdScript id="schema-service" data={usSchema} />
        <NewDesignTemplate data={updatedService} />
      </>
    );
  }

  // Fetch service first; only fetch FAQs if the service is valid
  const service = await fetchService(slugParam);

  if (!service || (!service.title && !service.slug)) {
    notFound();
  }


  const canonical = service?.canonicalUrl || service?.canonicalurl || `${normalizedSiteUrl}/services/${slugParam || ''}`;
  const organizationId = normalizedSiteUrl
    ? `${normalizedSiteUrl}/#organization`
    : '#organization';
  const websiteId = normalizedSiteUrl
    ? `${normalizedSiteUrl}/#website`
    : '#website';
  const title = service?.metatitle || service?.title || 'Service Detail - Akoode';
  const description = stripHtml(service?.metadescription || service?.description || '');

  const faqList = normalizeFaqList(service?.faqs || []).sort(
    (a, b) => (a?.order ?? 0) - (b?.order ?? 0)
  );
  const faqEntities = faqList
    .map((faq) => ({
      question: stripHtml(faq?.title),
      answer: stripHtml(faq?.description),
    }))
    .filter((item) => item.question && item.answer);

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: title,
        description,
        url: canonical,
        isPartOf: {
          '@id': websiteId,
        },
        about: {
          '@id': organizationId,
        },
      },
      {
        '@type': 'Service',
        name: service?.title || title,
        description,
        serviceType: service?.title || title,
        provider: {
          '@type': 'Organization',
          '@id': organizationId,
          name: 'Akoode Technologies',
        },
        url: canonical,
        mainEntityOfPage: canonical,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: normalizedSiteUrl || '/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: service?.title || 'Service',
            item: canonical,
          },
        ],
      },
    ],
  };

  if (faqEntities.length > 0) {
    schemaJsonLd['@graph'].push({
      '@type': 'FAQPage',
      mainEntity: faqEntities.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <>
      <JsonLdScript id="schema-service" data={schemaJsonLd} />
      <ServicePage service={service} />
    </>
  );
}