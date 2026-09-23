const mongoose = require("mongoose"); // Erase if already required
const Servicesprocess = require("../models/servicesprocessModel");
const Serviceschallenge = require("./servicesserviceModel");
// Declare the Schema of the Mongo model

var servicesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    project: {
      type: String,
      // required: true,
      // unique: true,
      index: true,
    },
    abouttitle: {
      type: String,
      required: true,
    },
    aboutdescription: {
    type: String,
    // required: true,
    },
    aboutimage: {
    type: String,
    // required: true,
    },
    description:{
      type: String,
      required: true,
      // unique: true,
      index: true,
    },
    servicesimage:{
      type: String,
      // required: true,
      // unique: true,
      index: true,
    },
    logoimage:{
      type: String,
      // required: true,
      // unique: true,
      index: true,
    },
    
    challengetitle: {
        type: String,
        required: true,
    },
    challengedescription: {
    type: String,
    // required: true,
    },
    deliveredtitle: {
        type: String,
        required: true,
    },
    delivereddescription: {
    type: String,
    // required: true,
    },
    metatitle:{
      type: String,
    },
    metadescription:{
      type: String,
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

servicesSchema.virtual('processstep', {
  ref: 'Servicesprocess', // Make sure this matches the model name for your images schema
  localField: '_id',
  foreignField: 'servicesid',
});

servicesSchema.set('toObject', { virtuals: true });
servicesSchema.set('toJSON', { virtuals: true });

servicesSchema.virtual('servicestep', {
  ref: 'Servicesservice', // Make sure this matches the model name for your images schema
  localField: '_id',
  foreignField: 'servicesid',
});

servicesSchema.set('toObject', { virtuals: true });
servicesSchema.set('toJSON', { virtuals: true });

servicesSchema.virtual('challengestep', {
  ref: 'Serviceschallenge', // Make sure this matches the model name for your images schema
  localField: '_id',
  foreignField: 'servicesid',
});

servicesSchema.set('toObject', { virtuals: true });
servicesSchema.set('toJSON', { virtuals: true });
//Export the model
module.exports = mongoose.models.Services || mongoose.model("Services", servicesSchema);
