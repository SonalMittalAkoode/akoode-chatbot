import dynamic from "next/dynamic";
import NavBar from "../components/NavBar";
import HeroSection from "../sections/HeroSection";
import Services from "../sections/Services";
import { getHomePageSchemaGraph, homeOgImage, buildCanonical } from "@/utils/seo";
import { getCasestudyList } from "@/api/frontend/casestudy";
import { getCaseStudyLatestList } from "@/api/caseStudyLatest";
import { normalizeCasestudyListForSlider, normalizeLatestCasestudyListForSlider } from "@/utils/normalizeCasestudyForSlider";
import { getBlogTableData } from "@/api/frontend/blog";
import { getVideoTableData } from "@/api/frontend/video";
import { getTestimonialTableData } from "@/api/frontend/testimonial";
import JsonLdScript from "@/components/security/JsonLdScript";

// Homepage social-share image. Title/description/canonical are inherited from
// the root layout; we only override the OG/Twitter image here. openGraph is
// redefined in full because Next.js replaces (not deep-merges) the parent's
// openGraph object.
const homeOgTitle =
  "Software Company in Gurgaon, India | Akoode Technologies";
const homeOgDescription =
  "Akoode is a trusted AI and software development company serving India and the USA, delivering custom software, DevOps, SaaS, and digital solutions.";

export const metadata = {
  openGraph: {
    title: homeOgTitle,
    description: homeOgDescription,
    url: buildCanonical("/"),
    siteName: "Akoode Technologies",
    type: "website",
    images: [homeOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: homeOgTitle,
    description: homeOgDescription,
    images: [homeOgImage],
  },
};

const MediaStrip = dynamic(() => import("../components/MediaStrip"), { ssr: true });
import Industries from "../sections/Industries";
const Technologies = dynamic(() => import("../sections/Technologies"));
const Testimonials = dynamic(() => import("../sections/Testimonials"));
const CaseStudies = dynamic(() => import("../sections/CaseStudies"));
const WhyChooseUs = dynamic(() => import("../sections/WhyChooseUs"));
const Faqs = dynamic(() => import("../sections/Faqs"));
const Blog = dynamic(() => import("../sections/Blog"));
const SubscribeForm = dynamic(() => import("../components/SubscribeForm"));
const Footer = dynamic(() => import("../components/Footer"));
 

export default async function Home() {
  const [caseStudyResult, latestCaseStudies, blogResult, initialVideoTestimonials, initialTextTestimonials] =
    await Promise.all([
      getCasestudyList(1, 4).catch((e) => { console.error("Home: case studies fetch failed", e); return null; }),
      getCaseStudyLatestList(6).catch((e) => { console.error("Home: latest case studies fetch failed", e); return []; }),
      getBlogTableData(1, 3).catch((e) => { console.error("Home: blogs fetch failed", e); return null; }),
      getVideoTableData().catch(() => []),
      getTestimonialTableData().catch(() => []),
    ]);

  // Latest (new-schema) entries appear first; old-schema fills remaining slots.
  // Once old case studies are retired, simply remove the legacy entries below.
  const latestNormalized = normalizeLatestCasestudyListForSlider(Array.isArray(latestCaseStudies) ? latestCaseStudies : []);
  const legacyNormalized = normalizeCasestudyListForSlider(caseStudyResult?.data || []);
  const seenIds = new Set(latestNormalized.map((c) => c.id));
  const caseStudiesForSlider = [
    ...latestNormalized,
    ...legacyNormalized.filter((c) => !seenIds.has(c.id)),
  ].slice(0, 6);
  const homepageBlogs = Array.isArray(blogResult?.blogs) ? blogResult.blogs : [];

  const schemaGraph = getHomePageSchemaGraph();

  return (
    <>
      <JsonLdScript id="schema-home-graph" data={schemaGraph} />
      <main className="bg-gradient-to-b from-[#f0f1f9] to-[#f7f8fc]">
      <NavBar />
      <HeroSection />
      <MediaStrip />
      <Services />
      <Industries />
      <Technologies />
      <Testimonials
          initialVideoTestimonials={initialVideoTestimonials}
          initialTextTestimonials={initialTextTestimonials}
        />
      <CaseStudies caseStudies={caseStudiesForSlider} />
      <WhyChooseUs />
      <Faqs />
      <Blog blogs={homepageBlogs} />
      <SubscribeForm />
      <Footer />
    </main>
    </>
  );
}
