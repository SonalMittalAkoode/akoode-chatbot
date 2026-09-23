import { NextResponse } from "next/server";
import { buildCspHeader, generateNonce, CSP_NONCE_HEADER, PATHNAME_HEADER } from "@/lib/csp";

export function proxy(request) {
  const pathname = request.nextUrl.pathname;

  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  const nonce = generateNonce();
  const csp = buildCspHeader({
    nonce,
    isDev: process.env.NODE_ENV !== "production",
  });
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PATHNAME_HEADER, pathname);
  requestHeaders.set(CSP_NONCE_HEADER, nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:css|js|map|json|txt|ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
};
