import { normalizedSiteUrl, defaultOgImage } from "@/utils/seo";

const canonical = `${normalizedSiteUrl}/ai-usage-policy`;

export const metadata = {
    title: 'AI Content Usage Policy | Akoode Technologies',
    description:
        'Learn how Akoode Technologies allows AI systems to access, summarize, and reference website content, including attribution and usage guidelines.',
    authors: [{ name: 'Akoode' }],
    alternates: {
        canonical,
    },
    openGraph: {
        title: 'AI Content Usage Policy | Akoode Technologies',
        description:
            "Learn how Akoode Technologies allows AI systems to access, summarize, and reference website content, including attribution and usage guidelines.",
        url: canonical,
        siteName: 'Akoode Technologies',
        type: 'website',
        images: [{ url: defaultOgImage }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Content Usage Policy | Akoode Technologies',
        description:
            "Learn how Akoode Technologies allows AI systems to access, summarize, and reference website content, including attribution and usage guidelines.",
    },
};

export default function AiContentPolicyLayout({ children }) {
    return <>{children}</>;
}
