import { normalizedSiteUrl, defaultOgImage } from "@/utils/seo";

const canonical = `${normalizedSiteUrl}/privacy-policy`;

export const metadata = {
  title: "Privacy Policy | Akoode Technologies",
  description:
    "Read Akoode’s Privacy Policy to learn how we collect, use, and protect your personal data while delivering secure and trusted digital solutions.",
  authors: [{ name: "Akoode" }],
  alternates: {
    canonical,
  },
  openGraph: {
    title: "Privacy Policy | Akoode Technologies",
    description:
      "Read Akoode Technologies' Privacy Policy to understand how we collect, use, and protect your personal information.",
    url: canonical,
    siteName: "Akoode Technologies",
    type: "website",
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Akoode Technologies",
    description:
      "Read Akoode Technologies' Privacy Policy to understand how we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPolicyLayout({ children }) {
  return <>{children}</>;
}
