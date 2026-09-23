const Enquiry = require("../models/enqModel");
const GeneralEnquiry = require("../models/enqjobModel");
const JobApplication = require("../models/jobApplication");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// const { enqueryContactMail } = require("../middlewares/enqueryMail");

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    // const emailsend  =await enqueryContactMail(req, res);
    const message={
      "status":"success",
      "message":"Thank you for your message. It has been sent.",
      "data":newEnquiry
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    if (!deletedEnquiry) {
      return res.status(404).json({ status: "error", message: "Enquiry not found", data: null });
    }
     const message={
      "status":"success",
      "message":"Data deleted successfully",
      "data":deletedEnquiry
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaEnquiry = await Enquiry.findById(id);
    res.json(getaEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});
const getallEnquiry = asyncHandler(async (req, res) => {
  try {
    let limit = 100;
    let skip = 1;

    if (req.query.limit) {
      limit = Number(req.query.limit) || 100;
      skip = Number(req.query.skip) || 1;
    }

    // source=contact → contact form (no budget); source=post-requirement → post requirement form (has budget)
    const source = (req.query.source || "").toLowerCase();
    const filter = {};
    if (source === "contact") {
      filter.$or = [
        { budget: { $in: [null, ""] } },
        { budget: { $exists: false } },
      ];
    } else if (source === "post-requirement") {
      filter.budget = { $exists: true, $nin: [null, ""] };
    }

    const [EnquiryList, totalCount] = await Promise.all([
      Enquiry.find(filter)
        .sort({ _id: -1 })
        .skip((skip - 1) * limit)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(filter),
    ]);

    res.status(200).json({
      items: EnquiryList,
      totalCount: totalCount,
      currentPage: skip,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    throw new Error(error);
  }
});

const buildChartData = (items, periodType, customStart, customEnd, label) => {
  const now = new Date();
  let allLabels = [];
  let groupedData = {};

  if (periodType === "weekly") {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    allLabels = dayNames;
    dayNames.forEach((day) => { groupedData[day] = 0; });

    const twelveWeeksAgo = new Date(now);
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
    twelveWeeksAgo.setHours(0, 0, 0, 0);

    items.forEach((item) => {
      const itemDate = new Date(item.createdAt || Date.now());
      if (isNaN(itemDate.getTime())) return;
      if (itemDate >= twelveWeeksAgo && itemDate <= now) {
        const dayName = itemDate.toLocaleDateString("en-US", { weekday: "long" });
        if (groupedData.hasOwnProperty(dayName)) {
          groupedData[dayName] = (groupedData[dayName] || 0) + 1;
        }
      }
    });
  } else if (periodType === "custom" && customStart && customEnd) {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayKey = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      allLabels.push(dayKey);
      groupedData[dayKey] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    items.forEach((item) => {
      const itemDate = new Date(item.createdAt || Date.now());
      if (isNaN(itemDate.getTime())) return;
      if (itemDate >= start && itemDate <= end) {
        const dayKey = itemDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        if (groupedData.hasOwnProperty(dayKey)) {
          groupedData[dayKey] = (groupedData[dayKey] || 0) + 1;
        }
      }
    });
  } else {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    allLabels = monthNames;
    monthNames.forEach((month) => { groupedData[month] = 0; });

    items.forEach((item) => {
      const itemDate = new Date(item.createdAt || Date.now());
      if (isNaN(itemDate.getTime())) return;
      const monthName = itemDate.toLocaleDateString("en-US", { month: "long" });
      if (groupedData.hasOwnProperty(monthName)) {
        groupedData[monthName] = (groupedData[monthName] || 0) + 1;
      }
    });
  }

  return {
    labels: allLabels,
    datasets: [
      {
        label,
        data: allLabels.map((labelKey) => groupedData[labelKey] || 0),
        borderColor: "#4b4d7c",
        backgroundColor: "#4b4d7c",
        fill: false,
        tension: 0.4,
      },
    ],
  };
};

const getDashboardEnquiryStats = asyncHandler(async (req, res) => {
  const type = String(req.query.type || "all").toLowerCase();
  const period = String(req.query.period || "monthly").toLowerCase();
  const startDate = String(req.query.startDate || "");
  const endDate = String(req.query.endDate || "");

  const contactFilter = {
    $or: [
      { budget: { $in: [null, ""] } },
      { budget: { $exists: false } },
    ],
  };
  const postRequirementFilter = {
    budget: { $exists: true, $nin: [null, ""] },
  };
  const labels = {
    all: "All Enquiries",
    contact: "Contact Enquiry",
    "post-requirement": "Post Requirement",
    general: "General Enquiry",
    "job-application": "Job Application",
  };

  let items = [];

  if (type === "contact") {
    items = await Enquiry.find(contactFilter).select("createdAt").lean();
  } else if (type === "post-requirement") {
    items = await Enquiry.find(postRequirementFilter).select("createdAt").lean();
  } else if (type === "general") {
    items = await GeneralEnquiry.find().select("createdAt").lean();
  } else if (type === "job-application") {
    items = await JobApplication.find().select("createdAt").lean();
  } else {
    const [contactItems, postRequirementItems, generalItems, jobApplicationItems] = await Promise.all([
      Enquiry.find(contactFilter).select("createdAt").lean(),
      Enquiry.find(postRequirementFilter).select("createdAt").lean(),
      GeneralEnquiry.find().select("createdAt").lean(),
      JobApplication.find().select("createdAt").lean(),
    ]);
    items = [...contactItems, ...postRequirementItems, ...generalItems, ...jobApplicationItems];
  }

  res.status(200).json(buildChartData(items, period, startDate, endDate, labels[type] || labels.all));
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
  getDashboardEnquiryStats,
};
