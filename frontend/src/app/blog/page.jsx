import {
  normalizedSiteUrl,
  defaultOgImage,
  buildCanonical,
  organizationId,
  websiteId,
} from "@/utils/seo";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BlogHero from "./components/listing/BlogHero";
import TrendingSection from "./components/listing/TrendingSection";
import SpecialisedCapabilities from "./components/listing/SpecialisedCapabilities";
import CategoryFlow from "./components/listing/CategoryFlow";
import FinalCTA from "@/components/FinalCTA";
import SubscribeForm2 from "@/components/SubscribeForm2";
import JsonLdScript from "@/components/security/JsonLdScript";
import { getBlogTableData, getTrendingBlogs } from "@/api/frontend/blog";
import { getCategoryGroups } from "@/lib/blogCategoryGroups";
import resolveImageUrl from "@/utils/resolveImageUrl";

const blogCanonical = buildCanonical("/blog");
const title = "Blog - Akoode | Latest Technology Insights and News";
const description =
  "Explore Akoode's blog for insights on AI, software development, mobile apps, and tech trends. Stay ahead with expert articles and industry updates.";

export async function generateMetadata() {
  const heroResponse = await getBlogTableData(1, 1);
  const featured =
    heroResponse?.blogs || (Array.isArray(heroResponse) ? heroResponse : []);
  const latestPost = featured[0];

  const primaryImage =
    latestPost?.logoimage ||
    (Array.isArray(latestPost?.images) && latestPost.images.length > 0 && latestPost.images[0]) ||
    (typeof latestPost?.image === "string" ? latestPost.image : null);
  const ogImage = resolveImageUrl(primaryImage) || defaultOgImage;

  return {
    title,
    description,
    authors: [{ name: "Akoode Technologies" }],
    alternates: { canonical: blogCanonical },
    openGraph: {
      title,
      description,
      url: blogCanonical,
      siteName: "Akoode Technologies",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPage() {
  const categoryGroups = await getCategoryGroups();

  const [heroResponse, trending, ...groupResponses] = await Promise.all([
    getBlogTableData(1, 1), 
    getTrendingBlogs(5), 
    ...categoryGroups.map((group) =>
      getBlogTableData(1, 4, group.categoryIds.join(","))
    ),
  ]);

  const featured =
    heroResponse?.blogs || (Array.isArray(heroResponse) ? heroResponse : []);

  const sections = categoryGroups.map((group, index) => ({
    ...group,
    posts: groupResponses[index]?.blogs || [],
  }));

  // Page-only schema; Organization + WebSite are in root layout (no duplication).
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Blog",
        description,
        url: blogCanonical,
        about: { "@id": organizationId },
        isPartOf: { "@id": websiteId },
      },
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
            name: "Blog",
            item: blogCanonical,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLdScript id="schema-blog-list" data={schemaJsonLd} />
      <NavBar forceTransparent />
      <BlogHero blogs={featured} />
      <TrendingSection posts={trending} />
      {/* <SpecialisedCapabilities /> */}
      <CategoryFlow sections={sections} />
      <FinalCTA
        variant="light"
        service="Blog Enquiry"
        data={{
          eyebrow: "Have A Project In Mind?",
          heading: "Let's Build Your",
          headingAccent: "Next Big Idea",
          headingTail: "",
          subtitle:
          "Send your brief and someone from Akoode will respond within one business day. The first conversation covers your use case, your current environment, and how the build would be approached. No pitch deck, no pressure.",
        }}
      />
        <SubscribeForm2 />
      <Footer />
    </>
  );
}
