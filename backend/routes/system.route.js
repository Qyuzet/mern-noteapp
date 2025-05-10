import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to .env file
const envPath = path.join(__dirname, "..", "..", ".env");

/**
 * @swagger
 * /api/system/db-type:
 *   get:
 *     summary: Get current database type
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Current database type retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/db-type", (req, res) => {
  try {
    console.log("GET /api/system/db-type called");

    // MongoDB is the only database type used
    const dbType = "mongodb";
    console.log("Current database type:", dbType);

    // Send JSON response
    return res.status(200).json({
      success: true,
      data: {
        type: dbType,
      },
    });
  } catch (error) {
    console.error("Error getting database type:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// No database toggle endpoint needed as we only use MongoDB

export default router;
