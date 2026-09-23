const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var servicestwhatweofferSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      index: true,
    },
    title: {
      type: String,
      index: true,
    },
    description: {
      type: String,
    },
    imageurl: {
      type: String,
    },
    imagealt: {
      type: String,
      default: "",
    },
    link: {
      type: String,
    },
    servicesid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
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
module.exports = mongoose.models.Servicestwhatweoffer || mongoose.model("Servicestwhatweoffer", servicestwhatweofferSchema);

