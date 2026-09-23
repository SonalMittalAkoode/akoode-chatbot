// Icon resolver for the Ecommerce Development template.
// Resolves admin IconPicker keys (Fi* / Lu*) from the shared adminIconMap — used
// by CMS data (e.g. platformProblem.points[].icon). Falls back to null so callers
// can keep their own static lucide-react default when nothing is picked.

import { ICON_MAP as ADMIN_ICONS } from "@/utils/adminIconMap";

export const resolveIcon = (name) => (name && ADMIN_ICONS[name]) || null;

export default resolveIcon;
