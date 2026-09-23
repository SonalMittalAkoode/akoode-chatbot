import { notFound } from "next/navigation";

// This route exists only as a development/staging workspace for the
// SoftwareDevelopmentTemplate components. The live page is served at
// /services/software-development via the dynamic [slug] route.
export default function SoftwareDevelopmentDevPage() {
  notFound();
}
