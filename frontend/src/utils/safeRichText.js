import { SITE_URL } from "@/config/site";
import {
  isInternalHref,
  canonicalizeInternalHref,
  setHref,
} from "@/utils/internalLinks";

export const hasHtmlContent = (value) => {
  if (!value) return false;
  const text = String(value);
  return text.includes("<") || text.includes("&lt;");
};

export const normalizeHtml = (html) => {
  if (!html) return "";
  return String(html).replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
};

const SITE_ORIGIN = SITE_URL;

// Fix link rel attributes: strip nofollow/noopener/noreferrer from internal links,
// enforce noopener noreferrer (but NOT nofollow) on external links.
function fixLinkRels(html) {
  return html.replace(/<a\s+([^>]*?)>/gi, (_, attrs) => {
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1] : "";
    const internal = isInternalHref(href, SITE_ORIGIN);

    const relMatch = attrs.match(/rel\s*=\s*["']([^"']*)["']/i);
    const existingTokens = relMatch
      ? relMatch[1].split(/\s+/).filter(Boolean)
      : [];

    let withoutRel = attrs.replace(/\s*rel\s*=\s*["'][^"']*["']/gi, "").trim();
    if (internal) {
      // Remove target="_blank" and all nofollow/noopener/noreferrer from internal links
      withoutRel = withoutRel.replace(/\s*target\s*=\s*["'][^"']*["']/gi, "").trim();
      const cleanTokens = existingTokens.filter(
        (t) => !["nofollow", "noopener", "noreferrer"].includes(t.toLowerCase())
      );
      // Rewrite http:// or bare-domain links to this site to the canonical origin.
      const canonicalHref = canonicalizeInternalHref(href, SITE_ORIGIN);
      const withHref = canonicalHref ? setHref(withoutRel, canonicalHref) : withoutRel;
      const relAttr = cleanTokens.length ? ` rel="${cleanTokens.join(" ")}"` : "";
      return `<a ${withHref}${relAttr}>`;
    } else {
      // External: keep noopener + noreferrer for security, but never nofollow on own site's content links
      const secureTokens = [...new Set([
        ...existingTokens.filter((t) => t.toLowerCase() !== "nofollow"),
        "noopener",
        "noreferrer",
      ])];
      return `<a ${withoutRel} rel="${secureTokens.join(" ")}">`;
    }
  });
}

// Lightweight sanitizer for admin-authored HTML.
// Removes script-like tags, inline event handlers, dangerous URLs, and fixes link rel attributes.
export const sanitizeRichText = (html) => {
  if (!html) return "";

  const sanitized = String(html)
    .replace(
      /<\s*(script|style|iframe|object|embed|form|meta|link)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
      ""
    )
    .replace(/<\s*(script|style|iframe|object|embed|form|meta|link)[^>]*\/?\s*>/gi, "")
    .replace(/\son\w+\s*=\s*(['"])[\s\S]*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, ' $1="#"')
    .replace(/\s(href|src)\s*=\s*(['"])\s*data:text\/html[\s\S]*?\2/gi, ' $1="#"');

  return fixLinkRels(sanitized);
};

// Strip auto-linkified false positives like "B.Tech" / "M.Tech" that some
// rich-text editors turn into <a href="http://b.tech">. We unwrap anchors
// whose href points to a single-letter-subdomain bare domain (e.g. b.tech,
// m.tech, x.io) with no path. Legitimate links (full URLs with paths, or
// multi-character hostnames) are preserved so interlinking still works.
export const stripBareTldAutolinks = (html) => {
  if (!html) return "";
  return String(html).replace(
    /<a\b[^>]*\bhref\s*=\s*(['"])\s*(?:https?:\/\/)?[a-zA-Z]\.[a-zA-Z]{2,}\/?\s*\1[^>]*>([\s\S]*?)<\/a>/gi,
    "$2"
  );
};

// Editors often save links like href="www.akoode.com" or href="akoode.com/foo"
// without a scheme. The browser then resolves those relative to the current
// page (e.g. /uk/gurugram/www.akoode.com). Normalize: any href that looks like
// an external domain (contains a dot, isn't already a scheme, isn't site-root,
// anchor, mail, or tel) gets https:// prepended.
const PROTOCOL_RE = /^[a-z][a-z0-9+.-]*:/i;
export const normalizeAnchorHrefs = (html) => {
  if (!html) return "";
  return String(html).replace(
    /(<a\b[^>]*\bhref\s*=\s*)(['"])([^'"]*)\2/gi,
    (match, prefix, quote, href) => {
      const raw = href.trim();
      if (!raw) return match;
      if (raw.startsWith("/") || raw.startsWith("#")) return match;
      if (PROTOCOL_RE.test(raw)) return match; // http:, https:, mailto:, tel:, etc.
      if (raw.includes(".")) {
        return `${prefix}${quote}https://${raw}${quote}`;
      }
      return match;
    }
  );
};

