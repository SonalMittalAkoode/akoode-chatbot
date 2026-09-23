// routes/generalEnquiry.routes.js
const express = require("express");
const router = express.Router();

const { createEnquiry } = require("../../controller/frontend/enqJobCtrl");
const upload = require("../../middlewares/resumeUpload");

router.post("/enquiry", upload.single("resume"), createEnquiry);

module.exports = router;
