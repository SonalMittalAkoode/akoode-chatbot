const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var blogSchema = new mongoose.Schema(
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
      // unique: true,
      index: true,
    },
    logoimage:{
      type: String,
      index: true,
    },
    logoimagealt:{
      type: String,
      default: "",
    },
    blogcategory:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blogcategory", 
      required: true,
    },
    author:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    // Optional custom author name for blog posts (does not create/affect Employee records).
    authorName: {
      type: String,
      default: "",
      index: true,
    },
    source:{
      type: String,
    },
    date:{
      type: String,
    },
    tags: {
      type: [String],
      default: [],
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
    // Set once, the first time this blog transitions to published (status: true) —
    // NOT the document's createdAt. A post drafted long ago and published today
    // must sort as recent, not by its original creation date. Falls back to
    // createdAt for legacy posts published before this field existed.
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    // Incremented once per detail-page view; drives the /blog-new "Trending" ranking.
    views: {
      type: Number,
      default: 0,
      index: true,
    },
    // Set to true the first time subscribers are emailed about this blog.
    // Prevents re-notifying on later edits / draft→publish toggles.
    notifiedSubscribers: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
