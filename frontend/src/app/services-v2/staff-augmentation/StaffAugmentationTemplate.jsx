import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm2 from "@/components/SubscribeForm2";
import FinalCTA from "@/components/FinalCTA";
import FounderCtaStrip from "@/components/FounderCtaStrip";
import StaffAugHeroSection from "./components/StaffAugHeroSection";
import StaffAugHeroBackdrop from "./components/StaffAugHeroBackdrop";
import StaffAugHiringGapSection from "./components/StaffAugHiringGapSection";
import StaffAugServicesSection from "./components/StaffAugServicesSection";
import StaffAugCapabilitiesSection from "./components/StaffAugCapabilitiesSection";
import StaffAugModelFitSection from "./components/StaffAugModelFitSection";
import WebDevelopmentTrustBarSection from "../web-development/components/WebDevelopmentTrustBarSection";
import WebDevelopmentWhyChooseSection from "../web-development/components/WebDevelopmentWhyChooseSection";
import WhatsChanging from "@/app/industries/_components/WhatsChanging";
import MadIndustries from "@/app/services-v2/mobile-app-development/components/MadIndustries";
import MadTechnologies from "@/app/services-v2/mobile-app-development/components/MadTechnologies";
import MadProcess from "@/app/services-v2/mobile-app-development/components/MadProcess";
import MadEngagement from "@/app/services-v2/mobile-app-development/components/MadEngagement";
import MadCaseStudies from "@/app/services-v2/mobile-app-development/components/MadCaseStudies";
import TestimonialsSection from "../_components/TestimonialsSection";
import MadBlogs from "@/app/services-v2/mobile-app-development/components/MadBlogs";
import MadFAQ from "@/app/services-v2/mobile-app-development/components/MadFAQ";
import { SA_TRENDS, SA_WHY_CHOOSE_CARDS, SA_ENGAGEMENT_PLANS } from "./saData";
import { getCaseStudyLatestBySlug } from "@/api/caseStudyLatest";
import { getBlogBySlug } from "@/api/blog";

// Figma 1028:2531 — this page counts Clients Served where web development
// counts Projects Delivered. Icons are names, not components: the trust bar is
// a client component and this template is a server component.
const SA_STATS = [
  { value: "4.9", label: "Google Rating", icon: "Star" },
  { value: "97%", label: "Client Retention", icon: "Users" },
  { value: "180+", label: "Clients Served", icon: "Briefcase" },
  { value: "15+", label: "Industries Served", icon: "Rocket" },
];

const visible = (section) => section?.show !== false;

async function fetchCaseStudies(refs) {
  if (!refs?.length) return [];
  const results = await Promise.all(refs.map((ref) => getCaseStudyLatestBySlug(ref).catch(() => null)));
  return results.filter(Boolean);
}

async function fetchBlogs(refs) {
  if (!refs?.length) return [];
  const results = await Promise.all(refs.map((ref) => getBlogBySlug(ref).catch(() => null)));
  return results.filter(Boolean);
}

export default async function StaffAugmentationTemplate({ data }) {
  if (!data) return null;

  const csRefs = (data.caseStudies?.items || []).map((c) => c.ref).filter(Boolean);
  const caseStudies = visible(data.caseStudies) ? await fetchCaseStudies(csRefs) : [];

  const blogRefs = (data.blogs?.items || []).map((b) => b.ref).filter(Boolean);
  const blogs = visible(data.blogs) ? await fetchBlogs(blogRefs) : [];

  return (
    <main>
      <NavBar forceTransparent />

      {/* Deliberately NOT the web-development hero's bright radial wash: the
          Figma frame is flat #130E2A carrying only the line-art swirls and a
          soft *dark* ellipse (#1D2033 at 80%, 100px blur), so a light gradient
          here would wash the artwork out. */}
      {/* The hero wrapper fills exactly one viewport on desktop (lg:min-h-screen)
          and uses flexbox to position the stats bar at the bottom fold. */}
      <div className="relative overflow-hidden lg:min-h-screen lg:flex lg:flex-col lg:justify-between" style={{ background: "#130E2A" }}>
        {/* Spans hero + stats bar together, as the source frame does. */}
        <StaffAugHeroBackdrop />
        {visible(data.hero) && <StaffAugHeroSection data={data.hero} />}
        <WebDevelopmentTrustBarSection stats={SA_STATS} />
      </div>

      {visible(data.hiringGap) && <StaffAugHiringGapSection data={data.hiringGap} />}
      {visible(data.staffServices) && <StaffAugServicesSection data={data.staffServices} />}
      {visible(data.vendorCapabilities) && <StaffAugCapabilitiesSection data={data.vendorCapabilities} />}
      {visible(data.modelFit) && <StaffAugModelFitSection data={data.modelFit} />}

      {visible(data.trends) && (
        <WhatsChanging
          data={{
            heading:
              [data.trends?.heading, data.trends?.headingAccent].filter(Boolean).join(" ") ||
              "Why Staff Augmentation Is Growing Right Now",
            subtitle:
              data.trends?.intro ||
              "Hiring has not got easier, and roadmaps have not got shorter. These are the shifts pushing teams towards augmented capacity instead of another permanent req.",
            items: data.trends?.items?.length ? data.trends.items : SA_TRENDS,
            image: data.trends?.image,
            imageAlt: data.trends?.imageAlt,
          }}
        />
      )}

      {visible(data.industries) && <MadIndustries data={data.industries} />}
      {visible(data.technologies) && <MadTechnologies data={data.technologies} />}
      {visible(data.ecommerceProcess) && <MadProcess data={data.ecommerceProcess} />}

      {visible(data.engagement) && (
        <MadEngagement
          data={{
            heading: "Flexible Engagement Models",
            headingTail: "For Staff Augmentation",
            subtitle:
              "How much of the delivery you want to own is the real question. Pick the model that matches the size of the gap and how much management overhead you have spare.",
            ...data.engagement,
            // This page bills by hire model, not by project shape, so it
            // overrides MadEngagement's shared three.
            plans: SA_ENGAGEMENT_PLANS,
          }}
        />
      )}

      {visible(data.caseStudies) && <MadCaseStudies data={data.caseStudies} caseStudies={caseStudies} />}

      {visible(data.testimonials) && (
        <div className="-mt-16 sm:-mt-20 lg:-mt-24">
          <TestimonialsSection data={data.testimonials} />
        </div>
      )}

      {visible(data.whyChoose) && (
        <WebDevelopmentWhyChooseSection
          data={{
            heading: "Why Businesses Choose",
            headingAccent: "Akoode",
            headingTail: "for Staff Augmentation",
            subtitle:
              "The difference between an agency placement and an Akoode one shows up in the first fortnight, when the engineer is already shipping instead of still being onboarded.",
            ...data.whyChoose,
            cards: data.whyChoose?.cards?.length ? data.whyChoose.cards : SA_WHY_CHOOSE_CARDS,
          }}
        />
      )}

      <section className="w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-16" style={{ background: "#130E2A" }}>
        <div className="mx-auto max-w-[1280px]">
          <FounderCtaStrip />
        </div>
      </section>

      {visible(data.blogs) && <MadBlogs data={data.blogs} blogs={blogs} />}
      {visible(data.faq) && <MadFAQ data={data.faq} />}

      {visible(data.finalCta) && (
        <FinalCTA
          variant="light"
          service={data.finalCta?.service || data.finalCta?.headingAccent || "Staff Augmentation"}
          data={{
            eyebrow: "Start Hiring",
            heading: "Close Your",
            headingAccent: "Skill Gap",
            headingTail: "This Month",
            subtitle:
              "Tell us the role, the stack and when you need someone shipping. Someone from Akoode will respond within one business day with a shortlist approach, not a sales deck.",
            ...data.finalCta,
          }}
        />
      )}

      <SubscribeForm2 />
      <Footer />
    </main>
  );
}
