const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var propertytypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    categoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // 🔗 This should match the name you used in mongoose.model("City", ...)
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
module.exports = mongoose.model("Propertytype", propertytypeSchema);
