const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var propertyfloorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: true,
      // unique: true,
      index: true,
    },
    bedroom: {
      type: String,
      // required: true,      
    },
    // bathroom: {
    //   type: String,
    //   required: true,      
    // },
    price: {
      type: String,
      // required: true,      
    },
    areasize: {
      type: String,
      // required: true,      
    },
    planimageurl: {
      type: String,
      // required: true,      
    },
    description:{
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    propertyid: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Property", 
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
module.exports = mongoose.model("Propertyfloor", propertyfloorSchema);
