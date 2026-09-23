const https = require("https");
const http = require("http");

/**
 * Tells the Next.js frontend to purge the ISR cache for a specific page.
 * Fire-and-forget — errors are swallowed so a reachability issue never
 * causes an admin save to fail.
 *
 * @param {{ slug: string, type: 'service'|'industry'|'sbc'|'city', market?: string, city?: string }} payload
 */
async function revalidateFrontend(payload) {
  const secret = process.env.REVALIDATE_SECRET;
  const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
  if (!secret || !siteUrl) return;

  try {
    const url = new URL(`${siteUrl}/api/revalidate`);
    const body = JSON.stringify(payload);
    const lib = url.protocol === "https:" ? https : http;

    await new Promise((resolve, reject) => {
      const req = lib.request(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
            "x-revalidate-secret": secret,
          },
        },
        (res) => {
          res.resume(); // consume and discard response body
          resolve();
        }
      );
      req.on("error", reject);
      req.setTimeout(5000, () => req.destroy());
      req.write(body);
      req.end();
    });
  } catch {
    // Silently ignore — frontend being temporarily unreachable must never
    // fail an admin save. The ISR baseline TTL (1h) will cover it.
  }
}

module.exports = revalidateFrontend;
