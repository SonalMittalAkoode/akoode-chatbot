import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm2 from "@/components/SubscribeForm2";
import FinalCTA from "@/components/FinalCTA";
import FounderCtaStrip from "@/components/FounderCtaStrip";
import WebDevelopmentHeroSection from "./components/WebDevelopmentHeroSection";
import WebDevelopmentTrustBarSection from "./components/WebDevelopmentTrustBarSection";
import WebDevelopmentWhyNowSection from "./components/WebDevelopmentWhyNowSection";
import WebDevelopmentServicesSection from "./components/WebDevelopmentServicesSection";
import WebDevelopmentWhyChooseSection from "./components/WebDevelopmentWhyChooseSection";
import CommerceEngineeringSection from "../ecommerce-development/components/CommerceEngineeringSection";
import WhatsChanging from "@/app/industries/_components/WhatsChanging";
import MadIndustries from "@/app/services-v2/mobile-app-development/components/MadIndustries";
import MadTechnologies from "@/app/services-v2/mobile-app-development/components/MadTechnologies";
import MadProcess from "@/app/services-v2/mobile-app-development/components/MadProcess";
import MadEngagement from "@/app/services-v2/mobile-app-development/components/MadEngagement";
import MadCaseStudies from "@/app/services-v2/mobile-app-development/components/MadCaseStudies";
import TestimonialsSection from "../_components/TestimonialsSection";
import MadBlogs from "@/app/services-v2/mobile-app-development/components/MadBlogs";
import MadFAQ from "@/app/services-v2/mobile-app-development/components/MadFAQ";
import { getCaseStudyLatestBySlug } from "@/api/caseStudyLatest";
import { getBlogBySlug } from "@/api/blog";

const HERO_TRUST_GRADIENT =
  "radial-gradient(95% 120% at 90% 62%, rgba(255,255,255,1) 0%, rgba(217,222,248,1) 7.8%, rgba(179,188,242,1) 15.6%, rgba(140,155,235,1) 23.4%, rgba(102,121,228,1) 31.25%, rgba(81,94,182,1) 36.8%, rgba(61,68,135,1) 42.4%, rgba(40,41,89,1) 48%, rgba(29,27,65,1) 50.8%, rgba(19,14,42,1) 53.6%, rgba(19,14,42,1) 100%)";

const WEB_DEV_TRENDS = [
  {
    icon: "FiZap",
    title: "AI Is Rewriting How Sites Get Built and Ranked",
    desc: "From AI-assisted development to AI Overviews reshaping search results, sites that aren't built with structured, machine-readable content are losing visibility.",
  },
  {
    icon: "FiCpu",
    title: "Core Web Vitals Are a Ranking and Revenue Signal",
    desc: "Speed and stability are no longer nice-to-haves. Sites that fail Core Web Vitals lose both search ranking and conversion rate.",
  },
  {
    icon: "FiCloud",
    title: "Headless and API-First Architecture Is the Default",
    desc: "Decoupled front ends and composable backends are replacing monolithic CMS builds, giving teams the flexibility to ship faster without rebuilding from scratch.",
  },
  {
    icon: "FiSmartphone",
    title: "Mobile Is Now the Primary Design Target",
    desc: "The majority of traffic arrives on a phone first. Design and performance budgets increasingly start on mobile, not desktop.",
  },
  {
    icon: "FiBarChart2",
    title: "Security and Compliance Are Board-Level Conversations",
    desc: "Ageing plugins and unpatched frameworks are the easiest way into a business. Security has moved from an afterthought to a launch requirement.",
  },
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

export default async function WebDevelopmentTemplate({ data }) {
  if (!data) return null;

  const csRefs = (data.caseStudies?.items || []).map((c) => c.ref).filter(Boolean);
  const caseStudies = visible(data.caseStudies) ? await fetchCaseStudies(csRefs) : [];

  const blogRefs = (data.blogs?.items || []).map((b) => b.ref).filter(Boolean);
  const blogs = visible(data.blogs) ? await fetchBlogs(blogRefs) : [];

  return (
    <main>
      <NavBar forceTransparent />
      <div className="relative overflow-hidden" style={{ background: "#130E2A" }}>
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: HERO_TRUST_GRADIENT }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/25" />
        {visible(data.hero) && <WebDevelopmentHeroSection data={data.hero} />}

        <WebDevelopmentTrustBarSection />
      </div>
      {visible(data.whyNow) && <WebDevelopmentWhyNowSection data={data.whyNow} />}
      {visible(data.services) && <WebDevelopmentServicesSection data={data.services} />}
      {visible(data.commerceEngineering) && (
        <CommerceEngineeringSection
          data={{
            heading: "Engineering Depth",
            headingAccent: "Beyond the Landing Page",
            intro:
              "A brochure site is the baseline. The work below is where custom builds pull away from template themes, and increasingly it is the reason clients call us in the first place.",
            ...data.commerceEngineering,
          }}
        />
      )}
      {visible(data.trends) && (
        <WhatsChanging
          data={{
            heading:
              [data.trends?.heading, data.trends?.headingAccent].filter(Boolean).join(" ") ||
              "Why Web Development Is Changing Right Now",
            subtitle:
              data.trends?.intro ||
              "What worked five years ago won't work today, and the next few years will be built by teams who adapt. Here are the shifts driving that change.",
            items: data.trends?.items?.length ? data.trends.items : WEB_DEV_TRENDS,
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
            headingTail: "For Web Development",
            subtitle:
              "Every build carries a different risk profile, so there are three ways to work with us. Pick whichever fits how clear your scope is right now, and how long the platform needs to keep evolving after launch.",
            ...data.engagement,
          }}
        />
      )}
      {visible(data.caseStudies) && <MadCaseStudies data={data.caseStudies} caseStudies={caseStudies} />}

      {visible(data.testimonials) && (
        <div className="-mt-16 sm:-mt-20 lg:-mt-24">
          <TestimonialsSection data={data.testimonials} />
        </div>
      )}
      {visible(data.whyChoose) && <WebDevelopmentWhyChooseSection data={data.whyChoose} />}

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
          service={data.finalCta?.service || data.finalCta?.headingAccent || "Web Development"}
          data={{
            eyebrow: "Start Your Project",
            heading: "Start Your",
            headingAccent: "Web Development",
            headingTail: "Project",
            subtitle:
              "Send your brief and someone from Akoode will respond within one business day. The first conversation covers your current site, your goals, and how the build would be approached. No pitch deck, no pressure.",
            ...data.finalCta,
          }}
        />
      )}
      <SubscribeForm2 />
      <Footer />
    </main>
  );
}
