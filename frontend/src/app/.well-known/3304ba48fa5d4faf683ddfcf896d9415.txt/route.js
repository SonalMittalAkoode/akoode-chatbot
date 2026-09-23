import { INDEXNOW_KEY } from "@/lib/indexnow";

// IndexNow key-verification file. Lives under /.well-known/ — the standard
// location for domain-ownership/verification files (same convention as
// security.txt, Apple Pay domain association, etc.) — rather than the site
// root, so it reads clearly as "site metadata" and not a content page.
// The IndexNow ping in lib/indexnow.js sends a matching `keyLocation` so
// search engines know to look here instead of the default root path.
//
// Response body must be exactly the key, nothing else.
export async function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
