// models/JobApplication.js
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPosting",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    default: ""
  },
  resume: {
    type: String,
    required: true
  },
  linkedin: {
    type: String,
    default: ""
  },
  source: {
    type: String,
    enum: [
      "LinkedIn",
      "Indeed",
      "Google/Bing",
      "Company Website",
      "Employee Referral",
      "Social Media",
      "Other",
      ""
    ],
    default: ""
  },
  referralName: {
    type: String,
    default: ""
  },
  referralDepartment: {
    type: String,
    default: ""
  },
  consent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
