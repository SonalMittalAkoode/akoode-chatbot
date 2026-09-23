const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var landingfloorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      index: true,
    },
    areasize: {
      type: String,    
    },
    planimageurl: {
      type: String,     
    },
    landingpageid: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Landingpage", 
         required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Landingfloor", landingfloorSchema);
