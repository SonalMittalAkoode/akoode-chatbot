const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var stateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    countryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country", 
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
module.exports = mongoose.model("State", stateSchema);
