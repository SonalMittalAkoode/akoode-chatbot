// controllers/frontendJobs.controller.js
const JobPosting = require('../../models/jobPostingModel');

// Get Active + Non-Expired jobs for Website UI (with pagination)
const getFrontendJobs = async (req, res) => {
  try {
    // page & limit from query params
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 3;

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    // Expired jobs stay listed (the detail page keeps showing the JD and simply
    // closes the application form); only isActive controls visibility.
    const filter = {
      isActive: true,
    };

    const [jobs, total] = await Promise.all([
      JobPosting.find(filter)
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limit),
      JobPosting.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: jobs,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Job by Slug
const getJobBySlug = async (req, res) => {
  try {
    // Expired jobs remain reachable so the JD stays visible; the frontend closes
    // the application form once the deadline has passed.
    const job = await JobPosting.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getFrontendJobs, getJobBySlug };
