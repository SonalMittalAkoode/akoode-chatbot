import Link from "next/link";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import AboutIntroduction from "./components/AboutIntroduction";
import AboutLeadership from "./components/AboutLeadership";
import VisionMission from "./components/VisionMission";
import SubscribeForm from "../../components/SubscribeForm";
import OurTeam from "./components/OurTeam";
import { ChevronRight } from "lucide-react";
import {
  normalizedSiteUrl,
  defaultOgImage,
  homeOgImage,
  buildCanonical,
  organizationId,
  organizationSchemaBase,
} from "@/utils/seo";
import JsonLdScript from "@/components/security/JsonLdScript";

const aboutCanonical = buildCanonical("/about-us");

export const metadata = {
  title: "About Us - Akoode | Leading Software Development Company",
  description:
    "Learn about Akoode, a leading software development company specializing in AI, web development, mobile apps, and digital transformation solutions.",
  authors: [{ name: "Akoode Technologies" }],
  alternates: { canonical: aboutCanonical },
  openGraph: {
    title: "About Us - Akoode | Leading Software Development Company",
    description:
      "Learn about Akoode, a leading software development company specializing in AI, web development, mobile apps, and digital transformation solutions.",
    url: aboutCanonical,
    siteName: "Akoode Technologies",
    type: "website",
    images: [homeOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Akoode | Leading Software Development Company",
    description:
      "Learn about Akoode, a leading software development company specializing in AI, web development, mobile apps, and digital transformation solutions.",
    images: [homeOgImage],
  },
};

export default function AboutUsPage() {
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${normalizedSiteUrl}/#localbusiness`,
        name: "Akoode Technologies",
        image: defaultOgImage,
        url: normalizedSiteUrl,
        sameAs: [organizationId],
        telephone: organizationSchemaBase.telephone,
        address: organizationSchemaBase.address,
        // reviewCount is commented out until confirmed from Clutch dashboard
        // (matches the pattern used on industries/[slug] pages).
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          // reviewCount: "648",
        },
      },
      {
        "@type": "AboutPage",
        "@id": `${aboutCanonical}#about`,
        url: aboutCanonical,
        name: "About Us - Akoode",
        description:
          "Learn about Akoode, a leading software development company specializing in AI, web development, mobile apps, and digital transformation solutions.",
        about: { "@id": organizationId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: normalizedSiteUrl || "/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "About Us",
            item: aboutCanonical,
          },
        ],
      },
    ],
  };

    return (
        <>
            <JsonLdScript id="schema-about" data={schemaJsonLd} />
            <NavBar />

            <div
                className="pt-[120px] pb-[60px] md:pt-32 md:pb-20 bg-center bg-no-repeat bg-cover bg-[url('/inner-bg.webp')]"
            >
                <div className="w-full mx-auto px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]">
                    <div className="flex justify-center">
                        <div className="w-full max-w-lg text-center">
                            <h1 className="text-2xl md:text-[42px] font-semibold mb-4 md:mb-8 font-sans text-white">
                                About <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#2A2B44_0%,#4A5175_25%,#00F6FF_50%,#4A5175_75%,#2A2B44_100%)] bg-[length:200%_auto] animate-text-shine">
                                    Us
                                </span>
                            </h1>
                            <p className="text-white/90 text-sm md:text-base">
                                <Link className="hometag hover:text-white transition-colors" href="/">
                                    Home</Link> <ChevronRight className="mx-2 text-[10px] inline-block align-middle" size={12} strokeWidth={3} />{" "}
                                <span className="text-white font-semibold">About Us</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <AboutIntroduction />
            <AboutLeadership />

            <VisionMission />
            <OurTeam />
            <SubscribeForm />
            <Footer />
        </>
    );
}

