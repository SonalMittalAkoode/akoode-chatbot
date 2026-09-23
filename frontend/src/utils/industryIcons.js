// Shared industry → icon resolver.
//
// Industry records carry no icon field, so the presentation icon is derived
// from the slug via substring keyword matching. This is the single source of
// truth used by both the NavBar mega-menu and the /industries listing grid —
// keep it here rather than duplicating the map per component.

import {
  Building2,
  HeartPulse,
  ShoppingBag,
  Film,
  CreditCard,
  Car,
  Leaf,
  Radio,
  Settings,
  Landmark,
  Zap,
  Plane,
  GraduationCap,
  Shield,
  Truck,
  Globe,
} from "lucide-react";

const INDUSTRY_ICON_MAP = [
  { keywords: ["healthcare", "health", "medical"], icon: HeartPulse },
  { keywords: ["retail", "ecommerce", "e-commerce"], icon: ShoppingBag },
  { keywords: ["media", "entertainment"], icon: Film },
  { keywords: ["finance", "banking", "fintech"], icon: CreditCard },
  { keywords: ["automotive", "automobile"], icon: Car },
  { keywords: ["agriculture", "agri", "farming"], icon: Leaf },
  { keywords: ["telecom", "telecommunication"], icon: Radio },
  { keywords: ["manufacturing", "production"], icon: Settings },
  { keywords: ["public-sector", "government", "govt"], icon: Landmark },
  { keywords: ["real-estate", "realestate", "property"], icon: Building2 },
  { keywords: ["energy", "utilities", "utility"], icon: Zap },
  { keywords: ["travel", "hospitality", "tourism"], icon: Plane },
  { keywords: ["education", "elearning", "e-learning", "edtech"], icon: GraduationCap },
  { keywords: ["insurance"], icon: Shield },
  { keywords: ["logistics", "supply-chain", "supplychain"], icon: Truck },
];

// Returns a lucide-react icon component for the given industry slug, falling
// back to a generic globe when nothing matches.
export const getIndustryIcon = (slug = "") => {
  const s = slug.toLowerCase();
  const match = INDUSTRY_ICON_MAP.find(({ keywords }) => keywords.some((k) => s.includes(k)));
  return match?.icon ?? Globe;
};

export default getIndustryIcon;
