const Casestudyprocess = require("../models/casestudyprocessModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const mongoose = require("mongoose");
const slugify = require("slugify");
const { processFloorPlanImages,processFloorPlanImagesGet } = require("../middlewares/uploadImage");


const createCasestudyprocess = asyncHandler(async (req, res) => {
  try {

    for(var i=0;i<req.body.floorPlans?.length;i++){
        var plandata={
            "title":req.body.floorPlans[i].title,
            "bedroom":req.body.floorPlans[i].bedroom,
            "price":req.body.floorPlans[i].price,
            "areasize":req.body.floorPlans[i].areasize,
            "description":req.body.floorPlans[i].description,
            "landingid":req.body.landingId
        }
      
        const floorPlans = [];

    // Parse text fields like floorPlans[0][title], etc.
    Object.entries(req.body).forEach(([key, value]) => {
      const match = key.match(/^floorPlans\[(\d+)]\[(\w+)]$/);
      if (match) {
        const [ , index, field ] = match;
        if (!floorPlans[index]) floorPlans[index] = {};
        floorPlans[index][field] = value;
      }
    });

    // Parse uploaded files with fieldnames like floorPlans[0][planimage]
    (req.files || []).forEach((file) => {
      const match = file.fieldname.match(/^floorPlans\[(\d+)]\[planimage]$/);
      if (match) {
        const index = parseInt(match[1]);
        if (!floorPlans[index]) floorPlans[index] = {};
        floorPlans[index].planimage = file;
      }
    });
   
    // Now process each floor plan image
    for (let i = 0; i < floorPlans.length; i++) {
      const plan = floorPlans[i];

      if (plan) {
        console.log("Resizing image for floorPlan", i);

        const processedImages = await processFloorPlanImages(plan); // assuming this accepts a single file
        if (processedImages.length > 0) {
            plandata.planimageurl = `${processedImages[0].url}`;
        }
      }
    }
        console.log("plandata plandata")
        console.log(plandata)
        const newCasestudyprocess = await Casestudyprocess.create(plandata);
      }
    
      for(var i=0;i<req.body.floorPlansget?.length;i++){
        var plandata={
            "title":req.body.floorPlansget[i].title,
            "bedroom":req.body.floorPlansget[i].bedroom,
            "price":req.body.floorPlansget[i].price,
            "areasize":req.body.floorPlansget[i].areasize,
            "description":req.body.floorPlansget[i].description,
            "landingid":req.body.landingId
        }
       

        const floorPlansget = [];

        // Parse text fields like floorPlans[0][title], etc.
        Object.entries(req.body).forEach(([key, value]) => {
          const match = key.match(/^floorPlansget\[(\d+)]\[(\w+)]$/);
          if (match) {
            const [ , index, field ] = match;
            if (!floorPlansget[index]) floorPlansget[index] = {};
            floorPlansget[index][field] = value;
          }
        });
    
        // Parse uploaded files with fieldnames like floorPlans[0][planimage]
        (req.files || []).forEach((file) => {
          const match = file.fieldname.match(/^floorPlansget\[(\d+)]\[planimageget]$/);
          if (match) {
            const index = parseInt(match[1]);
            if (!floorPlansget[index]) floorPlansget[index] = {};
            floorPlansget[index].planimageget = file;
          }
        });
        // console.log("floorPlans floorPlans")
        // console.log(floorPlans)
        // Now process each floor plan image
        for (let i = 0; i < floorPlansget.length; i++) {
          const plan = floorPlansget[i];
    
          if (plan) {
            console.log("Resizing image for floorPlan", i);
    
            const processedImages = await processFloorPlanImagesGet(plan); // assuming this accepts a single file
            if (processedImages.length > 0) {
                plandata.planimageurl = `${processedImages[0].url}`;
            }
          }
        }

        const updatedCasestudyprocess = await Casestudyprocess.findByIdAndUpdate(req.body.floorPlansget[i].planid, plandata, {
            new: true,
          });
    }
    //res.json(newLanding);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
    //   "data":newCasestudyprocess
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateCasestudyprocess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    const updatedCasestudyprocess = await Casestudyprocess.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedCasestudyprocess
    }
    res.json(message);
    // res.json(updatedLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCasestudyprocess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedCasestudyprocess = await Casestudyprocess.findByIdAndDelete(id);
    if (!deletedCasestudyprocess) {
      return res.status(404).json({ status: "error", message: "Case study process not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data deleted successfully",
      "data":deletedCasestudyprocess
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getCasestudyprocess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getCasestudyprocess = await Casestudyprocess.findById(id);
    if (!getCasestudyprocess) {
      return res.status(404).json({ status: "error", message: "Case study process not found", data: null });
    }
    const message={
      "status":"success",
      "message":"Data fetched successfully",
      "data":getCasestudyprocess
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const getallCasestudyprocess = asyncHandler(async (req, res) => {
  try {
    const getallCasestudyprocess = await Casestudyprocess.find().populate("cityid").populate("categoryid");
    res.json(getallCasestudyprocess);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
createCasestudyprocess,
  updateCasestudyprocess,
  deleteCasestudyprocess,
  getCasestudyprocess,
  getallCasestudyprocess,
};
