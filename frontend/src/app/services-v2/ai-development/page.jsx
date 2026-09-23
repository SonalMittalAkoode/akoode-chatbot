import { notFound } from "next/navigation";

// This route exists only as a development/staging workspace for the
// AiDevelopmentTemplate components. The live page is served at
// /services/ai (or the configured slug) via the dynamic [slug] route.
export default function AiDevelopmentDevPage() {
  notFound();
}
