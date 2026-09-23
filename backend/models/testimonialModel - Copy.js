const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var testimonialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description:{
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    logoimage:{
      type: String,
      // required: true,
      unique: true,
      index: true,
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
module.exports = mongoose.model("Testimonial", testimonialSchema);
