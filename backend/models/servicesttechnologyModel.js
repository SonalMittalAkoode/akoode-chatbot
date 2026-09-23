const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var servicesttechnologySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      index: true,
    },
    description: {
      type: String,    
    },
    imageurl: {
      type: String,    
    },
    section: {
      type: String,
      enum: ["frontend", "backend", "database"],
      default: "frontend",
    },
    servicesid: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Services", 
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
module.exports = mongoose.models.Servicesttechnology || mongoose.model("Servicesttechnology", servicesttechnologySchema);
