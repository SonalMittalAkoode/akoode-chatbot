export async function getAuthorBySlug(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
    const response = await fetch(apiUrl + `api/employee/author/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600, tags: [`author-${slug}`] },
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data ?? null;
  } catch (error) {
    console.error("Error fetching author by slug:", error);
    return null;
  }
}
