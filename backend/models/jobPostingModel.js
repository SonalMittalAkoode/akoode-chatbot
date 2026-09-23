const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  tag: { 
    type: String, 
    // required: true,
    // enum: ['Engineering', 'Design', 'Marketing', 'Sales'] 
  },
  location: { 
    type: String, 
    // required: true,
    // default: ""
  },
  description: { 
    type: String, 
    default: ""
  },
  experience: { 
    type: String, 
    // required: true 
   
  },
  salary: { 
    type: String, 
    // required: true 
    
  },
  shortDescription: {
    type: String,
    trim: true,
    default: ""
  },
  slug: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },
  deadline: { 
    type: Date, 
    required: true 
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  metatitle: {
    type: String,
    trim: true,
    default: ""
  },
  metadescription: {
    type: String,
    trim: true,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('JobPosting', jobPostingSchema);