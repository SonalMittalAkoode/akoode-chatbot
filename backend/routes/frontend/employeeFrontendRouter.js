const express = require("express");
const {
  getEmployee,
  getallEmployee,
  getAuthorBySlug,
} = require("../../controller/frontend/employeeCtrl");
const router = express.Router();

router.get("/byid/:id", getEmployee);
router.get("/list", getallEmployee);
router.get("/author/:slug", getAuthorBySlug);

module.exports = router;

