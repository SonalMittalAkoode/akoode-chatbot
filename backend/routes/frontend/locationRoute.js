const express = require("express");
const {
  getLocation,
  getallLocation,
} = require("../../controller/frontend/locationCtrl.js");

const router = express.Router();

router.get("/:id", getLocation);
router.get("/", getallLocation);

module.exports = router;
