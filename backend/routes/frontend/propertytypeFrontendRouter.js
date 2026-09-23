const express = require("express");
const {
  getPropertytype,
  getallPropertytype,
  getPropertytypeCategoryId,
  countPropertiesByType
} = require("../../controller/frontend/propertytypeCtrl.js");
const router = express.Router();

router.get("/byid/:id", getPropertytype);
router.get("/", getallPropertytype);
router.get("/bycategory/:categoryid", getPropertytypeCategoryId);
router.get("/listwithpropertcount", countPropertiesByType);

module.exports = router;
