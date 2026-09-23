import { SITE_URL } from "@/config/site";

/**
 * IndexNow key — must match the filename of the key-verification route
 * (frontend/src/app/.well-known/<key>.txt/route.js) exactly. The key itself
 * is not a secret; it only proves domain ownership by being hosted at that
 * path, which is why we also tell IndexNow the exact location below via
 * `keyLocation` (it lives under /.well-known/, not the site root).
 */
export const INDEXNOW_KEY = "3304ba48fa5d4faf683ddfcf896d9415";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * Notify IndexNow-participating search engines (Bing, Yandex, Naver, Seznam...)
 * that one or more URLs changed, so they can crawl sooner instead of waiting
 * for their next scheduled pass. Best-effort: failures are logged, never thrown,
 * so a slow/unreachable IndexNow endpoint can't break the caller's revalidation.
 */
export async function pingIndexNow(paths) {
  const list = (Array.isArray(paths) ? paths : [paths]).filter(Boolean);
  if (list.length === 0) return;

  const urlList = list.map((p) => (p.startsWith("http") ? p : `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`));

  try {
    const host = new URL(SITE_URL).host;
    await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/.well-known/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
  } catch (error) {
    console.error("IndexNow ping failed (non-fatal):", error);
  }
}
