const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true, 
      trim: true,
    },
    designation: {
      type: String,
      required: true, 
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    // Author-page copy — long-form bio and the pull quote on /author/[slug].
    bio: {
      type: String,
      trim: true,
    },
    quote: {
      type: String,
      trim: true,
    },
    // Controls the About Us team carousel only. `status` still governs whether
    // the record is active at all (author pages, blog author picker).
    showOnTeam: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("Employee", employeeSchema);
