
export function normalizeHostname(hostname) {
  return String(hostname || "").toLowerCase().replace(/^www\./, "");
}

export function isInternalHref(href, siteOrigin) {
  if (!href || typeof href !== "string") return true;
  const h = href.trim();
  if (h.startsWith("#") || h === "") return true;
  if (h.startsWith("/") && !h.startsWith("//")) return true;
  if (!siteOrigin) return false;
  try {
    const base = new URL(siteOrigin);
    const u = new URL(h, siteOrigin);
    return normalizeHostname(u.hostname) === normalizeHostname(base.hostname);
  } catch {
    return false;
  }
}

export function canonicalizeInternalHref(href, siteOrigin) {
  if (!href || typeof href !== "string" || !siteOrigin) return null;
  const h = href.trim();
  // Relative, anchor-only and empty hrefs already resolve against this origin.
  if (h === "" || h.startsWith("#")) return null;
  if (h.startsWith("/") && !h.startsWith("//")) return null;
  try {
    const base = new URL(siteOrigin);
    const u = new URL(h, siteOrigin);
    // Leave mailto:, tel: and any other non-web scheme alone.
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (normalizeHostname(u.hostname) !== normalizeHostname(base.hostname)) return null;
    const canonical = `${base.origin}${u.pathname}${u.search}${u.hash}`;
    return canonical === h ? null : canonical;
  } catch {
    return null;
  }
}

export function setHref(attrs, nextHref) {
  return attrs.replace(
    /(href\s*=\s*)(["'])[^"']*\2/i,
    (_m, prefix, quote) => `${prefix}${quote}${nextHref}${quote}`
  );
}
