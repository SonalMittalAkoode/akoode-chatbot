import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm2 from "@/components/SubscribeForm2";
import MadHero from "./components/MadHero";
import MadIntro from "./components/MadIntro";
import MadWhyGurgaon from "./components/MadWhyGurgaon";
import MadServices from "./components/MadServices";
import MadTechnologies from "./components/MadTechnologies";
import MadWhyChoose from "./components/MadWhyChoose";
import MadProcess from "./components/MadProcess";
import MadEngagement from "./components/MadEngagement";
import MadCaseStudies from "./components/MadCaseStudies";
import TestimonialsSection from "../_components/TestimonialsSection";
import MadIndustries from "./components/MadIndustries";
import MadBlogs from "./components/MadBlogs";
import MadFAQ from "./components/MadFAQ";
import FinalCTA from "@/components/FinalCTA";
import { getCaseStudyLatestBySlug } from "@/api/caseStudyLatest";
import { getBlogBySlug } from "@/api/blog";

// A section renders unless explicitly hidden (show === false). The static madData
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

export default async function MobileAppDevelopmentTemplate({ data }) {
  if (!data) return null;

  const csRefs = (data.caseStudies?.items || []).map((c) => c.ref).filter(Boolean);
  const caseStudies = visible(data.caseStudies) ? await fetchCaseStudies(csRefs) : [];

  const blogRefs = (data.blogs?.items || []).map((b) => b.ref).filter(Boolean);
  const blogs = visible(data.blogs) ? await fetchBlogs(blogRefs) : [];

  return (
    <main>
      <NavBar forceTransparent />
      {visible(data.hero) && <MadHero data={data.hero} title={data.title} />}
      {visible(data.intro) && <MadIntro data={data.intro} />}
      <MadWhyGurgaon />
      {/* Timeline design renders the `services` key; snake design renders the
          `process` key. Each section's array is normalised to the field its
          component reads (timeline → steps, snake → items). */}
      {visible(data.services) && <MadProcess data={{ ...data.services, steps: data.services?.steps ?? data.services?.items }} />}
      {visible(data.technologies) && <MadTechnologies data={data.technologies} />}
      {visible(data.whyChoose) && <MadWhyChoose data={data.whyChoose} />}
      {visible(data.process) && <MadServices data={{ ...data.process, items: data.process?.items ?? data.process?.steps }} />}
      {visible(data.engagement) && <MadEngagement data={data.engagement} />}
      {visible(data.caseStudies) && <MadCaseStudies data={data.caseStudies} caseStudies={caseStudies} />}
      {visible(data.testimonials) && <TestimonialsSection data={data.testimonials} />}
      {visible(data.industries) && <MadIndustries data={data.industries} />}
      {visible(data.blogs) && <MadBlogs data={data.blogs} blogs={blogs} />}
      {visible(data.faq) && <MadFAQ data={data.faq} />}
      {visible(data.finalCta) && (
        <FinalCTA
          variant="light"
          service={data.finalCta?.service || data.finalCta?.headingAccent || "Mobile App Development"}
          data={{
            eyebrow: "Start Your Project",
            heading: "Start Your",
            headingAccent: "Mobile App Development",
            headingTail: "Project",
            subtitle:
              "Send your brief and someone from Akoode will respond within one business day. The first conversation covers your use case, your current environment, and how the build would be approached. No pitch deck, no pressure.",
            ...data.finalCta,
          }}
        />
      )}
      <SubscribeForm2 />
      <Footer />
    </main>
  );
}
