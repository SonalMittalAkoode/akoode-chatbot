import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BlogDetailHero from '../components/detail/BlogDetailHero';
import BlogDetail from '../components/detail/BlogDetail';
import BlogEnquiryPopup from '../components/BlogEnquiryPopup';
import { getBlogBySlug, getBlogTableData, getRelatedBlogs } from '@/api/frontend/blog';
import SubscribeForm from '@/components/SubscribeForm';
import resolveImageUrl from '@/utils/resolveImageUrl';
import FaqSchemaInjector from '@/components/FaqSchemaInjector';
import JsonLdScript from "@/components/security/JsonLdScript";
import {
  normalizedSiteUrl,
  defaultOgImage,
  buildCanonical,
  organizationId,
} from '@/utils/seo';
import { extractFaqEntitiesFromBlogHtml } from '@/utils/extractBlogFaqEntities';
import { authorSlug } from '@/utils/authorSlug';
import { getRequestNonce } from "@/lib/csp-server";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

// ISR baseline — published blog HTML is statically cached and regenerated
// hourly (or instantly on edit via /api/revalidate). Drafts use preview mode.
export const revalidate = 3600;

// Pre-render the most recent posts at build time so they're never cold; any
// other slug is generated on first request and then cached (dynamicParams).
export async function generateStaticParams() {
  try {
    const res = await getBlogTableData(1, 100);
    const blogs = Array.isArray(res?.blogs) ? res.blogs : [];
    return blogs
      .map((b) => b?.slug)
      .filter(Boolean)
      .map((slug) => ({ slug: String(slug) }));
  } catch {
    return [];
  }
}

const extractBlogFromResponse = (response) => {
  if (!response) return null;
  if (Array.isArray(response)) {
    return response[0] ?? null;
  }
  // A `data` key that's explicitly null (e.g. a "not found" API response wrapped
  // in a 200 success envelope) means no blog — don't fall through and treat the
  // wrapper object itself as the blog.
  if ("data" in response) {
    return response.data ?? null;
  }
  return response;
};

const extractListFromResponse = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.data && Array.isArray(response.data)) return response.data;
  return [];
};

const stripHtml = (value) => {
  if (!value) return '';
  return String(value).replace(/<[^>]*>/g, '').trim();
};

const formatDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

const hasEmbeddedSchemaMarkup = (value) => {
  if (!value) return false;
  const normalized = String(value).toLowerCase();
  return (
    normalized.includes('application/ld+json') ||
    normalized.includes('"@context"') ||
    normalized.includes('"@type":"faqpage"') ||
    normalized.includes('"@type": "faqpage"') ||
    normalized.includes('schema.org')
  );
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const { isEnabled: isPreview } = await draftMode();
  const previewToken = isPreview ? process.env.NEXT_PUBLIC_PREVIEW_SECRET : undefined;
  if (!slug) {
    const canonical = `${normalizedSiteUrl}/blog`;
    return {
      title: 'Blog Detail - Akoode',
      description: 'Latest insights and stories from the Akoode technology team.',
      alternates: { canonical },
      openGraph: {
        title: 'Blog Detail - Akoode',
        description: 'Latest insights and stories from the Akoode technology team.',
        url: canonical,
        siteName: 'Akoode Technologies',
        type: 'article',
        images: [{ url: defaultOgImage, width: 1200, height: 630, alt: 'Akoode Technologies Blog' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog Detail - Akoode',
        description: 'Latest insights and stories from the Akoode technology team.',
        images: [defaultOgImage],
      },
    };
  }

  try {
    const blogResponse = await getBlogBySlug(slug, previewToken);
    const blog = extractBlogFromResponse(blogResponse);

    if (!blog) {
      const canonical = buildCanonical(`/blog/${slug}`);
      return {
        title: 'Blog Not Found - Akoode',
        description: 'The requested blog could not be found.',
        alternates: { canonical },
        openGraph: {
          title: 'Blog Not Found - Akoode',
          description: 'The requested blog could not be found.',
          url: canonical,
          siteName: 'Akoode Technologies',
          type: 'article',
          images: [{ url: defaultOgImage, width: 1200, height: 630, alt: 'Akoode Technologies Blog' }],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Blog Not Found - Akoode',
          description: 'The requested blog could not be found.',
          images: [defaultOgImage],
        },
      };
    }

    const title = blog.metatitle || blog.title || 'Blog Detail - Akoode';
    const description = stripHtml(
      blog.metadescription ||
      blog.shortdescription ||
      blog.description?.slice(0, 155) ||
      'Learn more about this topic from Akoode.'
    );
    const canonical = buildCanonical(`/blog/${blog.slug || slug}`);

    // Resolve the blog's actual featured image for OG/Twitter preview
    const primaryImage =
      blog.logoimage ||
      (Array.isArray(blog.images) && blog.images.length > 0 && blog.images[0]) ||
      (typeof blog.image === 'string' ? blog.image : null);
    const ogImage = resolveImageUrl(primaryImage) || defaultOgImage;

    const publishedTime = formatDate(blog.date || blog.publishedOn || blog.createdAt);
    const modifiedTime = formatDate(blog.updatedAt || blog.modifiedAt);

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'Akoode Technologies',
        type: 'article',
        ...(publishedTime && { publishedTime }),
        ...(modifiedTime && { modifiedTime }),
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    const canonical = buildCanonical(`/blog/${slug}`);
    return {
      title: 'Blog Detail - Akoode',
      description: 'Latest insights and stories from the Akoode technology team.',
      alternates: { canonical },
      openGraph: {
        title: 'Blog Detail - Akoode',
        description: 'Latest insights and stories from the Akoode technology team.',
        url: canonical,
        siteName: 'Akoode Technologies',
        type: 'article',
        images: [{ url: defaultOgImage, width: 1200, height: 630, alt: 'Akoode Technologies Blog' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog Detail - Akoode',
        description: 'Latest insights and stories from the Akoode technology team.',
        images: [defaultOgImage],
      },
    };
  }
}

export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    notFound();
  }

  const { isEnabled: isPreview } = await draftMode();
  const previewToken = isPreview ? process.env.NEXT_PUBLIC_PREVIEW_SECRET : undefined;

  const nonce = await getRequestNonce();

  let blog = null;
  let related = [];

  try {
    const blogResponse = await getBlogBySlug(slug, previewToken);
    blog = extractBlogFromResponse(blogResponse);

    // Fetch related blogs using the blog's _id
    if (blog?._id) {
      related = await getRelatedBlogs(blog._id, 3);
    } else {
      // Fallback: fetch all blogs and filter
      const listResponse = await getBlogTableData();
      const allBlogs = extractListFromResponse(listResponse);
      related = allBlogs.filter((item) => item.slug !== blog?.slug).slice(0, 3);
    }
  } catch (error) {
    console.error('Error loading blog detail:', error);
  }

  if (!blog) {
    notFound();
  }

  // Related-post cards render only image, date, title and a link — the full
  // rich-text body (description/body/richdescription) is never shown there, so
  // strip it before passing to the client component to keep it out of the RSC
  // payload. The main `blog` keeps all fields (its body is rendered in full).
  const relatedSlim = (Array.isArray(related) ? related : []).map((r) => ({
    _id: r?._id,
    id: r?.id,
    slug: r?.slug,
    title: r?.title,
    logoimage: r?.logoimage,
    images: Array.isArray(r?.images) ? r.images.slice(0, 1) : undefined,
    image: typeof r?.image === 'string' ? r.image : undefined,
    date: r?.date,
    publishedOn: r?.publishedOn,
    createdAt: r?.createdAt,
  }));

  const canonical = blog?.slug
    ? buildCanonical(`/blog/${blog.slug}`)
    : buildCanonical(`/blog/${slug || ''}`);
  const primaryImage =
    blog?.logoimage ||
    (Array.isArray(blog?.images) && blog.images.length > 0 && blog.images[0]) ||
    (typeof blog?.image === 'string' ? blog.image : null);
  const imageUrl = resolveImageUrl(primaryImage);
  const title = blog?.metatitle || blog?.title || 'Blog Detail';
  const description =
    stripHtml(blog?.metadescription) ||
    stripHtml(blog?.shortdescription) ||
    stripHtml(blog?.description) ||
    'Latest insights and stories from the Akoode technology team.';
  const datePublished = formatDate(blog?.date || blog?.publishedOn || blog?.createdAt);
  const dateModified = formatDate(blog?.updatedAt || blog?.modifiedAt);

  const graph = [
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
          name: 'Blog',
          item: buildCanonical('/blog'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: blog?.title || 'Blog Detail',
          item: canonical,
        },
      ],
    },
  ];

  if (blog) {
    const authorName =
      (blog?.author && typeof blog.author === 'object' ? blog.author.name : null) ||
      blog?.authorName ||
      null;
    // Employee-backed authors have a profile page — linking the Person entity to
    // it ties every post to one author entity for E-E-A-T.
    const authorPageUrl =
      blog?.author && typeof blog.author === 'object' && blog.author.name
        ? buildCanonical(`/author/${authorSlug(blog.author.name)}`)
        : null;
    const authorLinkedin =
      blog?.author && typeof blog.author === 'object' ? blog.author.linkedin : null;
    const blogPosting = {
      '@type': 'BlogPosting',
      headline: title,
      description,
      url: canonical,
      mainEntityOfPage: canonical,
      publisher: { '@id': organizationId },
      author: authorName
        ? {
            '@type': 'Person',
            name: authorName,
            ...(authorPageUrl && { url: authorPageUrl }),
            ...(authorLinkedin && { sameAs: [authorLinkedin] }),
          }
        : { '@id': organizationId },
    };
    if (imageUrl) {
      blogPosting.image = [
        {
          '@type': 'ImageObject',
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ];
    }
    if (datePublished) {
      blogPosting.datePublished = datePublished;
    }
    if (dateModified) {
      blogPosting.dateModified = dateModified;
    }
    graph.unshift(blogPosting);
  }

  const faqSourceHtml = blog?.description || blog?.body || blog?.richdescription || "";
  const hasInlineSchema = hasEmbeddedSchemaMarkup(faqSourceHtml);
  const faqEntities = hasInlineSchema
    ? []
    : extractFaqEntitiesFromBlogHtml(faqSourceHtml);

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <>
      <JsonLdScript id="schema-blog-detail" data={schemaJsonLd} />
      {/* Blog-only FAQ schema injector to avoid FAQPage duplication from SSR + RSC payload in App Router. */}
      <FaqSchemaInjector faqEntities={faqEntities} nonce={nonce} />
      {/* <Header /> */}
      {/* Figma 934:470 — header sits transparent over the dark hero until scroll */}
      <NavBar forceTransparent />

      <BlogDetailHero blog={blog} />
      <BlogDetail blog={blog} relatedBlogs={relatedSlim} pageUrl={canonical} />
      <SubscribeForm />
      <Footer />
      <BlogEnquiryPopup />
    </>
  );
}

