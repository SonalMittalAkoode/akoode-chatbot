const express = require("express");
const { getActiveImages } = require("../../controller/lifeAtAkoodeImageCtrl");
const router = express.Router();

router.get("/", getActiveImages);

module.exports = router;
