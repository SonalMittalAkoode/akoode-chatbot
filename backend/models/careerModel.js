const mongoose = require('mongoose');

const careerPageSchema = new mongoose.Schema({
  aboutTag: { 
    type: String, 
    default: "" 
  },
  aboutTitle: { 
    type: String, 
    required: true 
  },
  aboutDescription: { 
    type: String, 
    required: true 
  },
  aboutImage: { 
    type: String, 
    // required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('CareerPage', careerPageSchema);