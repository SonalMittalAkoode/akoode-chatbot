

import { SITE_URL } from "@/config/site";
import {
  isInternalHref,
  canonicalizeInternalHref,
  setHref,
} from "@/utils/internalLinks";

const DEFAULT_ORIGIN = SITE_URL;

function normalizeOrigin(urlOrOrigin) {
  if (!urlOrOrigin || typeof urlOrOrigin !== "string") return "";
  const s = urlOrOrigin.trim().replace(/\/$/, "");
  return s;
}

function getRelTokens(attrs) {
  const relMatch = attrs.match(/rel\s*=\s*["']([^"']*)["']/i);
  return relMatch
    ? relMatch[1].split(/\s+/).map((token) => token.trim()).filter(Boolean)
    : [];
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

/**
 * Rewrite <a> tags in html so internal links are followable and external keep nofollow.
 * @param {string} html - Raw HTML (e.g. from CMS).
 * @param {string} [siteOrigin] - Site origin (e.g. https://www.akoode.com). Defaults to NEXT_PUBLIC_SITE_URL.
 * @returns {string} Processed HTML.
 */
export function processHtmlLinks(html, siteOrigin) {
  if (!html || typeof html !== "string") return html;
  const origin = normalizeOrigin(siteOrigin || DEFAULT_ORIGIN);

  return html.replace(/<a\s+([^>]*?)>/gi, (fullMatch, attrs) => {
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1] : "";
    const internal = isInternalHref(href, origin);
    const relTokens = getRelTokens(attrs);
    const withoutRel = attrs.replace(/\s*rel\s*=\s*["'][^"']*["']/gi, "").trim();
    const withoutTarget = internal
      ? withoutRel.replace(/\s*target\s*=\s*["'][^"']*["']/gi, "").trim()
      : withoutRel;

    // Only internal links are rewritten; external hrefs are never touched.
    const canonicalHref = internal ? canonicalizeInternalHref(href, origin) : null;
    const withHref = canonicalHref ? setHref(withoutTarget, canonicalHref) : withoutTarget;

    const nextRelTokens = internal
      ? relTokens.filter((token) => !["noopener", "noreferrer", "nofollow"].includes(token.toLowerCase()))
      : uniq([...relTokens, "noopener", "noreferrer", "nofollow"]);

    const relAttr = nextRelTokens.length ? ` rel="${nextRelTokens.join(" ")}"` : "";
    const newAttrs = `${withHref}${relAttr}`.trim();
    return `<a ${newAttrs}>`;
  });
}
