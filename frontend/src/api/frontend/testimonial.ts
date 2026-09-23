import { LIST_TESTIMONIALS } from "@/lib/cacheTags";

export async function getTestimonialTableData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL || "http://localhost:5000/frontend/";
    const response = await fetch(apiUrl + "api/testimonial/list", { next: { revalidate: 60, tags: [LIST_TESTIMONIALS] } }); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch Testimonial");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Testimonial:", error);
    return []; // Return an empty array in case of an error
  }
}


// Public lookup of a single testimonial by id. The route is public (see
// backend/routes/frontend/testimonialFrontendRouter.js) so no token is
// required. Returns the testimonial record or null on failure.
export const getTestimonialById = async (id: string): Promise<any | null> => {
  if (!id) return null;
  const apiUrl = process.env.NEXT_PUBLIC_FRONTEND_API_URL;
  if (!apiUrl) return null;
  try {
    const response = await fetch(`${apiUrl}api/testimonial/byid/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const result = await response.json();
    if (result?.status === "success" && result?.data) return result.data;
    return result?.data ?? result ?? null;
  } catch (error) {
    console.error("Error fetching testimonial by id:", error);
    return null;
  }
};

