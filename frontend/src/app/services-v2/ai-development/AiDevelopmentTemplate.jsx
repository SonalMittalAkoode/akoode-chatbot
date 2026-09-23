import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm2 from "@/components/SubscribeForm2";
import AiHero from "./components/AiHero";
import AiGap from "./components/AiGap";
import AiServices from "./components/AiServices";
import AiCapabilities from "./components/AiCapabilities";
import AiTrends from "./components/AiTrends";
import AiProcess from "./components/AiProcess";
import aiData from "./aiData";
import SdWhyAkoode from "@/app/services-v2/software-development/components/SdWhyAkoode";
// Reused from the Mobile App Development template — these sections are fully
// data-driven, so AI content flows in via the `data` prop. The 2 bespoke AI
// sections (hero + gap) live in ./components.
import MadTechnologies from "@/app/services-v2/mobile-app-development/components/MadTechnologies";
import MadEngagement from "@/app/services-v2/mobile-app-development/components/MadEngagement";
import MadCaseStudies from "@/app/services-v2/mobile-app-development/components/MadCaseStudies";
import MadIndustries from "@/app/services-v2/mobile-app-development/components/MadIndustries";
import MadBlogs from "@/app/services-v2/mobile-app-development/components/MadBlogs";
import MadFAQ from "@/app/services-v2/mobile-app-development/components/MadFAQ";
import FinalCTA from "@/components/FinalCTA";
import TestimonialsSection from "../_components/TestimonialsSection";
import { getCaseStudyLatestBySlug } from "@/api/caseStudyLatest";
import { getBlogBySlug } from "@/api/blog";

// A section renders unless explicitly hidden (show === false). The static aiData
// preview has no `show` flags, so everything renders; CMS data drives visibility.
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

export default async function AiDevelopmentTemplate({ data }) {
  if (!data) return null;

  const csRefs = (data.caseStudies?.items || []).map((c) => c.ref).filter(Boolean);
  const caseStudies = visible(data.caseStudies) ? await fetchCaseStudies(csRefs) : [];

  const blogRefs = (data.blogs?.items || []).map((b) => b.ref).filter(Boolean);
  const blogs = visible(data.blogs) ? await fetchBlogs(blogRefs) : [];

  return (
    <main>
      <NavBar forceTransparent />
      {/* Section order (per spec): hero, intro, services, capabilities, trends,
          industries, tech stack, process, engagement, case study, why-choose
          (software-dev design), testimonials, blogs, faq, final cta. */}
      {visible(data.hero) && <AiHero data={data.hero} title={data.title} />}
      {visible(data.gap) && <AiGap data={data.gap} />}
      {visible(data.process) && (
        <>
          {(() => {
            const seoItems = data.process?.steps ?? data.process?.items ?? [];
            return seoItems.length > 0 ? (
              <ul className="sr-only" aria-label="All AI development services">
                {seoItems.map((item, idx) => (
                  <li key={item.num ?? item.title ?? idx}>
                    <h3>{item.title}</h3>
                    {item.desc && (
                      <div dangerouslySetInnerHTML={{ __html: item.desc }} />
                    )}
                    {item.link && (
                      <a href={item.link}>Learn more about {item.title}</a>
                    )}
                  </li>
                ))}
              </ul>
            ) : null;
          })()}
          <AiServices data={data.process} />
        </>
      )}
      {visible(data.capabilities) && <AiCapabilities data={data.capabilities} />}
      {visible(data.trends) && <AiTrends data={data.trends} />}
      {visible(data.industries) && <MadIndustries data={data.industries} />}
      {visible(data.technologies) && <MadTechnologies data={data.technologies} />}
      {/* Process — snake-connector design, laid out in rows of 4 (AiProcess
          maps the process-stage fields and chunks the cards itself). */}
      {visible(data.services) && <AiProcess data={data.services} />}
      {/* Engagement plan content is fixed per template — inject the AI plans
          (admin only edits heading/subtitle). */}
      {visible(data.engagement) && <MadEngagement data={data.engagement} />}
      {visible(data.caseStudies) && <MadCaseStudies data={data.caseStudies} caseStudies={caseStudies} />}
      {visible(data.whyChoose) && <SdWhyAkoode data={data.whyChoose} mobileSlider />}
      {visible(data.testimonials) && <TestimonialsSection data={data.testimonials} />}
      {visible(data.blogs) && <MadBlogs data={data.blogs} blogs={blogs} />}
      {visible(data.faq) && <MadFAQ data={data.faq} />}
      {/* AI final CTA has no hardcoded "Project" tail (mobile keeps it) */}
      {visible(data.finalCta) && (
        <FinalCTA
          variant="light"
          service={data.finalCta?.service || data.finalCta?.headingAccent || "AI Development"}
          data={{
            eyebrow: aiData.finalCta.eyebrow,
            heading: aiData.finalCta.heading,
            headingAccent: aiData.finalCta.headingAccent,
            subtitle: aiData.finalCta.subtitle,
            ...data.finalCta,
            headingTail: data.finalCta?.headingTail ?? "",
          }}
        />
      )}
      <SubscribeForm2 />
      <Footer />
    </main>
  );
}
