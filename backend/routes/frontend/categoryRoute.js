const express = require("express");
const {
  getCategory,
  getallCategory,
} = require("../../controller/frontend/categoryCtrl.js");

const router = express.Router();

router.get("/:id", getCategory);
router.get("/", getallCategory);

module.exports = router;
