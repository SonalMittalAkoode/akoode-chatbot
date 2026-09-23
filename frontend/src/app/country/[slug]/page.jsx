import { getSBCBySlug } from "@/api/serviceByCountry";
import { permanentRedirect, notFound } from "next/navigation";

const toSlug = (v) =>
  (v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Legacy canonical location for service-by-country pages. Google still has
// these /country/{slug} URLs indexed from before the canonical structure
// moved to /{market}/{slug}; redirect them permanently instead of 404ing.
export default async function CountrySlugRedirect({ params }) {
  const { slug } = await params;
  const data = await getSBCBySlug(slug);
  if (!data) notFound();

  const market = data.market || toSlug(data.country) || "global";
  permanentRedirect(`/${market}/${slug}`);
}
