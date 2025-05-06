import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Mock password hashing (without bcrypt)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Simple mock hashing for demonstration
  this.password = `hashed_${this.password}_${Date.now()}`;
  next();
});

// Mock password comparison (without bcrypt)
userSchema.methods.matchPassword = async function (enteredPassword) {
  // For demonstration, we'll just check if the password contains the entered password
  // In a real implementation, this would use bcrypt.compare
  console.log("Mock password comparison");
  return this.password.includes(enteredPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
