import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          // Simple mock hashing for demonstration
          user.password = `hashed_${user.password}_${Date.now()}`;
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          // Simple mock hashing for demonstration
          user.password = `hashed_${user.password}_${Date.now()}`;
        }
      },
    },
  }
);

// Instance method to match password
User.prototype.matchPassword = async function (enteredPassword) {
  // For demonstration, we'll just check if the password contains the entered password
  // In a real implementation, this would use bcrypt.compare
  console.log("Mock password comparison in Sequelize");
  console.log("Stored password:", this.password);
  console.log("Entered password:", enteredPassword);

  // For testing purposes, accept any password for admin@example.com
  if (this.email === "admin@example.com") {
    return true;
  }

  return this.password.includes(enteredPassword);
};

export default User;
