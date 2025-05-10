import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";
import { setupSwagger } from "./config/swagger.js";

import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import systemRoutes from "./routes/system.route.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 7777;
const __dirname = path.resolve();

// Middleware
app.use(express.json()); // Allows us to accept JSON data in the req.body

// Set security HTTP headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Setup Swagger documentation
setupSwagger(app);

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/system", systemRoutes);

/**
 * @swagger
 * /test-login:
 *   post:
 *     summary: Test login endpoint (use this instead of /api/users/login)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       401:
 *         description: Invalid credentials or email not verified
 *       500:
 *         description: Server error
 */
// Special route for Swagger testing
app.post("/test-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Forward the request to the actual login endpoint
    const response = await fetch(`http://localhost:${PORT}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error in test-login route:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "backend/public")));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  // Serve the index.html file at the root in development
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "backend", "public", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const startServer = async () => {
  try {
    console.log("Starting server...");
    console.log("MongoDB URI:", process.env.MONGO_URI);

    // Connect to MongoDB database
    try {
      await connectDB();
      console.log("MongoDB connected successfully");
    } catch (dbError) {
      console.error("MongoDB connection error:", dbError.message);
      if (process.env.NODE_ENV === "production") {
        console.error(
          "Cannot start server without database in production mode"
        );
        process.exit(1);
      } else {
        console.warn("Running in development mode without database connection");
        console.warn("Some features may not work properly");
      }
    }

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
