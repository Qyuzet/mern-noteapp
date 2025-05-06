import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { getDbType } from "../config/db-toggle.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get the current database type
      const dbType = getDbType();
      console.log(`[AUTH] Using database type: ${dbType}`);

      // Get user from the token based on database type
      if (dbType === "sequelize") {
        // For Sequelize
        req.user = await User.findByPk(decoded.id);
        console.log(`[AUTH] Sequelize user found: ${req.user ? "Yes" : "No"}`);
      } else {
        // For MongoDB
        req.user = await User.findById(decoded.id).select("-password");
        console.log(`[AUTH] MongoDB user found: ${req.user ? "Yes" : "No"}`);
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      next();
    } catch (error) {
      console.error("Error in auth middleware:", error.message);

      res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

// Middleware to check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as an admin",
    });
  }
};

// Middleware to check if user is verified
export const verified = (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Email not verified",
    });
  }
};
