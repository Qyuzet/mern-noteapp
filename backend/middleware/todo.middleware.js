import mongoose from "mongoose";

// Middleware to validate todo data
export const validateTodoData = (req, res, next) => {
  const { task, priority, image } = req.body;

  if (!task || !priority || !image) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields: task, priority, and image",
    });
  }

  // Validate priority is a number
  if (isNaN(Number(priority))) {
    return res.status(400).json({
      success: false,
      message: "Priority must be a number",
    });
  }

  next();
};

// Middleware to validate todo ID
export const validateTodoId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Todo ID",
    });
  }

  next();
};

// Middleware to log todo operations
export const logTodoOperation = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] Todo operation: ${req.method} ${req.originalUrl}`);
  console.log("User:", req.user ? req.user._id : "Unauthenticated");
  console.log("Body:", req.body);
  
  next();
};
