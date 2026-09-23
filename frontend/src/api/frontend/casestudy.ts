export async function getCasestudyList(page: number = 1, limit: number = 6) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}api/casestudy/list`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch case studies");
    }
    const result = await response.json();

    // Handle different response formats - backend returns { status, message, data: [...] }
    let allCaseStudies = [];
    if (result.status === 'success' && Array.isArray(result.data)) {
      allCaseStudies = result.data;
    } else if (Array.isArray(result)) {
      allCaseStudies = result;
    } else if (result.data && Array.isArray(result.data)) {
      allCaseStudies = result.data;
    } else if (result.items && Array.isArray(result.items)) {
      allCaseStudies = result.items;
    }

    // Client-side pagination
    const total = allCaseStudies.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = allCaseStudies.slice(startIndex, endIndex);
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedData,
      total,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return { data: [], total: 0, currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false };
  }
}

export const getCasestudyBySlug = async (slug: string) => {
  if (!slug) {
    console.error("getCasestudyBySlug: slug is required");
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL;
  if (!apiUrl) {
    console.error("NEXT_PUBLIC_FRONTEND_API_URL is not set");
    return null;
  }

  try {
    const url = `${apiUrl}api/casestudy/slug/${slug}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // ISR: cache the published case study and regenerate hourly (or instantly
      // on edit via /api/revalidate) so the route can be statically served.
      next: { revalidate: 3600, tags: [`casestudy-${slug}`] },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || "Failed to get case study" };
      }
      throw new Error(errorData.message || "Failed to get case study");
    }

    const result = await response.json();

    // Handle different response formats - backend returns { status, message, data: {...} }
    if (result.status === 'success' && result.data) {
      return result.data;
    }
    if (result.data) {
      return result.data;
    }
    if (Array.isArray(result)) {
      return result[0] || null;
    }
    return result;
  } catch (error) {
    console.error("Error fetching case study by slug:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
};

// Public lookup of a single case study by its Mongo _id. Used by the
// /industries/[slug] page to resolve the `featuredId` chosen in the
// industry admin form.
export const getCasestudyById = async (id: string): Promise<any | null> => {
  if (!id) return null;
  const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}api/casestudy/byid/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const result = await res.json();
    if (result?.status === "success" && result?.data) return result.data;
    return result?.data ?? result ?? null;
  } catch (error) {
    console.error("Error fetching case study by id:", error);
    return null;
  }
};

export async function getCasestudyTableDataFeatured() {
  if (!process.env.NEXT_PUBLIC_FRONTEND_API_URL) {
    console.error("NEXT_PUBLIC_FRONTEND_API_URL is not defined");
    return { data: [] };
  }

  try {
    // First try to fetch featured case studies
    const featuredUrl = `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}api/casestudy/list?featured=true`;
    // console.log("Fetching featured case studies from:", featuredUrl);

    const featuredResponse = await fetch(featuredUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    let caseStudies = [];

    if (featuredResponse.ok) {
      const featuredResult = await featuredResponse.json();
      console.log("Featured case studies response:", featuredResult);

      // Handle different response formats
      if (featuredResult.status === 'success' && Array.isArray(featuredResult.data)) {
        caseStudies = featuredResult.data;
      } else if (Array.isArray(featuredResult)) {
        caseStudies = featuredResult;
      } else if (featuredResult.data && Array.isArray(featuredResult.data)) {
        caseStudies = featuredResult.data;
      }
    }

    // If no featured case studies found, fetch all case studies
    if (caseStudies.length === 0) {
      console.log("No featured case studies found, fetching all case studies...");
      const allUrl = `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}api/casestudy/list`;

      const allResponse = await fetch(allUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (allResponse.ok) {
        const allResult = await allResponse.json();
        // console.log("All case studies response:", allResult);

        if (allResult.status === 'success' && Array.isArray(allResult.data)) {
          caseStudies = allResult.data;
        } else if (Array.isArray(allResult)) {
          caseStudies = allResult;
        } else if (allResult.data && Array.isArray(allResult.data)) {
          caseStudies = allResult.data;
        }
      }
    }

    console.log("Final case studies count:", caseStudies.length);
    return { data: caseStudies };
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return { data: [] };
  }
}

