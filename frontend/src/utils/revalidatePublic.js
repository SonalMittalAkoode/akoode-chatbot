/**
 * Bust the ISR cache for a public page immediately after an admin edit, so the
 * change appears live instead of waiting out the page's `revalidate` window.
 *
 * Posts to the existing /api/revalidate route (same contract the service-by-country
 * / service-by-city admin forms already use). Fire-and-forget: a failed revalidation
 * never blocks or breaks the save — the page just falls back to its normal hourly
 * revalidate. Runs only on the client (admin panel).
 *
 * @param {string} path     Canonical public path to refresh, e.g. `/blog/my-post`.
 * @param {string} [oldPath] Previous path when the slug changed, so the stale URL is purged too.
 */
export async function revalidatePublic(path, oldPath) {
  try {
    const secret = process.env.NEXT_PUBLIC_PREVIEW_SECRET;
    if (!secret || !path) return;
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, oldPath, secret }),
    });
  } catch {
    // Silent — revalidation is best-effort; the hourly ISR window is the fallback.
  }
}
