const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var locationSchema = new mongoose.Schema(
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
    stateid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State", 
      required: true,
    },
    cityid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City", // 🔗 This should match the name you used in mongoose.model("City", ...)
      required: true,
    },
    locationlogoimage: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    istrending: {
      type: Boolean,
      default: true,
    },
     h1title:{
      type: String,
    },
    description:{
      type: String,
    },
    metatitle:{
      type: String,
    },
    metadescription:{
      type: String,
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
module.exports = mongoose.model("Location", locationSchema);
