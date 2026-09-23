export async function getBlogTableData(page: number = 1, limit: number = 6, category?: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
    const categoryQs = category ? `&category=${encodeURIComponent(category)}` : "";
    const response = await fetch(
      `${apiUrl}api/blog/list?page=${page}&limit=${limit}${categoryQs}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch blog");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { blogs: [], pagination: null }; // Return empty structure in case of an error
  }
}


export const getBlogById = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
  const response = await fetch(apiUrl + `api/blog/byid/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get blog");
  }

  return response.json();
};
export const getBlogBySlug = async (id: string, previewSecret?: string) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
    const qs = previewSecret ? `?preview=${encodeURIComponent(previewSecret)}` : "";
    const response = await fetch(apiUrl + `api/blog/slug/${id}${qs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Preview drafts must always be fresh; published pages use ISR so the
      // route can be statically cached (revalidated on edit via /api/revalidate).
      ...(previewSecret
        ? { cache: "no-store" as const }
        : { next: { revalidate: 3600, tags: [`blog-${id}`] } }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
};

export async function getTrendingBlogs(limit: number = 5) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
    // Short revalidate window (not no-store) — trending shifts view-by-view, but a live
    // per-request DB sort isn't worth paying for on every hit; 60s keeps it near-real-time.
    const response = await fetch(`${apiUrl}api/blog/trending?limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error("Failed to fetch trending blogs");
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching trending blogs:", error);
    return [];
  }
}

// Fire-and-forget: called client-side from the blog detail page so real visits count
// even though the page HTML itself is ISR-cached. keepalive lets it survive navigation.
export function trackBlogView(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
    fetch(`${apiUrl}api/blog/slug/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  } catch {
    // no-op — view tracking must never break the page
  }
}

// Server-side global search over all ACTIVE blogs — called client-side by the
// /blog search bar on each (debounced) keystroke. Returns slim result objects
// (title, slug, category) rather than full posts.
export async function searchBlogs(query: string, limit: number = 8) {
  try {
    const q = String(query || "").trim();
    if (!q) return [];
    const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
    const response = await fetch(
      `${apiUrl}api/blog/search?q=${encodeURIComponent(q)}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to search blogs");
    const result = await response.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("Error searching blogs:", error);
    return [];
  }
}

export const getRelatedBlogs = async (id: string, limit: number = 3) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
    const response = await fetch(
      `${apiUrl}api/blog/related/${id}?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600, tags: [`blog-related-${id}`] },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch related blogs");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
};

