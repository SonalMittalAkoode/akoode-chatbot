const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var casestudychallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      index: true,
    },
    description: {
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
module.exports = mongoose.models.Casestudychallenge || mongoose.model("Casestudychallenge", casestudychallengeSchema);
