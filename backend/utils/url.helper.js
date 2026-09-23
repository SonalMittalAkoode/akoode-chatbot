const getBaseUrl = (req = null) => {
  // Priority 1: Explicit env (best for prod)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  // Priority 2: Runtime request (useful for SSR / APIs)
  if (req) {
    const protocol = req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}`;
  }

  // Final fallback (local dev safety net)
  return "http://localhost:3000";
};

const getLogoUrl = (req = null) => {
  const baseUrl = getBaseUrl(req);
  return `${baseUrl.replace(/\/$/, "")}/public/images/logo-dark.png`;
};

/** Use for emails only: returns a public URL so recipients can load the logo (no localhost). */
const getPublicLogoUrl = () => {
  const base = (process.env.SITE_URL || process.env.BASE_URL || "").trim().replace(/\/$/, "");
  return base ? `${base}/public/images/logo-dark.png` : "";
};

module.exports = { getBaseUrl, getLogoUrl, getPublicLogoUrl };
