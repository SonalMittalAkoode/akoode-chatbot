import {
  defaultOgImage,
  buildCanonical,
  twitterSite,
} from '@/utils/seo';

export async function generateMetadata() {
  const canonical = buildCanonical('/services-v2');
  return {
    title: 'AI, Software & Digital Innovation Services | Akoode Technologies',
    description:
      "Explore Akoode's end-to-end IT services: AI, software development, cloud, IoT, and digital marketing solutions designed to drive your business growth.",
    authors: [{ name: 'Akoode' }],
    alternates: { canonical },
    openGraph: {
      title: 'AI, Software & Digital Innovation Services | Akoode Technologies',
      description:
        "Explore Akoode's end-to-end IT services: AI, software development, cloud, IoT, and digital marketing solutions designed to drive your business growth.",
      url: canonical,
      siteName: 'Akoode Technologies',
      type: 'website',
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI, Software & Digital Innovation Services | Akoode Technologies',
      description:
        "Explore Akoode's end-to-end IT services: AI, software development, cloud, IoT, and digital marketing solutions designed to drive your business growth.",
      images: [defaultOgImage],
      site: twitterSite,
    },
  };
}

export default function ServicesV2Layout({ children }) {
  return children;
}
