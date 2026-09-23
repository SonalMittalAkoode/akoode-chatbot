const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var enqSchemaProperty = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  propertyid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property", 
    required: true,
  },
  sellerid:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller", 
      required: true,
  },
//   date: {
//     type: Date,
//     required: true,
//   },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Submitted",
    enum: ["Submitted", "Contacted", "In Progress", "Resolved"],
  },
},
{
  timestamps: true,
});

//Export the model
module.exports = mongoose.model("Enquiryproperty", enqSchemaProperty);
