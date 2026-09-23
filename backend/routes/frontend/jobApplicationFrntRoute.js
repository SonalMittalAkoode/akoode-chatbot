// routes/jobApplication.routes.js
const express = require("express");
const router = express.Router();
const uploadResume = require("../../middlewares/resumeUpload");
const { submitJobApplication } = require("../../controller/frontend/jobApplicationFrntCtrl");

router.post("/apply", uploadResume.single("resume"), submitJobApplication);

module.exports = router;
