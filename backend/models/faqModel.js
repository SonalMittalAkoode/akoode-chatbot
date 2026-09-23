const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var faqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description:{
      type: String,
      required: true,
      index: true,
    },
    serviceid: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Services", 
         required: false,
         index: true,
    },
    homepage:{
        type: String,
        enum: ["", "homepage"],
        default: ""
    },
    status: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound unique index to allow same title/description for different services
// but prevent duplicates within the same service
faqSchema.index({ title: 1, serviceid: 1 }, { unique: true });
faqSchema.index({ description: 1, serviceid: 1 }, { unique: true });

//Export the model
module.exports = mongoose.model("Faq", faqSchema);
