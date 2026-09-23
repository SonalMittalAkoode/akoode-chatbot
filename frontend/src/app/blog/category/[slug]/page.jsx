import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm from "@/components/SubscribeForm";
import JsonLdScript from "@/components/security/JsonLdScript";
import BlogList from "../../components/listing/BlogList";
import { getBlogTableData } from "@/api/frontend/blog";
import { getCategoryGroups, getCategoryGroupBySlug } from "@/lib/blogCategoryGroups";
import resolveImageUrl from "@/utils/resolveImageUrl";
import {
  normalizedSiteUrl,
  defaultOgImage,
  buildCanonical,
  organizationId,
  websiteId,
} from "@/utils/seo";

// ISR baseline — matches the same generateStaticParams + explicit revalidate
// convention used by blog/[slug] and case-studies/[slug]. Without this, the
// route's caching/regeneration behavior is ambiguous in production builds.
export const revalidate = 3600;

export async function generateStaticParams() {
  const groups = await getCategoryGroups();
  return groups.map((group) => ({ slug: group.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const group = await getCategoryGroupBySlug(slug);
  if (!group) return { title: "Category Not Found - Akoode" };

  const title = `${group.label} Blog & Insights - Akoode`;
  const description = group.subtitle;
  const canonical = buildCanonical(`/blog/category/${group.id}`);

  const category = group.categoryIds.join(",");
  const blogResponse = await getBlogTableData(1, 1, category);
  const blogs =
    blogResponse?.blogs || (Array.isArray(blogResponse) ? blogResponse : []);
  const topPost = blogs[0];

  const primaryImage =
    topPost?.logoimage ||
    (Array.isArray(topPost?.images) && topPost.images.length > 0 && topPost.images[0]) ||
    (typeof topPost?.image === "string" ? topPost.image : null);
  const ogImage = resolveImageUrl(primaryImage) || defaultOgImage;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
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

export default async function BlogCategoryPage({ params }) {
  const { slug } = await params;
  const group = await getCategoryGroupBySlug(slug);
  if (!group) notFound();

  const category = group.categoryIds.join(",");
  const blogResponse = await getBlogTableData(1, 6, category);
  const blogs =
    blogResponse?.blogs || (Array.isArray(blogResponse) ? blogResponse : []);
  const totalBlogs = blogResponse?.pagination?.totalBlogs || blogs.length;

  const categoryCanonical = buildCanonical(`/blog/category/${group.id}`);

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `${group.label} Blog & Insights`,
        description: group.subtitle,
        url: categoryCanonical,
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
            item: buildCanonical("/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: group.label,
            item: categoryCanonical,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLdScript id="schema-blog-category-list" data={schemaJsonLd} />
      <NavBar />

      <div
        className="relative z-[1] pt-[120px] pb-[60px] md:pt-[138px] md:pb-[76px] overflow-hidden"
        style={{
          backgroundImage: "url('/inner-bg.webp')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(to_right,#2A2B44_0%,#4A5175_25%,#00F6FF_50%,#4A5175_75%,#2A2B44_100%)] bg-[length:200%_auto] animate-text-shine">
              {group.label}
            </h1>

            <div className="h-[28px]" />

            <p className="text-[14px] md:text-[18px] text-white/80">
              <a
                href="/"
                className="text-[14px] md:text-[18px] text-white hover:text-[#a8a6ff] transition-colors"
              >
                Home
              </a>
              <ChevronRight
                className="mx-2 inline-block align-middle text-white/60"
                size={14}
              />
              <a
                href="/blog"
                className="text-[14px] md:text-[18px] text-white hover:text-[#a8a6ff] transition-colors"
              >
                Blog
              </a>
              <ChevronRight
                className="mx-2 inline-block align-middle text-white/60"
                size={14}
              />
              <span className="text-white/80">Category</span>
              <ChevronRight
                className="mx-2 inline-block align-middle text-white/60"
                size={14}
              />
              <span className="text-white/80">{group.label}</span>
            </p>
          </div>
        </div>
      </div>

      <BlogList blogs={blogs} totalBlogs={totalBlogs} category={category} />
      <SubscribeForm />
      <Footer />
    </>
  );
}
