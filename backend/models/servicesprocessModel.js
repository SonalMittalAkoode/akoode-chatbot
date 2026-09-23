const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var servicesprocessSchema = new mongoose.Schema(
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

module.exports = mongoose.models.Servicesprocess || mongoose.model("Servicesprocess", servicesprocessSchema);
