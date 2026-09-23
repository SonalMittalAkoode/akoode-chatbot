const express = require("express");
const router = express.Router();
const {
  getServiceByCountry,
  getAllServiceByCountry,
  getServiceByCountrySlug,
} = require("../../controller/frontend/serviceByCountryCtrl");

router.get("/list", getAllServiceByCountry);
router.get("/slug/:slug", getServiceByCountrySlug);
router.get("/byid/:id", getServiceByCountry);

module.exports = router;
