// Server component — fetches published industries from the API and matches
// them by name to the curated static array below, so each homepage card
// auto-links to its /industries/<slug> page as soon as that page is published.
// No manual wiring needed: just create the admin entry with the matching name.

import { listIndustries } from "@/api/frontend/industries";
import IndustriesClient from "./IndustriesClient";

// Curated marketing copy + icons stay hardcoded so the homepage layout
// doesn't depend on admin order or completeness.
const INDUSTRIES = [
  { title: "Healthcare", desc: "Custom healthcare software development for secure, compliant digital platforms", icon: "/industries/health.svg" },
  { title: "Retail & E-Commerce", desc: "End-to-end retail & ecommerce software development solutions that drive conversions", icon: "/industries/retail.svg" },
  { title: "Media & Entertainment", desc: "Scalable media and entertainment software development for seamless content delivery", icon: "/industries/media.svg" },
  { title: "Finance & Banking", desc: "Robust finance & banking software development for secure financial infrastructure", icon: "/industries/bank.svg" },
  { title: "Automotive", desc: "Advanced automotive software engineering for intelligent connected mobility", icon: "/industries/automotive.svg" },
  { title: "Agriculture", desc: "Smart agriculture software development for agri-tech automation & precision farming", icon: "/industries/agriculture.svg" },
  { title: "Telecommunication", desc: "Scalable telecom software development for robust network management platforms", icon: "/industries/telecommunication.svg" },
  { title: "Manufacturing", desc: "Custom manufacturing software development for automated production optimization", icon: "/industries/manufacturing.svg" },
  { title: "Public Sector & Government", desc: "Trusted government software development for secure digital governance platforms", icon: "/industries/public.svg" },
  { title: "Real Estate", desc: "Custom PropTech & real estate software development for smart property management platforms", icon: "/industries/realestate.svg" },
  { title: "Energy & Utilities", desc: "Intelligent energy software development for real-time monitoring & utility management", icon: "/industries/enegy.svg" },
  { title: "Travel & Hospitality", desc: "Custom travel & hospitality software development for seamless booking experiences", icon: "/industries/travel.svg" },
  { title: "Education & E-Learning", desc: "Scalable education & eLearning software development for modern digital classrooms", icon: "/industries/education.svg" },
  { title: "Insurance", desc: "Custom insurance software development for automated policy & claims management", icon: "/industries/insurance.svg" },
  { title: "Logistics & Supply Chain", desc: "End-to-end logistics & supply chain software development for real-time visibility", icon: "/industries/logistics.svg" },
];

// Normalize for matching: lowercase, drop punctuation/spaces, expand "&" → "and".
// "Retail & E-Commerce" → "retailandecommerce"; matches "Retail and E-Commerce",
// "retail-and-ecommerce", etc.
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");

export default async function Industries({ className = "" }) {
  let published = [];
  try {
    published = await listIndustries();
  } catch {
    published = [];
  }

  // Build a quick lookup: normalized name/slug → slug.
  const slugByKey = new Map();
  for (const item of published) {
    if (!item?.slug) continue;
    if (item.name) slugByKey.set(norm(item.name), item.slug);
    slugByKey.set(norm(item.slug), item.slug);
  }

  const enriched = INDUSTRIES.map((ind) => ({
    ...ind,
    slug: slugByKey.get(norm(ind.title)) || null,
  }));

  return <IndustriesClient industries={enriched} className={className} />;
}
