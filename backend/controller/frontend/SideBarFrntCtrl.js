const Services = require("../../models/servicesModel.js");
const asyncHandler = require("express-async-handler");

const getAllServicesTitle = asyncHandler(async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const page = req.query.skip ? parseInt(req.query.skip, 10) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : null;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;

    // Include `project` — admin "Services Tag"; used by /services cards & nav labels
    const baseQuery = Services.find({ status: true })
      .select("title slug _id logoimage description project")
      .sort({ createdAt: 1 });

    const [services, totalCount] = await Promise.all([
      safeLimit
        ? baseQuery
          .skip((safePage - 1) * safeLimit)
          .limit(safeLimit)
          .lean()
        : baseQuery.lean(),
      Services.countDocuments({ status: true }),
    ]);

    const response = {
      items: services,
      totalCount,
    };

    if (safeLimit) {
      response.currentPage = safePage;
      response.totalPages = Math.ceil(totalCount / safeLimit);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch services",
      error: error.message,
    });
  }
});

module.exports = {
  getAllServicesTitle,
};
