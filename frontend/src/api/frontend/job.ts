const FRONTEND_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
  "http://localhost:5000";

const buildFrontendUrl = (slug: string) => {
  const cleanedSlug = slug.replace(/^\/+|\/+$/g, "");
  return `${FRONTEND_API_BASE.replace(/\/$/, "")}/frontend/api/${cleanedSlug}`;
};

export async function getFrontendJobs(page: number = 1, limit: number = 3) {
  try {
    const response = await fetch(
      `${buildFrontendUrl("job/jobs")}?page=${page}&limit=${limit}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { data: [], pagination: null };
  }
}

export const getJobBySlug = async (slug: string) => {
  try {
    const response = await fetch(
      `${buildFrontendUrl(`job/${slug}`)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // ISR: cache the published job posting and regenerate hourly so the
        // career route can be statically served instead of dynamic per-request.
        next: { revalidate: 3600, tags: [`job-${slug}`] },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to get job");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching job by slug:", error);
    throw error;
  }
};

// Keep getJobById for backward compatibility (admin panel might still use it)
export const getJobById = async (id: string) => {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000";

    const response = await fetch(
      `${apiBase.replace(/\/$/, "")}/admin/api/jobposting/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to get job");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching job by id:", error);
    throw error;
  }
};

