const express = require("express");
const router = express.Router();
const { getAllServicesTitle } = require("../../controller/frontend/SideBarFrntCtrl");

// GET ALL SERVICES (TITLE ONLY)
// This route handles /frontend/api/service/list
router.get("/", getAllServicesTitle);

module.exports = router;
