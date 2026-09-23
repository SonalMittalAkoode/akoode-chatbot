const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var casestudyprocessSchema = new mongoose.Schema(
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
    casestudyid: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Casestudy", 
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

module.exports = mongoose.models.Casestudyprocess || mongoose.model("Casestudyprocess", casestudyprocessSchema);
