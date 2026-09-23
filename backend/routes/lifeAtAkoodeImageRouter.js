const express = require("express");
const {
    createImage,
    getAllImages,
    getImage,
    updateImage,
    deleteImage,
} = require("../controller/lifeAtAkoodeImageCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/uploadImage");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, uploadPhoto.single("image"), createImage);
router.get("/", authMiddleware, isAdmin, getAllImages);
router.get("/:id", authMiddleware, isAdmin, getImage);
router.put("/:id", authMiddleware, isAdmin, uploadPhoto.single("image"), updateImage);
router.delete("/:id", authMiddleware, isAdmin, deleteImage);

module.exports = router;
