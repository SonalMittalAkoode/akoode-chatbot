const Serviceschallenge = require("../models/serviceschallengeModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const mongoose = require("mongoose");
const slugify = require("slugify");
const { challengeFloorPlanImages,challengeFloorPlanImagesGet } = require("../middlewares/uploadImage");


const createServiceschallenge = asyncHandler(async (req, res) => {
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
   
    // Now challenge each floor plan image
    for (let i = 0; i < floorPlans.length; i++) {
      const plan = floorPlans[i];

      if (plan) {
        console.log("Resizing image for floorPlan", i);

        const challengeedImages = await challengeFloorPlanImages(plan); // assuming this accepts a single file
        if (challengeedImages.length > 0) {
            plandata.planimageurl = `${challengeedImages[0].url}`;
        }
      }
    }
        console.log("plandata plandata")
        console.log(plandata)
        const newServiceschallenge = await Serviceschallenge.create(plandata);
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
        // Now challenge each floor plan image
        for (let i = 0; i < floorPlansget.length; i++) {
          const plan = floorPlansget[i];
    
          if (plan) {
            console.log("Resizing image for floorPlan", i);
    
            const challengeedImages = await challengeFloorPlanImagesGet(plan); // assuming this accepts a single file
            if (challengeedImages.length > 0) {
                plandata.planimageurl = `${challengeedImages[0].url}`;
            }
          }
        }

        const updatedServiceschallenge = await Serviceschallenge.findByIdAndUpdate(req.body.floorPlansget[i].planid, plandata, {
            new: true,
          });
    }
    //res.json(newLanding);
    const message={
      "status":"success",
      "message":"Data Add sucessfully",
    //   "data":newServiceschallenge
    }
    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});
const updateServiceschallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    req.body.slug  = slugify(req.body.slug.toLowerCase());
    const updatedServiceschallenge = await Serviceschallenge.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const message={
      "status":"success",
      "message":"Data updated sucessfully",
      "data":updatedServiceschallenge
    }
    res.json(message);
    // res.json(updatedLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteServiceschallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedServiceschallenge = await Serviceschallenge.findByIdAndDelete(id);
    const message={
      "status":"success",
      "message":"Data deleted sucessfully",
      "data":deletedServiceschallenge
    }
    res.json(message);
    // res.json(deletedLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const getServiceschallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getServiceschallenge = await Serviceschallenge.findById(id);
    const message={
      "status":"success",
      "message":"Data deleted sucessfully",
      "data":getServiceschallenge
    }
    res.json(message);
    // res.json(getaLandingpage);
  } catch (error) {
    throw new Error(error);
  }
});
const getallServiceschallenge = asyncHandler(async (req, res) => {
  try {
    const getallServiceschallenge = await Serviceschallenge.find().populate("cityid").populate("categoryid");
    res.json(getallServiceschallenge);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
createServiceschallenge,
  updateServiceschallenge,
  deleteServiceschallenge,
  getServiceschallenge,
  getallServiceschallenge,
};
