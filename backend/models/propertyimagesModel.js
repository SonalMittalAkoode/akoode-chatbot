const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var propertyimagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      // unique: true,
      index: true,
    },
    image: {
      // type: String,
      // required: true,  
      url: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }    
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
module.exports = mongoose.model("Propertyimage", propertyimagesSchema);
