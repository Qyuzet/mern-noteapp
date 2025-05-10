// Simple Express server with mock data
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7778;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "noteapp_secret_key_123456789";

// Middleware
app.use(express.json());
app.use(cors());

// Authentication middleware
const protect = (req, res, next) => {
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
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from the token
      req.user = users.find((u) => u._id === decoded.id);

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
  } else {
    // For development purposes, allow requests without token
    console.log("No token provided, but allowing request for development");
    next();
  }
};

// Mock data
const tasks = [
  {
    _id: "1",
    task: "Learn React",
    priority: 3,
    image: "https://picsum.photos/200/300?random=1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    task: "Build a MERN app",
    priority: 4,
    image: "https://picsum.photos/200/300?random=2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    task: "Deploy to production",
    priority: 2,
    image: "https://picsum.photos/200/300?random=3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock users
const users = [
  {
    _id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "user",
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Routes
// Get all tasks
app.get("/api/products", protect, (req, res) => {
  console.log("GET /api/products");
  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// Create a task
app.post("/api/products", protect, (req, res) => {
  console.log("POST /api/products", req.body);
  const { task, priority, image } = req.body;

  if (!task || !priority || !image) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields: task, priority, and image",
    });
  }

  const newTask = {
    _id: Date.now().toString(),
    task,
    priority,
    image,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask,
  });
});

// Update a task
app.put("/api/products/:id", protect, (req, res) => {
  console.log(`PUT /api/products/${req.params.id}`, req.body);
  const { id } = req.params;
  const { task, priority, image } = req.body;

  const taskIndex = tasks.findIndex((t) => t._id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...(task && { task }),
    ...(priority && { priority }),
    ...(image && { image }),
    updatedAt: new Date().toISOString(),
  };

  tasks[taskIndex] = updatedTask;

  res.json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
});

// Delete a task
app.delete("/api/products/:id", protect, (req, res) => {
  console.log(`DELETE /api/products/${req.params.id}`);
  const { id } = req.params;

  const taskIndex = tasks.findIndex((t) => t._id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);

  res.json({
    success: true,
    message: "Task deleted successfully",
    data: id,
  });
});

// User login endpoint
app.post("/api/users/login", (req, res) => {
  console.log("POST /api/users/login", req.body);
  const { email, password } = req.body;

  // Find user by email
  const user = users.find((u) => u.email === email);

  // Check if user exists and password matches
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "30d",
  });

  // Return user data and token
  res.json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token,
    },
  });
});

// User registration endpoint
app.post("/api/users", (req, res) => {
  console.log("POST /api/users", req.body);
  const { name, email, password } = req.body;

  // Check if required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields: name, email, and password",
    });
  }

  // Check if user already exists
  if (users.some((u) => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists",
    });
  }

  // Create new user
  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    password,
    role: "user",
    isVerified: true, // Auto-verify for simplicity
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add user to mock database
  users.push(newUser);

  // Generate verification URL (mock)
  const verificationUrl = `http://localhost:${PORT}/api/users/verify/${newUser._id}`;

  // Return success response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isVerified: newUser.isVerified,
      verificationUrl,
    },
  });
});

// Resend verification email endpoint
app.post("/api/users/resend-verification", (req, res) => {
  console.log("POST /api/users/resend-verification", req.body);
  const { email } = req.body;

  // Find user by email
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Generate verification URL (mock)
  const verificationUrl = `http://localhost:${PORT}/api/users/verify/${user._id}`;

  // Return success response
  res.json({
    success: true,
    message: "Verification email sent successfully",
    data: {
      verificationUrl,
    },
  });
});

// Add Swagger documentation endpoint
app.get("/api-docs", (req, res) => {
  res.json({
    message: "API Documentation",
    version: "1.0.0",
    endpoints: [
      { path: "/api/products", methods: ["GET", "POST"] },
      { path: "/api/products/:id", methods: ["PUT", "DELETE"] },
      { path: "/api/users/login", methods: ["POST"] },
      { path: "/api/users", methods: ["POST"] },
      { path: "/api/users/resend-verification", methods: ["POST"] },
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
