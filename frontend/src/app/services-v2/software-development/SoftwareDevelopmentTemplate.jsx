import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscribeForm2 from "@/components/SubscribeForm2";
import SdHero from "./components/SdHero";
import SdWhyCustom from "./components/SdWhyCustom";
import SdServices from "./components/SdServices";
import SdSolutions from "./components/SdSolutions";
import SdAI from "./components/SdAI";
import SdIndustries from "./components/SdIndustries";
import TechStack from "@/app/industries/_components/TechStack";
import SdProcess from "./components/SdProcess";
import SdCaseStudies from "./components/SdCaseStudies";
import TestimonialsSection from "../_components/TestimonialsSection";
import SdWhyAkoode from "./components/SdWhyAkoode";
import SdBlogs from "./components/SdBlogs";
import SdFAQ from "./components/SdFAQ";
import FinalCTA from "@/components/FinalCTA";
import { getCaseStudyLatestBySlug } from "@/api/caseStudyLatest";
import { getBlogBySlug } from "@/api/blog";

async function fetchCaseStudies(refs) {
  if (!refs?.length) return [];
  const results = await Promise.all(
    refs.map((ref) => getCaseStudyLatestBySlug(ref).catch(() => null))
  );
  return results.filter(Boolean);
}

async function fetchBlogs(refs) {
  if (!refs?.length) return [];
  const results = await Promise.all(
    refs.map((ref) => getBlogBySlug(ref).catch(() => null))
  );
  return results.filter(Boolean);
}

export default async function SoftwareDevelopmentTemplate({ data }) {
  if (!data) return null;

  const csRefs = (data.caseStudies?.items || []).map((c) => c.ref).filter(Boolean);
  const caseStudies = data.caseStudies?.show ? await fetchCaseStudies(csRefs) : [];

  const blogRefs = (data.blogs?.items || []).map((b) => b.ref).filter(Boolean);
  const blogs = data.blogs?.show ? await fetchBlogs(blogRefs) : [];

  return (
    <main>
      <NavBar forceTransparent />
      {data.hero?.show !== false && <SdHero data={data.hero} title={data.title} />}
      {data.whyCustom?.show && <SdWhyCustom data={data.whyCustom} />}
      {data.services?.show && <SdServices data={data.services} />}
      {data.solutions?.show && <SdSolutions data={data.solutions} />}
      {data.ai?.show && <SdAI data={data.ai} />}
      {data.industries?.show && <SdIndustries data={data.industries} />}
      {data.techStack?.show !== false && <TechStack data={data.techStack} />}
      {data.process?.show && <SdProcess data={data.process} />}
      {data.caseStudies?.show && (
        <SdCaseStudies data={data.caseStudies} caseStudies={caseStudies} />
      )}
      {data.testimonials?.show && <TestimonialsSection data={data.testimonials} />}
      {data.whyAkoode?.show && <SdWhyAkoode data={data.whyAkoode} />}
      {data.blogs?.show && <SdBlogs data={data.blogs} blogs={blogs} />}
      {data.faq?.show && <SdFAQ data={data.faq} />}
      {data.finalCta?.show && (
        <FinalCTA
          variant="light"
          service="Software Development"
          data={{
            eyebrow: "Start Your Project",
            heading: "Start Your",
            headingAccent: "AI Development",
            headingTail: "Project",
            subtitle:
              "Send your brief and someone from Akoode will respond within one business day. First conversation covers your use case, your data environment, and how the build would be approached. No pitch deck, no pressure.",
            ...data.finalCta,
          }}
        />
      )}
      <SubscribeForm2 />
      <Footer />
    </main>
  );
}
