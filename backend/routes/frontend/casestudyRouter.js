const express = require("express");

const {
  getCasestudy,
  getallCasestudy,
  getCasestudySlug
} = require("../../controller/frontend/casestudyCtrl");
const router = express.Router();
router.get("/byid/:id", getCasestudy);
router.get("/list", getallCasestudy);
router.get("/slug/:slug", getCasestudySlug);

module.exports = router;
