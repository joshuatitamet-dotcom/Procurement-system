const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendOtpEmail } = require("../utils/mailer");
const { generateOtp, hashOtp, validatePassword } = require("../utils/authHelpers");

async function issueVerificationOtp(user) {
  const otp = generateOtp();
  user.verificationOtpHash = hashOtp(otp);
  user.verificationOtpExpiresAt = new Date(Date.now() + 60 * 1000);
  user.verificationAttempts = 0;
  await user.save();
  await sendOtpEmail({ email: user.email, otp });
}

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

    const passwordValidationError = validatePassword(password, email);
    if (passwordValidationError) {
      return res.status(400).json({
        message: passwordValidationError
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(409).json({
          message: "User already exists"
        });
      }

      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.isVerified = false;
      await issueVerificationOtp(existingUser);

      return res.status(200).json({
        message: "Verification code sent to your email",
        requiresVerification: true
      });
    }

    const user = new User({
      email,
      password: await bcrypt.hash(password, 10)
    });

    await user.save();
    await issueVerificationOtp(user);

    res.status(201).json({
      message: "Account created. Enter the OTP sent to your email to verify your account.",
      requiresVerification: true
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

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database unavailable. Check MONGODB_URI and try again."
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: "Account already verified"
      });
    }

    if (!user.verificationOtpHash || !user.verificationOtpExpiresAt) {
      return res.status(400).json({
        message: "No verification code found. Please request another OTP."
      });
    }

    if (user.verificationOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        message: "OTP expired. Request a new code."
      });
    }

    if (user.verificationAttempts >= 5) {
      return res.status(429).json({
        message: "Too many invalid OTP attempts. Request a new code."
      });
    }

    const incomingOtpHash = hashOtp(otp);
    if (incomingOtpHash !== user.verificationOtpHash) {
      user.verificationAttempts += 1;
      await user.save();
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    user.isVerified = true;
    user.verificationOtpHash = null;
    user.verificationOtpExpiresAt = null;
    user.verificationAttempts = 0;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully. You can now log in."
    });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database unavailable. Check MONGODB_URI and try again."
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Account is already verified"
      });
    }

    await issueVerificationOtp(user);

    return res.status(200).json({
      message: "A new OTP has been sent to your email"
    });
  } catch (error) {
    console.error("Resend OTP failed:", error);
    return res.status(500).json({
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

    if (typeof user.isVerified === "undefined" && !user.verificationOtpHash) {
      user.isVerified = true;
      await user.save();
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email with the OTP before logging in."
      });
    }

    let passwordMatches = false;
    if (user.password.startsWith("$2")) {
      passwordMatches = await bcrypt.compare(password, user.password);
    } else {
      passwordMatches = user.password === password;
      if (passwordMatches) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!passwordMatches) {
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

module.exports = { registerUser, verifyOtp, resendOtp, loginUser, logoutUser };
