import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { getDbType } from "../config/db-toggle.js";
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
    const dbType = getDbType();
    console.log("Current database type:", dbType);

    // Send a simple response for testing
    return res.send(`Current database type: ${dbType}`);

    // Original response
    /*
    res.status(200).json({
      success: true,
      data: {
        type: dbType,
      },
    });
    */
  } catch (error) {
    console.error("Error getting database type:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/**
 * @swagger
 * /api/system/toggle-db:
 *   post:
 *     summary: Toggle database type
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - useSequelize
 *             properties:
 *               useSequelize:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Database type toggled successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/toggle-db", protect, admin, async (req, res) => {
  try {
    const { useSequelize } = req.body;

    // Read the current .env file
    let envContent = "";
    try {
      envContent = fs.readFileSync(envPath, "utf8");
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error reading .env file: " + error.message,
      });
    }

    // Check if USE_SEQUELIZE is already in the .env file
    const useSequelizeRegex = /^USE_SEQUELIZE=.*/m;

    // Update the .env file
    if (useSequelizeRegex.test(envContent)) {
      // Replace the existing value
      envContent = envContent.replace(
        useSequelizeRegex,
        `USE_SEQUELIZE=${useSequelize}`
      );
    } else {
      // Add the new value
      envContent += `\nUSE_SEQUELIZE=${useSequelize}`;
    }

    // Write the updated .env file
    try {
      fs.writeFileSync(envPath, envContent);

      // Send response before restarting
      res.status(200).json({
        success: true,
        message: `Database toggled to ${
          useSequelize ? "Sequelize" : "MongoDB"
        }. The server will restart.`,
        data: {
          type: useSequelize ? "sequelize" : "mongodb",
        },
      });

      // Restart the server after a short delay to allow the response to be sent
      setTimeout(() => {
        console.log("Restarting server due to database toggle...");

        // Execute the restart script
        const restartProcess = exec("node restart-server.js");

        restartProcess.stdout.on("data", (data) => {
          console.log(`Restart stdout: ${data}`);
        });

        restartProcess.stderr.on("data", (data) => {
          console.error(`Restart stderr: ${data}`);
        });

        restartProcess.on("close", (code) => {
          console.log(`Restart process exited with code ${code}`);
        });
      }, 1000);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error writing .env file: " + error.message,
      });
    }
  } catch (error) {
    console.error("Error toggling database:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;
