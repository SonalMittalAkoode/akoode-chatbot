const Faq = require("../models/faqModel");
const Services = require("../models/servicesModel");
const asyncHandler = require("express-async-handler");

/** Service titles may contain HTML; plain regex on DB text fails when tags sit between words (e.g. "Artificial" + <span> + "Intelligence"). */
const stripHtmlForSearch = (value) =>
  String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const validateMongoDbId = require("../utils/validateMongodbId");

const createFaq = asyncHandler(async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || req.body.title.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Title is required"
      });
    }

    if (!req.body.description || req.body.description.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Description is required"
      });
    }

    // Validate homepage if provided (should be "homepage" or empty string)
    if (req.body.homepage && req.body.homepage !== "" && req.body.homepage !== "homepage") {
      return res.status(400).json({
        status: "error",
        message: "homepage must be either empty string or 'homepage'"
      });
    }

    const newFaq = await Faq.create(req.body);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
      "data":newFaq
    }
    res.json(message);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: "error",
        message: errors.join(", ")
      });
    }
    // Handle duplicate key errors (compound unique index)
    if (error.code === 11000) {
      const keyPattern = error.keyPattern || {};
      if (keyPattern.title && keyPattern.serviceid) {
        return res.status(400).json({
          status: "error",
          message: "A FAQ with this title already exists for this service"
        });
      }
      if (keyPattern.description && keyPattern.serviceid) {
        return res.status(400).json({
          status: "error",
          message: "A FAQ with this description already exists for this service"
        });
      }
      const field = Object.keys(keyPattern)[0];
      return res.status(400).json({
        status: "error",
        message: `${field} already exists`
      });
    }
    // Handle other errors
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to create FAQ"
    });
  }
});
const updateFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
     const updatedFaq = await Faq.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedFaq
    }
    res.json(message);
    // res.json(updatedFaq);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: "error",
        message: errors.join(", ")
      });
    }
    // Handle duplicate key errors (compound unique index)
    if (error.code === 11000) {
      const keyPattern = error.keyPattern || {};
      if (keyPattern.title && keyPattern.serviceid) {
        return res.status(400).json({
          status: "error",
          message: "A FAQ with this title already exists for this service"
        });
      }
      if (keyPattern.description && keyPattern.serviceid) {
        return res.status(400).json({
          status: "error",
          message: "A FAQ with this description already exists for this service"
        });
      }
      const field = Object.keys(keyPattern)[0];
      return res.status(400).json({
        status: "error",
        message: `${field} already exists`
      });
    }
    // Handle other errors
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to update FAQ"
    });
  }
});
const deleteFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedFaq = await Faq.findByIdAndDelete(id);
    if (!deletedFaq) {
      return res.status(404).json({ status: "error", message: "FAQ not found", data: null });
    }

    const message={
      "status":"success",
      "message":"Data deleted successfully",
      "data":deletedFaq
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaFaq= await Faq.findById(id);
    if (!getaFaq) {
      return res.status(404).json({ status: "error", message: "FAQ not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data fetched successfully",
      "data":getaFaq
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallFaq = asyncHandler(async (req, res) => {
  try {
    // const getallFaq = await Faq.find();
    // res.json(getallFaq);
    let limit=100;
        let skip=1;
        
    
        if (req.query.limit ) {
          limit=req.query.limit;
          skip=req.query.skip;     
      }

        const q = String(req.query.q || "").trim();
        let match = {};
        if (req.query.serviceid) {
          match.serviceid = req.query.serviceid;
        }
        if (q) {
          const qLower = q.toLowerCase();
          const allServices = await Services.find({})
            .select("title _id")
            .lean();
          const serviceIds = allServices
            .filter((s) =>
              stripHtmlForSearch(s.title).toLowerCase().includes(qLower)
            )
            .map((s) => s._id);
          if (serviceIds.length === 0) {
            return res.status(200).json({
              items: [],
              totalCount: 0,
              currentPage: skip,
              totalPages: 0,
            });
          }
          match = { serviceid: { $in: serviceIds } };
        }

        const [propertyList, totalCount] = await Promise.all([
                  Faq.find(match)
                    .populate('serviceid', 'title')
                    .sort({ order: 1, _id: 1 })
                    .skip((skip - 1) * limit)
                    .limit(limit)
                    .lean(),
                
                  Faq.countDocuments(match)
                ]);
                // propertyList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                // console.log(propertyList)
                res.status(200).json({
                  items: propertyList,
                  totalCount: totalCount,
                  currentPage: skip,
                  totalPages: Math.ceil(totalCount / limit)
                });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createFaq,
  updateFaq,
  deleteFaq,
  getFaq,
  getallFaq,
};
