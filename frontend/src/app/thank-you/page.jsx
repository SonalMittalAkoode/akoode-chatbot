const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const normalizedSiteUrl = (SITE_URL || '').replace(/\/$/, '');
const defaultOgImage = normalizedSiteUrl
    ? `${normalizedSiteUrl}/images/fav-logo1.png`
    : '/images/fav-logo1.png';
const canonical = `${normalizedSiteUrl}/thank-you`;

export const metadata = {
    title: 'Thank You - Akoode | Our Team Get in Touch with You',
    description:
        'Thank you for reaching out to Akoode. Get in touch with our expert team for AI, web development, mobile apps, and digital transformation solutions.',
    authors: [{ name: 'Akoode Technologies' }],
    alternates: {
        canonical,
    },
    openGraph: {
        title: 'Thank You - Akoode | Our Team Get in Touch with You',
        description:
            'Thank you for reaching out to Akoode. Get in touch with our expert team for AI, web development, mobile apps, and digital transformation solutions.',
        url: canonical,
        siteName: 'Akoode Technologies',
        type: 'website',
        images: [{ url: defaultOgImage }],
    },
    twitter: {
        card: 'summary',
        title: 'Thank You - Akoode | Our Team Get in Touch with You',
        description:
            'Thank you for reaching out to Akoode. Get in touch with our expert team for AI, web development, mobile apps, and digital transformation solutions.',
        images: [defaultOgImage],
    },
};

import { Suspense } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ThankYouPageClient from '@/app/thank-you/components/ThankYouPageClient';

export default function ThankYouPage() {
    return (
        <>
            <NavBar />
            <Suspense fallback={
                <div className="min-h-screen bg-[#fcfdfc] flex items-center justify-center">
                    <p className="text-[#374151]">Loading…</p>
                </div>
            }>
                <ThankYouPageClient />
            </Suspense>
            <Footer />
        </>
    );
}
