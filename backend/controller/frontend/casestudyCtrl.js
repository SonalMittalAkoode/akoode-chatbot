const Casestudy = require("../../models/casestudyModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../../utils/validateMongodbId");

const getCasestudy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaCasestudy = await Casestudy.findById(id).lean();
    if (!getaCasestudy) {
      return res.status(404).json({ status: "error", message: "Case study not found", data: null });
    }
    const message = {
      "status": "success",
      "message": "Data fetched successfully",
      "data": getaCasestudy
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallCasestudy = asyncHandler(async (req, res) => {
  try {
    let query = {};
    query["status"] = true;

    if (req.query.featured) {
      // Convert string "true" to boolean true
      query["featured"] = req.query.featured === "true" || req.query.featured === true;
    }

    // Always return newest case studies first (pagination + UI ordering depends on this).
    const getallCasestudy = await Casestudy.find(query)
      .sort({ createdAt: -1 })
      .lean();
    const message = {
      "status": "success",
      "message": "Data fetched successfully",
      "data": getallCasestudy
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getCasestudySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  // validateMongoDbId(id);
  try {
    const getaCasestudy = await Casestudy.findOne({ slug: slug, status: true })
      .populate('processstep')
      .populate('challengestep')
      .lean();
    if (!getaCasestudy) {
      return res.status(404).json({ status: "error", message: "Case study not found", data: null });
    }
    const message = {
      "status": "success",
      "message": "Data fetched successfully",
      "data": getaCasestudy
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getCasestudy,
  getallCasestudy,
  getCasestudySlug
};
