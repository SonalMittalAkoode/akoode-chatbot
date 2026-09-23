const JobPosting = require('../models/jobPostingModel');
const slugify = require('slugify');
const EnquirySubscribe = require('../models/enqSubscribeModel');
const { jobNotificationSubscriberMail } = require('../middlewares/enqueryMail');
const revalidateFrontend = require('../utils/revalidateFrontend');

const notifySubscribersForJob = async (job) => {
  try {
    const activeSubscribers = await EnquirySubscribe.find({ active: true }).lean();
    if (activeSubscribers.length > 0) {
      await jobNotificationSubscriberMail({ job, subscribers: activeSubscribers });
    }
  } catch (err) {
    console.error("Failed to notify subscribers for job posting:", err);
  }
};

// Helper function to generate unique slug
const generateUniqueSlug = async (title, existingId = null) => {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (existingId) {
      query._id = { $ne: existingId };
    }
    const existing = await JobPosting.findOne(query);
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

const JOB_FIELDS = [
  'title', 'slug', 'tag', 'location', 'shortDescription',
  'description', 'experience', 'salary', 'deadline',
  'isActive', 'metatitle', 'metadescription',
];

const pickJobFields = (body) => {
  const result = {};
  for (const key of JOB_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
};

// Create Job
const createJob = async (req, res) => {
  try {
    let payload = pickJobFields(req.body);

    // Auto-generate slug from title if not provided
    if (!payload.slug && payload.title) {
      payload.slug = await generateUniqueSlug(payload.title);
    } else if (payload.slug) {
      payload.slug = slugify(payload.slug, { lower: true, strict: true });
      // Ensure uniqueness
      payload.slug = await generateUniqueSlug(payload.slug);
    }

    // Note: past-deadline jobs are NOT auto-deactivated — expired postings stay
    // listed (JD visible, applications closed on the detail page). isActive is a
    // manual admin toggle only.

    const job = await JobPosting.create(payload);

    revalidateFrontend({ slug: job.slug, type: 'job' }).catch(() => {});

    if (job.isActive) {
      notifySubscribersForJob(job);
    }

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getJobs = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // "active" | "inactive" (optional)
    const sortField = req.query.sortField;

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const filter = {};
    // Optional filter by isActive for admin list
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const sortOptions = (() => {
      if (sortField === "location") return { location: 1 };
      if (sortField === "experience") return { experience: 1 };
      if (sortField === "deadline") return { deadline: 1 };
      return { createdAt: -1 };
    })();

    const [jobs, total] = await Promise.all([
      JobPosting.find(filter)
        .sort(sortOptions)
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

// Get Job by ID
const getJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const existingJob = await JobPosting.findById(req.params.id);
    if (!existingJob) return res.status(404).json({ error: 'Not found' });

    const payload = pickJobFields(req.body);

    // Auto-generate slug from title if title changed and slug not provided
    if (payload.title && !payload.slug) {
      payload.slug = await generateUniqueSlug(payload.title, req.params.id);
    } else if (payload.slug) {
      payload.slug = slugify(payload.slug, { lower: true, strict: true });
      // Ensure uniqueness (excluding current job)
      payload.slug = await generateUniqueSlug(payload.slug, req.params.id);
    }

    // Past-deadline jobs are intentionally left active so they stay listed with
    // the JD visible; the detail page closes the application form instead.

    const wasInactive = !existingJob.isActive;

    const job = await JobPosting.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    );

    revalidateFrontend({
      slug: job.slug,
      oldSlug: existingJob.slug,
      type: 'job',
    }).catch(() => {});

    // Notify when job becomes active (either newly activated or created active)
    if (wasInactive && job.isActive) {
      notifySubscribersForJob(job);
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });
    revalidateFrontend({ slug: job.slug, type: 'job' }).catch(() => {});
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const toggleJobActive = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });

    const wasInactive = !job.isActive;
    job.isActive = !job.isActive;
    await job.save();

    revalidateFrontend({ slug: job.slug, type: 'job' }).catch(() => {});

    if (wasInactive && job.isActive) {
      notifySubscribersForJob(job);
    }

    res.json({
      message: 'Job status updated',
      isActive: job.isActive,
      job,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  toggleJobActive,
};
