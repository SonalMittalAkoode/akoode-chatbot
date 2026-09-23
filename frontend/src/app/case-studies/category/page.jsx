import { notFound } from "next/navigation";

// /case-studies/category is not a page of its own — only the individual
// category listings at /case-studies/category/<slug> are reachable.
export default function CaseStudyCategoryIndex() {
    notFound();
}
