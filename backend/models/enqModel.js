const mongoose = require("mongoose");

const enqSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, trim: true },
  phone:    { type: String, required: true, trim: true },
  message:  { type: String, default: "" },
  service:  { type: String, default: "" },
  budget:   {
    type: String,
    default: "",
    enum: {
      values: ["", "Still Evaluating", "Less than $50K", "$50K - $100K", "$100K - $250K", "More than $250K"],
      message: "{VALUE} is not a supported budget range",
    },
  },

  source: {
    pageUrl:     { type: String, default: "" },
    pageType:    { type: String, default: "" },
    market:      { type: String, default: "" },
    slug:        { type: String, default: "" },
    country:     { type: String, default: "" },
    service:     { type: String, default: "" },
    utmSource:   { type: String, default: "" },
    utmMedium:   { type: String, default: "" },
    utmCampaign: { type: String, default: "" },
    referrer:    { type: String, default: "" },
  },
}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enqSchema);
