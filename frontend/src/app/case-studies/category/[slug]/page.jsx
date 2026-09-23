import { notFound } from 'next/navigation';

import CaseStudiesListingView from '../../components/CaseStudiesListingView';
import {
    CASE_STUDY_CATEGORIES,
    getCategoryBySlug,
    categoryHref,
} from '@/config/caseStudyCategories';
import { buildCanonical, defaultOgImage, twitterSite } from '@/utils/seo';

/** Pre-render every category page at build time. */
export function generateStaticParams() {
    return CASE_STUDY_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);
    if (!category) return {};

    const title = `${category.label} Case Studies | Akoode Technologies`;
    const description = `Explore Akoode Technologies case studies in ${category.label} — the problem, the approach, and what shipped.`;
    const canonical = buildCanonical(categoryHref(category.slug));

    return {
        title,
        description,
        authors: [{ name: 'Akoode Technologies' }],
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: 'Akoode Technologies',
            type: 'website',
            images: [{ url: defaultOgImage }],
        },
        twitter: {
            card: 'summary',
            title,
            description,
            images: [defaultOgImage],
            site: twitterSite,
        },
    };
}

export default async function CaseStudyCategoryPage({ params }) {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);
    if (!category) notFound();

    return <CaseStudiesListingView activeCategory={category} />;
}
