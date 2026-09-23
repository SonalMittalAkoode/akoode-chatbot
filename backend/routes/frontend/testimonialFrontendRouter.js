const express = require("express");

const {
  getTestimonial,
  getallTestimonial,
} = require("../../controller/frontend/testimonialCtrl");
const router = express.Router();
router.get("/byid/:id", getTestimonial);
router.get("/list", getallTestimonial);

module.exports = router;
