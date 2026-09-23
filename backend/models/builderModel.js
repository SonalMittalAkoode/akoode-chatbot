const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const Property = require("../models/propertyModel");

var builderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
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
builderSchema.virtual('propertylist', {
  ref: 'Property', // Make sure this matches the model name for your images schema
  localField: '_id',
  foreignField: 'builderid',
});

builderSchema.set('toObject', { virtuals: true });
builderSchema.set('toJSON', { virtuals: true });
//Export the model
module.exports = mongoose.model("Builder", builderSchema);
