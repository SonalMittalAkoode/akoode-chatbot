const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var citySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    citylogoimage: {
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
    description:{
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    stateid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State", 
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
citySchema.virtual('cityglimpse', {
  ref: 'Cityglimpse', // Make sure this matches the model name for your images schema
  localField: '_id',
  foreignField: 'cityid',
});

citySchema.set('toObject', { virtuals: true });
citySchema.set('toJSON', { virtuals: true });
//Export the model
module.exports = mongoose.model("City", citySchema);
