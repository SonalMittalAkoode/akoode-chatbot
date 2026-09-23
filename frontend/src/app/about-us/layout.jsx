const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const normalizedSiteUrl = (SITE_URL || '').replace(/\/$/, '');
const defaultOgImage = normalizedSiteUrl
    ? `${normalizedSiteUrl}/images/fav-logo1.png`
    : '/images/fav-logo1.png';
const canonical = `${normalizedSiteUrl}/about-us`;

export const metadata = {
    title: "About Us - Akoode | Leading Software Development Company",
    description:
        "Learn about Akoode, a leading software development company specializing in AI, web development, mobile apps, and digital transformation solutions.",
    openGraph: {
        title: "About Us - Akoode | Leading Software Development Company",
        description:
            "Learn about Akoode, a leading software development company specializing in AI, web development, mobile apps, and digital transformation solutions.",
        url: canonical,
        siteName: "Akoode Technologies",
        type: "website",
        images: [{ url: defaultOgImage }],
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us - Akoode | Leading Software Development Company",
        description:
            "Learn about Akoode, a leading software development company specializing in AI, web development, mobile apps, and digital transformation solutions.",
        images: [defaultOgImage],
    },
    authors: [{ name: "Akoode" }],
    alternates: {
        canonical,
    },
};

export default function AboutUsLayout({ children }) {
    return <>{children}</>;
}
