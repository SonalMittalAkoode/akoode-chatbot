const backendBase = process.env.LOCAL_BACKEND_URL || "http://localhost:5005";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function proxySbcAiRequest(req: Request, endpoint: string) {
  try {
    const body = await req.text();
    const response = await fetch(`${backendBase}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "Bearer local-test-token",
      },
      body,
      cache: "no-store",
    });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Local AI suggestion proxy failed";
    return Response.json({ status: "error", message }, { status: 502 });
  }
}

export async function POST(req: Request) {
  return proxySbcAiRequest(req, "/admin/api/ai-suggestions/service-by-country");
}
