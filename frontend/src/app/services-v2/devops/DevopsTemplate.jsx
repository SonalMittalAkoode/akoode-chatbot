import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm2 from "@/components/SubscribeForm2";
import FinalCTA from "@/components/FinalCTA";
import FounderCtaStrip from "@/components/FounderCtaStrip";

import DevopsHero from "./components/DevopsHero";
import DevopsBottleneck from "./components/DevopsBottleneck";
import DevopsServices from "./components/DevopsServices";
import DevopsCapabilities from "./components/DevopsCapabilities";
import DevopsEngagementFit from "./components/DevopsEngagementFit";
import DevopsCostTimeline from "./components/DevopsCostTimeline";
import DevopsOutlook from "./components/DevopsOutlook";

// Shared sections, same sources the staff-augmentation template pulls from.
// Each is a thin wrapper over the software-development original, so importing
// the Mad* name here keeps this page on the identical component instance rather
// than a second copy of the same markup.
import MadIndustries from "@/app/services-v2/mobile-app-development/components/MadIndustries";
import MadTechnologies from "@/app/services-v2/mobile-app-development/components/MadTechnologies";
import MadProcess from "@/app/services-v2/mobile-app-development/components/MadProcess";
import MadEngagement from "@/app/services-v2/mobile-app-development/components/MadEngagement";
import MadCaseStudies from "@/app/services-v2/mobile-app-development/components/MadCaseStudies";
import MadBlogs from "@/app/services-v2/mobile-app-development/components/MadBlogs";
import MadFAQ from "@/app/services-v2/mobile-app-development/components/MadFAQ";
import WebDevelopmentWhyChooseSection from "../web-development/components/WebDevelopmentWhyChooseSection";

import {
  DEVOPS_PROCESS_STEPS,
  DEVOPS_FAQ_ITEMS,
  DEVOPS_INDUSTRIES,
  DEVOPS_ENGAGEMENT_PLANS,
} from "./devopsData";
import { getCaseStudyLatestBySlug } from "@/api/caseStudyLatest";
import { getBlogBySlug } from "@/api/blog";

// A section renders unless the CMS explicitly hides it (show === false), the
// same rule the other services-v2 templates use.
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

export default async function DevopsTemplate({ data }) {
  if (!data) return null;

  const csRefs = (data.caseStudies?.items || []).map((c) => c.ref).filter(Boolean);
  const caseStudies = visible(data.caseStudies) ? await fetchCaseStudies(csRefs) : [];

  const blogRefs = (data.blogs?.items || []).map((b) => b.ref).filter(Boolean);
  const blogs = visible(data.blogs) ? await fetchBlogs(blogRefs) : [];

  // MadProcess substitutes its own "Process" accent whenever the CMS accent is
  // blank (`||`, not `??`), which renders "… Process Process" for a record that
  // already typed the word into `heading`. Split the trailing word off instead,
  // so the two-tone heading still renders and nothing repeats.
  const rawProcessHeading = (data.ecommerceProcess?.heading || "").trim();
  const rawProcessAccent = (data.ecommerceProcess?.headingAccent || "").trim();
  const processSplit = !rawProcessAccent && /\s+process$/i.test(rawProcessHeading);
  const processHeading = processSplit
    ? rawProcessHeading.replace(/\s+process$/i, "")
    : rawProcessHeading || "Our Cloud and DevOps";
  const processAccent = rawProcessAccent || "Process";

  // The page sits on the near-white `--background` body colour. Section heights
  // are fractional (1.6 line-height on 14px copy), so rounding can leave a
  // sub-pixel seam between two stacked sections, and the body shows through it
  // as a light hairline. Painting main with the section colour hides the seam.
  return (
    <main style={{ background: "#130E2A" }}>
      <NavBar forceTransparent />

      {visible(data.hero) && <DevopsHero data={data.hero} title={data.title} />}
      {visible(data.devopsBottleneck) && <DevopsBottleneck data={data.devopsBottleneck} />}
      {visible(data.devopsServices) && <DevopsServices data={data.devopsServices} />}
      {visible(data.devopsCapabilities) && <DevopsCapabilities data={data.devopsCapabilities} />}
      {visible(data.devopsEngagementFit) && <DevopsEngagementFit data={data.devopsEngagementFit} />}
      {visible(data.devopsCost) && <DevopsCostTimeline data={data.devopsCost} />}
      {visible(data.devopsOutlook) && <DevopsOutlook data={data.devopsOutlook} />}

      {visible(data.industries) && (
        <MadIndustries
          data={{
            heading: "Industries We Build",
            headingAccent: "Cloud and DevOps For",
            intro:
              "Deployment risk looks different in a payments system than it does in a content platform. These are the sectors where we have shipped infrastructure that had to hold up under real constraints.",
            ...data.industries,
            items: data.industries?.items?.length ? data.industries.items : DEVOPS_INDUSTRIES,
          }}
        />
      )}

      {visible(data.technologies) && (
        <MadTechnologies
          data={{
            headingLead: "Technologies",
            headingRest: "We Use For Cloud and DevOps",
            intro:
              "Tooling choices follow the problem, not the other way round. This is the stack we reach for most, and we will happily work inside the one you already run.",
            ...data.technologies,
          }}
        />
      )}

      {/* Timeline design renders the `ecommerceProcess` key on the newer
          templates — same wiring staff-augmentation uses. */}
      {visible(data.ecommerceProcess) && (
        <MadProcess
          data={{
            intro:
              "Infrastructure work goes wrong when the plan is discovered halfway through. Six stages, each with a defined outcome, so you know what has been decided and what comes next.",
            ...data.ecommerceProcess,
            heading: processHeading,
            headingAccent: processAccent,
            steps: data.ecommerceProcess?.steps?.length ? data.ecommerceProcess.steps : DEVOPS_PROCESS_STEPS,
          }}
        />
      )}

      {visible(data.engagement) && (
        <MadEngagement
          data={{
            heading: "Flexible Engagement Models",
            headingTail: "For Cloud and DevOps",
            subtitle:
              "A defined transformation, ongoing ownership, or a team embedded alongside yours. Pick the shape that matches how much of the running you want to keep.",
            ...data.engagement,
            // This page bills by infrastructure engagement shape, not by the
            // generic project shapes MadEngagement ships, so it overrides them
            // unless the CMS record supplies its own plans.
            plans: data.engagement?.plans?.length ? data.engagement.plans : DEVOPS_ENGAGEMENT_PLANS,
          }}
        />
      )}

      {visible(data.caseStudies) && (
        <MadCaseStudies
          data={{
            heading: "Cloud and DevOps",
            headingAccent: "Case Studies",
            intro: "Infrastructure work where the before and after are both measurable.",
            ...data.caseStudies,
          }}
          caseStudies={caseStudies}
        />
      )}

      {visible(data.whyChoose) && (
        <WebDevelopmentWhyChooseSection
          data={{
            heading: "Why Businesses Choose",
            headingAccent: "Akoode",
            headingTail: "for Cloud and DevOps",
            subtitle:
              "The difference shows up the first time something breaks at 2am, when the rollback works and nobody has to open a war room to find out why.",
            ...data.whyChoose,
          }}
        />
      )}

      <section className="w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-16" style={{ background: "#130E2A" }}>
        <div className="mx-auto max-w-[1280px]">
          <FounderCtaStrip />
        </div>
      </section>

      {visible(data.blogs) && (
        <MadBlogs data={{ heading: "Related", headingAccent: "Blogs", ...data.blogs }} blogs={blogs} />
      )}

      {visible(data.faq) && (
        <MadFAQ
          data={{
            heading: "Cloud and DevOps",
            headingAccent: "FAQs",
            ...data.faq,
            items: data.faq?.items?.length ? data.faq.items : DEVOPS_FAQ_ITEMS,
          }}
        />
      )}

      {visible(data.finalCta) && (
        <FinalCTA
          variant="light"
          service={data.finalCta?.service || data.finalCta?.headingAccent || "Cloud and DevOps"}
          data={{
            eyebrow: "Start Your Project",
            heading: "Fix the",
            headingAccent: "Deployment Bottleneck",
            headingTail: "This Quarter",
            subtitle:
              "Tell us what you are running and what keeps breaking. Someone from Akoode will respond within one business day with an assessment approach, not a sales deck.",
            ...data.finalCta,
          }}
        />
      )}

      <SubscribeForm2 />
      <Footer />
    </main>
  );
}
