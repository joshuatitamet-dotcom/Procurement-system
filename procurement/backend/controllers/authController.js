const mongoose = require("mongoose");
const User = require("../models/User");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database unavailable. Check MONGODB_URI and try again."
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const user = new User({
      email,
      password
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("Register failed:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid registration data",
        error: error.message
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database unavailable. Check MONGODB_URI and try again."
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    res.status(200).json({
      message: "Login successful",
      user
    });

  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // If you later add sessions or tokens, clear them here.
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
