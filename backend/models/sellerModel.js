const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

var sellerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    //   unique: true,
    //   index: true,
    },
    email: {
      type: String,
      required: true,
    //   unique: true,
    //   index: true,
    },
    phone: {
      type: String,
      required: true,
    //   unique: true,
    //   index: true,
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
module.exports = mongoose.model("Seller", sellerSchema);
