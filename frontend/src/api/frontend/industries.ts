// Public (frontend) industry API client

const getFrontendApiBase = () =>
  process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

export async function getIndustryBySlug(slug: string, preview?: boolean): Promise<any | null> {
  const base = getFrontendApiBase();
  if (!base || !slug) return null;
  try {
    const qs = preview
      ? `?preview=${encodeURIComponent(process.env.NEXT_PUBLIC_PREVIEW_SECRET || "")}`
      : "";
    const res = await fetch(`${base}api/industry/slug/${slug}${qs}`,
      preview
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, tags: [`industry-${slug}`] } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function listIndustries(): Promise<any[]> {
  const base = getFrontendApiBase();
  if (!base) return [];
  try {
    const res = await fetch(`${base}api/industry/list?limit=200`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.items) ? json.items : [];
  } catch {
    return [];
  }
}
