const mongoose = require("mongoose"); // Erase if already required
const Propertyimage = require("../models/propertyimagesModel");
const Propertyfloor = require("../models/propertyfloorModel");

// Declare the Schema of the Mongo model
var propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      // unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      // unique: true,
      // index: true,
    },
    description: {
      type: String,
      required: true,
      // unique: true,
      // index: true,
    },
    highlights: {
      type: String,
      
    },
    price: {
      type: String,
      required: true,
      // unique: true,
      // index: true,
    },
    pricesqft: {
      type: Number,
      required: true,
      // unique: true,
      // index: true,
    },
    countryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country", 
      // required: true,
    },
    stateid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State", 
      // required: true,
    },
    cityid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City", // 🔗 This should match the name you used in mongoose.model("City", ...)
      // required: true,
    },
    locationid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location", // 🔗 This should match the name you used in mongoose.model("City", ...)
      // required: true,
    },
    address: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    zipcode: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    areasize: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },    
    sizeprefix: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    bedrooms: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    bathrooms: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    garages: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    garagessize: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    yearbuild: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    mapembedcode: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    videoembedcode: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    nearby: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    specifications: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    sellername: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    selleremail: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    sellerphone: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    propertytypeid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Propertytype", // 🔗 This should match the name you used in mongoose.model("Propertytype", ...)
      // required: true,
    },
    builderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Builder", // 🔗 This should match the name you used in mongoose.model("Builder", ...)
      // required: true,
    },
    sellerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller", // 🔗 This should match the name you used in mongoose.model("Builder", ...)
      // required: true,
    },
    agentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent", // 🔗 This should match the name you used in mongoose.model("Agent", ...)
      // required: true,
    },
    amenityid: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity", // 🔗 This should match the name you used in mongoose.model("Amenity", ...)
      // required: true,
    }],
    categoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // 🔗 This should match the name you used in mongoose.model("Category", ...)
      // required: true,
    },
    constructionstatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constructionstatus", // 🔗 This should match the name you used in mongoose.model("Category", ...)
      // required: true,
    },
    furnishingstatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Furnishingstatus", // 🔗 This should match the name you used in mongoose.model("Category", ...)
      // required: true,
    },
    reraapproved: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    reranumber: {
      type: String,
      // index: true,
    },
    featuredproperty: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    hotproperty: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    propertyid: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    type: {
      type: String,
      // required: true,
      // unique: true,
      // index: true,
      default: "buy",
    },
    // featuredimageurl:{
    //   type: String,
    //   // required: true,
    //   // unique: true,
    //   // index: true,
    // },
    // siteplanurl:{
    //   type: String,
    //   // required: true,
    //   // unique: true,
    //   // index: true,
    // },
    featuredimageurl: {
      url: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
     siteplanurl: {
      url: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    paymentplan:{
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    foodcourt:{
      type: Boolean,
      default: false
      // required: true,
      // unique: true,
      // index: true,
    },
    multiplex:{
      type: Boolean,
      default: false
      // required: true,
      // unique: true,
      // index: true,
    },
    masterplanurl:{
      // type: String,
      // // required: true,
      // // unique: true,
      // // index: true,
      url: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    brochurepdf:{
      type: String,
    },
    propertyimageurl:[{
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    }],
    metatitle:{
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    metadescription:{
      type: String,
      // required: true,
      // unique: true,
      // index: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    admin_approve: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.virtual('images', {
  ref: 'Propertyimage', // Make sure this matches the model name for your images schema
  localField: '_id',
  foreignField: 'propertyid',
});

propertySchema.set('toObject', { virtuals: true });
propertySchema.set('toJSON', { virtuals: true });


propertySchema.virtual('floorplan', {
  ref: 'Propertyfloor', // Make sure this matches the model name for your images schema
  localField: '_id',
  foreignField: 'propertyid',
});

propertySchema.set('toObject', { virtuals: true });
propertySchema.set('toJSON', { virtuals: true });
//Export the model
module.exports = mongoose.model("Property", propertySchema);


