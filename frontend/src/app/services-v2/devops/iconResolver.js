// Icon resolver for the Cloud & DevOps template.
//
// CMS records store an IconPicker key (Fi* / Lu*) rather than a component, so
// every section that renders an icon resolves it here. Returns null when the
// admin left the field blank, which lets each component keep the lucide default
// it was built with instead of rendering a hole.

import { ICON_MAP as ADMIN_ICONS } from "@/utils/adminIconMap";

export const resolveIcon = (name) => (name && ADMIN_ICONS[name]) || null;

export default resolveIcon;
