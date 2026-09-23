const express = require("express");
const {
  getCity,
  getallCity,
  getCityStateId,
  countPropertiesByCity,
  getCityWithLocation,
  getCityWithPropertypage,
  getByidGlimpse
} = require("../../controller/frontend/cityCtrl");
const router = express.Router();


router.get("/byid/:id", getCity);
router.get("/list", getallCity);
router.get("/bystate/:stateid", getCityStateId);
router.get("/listwithpropertcount", countPropertiesByCity);
router.get("/citywithlocation", getCityWithLocation);
router.get("/citywithpropertypage", getCityWithPropertypage);
router.get("/byidglimpse/:id", getByidGlimpse);



module.exports = router;
