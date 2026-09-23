const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const normalizedSiteUrl = (SITE_URL || "").replace(/\/$/, "");
const defaultOgImage = normalizedSiteUrl
  ? `${normalizedSiteUrl}/images/fav-logo1.png`
  : "/images/fav-logo1.png";
const canonical = `${normalizedSiteUrl}/contact-us`;

export const metadata = {
  title: "Contact Us - Akoode | Get in Touch with Our Team",
  description:
    "Get in touch with Akoode's expert team for AI, web development, mobile apps, and digital transformation solutions. We're here to help you build better.",
  authors: [{ name: "Akoode" }],
  alternates: {
    canonical,
  },
  openGraph: {
    title: "Contact Us - Akoode | Get in Touch with Our Team",
    description:
      "Get in touch with Akoode's expert team for AI, web development, mobile apps, and digital transformation solutions. We're here to help you build better.",
    url: canonical,
    siteName: "Akoode Technologies",
    type: "website",
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Akoode | Get in Touch with Our Team",
    description:
      "Get in touch with Akoode's expert team for AI, web development, mobile apps, and digital transformation solutions. We're here to help you build better.",
    images: [defaultOgImage],
  },
};

export default function ContactUsLayout({ children }) {
  return children;
}
