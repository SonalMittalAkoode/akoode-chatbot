// Icon resolver for the Mobile App Development template.
// Resolves BOTH:
//   1. Admin IconPicker keys (Fi* / Lu*) from the shared adminIconMap — used by CMS data.
//   2. The lucide-react keys used by the static madData preview.
// Admin keys win when present; otherwise we fall back to the local lucide set.

import { ICON_MAP as ADMIN_ICONS } from "@/utils/adminIconMap";
import {
  Star,
  TrendingUp,
  Layers,
  Globe,
  Code2,
  Gauge,
  Building2,
  RefreshCw,
  ShieldCheck,
  Apple,
  Smartphone,
  Cpu,
  Atom,
  Feather,
  Map,
  Settings,
  Users,
  Box,
  Award,
  Trophy,
  Calendar,
  PieChart,
  Search,
  Target,
  Rocket,
  PenLine,
} from "lucide-react";

const LUCIDE_ICONS = {
  Star,
  TrendingUp,
  Layers,
  Globe,
  Code2,
  Gauge,
  Building2,
  RefreshCw,
  ShieldCheck,
  Apple,
  Smartphone,
  Cpu,
  Atom,
  Feather,
  Map,
  Settings,
  Users,
  Box,
  Award,
  Trophy,
  Calendar,
  PieChart,
  Search,
  Target,
  Rocket,
  PenLine,
};

export const resolveIcon = (name) =>
  (name && (ADMIN_ICONS[name] || LUCIDE_ICONS[name])) || null;

export default resolveIcon;
