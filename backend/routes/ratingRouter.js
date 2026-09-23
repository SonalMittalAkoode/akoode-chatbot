const express = require("express");
const {
  createRating,
  updateRating,
  deleteRating,
  getRating,
  getallRating,
} = require("../controller/ratingCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const revalidateOnWrite = require("../utils/revalidateOnWrite");
const router = express.Router();

// Purge the frontend cache tag for this content type after any successful write.
router.use(revalidateOnWrite("rating"));

router.post("/", authMiddleware, isAdmin, createRating);
router.put("/:id", authMiddleware, isAdmin, updateRating);
router.delete("/:id", authMiddleware, isAdmin, deleteRating);
router.get("/:id", getRating);
router.get("/", getallRating);

module.exports = router;

