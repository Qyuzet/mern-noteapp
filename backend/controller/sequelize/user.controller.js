import { User } from '../../models/index.js';
import generateToken from '../../utils/generateToken.js';
import {
  generateVerificationToken,
  sendVerificationEmail,
} from '../../utils/email.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
    });

    if (user) {
      // Generate verification URL
      const verificationUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/users/verify/${verificationToken}`;

      // Send verification email
      await sendVerificationEmail(user, verificationUrl);

      res.status(201).json({
        success: true,
        message:
          "User registered successfully. Please check your email for verification.",
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          verificationUrl: verificationUrl,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your email before logging in",
        });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      res.status(200).json({
        success: true,
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          token,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Verify user email
// @route   GET /api/users/verify/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await User.findOne({
      where: {
        verificationToken: token,
        verificationTokenExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error in getUserProfile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      await user.save();

      res.status(200).json({
        success: true,
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error in updateUserProfile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Import other controller functions as needed
import { Op } from 'sequelize';

// @desc    Resend verification email
// @route   POST /api/users/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Generate verification URL
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify/${verificationToken}`;

    // Send verification email
    await sendVerificationEmail(user, verificationUrl);

    res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
      data: {
        verificationUrl: verificationUrl,
      },
    });
  } catch (error) {
    console.error("Error in resendVerification:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
