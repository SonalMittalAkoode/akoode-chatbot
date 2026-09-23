const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createUpdatedService,
  updateUpdatedService,
  deleteUpdatedService,
  getUpdatedService,
  getAllUpdatedService,
} = require("../controller/updatedServiceCtrl");

// JSON body (no file uploads — images stay as static front-end assets).
router.post("/", authMiddleware, isAdmin, createUpdatedService);
router.put("/:id", authMiddleware, isAdmin, updateUpdatedService);
router.delete("/:id", authMiddleware, isAdmin, deleteUpdatedService);
router.get("/:id", getUpdatedService);
router.get("/", getAllUpdatedService);

module.exports = router;
