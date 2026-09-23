import { notFound } from "next/navigation";

// This route exists only as a development/staging workspace for the
// MobileAppDevelopmentTemplate components. The live page is served at
// /services/mobile-app-development via the dynamic [slug] route.
export default function MobileAppDevelopmentDevPage() {
  notFound();
}
