import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm2 from "@/components/SubscribeForm2";
import FinalCTA from "@/components/FinalCTA";
import FounderCtaStrip from "@/components/FounderCtaStrip";

import DtHero from "./components/DtHero";
import DtProblem from "./components/DtProblem";
import DtServices from "./components/DtServices";
import DtCapabilities from "./components/DtCapabilities";
import DtScopeTable from "./components/DtScopeTable";
import DtCostTimeline from "./components/DtCostTimeline";
import DtTrends from "./components/DtTrends";
import DtIndustries from "./components/DtIndustries";
import DtProcess from "./components/DtProcess";

// Shared sections, the same instances the devops and staff-augmentation

import MadTechnologies from "@/app/services-v2/mobile-app-development/components/MadTechnologies";
import MadEngagement from "@/app/services-v2/mobile-app-development/components/MadEngagement";
import MadCaseStudies from "@/app/services-v2/mobile-app-development/components/MadCaseStudies";
import MadBlogs from "@/app/services-v2/mobile-app-development/components/MadBlogs";
import MadFAQ from "@/app/services-v2/mobile-app-development/components/MadFAQ";
import WebDevelopmentWhyChooseSection from "@/app/services-v2/web-development/components/WebDevelopmentWhyChooseSection";

import { DT_ENGAGEMENT_PLANS, DT_FAQ_ITEMS } from "./dtData";
import { getCaseStudyLatestBySlug } from "@/api/caseStudyLatest";
import { getBlogBySlug } from "@/api/blog";

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

export default async function DigitalTransformationTemplate({ data }) {
  const d = data || {};

  const csRefs = (d.caseStudies?.items || []).map((c) => c.ref).filter(Boolean);
  const caseStudies = visible(d.caseStudies) ? await fetchCaseStudies(csRefs) : [];

  const blogRefs = (d.blogs?.items || []).map((b) => b.ref).filter(Boolean);
  const blogs = visible(d.blogs) ? await fetchBlogs(blogRefs) : [];

  return (
    <main style={{ background: "#13103A" }}>
      <NavBar forceTransparent />

      {visible(d.hero) && <DtHero data={d.hero} title={d.title} />}
      {visible(d.dtProblem) && <DtProblem data={d.dtProblem} />}
      {visible(d.dtServices) && <DtServices data={d.dtServices} />}
      {visible(d.dtCapabilities) && <DtCapabilities data={d.dtCapabilities} />}
      {visible(d.dtScope) && <DtScopeTable data={d.dtScope} />}
      {visible(d.dtCost) && <DtCostTimeline data={d.dtCost} />}
      {visible(d.dtTrends) && <DtTrends data={d.dtTrends} />}
      {visible(d.dtIndustries) && <DtIndustries data={d.dtIndustries} />}
      {visible(d.dtProcess) && <DtProcess data={d.dtProcess} />}

      {visible(d.technologies) && (
        <MadTechnologies
          data={{
            headingLead: "Technologies",
            headingRest: "We Use For Digital Transformation",
            intro:
              "Tooling follows the operating model, not the other way round. This is the stack we reach for most, and we will work inside the one you already run where that is the cheaper answer.",
            ...d.technologies,
          }}
        />
      )}

      {visible(d.engagement) && (
        <MadEngagement
          data={{
            heading: "Flexible Engagement Models",
            headingTail: "For Digital Transformation",
            subtitle:
              "A defined programme, an embedded team, or specialists filling a gap. Pick the shape that matches how much of the delivery you want to keep.",
            ...d.engagement,
            plans: d.engagement?.plans?.length ? d.engagement.plans : DT_ENGAGEMENT_PLANS,
          }}
        />
      )}

      {visible(d.caseStudies) && (
        <MadCaseStudies
          data={{
            heading: "Digital Transformation",
            headingAccent: "Case Studies",
            intro: "Transformation work where the before and after are both measurable.",
            ...d.caseStudies,
          }}
          caseStudies={caseStudies}
        />
      )}

      {visible(d.whyChoose) && (
        <WebDevelopmentWhyChooseSection
          data={{
            heading: "Why Businesses Choose",
            headingAccent: "Akoode",
            headingTail: "for Digital Transformation",
            subtitle:
              "We start with the operating model, not the software catalogue. That is the difference between a transformation that holds together a year later and one that quietly becomes another disconnected system.",
            ...d.whyChoose,
          }}
        />
      )}

      <section className="w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-16" style={{ background: "#F8FAFF" }}>
        <div className="mx-auto max-w-[1280px]">
          <FounderCtaStrip />
        </div>
      </section>

      {visible(d.blogs) && (
        <MadBlogs data={{ heading: "Related", headingAccent: "Blogs", ...d.blogs }} blogs={blogs} />
      )}

      {visible(d.faq) && (
        <MadFAQ
          data={{
            heading: "Digital Transformation",
            headingAccent: "FAQs",
            ...d.faq,
            items: d.faq?.items?.length ? d.faq.items : DT_FAQ_ITEMS,
          }}
        />
      )}

      {visible(d.finalCta) && (
        <FinalCTA
          variant="light"
          service={d.finalCta?.service || d.finalCta?.headingAccent || "Digital Transformation"}
          data={{
            eyebrow: "Start Your Project",
            heading: "Fix the",
            headingAccent: "Disconnect",
            headingTail: "Before It Costs You a Year",
            subtitle:
              "Tell us what you are running and where it breaks. Someone from Akoode will respond within one business day with an assessment approach, not a sales deck.",
            ...d.finalCta,
          }}
        />
      )}

      <SubscribeForm2 />
      <Footer />
    </main>
  );
}
