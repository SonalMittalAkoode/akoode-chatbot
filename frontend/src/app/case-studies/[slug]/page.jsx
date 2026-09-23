import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CaseStudyDetail from '../components/CaseStudyDetail';
import MoreBlogsSection from '../components/MoreBlogsSection';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getCasestudyBySlug, getCasestudyList } from '@/api/frontend/casestudy';
import { getCaseStudyLatestBySlug, getCaseStudyLatestList } from '@/api/caseStudyLatest';
import CaseStudyV2 from '@/app/case-study-v2/CaseStudyV2';
import MoreCaseStudies from '@/app/case-study-v2/_components/MoreCaseStudies';
import FinalCTA from '@/components/FinalCTA';
import '@/app/services-v2/services-v2.css';
import SubscribeForm from '@/components/SubscribeForm';
import { normalizedSiteUrl, defaultOgImage, buildCanonical, organizationId, websiteId, twitterSite } from '@/utils/seo';
import JsonLdScript from "@/components/security/JsonLdScript";
import resolveImageUrl from '@/utils/resolveImageUrl';
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = new Set();
  try {
    const res = await getCasestudyList(1, 200);
    (Array.isArray(res?.data) ? res.data : []).forEach((c) => c?.slug && slugs.add(String(c.slug)));
  } catch { /* ignore */ }
  try {
    const latest = await getCaseStudyLatestList();
    (Array.isArray(latest) ? latest : []).forEach((c) => c?.slug && slugs.add(String(c.slug)));
  } catch { /* ignore */ }
  return [...slugs].map((slug) => ({ slug }));
}

const extractCaseStudyFromResponse = (response) => {
    if (!response) return null;
    if (Array.isArray(response)) return response[0] ?? null;
    if (response.data) return response.data;
    return response;
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    if (!slug) {
        const canonical = buildCanonical('/case-studies');
        return {
            title: 'Case Study Detail - Akoode',
            description: 'Explore our case studies showcasing successful projects and innovative solutions.',
            alternates: { canonical },
            openGraph: { title: 'Case Study Detail - Akoode', description: 'Explore our case studies showcasing successful projects and innovative solutions.', url: canonical, siteName: 'Akoode Technologies', type: 'article', images: [{ url: defaultOgImage }] },
            twitter: { card: 'summary', title: 'Case Study Detail - Akoode', description: 'Explore our case studies showcasing successful projects and innovative solutions.', images: [defaultOgImage], site: twitterSite },
        };
    }

    try {
        const latest = await getCaseStudyLatestBySlug(slug);
        if (latest) {
            const title = latest.meta?.title || latest.title || 'Case Study Detail - Akoode';
            const description = latest.meta?.description || (latest.hero?.body || '').replace(/<[^>]*>/g, '').substring(0, 155) || 'Learn more about this case study from Akoode.';
            const canonical = buildCanonical(`/case-studies/${latest.slug || slug}`);
            const ogImage = resolveImageUrl(latest.hero?.heroImage) || defaultOgImage;
            return {
                title, description, alternates: { canonical },
                openGraph: { title, description, url: canonical, siteName: 'Akoode Technologies', type: 'article', images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
                twitter: { card: 'summary_large_image', title, description, images: [ogImage], site: twitterSite },
            };
        }
    } catch { /* fall through */ }

    try {
        const caseStudyResponse = await getCasestudyBySlug(slug);
        const caseStudy = extractCaseStudyFromResponse(caseStudyResponse);
        if (!caseStudy) {
            const canonical = buildCanonical(`/case-studies/${slug}`);
            return { title: 'Case Study Not Found - Akoode', description: 'The requested case study could not be found.', alternates: { canonical }, openGraph: { title: 'Case Study Not Found - Akoode', description: 'The requested case study could not be found.', url: canonical, siteName: 'Akoode Technologies', type: 'article', images: [{ url: defaultOgImage }] }, twitter: { card: 'summary', title: 'Case Study Not Found - Akoode', description: 'The requested case study could not be found.', images: [defaultOgImage], site: twitterSite } };
        }
        const title = caseStudy.metatitle || caseStudy.title || 'Case Study Detail - Akoode';
        const description = caseStudy.metadescription || caseStudy.shortdescription || caseStudy.description?.replace(/<[^>]*>/g, '').substring(0, 155) || 'Learn more about this case study from Akoode.';
        const canonical = buildCanonical(`/case-studies/${caseStudy.slug || slug}`);
        const ogImage = resolveImageUrl(caseStudy.casestudyimage) || defaultOgImage;
        return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, siteName: 'Akoode Technologies', type: 'article', images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }, twitter: { card: 'summary_large_image', title, description, images: [ogImage], site: twitterSite } };
    } catch {
        const canonical = buildCanonical(`/case-studies/${slug}`);
        return { title: 'Case Study Detail - Akoode', description: 'Explore our case studies showcasing successful projects and innovative solutions.', alternates: { canonical }, openGraph: { title: 'Case Study Detail - Akoode', description: 'Explore our case studies showcasing successful projects and innovative solutions.', url: canonical, siteName: 'Akoode Technologies', type: 'article', images: [{ url: defaultOgImage }] }, twitter: { card: 'summary', title: 'Case Study Detail - Akoode', description: 'Explore our case studies showcasing successful projects and innovative solutions.', images: [defaultOgImage], site: twitterSite } };
    }
}

export default async function CaseStudiesDetailPage({ params }) {
    const { slug } = await params;
    if (!slug || typeof slug !== "string" || !slug.trim()) notFound();

    const [latestDoc, caseStudyListResponse] = await Promise.all([
        getCaseStudyLatestBySlug(slug).catch(() => null),
        getCasestudyList(1, 6).catch(() => null),
    ]);

    const relatedTrimmed = (Array.isArray(caseStudyListResponse?.data) ? caseStudyListResponse.data : [])
        .filter((item) => item?.slug && item.slug !== slug)
        .slice(0, 3)
        .map((item) => ({
            _id: item?._id, id: item?.id, slug: item?.slug, title: item?.title,
            casestudyimage: item?.casestudyimage, shortdescription: item?.shortdescription,
            aboutdescription: item?.aboutdescription, metadescription: item?.metadescription,
            createdAt: item?.createdAt, updatedAt: item?.updatedAt,
        }));

    if (latestDoc) {
        const canonicalLatest = buildCanonical(`/case-studies/${latestDoc.slug || slug}`);
        const descriptionLatest = latestDoc.meta?.description || (latestDoc.hero?.body || '').replace(/<[^>]*>/g, '').substring(0, 155) || 'Learn more about this case study from Akoode.';
        const h1Latest = [latestDoc.hero?.heading, latestDoc.hero?.headingAccent].filter(Boolean).join(' ') || latestDoc.title || 'Case Study';
        const heroImageLatest = resolveImageUrl(latestDoc.hero?.heroImage) || defaultOgImage;

        const schemaLatest = {
            '@context': 'https://schema.org',
            '@graph': [
                { '@type': 'Article', headline: h1Latest, description: descriptionLatest, image: heroImageLatest, url: canonicalLatest, mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalLatest }, datePublished: latestDoc.createdAt, dateModified: latestDoc.updatedAt || latestDoc.createdAt, author: { '@type': 'Organization', '@id': organizationId }, publisher: { '@id': organizationId }, isPartOf: { '@id': websiteId } },
                { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: normalizedSiteUrl || '/' }, { '@type': 'ListItem', position: 2, name: 'Case Studies', item: buildCanonical('/case-studies') }, { '@type': 'ListItem', position: 3, name: latestDoc.title || 'Case Study', item: canonicalLatest }] },
                { '@type': 'Service', name: latestDoc.title || 'Case Study', description: descriptionLatest, provider: { '@type': 'Organization', '@id': organizationId }, url: canonicalLatest },
            ],
        };

        return (
            <>
                <JsonLdScript id="schema-case-study-latest" data={schemaLatest} />
                <NavBar forceTransparent />
                <CaseStudyV2 doc={latestDoc} />
                <div className="services-v2-finalcta">
                    <FinalCTA
                      variant="dark"
                      service="Case Study Enquiry"
                      data={{
                        eyebrow: 'Start Your Project',
                        heading: latestDoc?.finalCta?.heading || "Let's Build Something That Performs",
                        subtitle: latestDoc?.finalCta?.subtitle || "Tell us what you're building. A senior engineer — not an account manager — will reply within thirty working minutes.",
                      }}
                    />
                </div>
                <MoreCaseStudies caseStudies={relatedTrimmed} />
                <SubscribeForm />
                <Footer />
            </>
        );
    }

    let caseStudy = null;
    let relatedCaseStudies = [];

    try {
        const caseStudyResponse = await getCasestudyBySlug(slug);
        caseStudy = extractCaseStudyFromResponse(caseStudyResponse);
        if (caseStudy) {
            if (!Array.isArray(caseStudy.processstep)) caseStudy.processstep = [];
            if (!Array.isArray(caseStudy.challengestep)) caseStudy.challengestep = [];
            const norm = (v) => (v === null || v === undefined) ? '' : String(v);
            caseStudy.description = norm(caseStudy.description);
            caseStudy.abouttitle = norm(caseStudy.abouttitle);
            caseStudy.aboutdescription = norm(caseStudy.aboutdescription);
            caseStudy.challengetitle = norm(caseStudy.challengetitle);
            caseStudy.challengedescription = norm(caseStudy.challengedescription);
            caseStudy.deliveredtitle = norm(caseStudy.deliveredtitle);
            caseStudy.delivereddescription = norm(caseStudy.delivereddescription);
            caseStudy.resultstitle = norm(caseStudy.resultstitle);
            caseStudy.resultsdescription = norm(caseStudy.resultsdescription);
            caseStudy.processstep = caseStudy.processstep.map((s) => ({ ...s, title: norm(s.title), description: norm(s.description), imageurl: norm(s.imageurl) }));
            caseStudy.challengestep = caseStudy.challengestep.map((c) => ({ ...c, title: norm(c.title), description: norm(c.description) }));
            caseStudy = JSON.parse(JSON.stringify(caseStudy));
        }
        relatedCaseStudies = relatedTrimmed;
    } catch (error) {
        console.error('Error loading case study detail:', error);
    }

    if (!caseStudy || !caseStudy._id) notFound();

    const canonical = caseStudy?.slug
        ? buildCanonical(`/case-studies/${caseStudy.slug}`)
        : buildCanonical(`/case-studies/${slug || ''}`);

    const schemaJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'WebPage', name: caseStudy?.title || 'Case Study', url: canonical, isPartOf: { '@id': websiteId }, about: { '@id': organizationId } },
            { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: normalizedSiteUrl || '/' }, { '@type': 'ListItem', position: 2, name: caseStudy?.title || 'Case Study', item: canonical }] },
        ],
    };

    return (
        <>
            <JsonLdScript id="schema-case-study-detail" data={schemaJsonLd} />
            <NavBar />
            <div className="relative z-10 py-[120px] pb-[60px] md:py-[160px] md:pb-[100px] overflow-hidden bg-center bg-no-repeat bg-cover flex items-center justify-center" style={{ backgroundImage: "url(/inner-bg.webp)" }}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-8/12 mx-auto text-center">
                            <div className="flex flex-col items-center">
                                <h1 className="text-[22px] md:text-[42px] font-bold text-white mb-4 leading-tight">
                                    Case Study: <span className="text-gray-200">{caseStudy.title || 'Case Study'}</span>
                                </h1>
                                <p className="flex items-center gap-2 text-white text-sm md:text-lg justify-center">
                                    <Link className='text-white hover:text-gray-300 transition-all duration-400 font-medium' href="/">Home</Link>
                                    <ChevronRight className="text-xs" size={12} />{' '}
                                    <Link className='text-white hover:text-gray-300 transition-all duration-400 font-medium' href="/case-studies">Case Studies</Link>
                                    <ChevronRight className="text-xs" size={12} />{' '}
                                    <span className="text-white font-medium truncate max-w-[200px] md:max-w-none">{caseStudy.title || 'Detail'}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CaseStudyDetail caseStudy={caseStudy} />
            <MoreBlogsSection caseStudies={relatedCaseStudies} />
            <SubscribeForm />
            <Footer />
        </>
    );
}
