// Fetches the admin-managed blog category groupings that drive /blog's pill nav +
// alternating sections, and /blog/category/[slug]'s "View All" destination. Each group's
// `categoryIds` are unioned via the backend's comma-separated `category` filter.
// `theme` alternates light/dark by position (not stored) so inserting/reordering groups
// in the admin panel never leaves two of the same theme adjacent.
export async function getCategoryGroups() {
  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:5000/admin/";
  try {
    const response = await fetch(`${apiUrl}api/blogcategorygroup`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const groups = await response.json();
    if (!Array.isArray(groups)) return [];

    return groups
      .filter((group) => group.status !== false)
      .map((group, index) => ({
        id: group.slug,
        label: group.label,
        theme: index % 2 === 0 ? "light" : "dark",
        categoryIds: (group.categoryIds || []).map((category) =>
          typeof category === "string" ? category : category._id
        ),
        heading: group.heading,
        headingAccent: group.headingAccent,
        subtitle: group.subtitle,
      }));
  } catch (error) {
    console.error("Error fetching blog category groups:", error);
    return [];
  }
}

export async function getCategoryGroupBySlug(slug) {
  const groups = await getCategoryGroups();
  return groups.find((group) => group.id === slug) || null;
}
