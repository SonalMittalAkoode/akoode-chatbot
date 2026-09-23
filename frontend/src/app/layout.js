import { headers } from "next/headers";
// import Script from "next/script"; // GTM temporarily disabled.
import { Geist_Mono, Figtree, Dancing_Script, Satisfy } from "next/font/google";
import "./globals.css";
import { normalizedSiteUrl, defaultOgImage, organizationSchemaBase } from "@/utils/seo";
import { SITE_URL } from "@/config/site";
import DeferredLayoutWidgets from "@/components/DeferredLayoutWidgets";
import MotionProvider from "@/components/core/MotionProvider";
import JsonLdScript from "@/components/security/JsonLdScript";
import { PATHNAME_HEADER } from "@/lib/csp";
import RightClickBlocker from "@/components/RightClickBlocker";
// import ScriptsManager from "@/components/ScriptsManager"; // GTM temporarily disabled.

const siteBaseUrl = normalizedSiteUrl ? `${normalizedSiteUrl}/` : "/";
const organizationId = normalizedSiteUrl
  ? `${normalizedSiteUrl}/#organization`
  : "#organization";
const websiteId = normalizedSiteUrl
  ? `${normalizedSiteUrl}/#website`
  : "#website";

const baseMetadata = {
  metadataBase: new URL(normalizedSiteUrl || SITE_URL),
  title: "Software Company in Gurgaon, India | Akoode Technologies",

  description:
    "Akoode is a trusted AI and software development company serving India and the USA, delivering custom software, DevOps, SaaS, and digital solutions.",
  openGraph: {
    title: "Software Company in Gurgaon, India | Akoode Technologies",
    description:
      "Akoode is a trusted AI and software development company serving India and the USA, delivering custom software, DevOps, SaaS, and digital solutions.",
    siteName: "Akoode Technologies",
    type: "website",
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Company in Gurgaon, India | Akoode Technologies",
    description:
      "Akoode is a trusted AI and software development company serving India and the USA, delivering custom software, DevOps, SaaS, and digital solutions.",
    images: [defaultOgImage],
  },
};


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/** Pathname from middleware (x-pathname); fallbacks when middleware not run. */
function getPathname(headersList) {
  return (
    headersList.get(PATHNAME_HEADER) ||
    headersList.get("next-url") ||
    headersList.get("x-invoke-path") ||
    "/"
  );
}

export async function generateMetadata(_props, _parent) {
  const headersList = await headers();
  const pathname = getPathname(headersList);

  const canonical = normalizedSiteUrl
    ? `${normalizedSiteUrl}${pathname}`
    : null;

  const ogUrl =
    canonical || (normalizedSiteUrl ? `${normalizedSiteUrl}/` : null);

  return {
    ...baseMetadata,
    // icons: {
    //   icon: "/favicon.ico",
    //   apple: "/apple-touch-icon.png",
    // },
    ...(canonical && { alternates: { canonical } }),
    ...(ogUrl && {
      openGraph: { ...baseMetadata.openGraph, url: ogUrl },
    }),
  };
}

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Akoode Technologies",
      url: siteBaseUrl,
      logo: defaultOgImage,
      telephone: organizationSchemaBase.telephone,
      address: organizationSchemaBase.address,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: organizationSchemaBase.telephone,
        contactType: "customer support",
        areaServed: ["IN", "US"],
        availableLanguage: ["English"],
      },
      sameAs: organizationSchemaBase.sameAs,
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: "Akoode Technologies",
      alternateName: ["Akoode", "Akoode Tech"],
      url: siteBaseUrl,
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
  ],
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = getPathname(headersList);
  // GTM temporarily disabled; restore CSP_NONCE_HEADER import with this line.
  // const nonce = headersList.get(CSP_NONCE_HEADER) || undefined;
  const isAdminRoute = pathname.startsWith("/thebusinesshub");

  return (
    // suppressHydrationWarning: browser extensions (e.g. data-qb-installed) inject
    // attributes on <html> before React hydrates, causing false-positive mismatch
    // errors in dev. Applies to this element's attributes only — children are
    // still fully hydration-checked.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Establish early connection to API for faster image/data loading */}
        <link rel="preconnect" href="https://api.akoode.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.akoode.com" />
        
        {/* Favicon — explicit relative paths so Safari and all browsers render correctly */}
        <link rel="icon" href="/fav-logo1.png?v=1" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=1" sizes="180x180" />
        {/* Structured Data */}
        <JsonLdScript id="schema-global" data={schemaJsonLd} />
        <link rel="icon" href="/favicon.ico" />
        {/* GTM consent defaults — native <script> in <head> so React reconciles it correctly.
            Must run before GTM loads so the consent state is set when GTM initialises. */}
        {/* GTM temporarily disabled.
        {!isAdminRoute && (
          // suppressHydrationWarning: browsers scrub the `nonce` content attribute
          // right after parsing (a CSP security measure so it can't be read back via
          // getAttribute/CSS selectors), so the live DOM always has nonce="" while the
          // server-rendered HTML still shows the real value — a guaranteed, harmless
          // mismatch on this one attribute, not an actual hydration bug.
          <script
            nonce={nonce}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'ad_storage':'granted','analytics_storage':'granted','personalization_storage':'granted','functionality_storage':'granted','security_storage':'granted'});`,
            }}
          />
        )}
        */}
      </head>

      <body
        className={`bg-[#fcfdfc] ${geistMono.variable} ${figtree.variable} ${dancingScript.variable} ${satisfy.variable} antialiased`}
      >
        {/* Always rendered so <body>'s first child is stable across all routes — prevents hydration mismatch */}
        {/* GTM temporarily disabled, including the no-JavaScript fallback.
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M24XSHLJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {!isAdminRoute && (
          <Script id="gtm-loader" strategy="afterInteractive" nonce={nonce}>
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M24XSHLJ');`}
          </Script>
        )}
        <ScriptsManager />
        */}

        <MotionProvider>
          {children}
        </MotionProvider>
        {/* {!isAdminRoute && <RightClickBlocker />} */}

        <DeferredLayoutWidgets showWhatsApp={!isAdminRoute} />
      </body>
    </html>
  );
}
