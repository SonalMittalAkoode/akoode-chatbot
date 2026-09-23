import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm2 from "@/components/SubscribeForm2";
import EcommerceDevelopmentHeroSection from "./components/EcommerceDevelopmentHeroSection";
import PlatformBottleneckSection from "./components/PlatformBottleneckSection";
import EcommerceServicesSection from "./components/EcommerceServicesSection";
import CommerceEngineeringSection from "./components/CommerceEngineeringSection";
import EcommercePlatformsSection from "./components/EcommercePlatformsSection";
import WhatsChanging from "@/app/industries/_components/WhatsChanging";
import MadIndustries from "@/app/services-v2/mobile-app-development/components/MadIndustries";
import MadTechnologies from "@/app/services-v2/mobile-app-development/components/MadTechnologies";
import MadProcess from "@/app/services-v2/mobile-app-development/components/MadProcess";
import MadEngagement from "@/app/services-v2/mobile-app-development/components/MadEngagement";
import MadCaseStudies from "@/app/services-v2/mobile-app-development/components/MadCaseStudies";
import TestimonialsSection from "../_components/TestimonialsSection";
import MadWhyChoose from "@/app/services-v2/mobile-app-development/components/MadWhyChoose";
import MadBlogs from "@/app/services-v2/mobile-app-development/components/MadBlogs";
import MadFAQ from "@/app/services-v2/mobile-app-development/components/MadFAQ";
import AwardsPanel from "@/components/AwardsPanel";
import FinalCTA from "@/components/FinalCTA";
import { getCaseStudyLatestBySlug } from "@/api/caseStudyLatest";
import { getBlogBySlug } from "@/api/blog";

// Engagement Models plans — fixed for this template (not admin-editable, only
// heading/headingTail/subtitle are). Passed as data.plans so MadEngagement's own
// generic defaults (built for Mobile App Development) are never touched.

// A section renders unless explicitly hidden (show === false). A freshly
// created record has no `show` flags on its ecommerce-only sections (they
// default to false in the schema so a brand-new "software-development" or
// "mobile-development" record isn't affected), so the admin must flip each
// section's toggle on — same convention as the Mobile/AI templates.
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

export default async function EcommerceDevelopmentTemplate({ data }) {
  if (!data) return null;

  const csRefs = (data.caseStudies?.items || []).map((c) => c.ref).filter(Boolean);
  const caseStudies = visible(data.caseStudies) ? await fetchCaseStudies(csRefs) : [];

  const blogRefs = (data.blogs?.items || []).map((b) => b.ref).filter(Boolean);
  const blogs = visible(data.blogs) ? await fetchBlogs(blogRefs) : [];

  return (
    <main>
      <NavBar forceTransparent />
      {/* Hero's stats bar and its three floating metric cards are fixed design
          elements — EcommerceDevelopmentHeroSection ignores any incoming data
          for those regardless of what's stored on data.hero. */}
      {visible(data.hero) && <EcommerceDevelopmentHeroSection data={data.hero} title={data.title} />}
      {visible(data.platformProblem) && <PlatformBottleneckSection data={data.platformProblem} />}
      {visible(data.ecommerceServices) && <EcommerceServicesSection data={data.ecommerceServices} />}
      {visible(data.commerceEngineering) && <CommerceEngineeringSection data={data.commerceEngineering} />}
      {/* WhatsChanging expects a plain `heading`/`subtitle` shape, while the
          reused `trends` schema (shared with the AI template's AiTrends) stores
          heading/headingAccent/intro — adapt here rather than reshape the
          shared schema field. */}
      {visible(data.trends) && (
        <WhatsChanging
          data={{
            heading: [data.trends?.heading, data.trends?.headingAccent].filter(Boolean).join(" ") || undefined,
            subtitle: data.trends?.intro,
            items: data.trends?.items,
            image: data.trends?.image,
            imageAlt: data.trends?.imageAlt,
          }}
        />
      )}
      {visible(data.ecommercePlatforms) && <EcommercePlatformsSection data={data.ecommercePlatforms} />}
      {visible(data.industries) && <MadIndustries data={data.industries} />}
      {visible(data.technologies) && <MadTechnologies data={data.technologies} />}
      {visible(data.ecommerceProcess) && <MadProcess data={data.ecommerceProcess} />}
      {/* Engagement Models — plans (Fixed Cost / Dedicated Team / Staff
          Augmentation) are fixed; only heading/headingTail/subtitle are
          admin-editable, same as the Mobile/AI templates. */}
      {visible(data.engagement) && (
        <MadEngagement data={data.engagement} />
      )}
      {visible(data.caseStudies) && <MadCaseStudies data={data.caseStudies} caseStudies={caseStudies} />}
      {visible(data.testimonials) && <TestimonialsSection data={data.testimonials} />}
      {visible(data.whyChoose) && <MadWhyChoose data={data.whyChoose} />}

      {/* Awards & Recognitions — shared static strip, no admin control
          (matches the existing convention on the other templates). */}
      <section
        className="w-full px-5 py-10 sm:px-8 sm:py-12 lg:px-16"
        style={{ background: "linear-gradient(180deg, #14132A 0%, #18172C 100%)" }}
      >
        <div className="mx-auto max-w-[1280px]">
          <AwardsPanel />
        </div>
      </section>

      {visible(data.blogs) && <MadBlogs data={data.blogs} blogs={blogs} />}
      {visible(data.faq) && <MadFAQ data={data.faq} />}
      {visible(data.finalCta) && (
        <FinalCTA
          variant="light"
          service={data.finalCta?.service || data.finalCta?.headingAccent || "Ecommerce Development"}
          data={{
            eyebrow: "Start Your Project",
            heading: "Start Your",
            headingAccent: "Ecommerce Development",
            headingTail: "Project",
            subtitle:
              "Send your brief and someone from Akoode will respond within one business day. The first conversation covers your catalogue, your current platform, and how the build would be approached. No pitch deck, no pressure.",
            ...data.finalCta,
            // CMS records carry `heading`/`headingAccent` but no `headingTail`,
            // so the default "Project" above survived the spread and was appended
            // to an already-complete CMS sentence ("...Let's Fix That Project").
            // A CMS-authored heading composes its own ending; the default tail
            // applies only when no heading was authored.
            headingTail: data.finalCta?.heading
              ? (data.finalCta?.headingTail ?? "")
              : "Project",
          }}
        />
      )}
      <SubscribeForm2 />
      <Footer />
    </main>
  );
}
