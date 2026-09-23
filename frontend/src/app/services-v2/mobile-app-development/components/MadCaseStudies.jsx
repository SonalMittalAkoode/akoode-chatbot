// Reuses the software-development Case Studies section (identical design/styling),
// driven by mobile-specific heading/intro. Falls back to its built-in sample cards.
import SdCaseStudies from "@/app/services-v2/software-development/components/SdCaseStudies";

export default function MadCaseStudies({ data, caseStudies }) {
  return <SdCaseStudies data={data} caseStudies={caseStudies} />;
}
