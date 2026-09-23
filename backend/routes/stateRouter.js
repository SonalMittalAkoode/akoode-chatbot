const express = require("express");
const {
  createState,
  updateState,
  deleteState,
  getState,
  getallState,
  getStateCountryId,
} = require("../controller/stateCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createState);
router.put("/:id", authMiddleware, isAdmin, updateState);
router.delete("/:id", authMiddleware, isAdmin, deleteState);
router.get("/byid/:id", getState);
router.get("/", getallState);
router.get("/bycountry/:countryid", getStateCountryId);

module.exports = router;
