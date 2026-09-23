const express = require("express");
const router = express.Router();
const {
  getAllUpdatedService,
  getUpdatedServiceBySlug,
} = require("../../controller/frontend/updatedServiceCtrl");

router.get("/list", getAllUpdatedService);
router.get("/slug/:slug", getUpdatedServiceBySlug);

module.exports = router;
