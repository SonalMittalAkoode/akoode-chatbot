const express = require("express");
const {
  createSeller,
  updateSeller,
  deleteSeller,
  getSeller,
  getallSeller,
} = require("../controller/sellerCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createSeller);
router.put("/:id", authMiddleware, isAdmin, updateSeller);
router.delete("/:id", authMiddleware, isAdmin, deleteSeller);
router.get("/:id", getSeller);
router.get("/", getallSeller);

module.exports = router;
