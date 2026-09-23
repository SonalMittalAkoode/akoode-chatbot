import { ICON_MAP } from "@/utils/adminIconMap";

export const resolveIcon = (name) => (name && ICON_MAP[name]) || null;
export const isImagePath = (v) => !!v && (v.startsWith("/") || v.startsWith("http"));
