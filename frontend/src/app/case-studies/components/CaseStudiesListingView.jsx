import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CaseStudyList from './CaseStudyList';
import { getCasestudyList } from '@/api/frontend/casestudy';
import { getCaseStudyLatestList } from '@/api/caseStudyLatest';
import SubscribeForm from '@/components/SubscribeForm';
import JsonLdScript from '@/components/security/JsonLdScript';
import {
    normalizedSiteUrl,
    buildCanonical,
    organizationId,
    websiteId,
} from '@/utils/seo';
import {
    CASE_STUDY_CATEGORIES,
    isInCategory,
    categoryHref,
} from '@/config/caseStudyCategories';

const caseStudyCanonical = buildCanonical('/case-studies');

const chipClass = (isActive) =>
    `inline-flex items-center rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${isActive
        ? 'border-[#474972] bg-[#474972] text-white'
        : 'border-[#474972]/20 bg-white text-[#474972] hover:border-[#474972]'
    }`;

/* ------------------------------------------------------------------ *
 *  Shared listing view for the case-study pages.
 *
 *  Renders the full listing when `activeCategory` is null, or a
 *  filtered category listing (/case-studies/category/<slug>) when a
 *  category is passed in.
 * ------------------------------------------------------------------ */
export default async function CaseStudiesListingView({ activeCategory = null }) {
    const limit = 6;
    const [caseStudyResponse, latestList] = await Promise.all([
        getCasestudyList(1, limit),
        getCaseStudyLatestList().catch(() => []),
    ]);

    const oldCaseStudies = caseStudyResponse?.data || [];
    const oldTotal = caseStudyResponse?.total ?? oldCaseStudies.length;

    // Only the "latest" records carry the hero `Type` field the categories
    // are built from, so a filtered view lists those alone. Newest first, so a
    // newly added case study leads its category listing.
    const latestSource = (Array.isArray(latestList) ? latestList : [])
        .filter((d) => !activeCategory || isInCategory(d, activeCategory))
        .sort(
            (a, b) =>
                new Date(b?.createdAt || 0).getTime() -
                new Date(a?.createdAt || 0).getTime()
        );

    const latestCards = latestSource.map((d) => ({
        _id: d?._id,
        slug: d?.slug,
        title: d?.title,
        casestudyimage: d?.hero?.listingImage || d?.hero?.heroImage || '',
        shortdescription: d?.meta?.description || '',
        aboutdescription: d?.hero?.body || d?.meta?.description || '',
        createdAt: d?.createdAt,
        updatedAt: d?.updatedAt,
    }));

    const latestSlugs = new Set(latestCards.map((c) => c.slug).filter(Boolean));
    const oldFiltered = oldCaseStudies.filter((c) => !latestSlugs.has(c?.slug));

    // Filtered view: show only the matching records and pass an exact total so
    // CaseStudyList hides "Load More" (its paginated fetch is unfiltered).
    const caseStudies = activeCategory
        ? latestCards
        : [...latestCards, ...oldFiltered];
    const totalCaseStudies = activeCategory
        ? latestCards.length
        : oldTotal + latestCards.length;

    const activeCanonical = activeCategory
        ? buildCanonical(categoryHref(activeCategory.slug))
        : caseStudyCanonical;

    const schemaJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                name: activeCategory
                    ? `${activeCategory.label} Case Studies`
                    : 'Case Studies',
                description: activeCategory
                    ? `Akoode Technologies case studies in ${activeCategory.label} — the problem, the approach, and what shipped.`
                    : 'Explore our case studies showcasing successful projects, innovative solutions, and client success stories. See how Akoode delivers exceptional results.',
                url: activeCanonical,
                about: { '@id': organizationId },
                isPartOf: { '@id': websiteId },
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
                        name: 'Case Studies',
                        item: caseStudyCanonical,
                    },
                    ...(activeCategory
                        ? [
                            {
                                '@type': 'ListItem',
                                position: 3,
                                name: activeCategory.label,
                                item: activeCanonical,
                            },
                        ]
                        : []),
                ],
            },
        ],
    };

    return (
        <>
            <JsonLdScript id="schema-case-study-list" data={schemaJsonLd} />
            <NavBar />
            <div className="relative z-10 py-[120px] pb-[60px] md:py-[160px] md:pb-[100px] overflow-hidden bg-center bg-no-repeat bg-cover flex items-center justify-center" style={{ backgroundImage: "url(/inner-bg.webp)" }}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-9/12 mx-auto text-center">
                            <div className="flex flex-col items-center">
                                {/* The shine gradient has dark stops that disappear
                                    against the dark hero, so it stays on the short
                                    trailing word only — never a long category label. */}
                                <h1 className="text-2xl md:text-[42px] font-semibold mb-4 md:mb-8 font-sans text-white">
                                    {activeCategory ? `${activeCategory.label} Case ` : 'Case '}
                                    <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#2A2B44_0%,#4A5175_25%,#00F6FF_50%,#4A5175_75%,#2A2B44_100%)] bg-[length:200%_auto] animate-text-shine">
                                        Studies
                                    </span>
                                </h1>
                                <p className="flex flex-wrap items-center justify-center gap-2 text-white text-sm md:text-lg">
                                    <Link className='text-white hover:text-gray-300 transition-all duration-400 font-medium' href="/">
                                        Home
                                    </Link>
                                    <ChevronRight className="inline-block" size={12} />{' '}
                                    {activeCategory ? (
                                        <>
                                            <Link className='text-white hover:text-gray-300 transition-all duration-400 font-medium' href="/case-studies">
                                                Case Studies
                                            </Link>
                                            <ChevronRight className="inline-block" size={12} />{' '}
                                            <span className="text-white font-medium">{activeCategory.label}</span>
                                        </>
                                    ) : (
                                        <span className="text-white font-medium">Case Studies</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category filters — plain links so every filtered view is
                server-rendered, shareable and crawlable. */}
            <nav
                aria-label="Filter case studies by category"
                className="relative z-10 bg-[#f7f8fc] pt-[40px] md:pt-[60px]"
            >
                <div className="container mx-auto px-4">
                    <ul className="m-0 flex list-none flex-wrap justify-center gap-3 p-0">
                        <li>
                            <Link
                                href="/case-studies"
                                aria-current={!activeCategory ? 'page' : undefined}
                                className={chipClass(!activeCategory)}
                            >
                                All
                            </Link>
                        </li>
                        {CASE_STUDY_CATEGORIES.map((category) => {
                            const isActive = activeCategory?.slug === category.slug;
                            return (
                                <li key={category.slug}>
                                    <Link
                                        href={categoryHref(category.slug)}
                                        aria-current={isActive ? 'page' : undefined}
                                        className={chipClass(isActive)}
                                    >
                                        {category.shortLabel}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            <CaseStudyList
                key={activeCategory?.slug || 'all'}
                caseStudies={caseStudies}
                totalCaseStudies={totalCaseStudies}
            />
            <SubscribeForm />
            <Footer />
        </>
    );
}
