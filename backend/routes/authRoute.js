const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  getSubAdmins,
  adminChangeSubAdminPassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,

  createOrder,

  removeProductFromCart,
  updateProductQuantityFromCart,
  getMyOrders,
  emptyCart,
  getMonthWiseOrderIncome,
  getMonthWiseOrderCount,
  getYearlyTotalOrder,
  getAllOrders,
  getsingleOrder,
  updateOrder,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin, isSuperAdmin } = require("../middlewares/authMiddleware");
// const { checkout, paymentVerification } = require("../controller/paymentCtrl");

const router = express.Router();
router.post("/register", createUser);
// router.post("/forgot-password-token", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, isSuperAdmin, updatePassword);
router.get("/sub-admins", authMiddleware, isSuperAdmin, getSubAdmins);
router.put("/admin/change-password/:id", authMiddleware, isSuperAdmin, adminChangeSubAdminPassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
// Lightweight session check for the admin panel guard: validates the Bearer
// token (signature + expiry + user still exists) and that the role is still
// admin/sub-admin. Any failure comes back as a non-2xx response.
router.get("/verify-session", authMiddleware, isAdmin, (req, res) => {
  res.json({
    status: "success",
    data: { _id: req.user._id, role: req.user.role },
  });
});
router.post("/cart", authMiddleware, userCart);
// router.post("/order/checkout", authMiddleware, checkout);
// router.post("/order/paymentVerification", authMiddleware, paymentVerification);

router.post("/cart/create-order", authMiddleware, createOrder);
router.get("/all-users", authMiddleware, isSuperAdmin, getallUser);
router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/getallorders", authMiddleware, isSuperAdmin, getAllOrders);
router.get("/getaOrder/:id", authMiddleware, isSuperAdmin, getsingleOrder);
router.put("/updateOrder/:id", authMiddleware, isSuperAdmin, updateOrder);

router.get("/getMonthWiseOrderIncome", authMiddleware, getMonthWiseOrderIncome);
router.get("/getyearlyorders", authMiddleware, getYearlyTotalOrder);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/:id", authMiddleware, isSuperAdmin, getaUser);

router.delete(
  "/delete-product-cart/:cartItemId",
  authMiddleware,
  removeProductFromCart
);
router.delete(
  "/update-product-cart/:cartItemId/:newQuantity",
  authMiddleware,
  updateProductQuantityFromCart
);

router.delete("/empty-cart", authMiddleware, emptyCart);

router.delete("/:id", authMiddleware, isSuperAdmin, deleteaUser);

router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isSuperAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isSuperAdmin, unblockUser);

module.exports = router;
