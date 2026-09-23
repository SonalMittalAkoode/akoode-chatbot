import resolveImageUrl from "@/utils/resolveImageUrl";

export const IS_DEV = process.env.NODE_ENV !== "production";

const LOCAL_PREFIXES = ["/digital-transformation/"];

export default function resolveAsset(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (LOCAL_PREFIXES.some((p) => src.startsWith(p))) return src;
  return resolveImageUrl(src);
}
