import { LIST_FAQS } from "@/lib/cacheTags";

const FRONTEND_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
  "http://localhost:5000";

const buildFrontendUrl = (path: string) => {
  const cleaned = path.replace(/^\/+|\/+$/g, "");
  return `${FRONTEND_API_BASE.replace(/\/$/, "")}/frontend/api/${cleaned}`;
};

/**
 * Fetch FAQs for a given service ID.
 * Returns { status?, data } or an array for normalizeFaqList / Faq5SectionArea.
 */
export async function getFaqByServiceId(
  serviceId: string | undefined
): Promise<{ status?: string; data?: unknown[] } | unknown[]> {
  if (!serviceId) return { data: [] };
  try {
    const url = buildFrontendUrl(`faq/list?serviceid=${serviceId}`);
    const response = await fetch(url, { next: { revalidate: 60, tags: [LIST_FAQS] } });
    if (!response.ok) return { data: [] };
    const json = await response.json();
    if (Array.isArray(json)) return json;
    if (json && typeof json === "object" && Array.isArray((json as { data?: unknown[] }).data)) return json as { data: unknown[] };
    return { data: [] };
  } catch (error) {
    console.error("Error fetching FAQ by service ID:", error);
    return { data: [] };
  }
}
