// Reuses the software-development Case Studies section (identical design/styling),
// driven by industry-focused heading/intro. Falls back to its built-in sample cards.
import SdCaseStudies from "@/app/services-v2/software-development/components/SdCaseStudies";

const DATA = {
  heading: "Industry Work That",
  headingAccent: "Speaks For Itself",
  intro:
    "Every project starts as a business problem before it becomes a technical one. Here's a snapshot of how we've helped teams across industries ship software that moved real metrics.",
};

export default function CaseStudies({ caseStudies }) {
  return <SdCaseStudies data={DATA} caseStudies={caseStudies} />;
}
