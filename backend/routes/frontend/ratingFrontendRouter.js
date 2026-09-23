const express = require("express");
const { getallRating } = require("../../controller/frontend/ratingCtrl");
const router = express.Router();

router.get("/list", getallRating);

module.exports = router;

