const mongoose = require("mongoose");

// Declare the Schema of the Mongo model

var blogCategoryGroupSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    // URL-safe id used both for the /blog pill-nav anchor and the /blog/cat/[slug] route.
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    categoryIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blogcategory" }],
      default: [],
    },
    heading: {
      type: String,
      required: true,
    },
    headingAccent: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    // Controls display order of the pills/sections on /blog.
    order: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("BlogCategoryGroup", blogCategoryGroupSchema);
