import { notFound } from "next/navigation";
import JobApplicationPageContent from "../components/JobApplicationPageContent";
import { getJobBySlug } from "@/api/frontend/job";
import {
  normalizedSiteUrl,
  defaultOgImage,
  buildCanonical,
  organizationId,
} from "@/utils/seo";
import JsonLdScript from "@/components/security/JsonLdScript";

// This route emits an inline JSON-LD <script> carrying the per-request CSP
// nonce (via JsonLdScript -> headers()). Reading headers() is incompatible with
// static/ISR generation — under `revalidate` it throws DYNAMIC_SERVER_USAGE and
// 500s the whole route in production. Render dynamically so the nonce is valid
// on every request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  let job = null;

  try {
    job = await getJobBySlug(slug);
  } catch {
    job = null;
  }

  const title = job?.metatitle || job?.title || "Career Opportunity - Akoode";
  const description =
    job?.metadescription ||
    job?.shortDescription ||
    job?.title ||
    "Explore career opportunities at Akoode and join our growing team.";
  const canonical = buildCanonical(`/career/${slug || ""}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Akoode Technologies",
      type: "article",
      images: [{ url: `${normalizedSiteUrl}/logo.svg`, width: 1200, height: 630, alt: "Akoode Technologies" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${normalizedSiteUrl}/logo.svg`],
    },
  };
}

// Maps free-text job tags to Google Jobs employment type enum values
const toEmploymentType = (tag = "") => {
  const t = tag.toLowerCase().trim();
  if (t.includes("full")) return "FULL_TIME";
  if (t.includes("part")) return "PART_TIME";
  if (t.includes("contract")) return "CONTRACTOR";
  if (t.includes("temporary") || t.includes("temp")) return "TEMPORARY";
  if (t.includes("intern")) return "INTERN";
  if (t.includes("volunteer")) return "VOLUNTEER";
  if (t.includes("per diem") || t.includes("per-diem")) return "PER_DIEM";
  return "OTHER";
};

// Formats a Date/string to YYYY-MM-DD required by Google Jobs
const toDateString = (value) => {
  if (!value) return null;
  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return null;
  }
};

export default async function CareerJobApplyPage({ params }) {
  const resolvedParams = await params;
  let job = null;
  try {
    job = await getJobBySlug(resolvedParams.slug);
  } catch (error) {
    console.error("Failed to fetch job", error);
  }

  if (!job) {
    notFound();
  }

  const slug = resolvedParams?.slug || "";
  const canonical = buildCanonical(`/career/${slug}`);

  const stripHtml = (value) =>
    value ? String(value).replace(/<[^>]*>/g, "").trim() : "";

  const jobTitle = stripHtml(job?.title);
  const jobDescription =
    stripHtml(job?.shortDescription) ||
    stripHtml(job?.description) ||
    "Explore career opportunities at Akoode Technologies.";

  const datePosted = toDateString(job?.createdAt);
  const validThrough = job?.deadline
    ? new Date(job.deadline).toISOString().replace(".000Z", "+05:30")
    : null;

  // Build PostalAddress from job.location string (e.g. "Gurgaon" or "Remote")
  const locationStr = job?.location ? String(job.location).trim() : "";
  const isRemote = /remote/i.test(locationStr);
  const jobLocation = locationStr
    ? {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: locationStr.split(",")[0].trim(),
          addressRegion: "Haryana",
          addressCountry: "IN",
        },
      }
    : null;

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JobPosting",

        // ── Core required fields ──────────────────────────────────────
        title: jobTitle || "Job Opportunity",
        description: jobDescription,
        directApply: true,
        url: canonical,

        // ── Dates ────────────────────────────────────────────────────
        ...(datePosted && { datePosted }),
        ...(validThrough && { validThrough }),

        // ── Employment type (Google Jobs enum) ───────────────────────
        ...(job?.tag && { employmentType: toEmploymentType(job.tag) }),

        // ── Remote / applicantLocationRequirements ───────────────────
        ...(isRemote && {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: {
            "@type": "Country",
            name: "India",
          },
        }),

        // ── Identifier ───────────────────────────────────────────────
        identifier: {
          "@type": "PropertyValue",
          name: "Akoode Technologies",
          value: slug,
        },

        // ── Hiring organization with logo + sameAs ───────────────────
        hiringOrganization: {
          "@type": "Organization",
          "@id": organizationId,
          name: "Akoode Technologies",
          sameAs: normalizedSiteUrl,
          logo: `${normalizedSiteUrl}/fav-logo1.png`,
        },

        // ── Location ─────────────────────────────────────────────────
        ...(jobLocation && { jobLocation }),

        // ── Rich details ─────────────────────────────────────────────
        industry: "Software Development",
        ...(job?.experience && {
          experienceRequirements: job.experience,
        }),
        ...(job?.salary && {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: {
              "@type": "QuantitativeValue",
              value: job.salary,
              unitText: "YEAR",
            },
          },
        }),
      },

      // ── Breadcrumb ───────────────────────────────────────────────────
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: normalizedSiteUrl || "/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Career",
            item: buildCanonical("/career"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: job?.title || "Job Detail",
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLdScript id="schema-career-detail" data={schemaJsonLd} />
      <JobApplicationPageContent job={job} />
    </>
  );
}

