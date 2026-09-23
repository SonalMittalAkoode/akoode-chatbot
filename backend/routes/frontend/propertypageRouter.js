const express = require("express");

const {
  getPropertyPage,
  getallPropertyPage,
  getPropertyPageSlug
} = require("../../controller/frontend/propertypageCtrl.js");
const router = express.Router();
router.get("/byid/:id", getPropertyPage);
router.get("/list", getallPropertyPage);
router.get("/slug/:slug", getPropertyPageSlug);

module.exports = router;
