import { NextResponse } from "next/server";
import sharp from "sharp";
import resolveImageUrl from "@/utils/resolveImageUrl";

// Social scrapers (LinkedIn, WhatsApp, X, iMessage, Facebook) do not reliably
// render WebP og:image, so previews break and clients fall back to the favicon.
// This route fetches a source image (typically an admin-uploaded .webp hero) and
// re-encodes it to a correctly-sized JPEG that every platform can display.
export const runtime = "nodejs";
export const revalidate = 604800; // 7 days

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Only allow fetching from hosts we own, to prevent this route being used as an
// open image proxy / SSRF vector.
const ALLOWED_HOSTS = new Set(
  [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_FRONTEND_API_URL,
    process.env.NEXT_PUBLIC_ASSET_BASE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ]
    .filter(Boolean)
    .map((u) => {
      try {
        return new URL(u).host;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
);

export async function GET(request) {
  const src = new URL(request.url).searchParams.get("src");
  if (!src) return new NextResponse("Missing src", { status: 400 });

  // Accept either a raw stored path (e.g. /public/images/uploads/x.webp) or a
  // full URL; resolveImageUrl turns paths into absolute API/asset URLs.
  const resolved = resolveImageUrl(src);
  let target;
  try {
    target = new URL(resolved);
  } catch {
    return new NextResponse("Invalid src", { status: 400 });
  }
  if (!ALLOWED_HOSTS.has(target.host)) {
    return new NextResponse("Forbidden host", { status: 403 });
  }

  try {
    const upstream = await fetch(target.href, { next: { revalidate: 604800 } });
    if (!upstream.ok) return new NextResponse("Upstream error", { status: 502 });

    const input = Buffer.from(await upstream.arrayBuffer());
    const output = await sharp(input)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "attention" })
      .flatten({ background: "#130F25" })
      .jpeg({ quality: 82 })
      .toBuffer();

    return new NextResponse(output, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=604800, s-maxage=604800, immutable",
      },
    });
  } catch {
    return new NextResponse("Conversion failed", { status: 500 });
  }
}
