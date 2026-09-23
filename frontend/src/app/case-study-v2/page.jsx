import { redirect } from "next/navigation";

// The /case-study-v2 preview is retired — the redesigned layout now powers the
// real /case-study/<slug> pages. Send visitors to the case study listing.
export default function CaseStudyV2Redirect() {
  redirect("/case-studies");
}
