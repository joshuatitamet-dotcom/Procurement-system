const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "admin"
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verificationOtpHash: {
    type: String,
    default: null
  },

  verificationOtpExpiresAt: {
    type: Date,
    default: null
  },

  verificationAttempts: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("User", UserSchema);
