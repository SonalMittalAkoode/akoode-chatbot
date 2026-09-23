const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    embedCode: {
      type: String, // your iframe embed HTML
      required: true,
      trim: true,
    },
    image: {
      type: String, 
    //   required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
