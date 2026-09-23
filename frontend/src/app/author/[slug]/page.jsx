import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SubscribeForm from '@/components/SubscribeForm';
import JsonLdScript from '@/components/security/JsonLdScript';
import resolveImageUrl from '@/utils/resolveImageUrl';
import { authorSlug } from '@/utils/authorSlug';
import { getAuthorBySlug } from '@/api/frontend/author';
import { buildCanonical, defaultOgImage, organizationId } from '@/utils/seo';
import AuthorProfile from './_components/AuthorProfile';
import AuthorArticles from './_components/AuthorArticles';

// Author pages change only when an employee record or their posts change.
export const revalidate = 3600;

const firstNameOf = (name = '') => String(name).trim().split(/\s+/)[0] || '';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getAuthorBySlug(slug);
  const author = data?.author;

  if (!author) {
    return {
      title: 'Author Not Found - Akoode',
      description: 'The requested author profile could not be found.',
      robots: { index: false, follow: true },
    };
  }

  // A profile with no published posts is thin content — keep it reachable but
  // out of the index until the author has articles to show.
  const hasArticles = Array.isArray(data?.blogs) && data.blogs.length > 0;
  const title = `${author.name} - ${author.designation || 'Author'} | Akoode Technologies`;
  const description =
    String(author.bio || '').trim().slice(0, 160) ||
    `Articles and insights by ${author.name}, ${author.designation || 'author'} at Akoode Technologies.`;
  const canonical = buildCanonical(`/author/${authorSlug(author.name)}`);
  const image = resolveImageUrl(author.image) || defaultOgImage;

  return {
    title,
    description,
    alternates: { canonical },
    ...(hasArticles ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Akoode Technologies',
      type: 'profile',
      images: [{ url: image, width: 1200, height: 630, alt: author.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const data = await getAuthorBySlug(slug);
  const author = data?.author;

  if (!author) notFound();

  const blogs = Array.isArray(data?.blogs) ? data.blogs : [];
  const canonical = buildCanonical(`/author/${authorSlug(author.name)}`);
  const image = resolveImageUrl(author.image);

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        url: canonical,
        mainEntity: {
          '@type': 'Person',
          name: author.name,
          ...(author.designation && { jobTitle: author.designation }),
          ...(author.bio && { description: String(author.bio).trim() }),
          ...(image && { image }),
          ...(author.linkedin && { sameAs: [author.linkedin] }),
          worksFor: { '@id': organizationId },
          url: canonical,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          // No /author index exists, so the trail is Home -> the author, matching
          // what the page actually renders.
          { '@type': 'ListItem', position: 1, name: 'Home', item: buildCanonical('/') },
          { '@type': 'ListItem', position: 2, name: author.name, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLdScript id="schema-author-profile" data={schemaJsonLd} />
      <NavBar />

      {/* 952:749 — author profile section */}
      <main className="relative bg-[#F8FAFF] font-figtree">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-[26px] px-4 pt-[86px] pb-[60px] md:gap-[30px] md:pt-[96px] md:pb-[80px]">
          <AuthorProfile author={author} />
          <AuthorArticles blogs={blogs} firstName={firstNameOf(author.name)} />
        </div>
      </main>

      <SubscribeForm />
      <Footer />
    </>
  );
}
