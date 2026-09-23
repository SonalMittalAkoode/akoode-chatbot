import { notFound } from "next/navigation";

// This route exists only as a development/staging workspace for the
// EcommerceDevelopmentTemplate components. The live page is served at
// /services/<slug> via the dynamic [slug] route, driven by an Updated
// Services CMS record with template = "ecommerce-development".
export default function EcommerceDevelopmentDevPage() {
  notFound();
}
