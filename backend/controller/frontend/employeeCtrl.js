const Employee = require("../../models/employeeModel");
const Blog = require("../../models/blogModel");
const asyncHandler = require("express-async-handler");

// Author URLs are derived from the employee name (no stored slug), so the same
// transform has to exist on both ends — keep in sync with frontend authorSlug.js.
const toAuthorSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    res.json(employee);
  } catch (error) {
    throw new Error(error);
  }
});

const getallEmployee = asyncHandler(async (req, res) => {
  try {
    // Powers the About Us team carousel, so employees flagged off the team are
    // excluded by default. $ne: false keeps records saved before the flag existed.
    // Pass ?includeHidden=true for a complete active-employee list.
    const filter = { status: true };
    if (req.query?.includeHidden !== "true") {
      filter.showOnTeam = { $ne: false };
    }
    // Sorted by priority (ascending) then by creation date
    const employees = await Employee.find(filter).sort({ priority: 1, createdAt: -1 });
    res.json(employees);
  } catch (error) {
    throw new Error(error);
  }
});

// Author profile page: the employee plus every published post they wrote.
const getAuthorBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const wanted = toAuthorSlug(slug);
    if (!wanted) {
      return res.status(404).json({ status: "error", message: "Author not found", data: null });
    }

    // The collection is small (staff list), so matching on the derived slug in
    // memory is cheaper than maintaining a stored slug + migration.
    const employees = await Employee.find({ status: true }).lean();
    const author = employees.find((emp) => toAuthorSlug(emp.name) === wanted);

    if (!author) {
      return res.status(404).json({ status: "error", message: "Author not found", data: null });
    }

    const blogs = await Blog.find({ status: true, author: author._id })
      .populate("blogcategory")
      .select("title slug logoimage logoimagealt blogcategory date publishedAt createdAt metadescription description")
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    res.json({
      status: "success",
      message: "Data fetched successfully",
      data: { author, blogs },
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getEmployee,
  getallEmployee,
  getAuthorBySlug,
};
