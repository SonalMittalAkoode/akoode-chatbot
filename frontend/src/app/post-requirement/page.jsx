import { buildCanonical, defaultOgImage, normalizedSiteUrl } from "@/utils/seo";
import PostRequirementClient from "./PostRequirementClient";
import JsonLdScript from "@/components/security/JsonLdScript";

const title = "Share Your Project Requirements | Get Started with Akoode";
const description =
  "Share your project requirements with Akoode Technologies. Tell us your goals, budget, and needs to get expert guidance and tailored solutions.";
const canonical = buildCanonical("/post-requirement");

const schemaPostRequirement = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Post Requirement",
      url: canonical,
    },
    {
      "@type": "ContactPage",
      name: "Post Requirement",
      url: canonical,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: normalizedSiteUrl || "/" },
        { "@type": "ListItem", position: 2, name: "Post Requirement", item: canonical },
      ],
    },
  ],
};

export const metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: "Akoode Technologies",
    type: "website",
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultOgImage],
  },
};

export default function PostRequirementPage() {
  return (
    <>
      <JsonLdScript id="schema-post-requirement" data={schemaPostRequirement} />
      <PostRequirementClient />
    </>
  );
}
