const express = require("express");
const {
  getFaq,
  getallFaq,
  getFaqPropertId
} = require("../../controller/frontend/faqCtrl");
const router = express.Router();


router.get("/byid/:id", getFaq);
router.get("/list", getallFaq);
router.get("/byproperty/:propertyid", getFaqPropertId);




module.exports = router;
