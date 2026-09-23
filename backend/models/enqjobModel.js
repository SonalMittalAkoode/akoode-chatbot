// models/GeneralEnquiry.js
const mongoose = require('mongoose');

const generalEnquirySchema = new mongoose.Schema({
  fullName: {
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
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  noticePeriod: {
    type: String,
    default: ""
  },
  currentCTC: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    default: ""
  },
  resume: {
    type: String, // storing file path
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('GeneralEnquiry', generalEnquirySchema);
