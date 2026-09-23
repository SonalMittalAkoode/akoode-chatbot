import { LIST_VIDEOS } from "@/lib/cacheTags";

export async function getVideoTableData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}api/video`,
      { next: { revalidate: 60, tags: [LIST_VIDEOS] } }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }
    const data = await response.json();
    // Handle response structure
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

