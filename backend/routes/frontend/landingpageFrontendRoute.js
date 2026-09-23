const express = require("express");

const {
  getLandingpage,
  getallLandingpage,
  getLandingpageSlug
} = require("../../controller/frontend/landingpageCtrl.js");
const router = express.Router();
router.get("/byid/:id", getLandingpage);
router.get("/list", getallLandingpage);
router.get("/slug/:slug", getLandingpageSlug);

module.exports = router;
