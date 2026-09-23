import resolveImageUrl from "@/utils/resolveImageUrl";

// In dev the API is http://localhost:5000 (a private/loopback IP). Next 16's image
// optimizer refuses such upstreams (SSRF protection), so CMS images 400. Bypass the
// optimizer for these images in development; production stays fully optimized.
export const IS_DEV = process.env.NODE_ENV !== "production";

// Bundled public assets committed under /public (used by the static preview).
// Anything else (CMS uploads) is served from the API origin via resolveImageUrl.
const LOCAL_PREFIXES = ["/mobile-app/", "/tech_stacks/", "/software_development/", "/badge/", "/strip/", "/whyus_badge/", "/ai/"];

export default function resolveAsset(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (LOCAL_PREFIXES.some((p) => src.startsWith(p))) return src;
  return resolveImageUrl(src);
}
