const Blog = require("../models/blogModel");

// Resolve the three blog cards for a country/city page's Blog section.
// Blogs picked in the admin form (blog.selectedBlogs) win; any slot left
// empty — or whose pick is unpublished/deleted — falls back to the most
// recently published blogs not already used in another slot.
// Mirrors resolveCaseStudySelection.
const resolveBlogSelection = async (blog) => {
  const selection = blog || {};
  const chosenIds = (selection.selectedBlogs || [])
    .filter(Boolean)
    .map(String)
    .slice(0, 3);

  const chosenDocs = chosenIds.length
    ? await Blog.find({ _id: { $in: chosenIds }, status: true }).lean()
    : [];
  const byId = new Map(chosenDocs.map((d) => [String(d._id), d]));

  const resolved = chosenIds.map((id) => byId.get(id) || null);
  while (resolved.length < 3) resolved.push(null);

  const missing = resolved.filter((d) => !d).length;
  if (missing > 0) {
    const fillers = await Blog.find({ status: true, _id: { $nin: chosenIds } })
      .sort({ createdAt: -1 })
      .limit(missing)
      .lean();
    for (let i = 0; i < resolved.length; i++) {
      if (!resolved[i]) resolved[i] = fillers.shift() || null;
    }
  }

  return { ...selection, selectedBlogs: resolved.filter(Boolean) };
};

module.exports = { resolveBlogSelection };
