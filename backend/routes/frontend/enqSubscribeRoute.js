const express = require("express");
const {
  createEnquirySubscribe,
} = require("../../controller/frontend/enqSubscribeCtrl");
const router = express.Router();

router.post("/", createEnquirySubscribe);

module.exports = router;
