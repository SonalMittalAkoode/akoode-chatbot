import { redirect } from "next/navigation";

// /case-study-v2/[slug] is retired — new case studies live at /case-study/[slug]
// (which renders the redesigned page). Redirect any old links here.
export default async function CaseStudyV2SlugRedirect({ params }) {
  const { slug } = await params;
  redirect(`/case-studies/${slug}`);
}
