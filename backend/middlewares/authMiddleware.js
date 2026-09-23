const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired,Please Login again");
    }
  } else {
    throw new Error("THere is no token attached to header");
  }
});

// Permissive admin gate — allows both `admin` and `sub-admin` roles.
// Used for content management routes (services, SBC, blogs, jobs, etc.) so
// sub-admins can add/edit content. For routes that must stay admin-only
// (user management, password changes, enquiries) use `isSuperAdmin` instead.
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (!adminUser || !["admin", "sub-admin"].includes(adminUser.role)) {
    throw new Error("Your are not an admin");
  } else {
    next();
  }
});

// Strict admin gate — only `admin` role. Use for sensitive operations
// (user CRUD, password changes, enquiries) that sub-admins must not touch.
const isSuperAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).json({ status: "fail", message: "Not authorized — admin only" });
  }
  next();
});

const canAccessEnquiry = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    throw new Error("User not found");
  }
  if (currentUser.role !== "admin") {
    return res.status(403).json({ status: "fail", message: "Not authorized to access enquiry listings" });
  }
  next();
});

const canAccessDashboardStats = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    throw new Error("User not found");
  }
  if (!["admin", "sub-admin"].includes(currentUser.role)) {
    return res.status(403).json({ status: "fail", message: "Not authorized to access dashboard statistics" });
  }
  next();
});

module.exports = { authMiddleware, isAdmin, isSuperAdmin, canAccessEnquiry, canAccessDashboardStats };
