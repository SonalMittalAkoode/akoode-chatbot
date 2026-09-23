const mongoose = require("mongoose"); // Erase if already required
const Servicesprocess = require("./servicesprocessModel");
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
    abouttag: {
      type: String,
      // required: true,
    },
    aboutdescription: {
    type: String,
    // required: true,
    },
    aboutimage: {
    type: String,
    // required: true,
    },
    aboutimagealt: {
      type: String,
      default: "",
    },
    featuredService: {
      type: Boolean,
      default: false,
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
    servicesimagealt: {
      type: String,
      default: "",
    },
    logoimage:{
      type: String,
      // required: true,
      // unique: true,
      index: true,
    },
    logoimagealt: {
      type: String,
      default: "",
    },
    serviceshow: {
      type: Boolean,
      default: false,
  },
    servicetitle: {
        type: String,
        // required: true,
    },
    servicedescription: {
    type: String,
    // required: true,
    },   
   
    // resultstitle: {
    //     type: String,
    //     required: true,
    // },
    // resultsdescription: {
    // type: String,
    // // required: true,
    // },
    technologyhow: {
      type: Boolean,
      default: false,
  },
    technologytitle: {
        type: String,
        // required: true,
    },
    technologydescription: {
    type: String,
    // required: true,
    },
    frontendtechnologyhow: {
      type: Boolean,
      default: false,
    },
    frontendtechnologytitle: {
      type: String,
    },
    frontendtechnologydescription: {
      type: String,
    },
    frontendtechnologyimage: {
      type: String,
    },
    frontendtechnologyimagealt: {
      type: String,
      default: "",
    },
    backendtechnologyhow: {
      type: Boolean,
      default: false,
    },
    backendtechnologytitle: {
      type: String,
    },
    backendtechnologydescription: {
      type: String,
    },
    backendtechnologyimage: {
      type: String,
    },
    backendtechnologyimagealt: {
      type: String,
      default: "",
    },
    databasetechnologyhow: {
      type: Boolean,
      default: false,
    },
    databasetechnologytitle: {
      type: String,
    },
    databasetechnologydescription: {
      type: String,
    },
    databasetechnologyimage: {
      type: String,
    },
    databasetechnologyimagealt: {
      type: String,
      default: "",
    },
    industryhow: {
      type: Boolean,
      default: false,
  },
    industrytitle: {
        type: String,
        // required: true,
    },
    industrydescription: {
    type: String,
    // required: true,
    },
    whatweofferhow: {
      type: Boolean,
      default: false,
    },
    whatweoffertitle: {
        type: String,
        // required: true,
    },
    whatweofferdescription: {
    type: String,
    // required: true,
    },

    peoplehow: {
      type: Boolean,
      default: false,
  },
  peopletitle: {
      type: String,
      // required: true,
    },
    peopledescription: {
    type: String,
    // required: true,
    },
    peopleimage: {
    type: String,
    // required: true,
    },
    peopleimagealt: {
      type: String,
      default: "",
    },
    teamServiceshow: {
      type: Boolean,
      default: false,
  },
  teamServicesTitle: {
      type: String,
      // required: true,
    },
  teamServicesSubTitle: {
    type: String,
    // required: true,
    },
  teamServicesDescription: {
    type: String,
    // required: true,
    },
    scrollSpyNavShow: {
      type: Boolean,
      default: false,
    },
    scrollSpyNavSections: {
      type: [
        {
          id: String,
          title: String,
        }
      ],
      default: [],
    },
    customSoftwareShow: {
      type: Boolean,
      default: false,
    },
    customSoftwareTitle: {
      type: String,
    },
    customSoftwareDescription: {
      type: String,
    },
    customSoftwareImage: {
      type: String,
    },
    customsoftwareimagealt: {
      type: String,
      default: "",
    },
    customSoftwareSteps: {
      type: [
        {
          icon: String,
          iconAlt: String,
          title: String,
          description: String,
        }
      ],
      default: [],
    },
    faqs: {
      type: [
        {
          title: String,
          description: String,
          order: {
            type: Number,
            default: 0,
          },
          status: {
            type: Boolean,
            default: true,
          },
        },
      ],
      default: [],
    },
    serviceSectionShow: {
      type: Boolean,
      default: false,
    },
    serviceSectionTitle: {
      type: String,
    },
    serviceSectionDescription: {
      type: String,
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
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
      default: null,
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



servicesSchema.virtual('technologystep', {
  ref: 'Servicesttechnology', // Make sure this matches the model name for your images schema
  localField: '_id',
  foreignField: 'servicesid',
});
servicesSchema.set('toObject', { virtuals: true });
servicesSchema.set('toJSON', { virtuals: true });
servicesSchema.virtual('servicestep', {
  ref: 'Servicesservice',
  localField: '_id',
  foreignField: 'servicesid',
});

servicesSchema.set('toObject', { virtuals: true });
servicesSchema.set('toJSON', { virtuals: true });

servicesSchema.virtual('industrystep', {
  ref: 'Servicestindustry',
  localField: '_id',
  foreignField: 'servicesid',
});

servicesSchema.set('toObject', { virtuals: true });
servicesSchema.set('toJSON', { virtuals: true });

servicesSchema.virtual('whatweofferstep', {
  ref: 'Servicestwhatweoffer',
  localField: '_id',
  foreignField: 'servicesid',
});

servicesSchema.set('toObject', { virtuals: true });
servicesSchema.set('toJSON', { virtuals: true });
//Export the model
module.exports = mongoose.models.Services || mongoose.model("Services", servicesSchema);
